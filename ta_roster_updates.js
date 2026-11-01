import{getWorkspace,clearWorkspace}from'./ta_ui.js';
import{apiRequest}from'./ta_api.js';
const ROSTER_SUBMIT_API='https://x58r-xped-p4y6.n7e.xano.io/api:EpDLPKN0/ta_weekly_roster_submit';

/*   Teacher class roster and calendar update intake*/
export function renderRosterUpdatesModule(){
clearWorkspace();
const workspace=getWorkspace();
if(!workspace)return;
const drafts={roster:'',update:''};
let kind='roster';
const root=document.createElement('section');
root.className='teacher-roster-updates';
root.innerHTML=`
<div class="teacher-roster-heading"><div class="teacher-roster-heading-icon" aria-hidden="true">📋</div><div><h2>Class Rosters &amp; Updates</h2></div></div>
<div class="teacher-roster-choices" aria-label="Choose what to send">
<button type="button" class="teacher-roster-choice is-active" data-roster-kind="roster" aria-pressed="true"><span class="teacher-roster-choice-icon" aria-hidden="true">📋</span><strong>Weekly Roster</strong><small>Paste your class list</small></button>
<button type="button" class="teacher-roster-choice" data-roster-kind="update" aria-pressed="false"><span class="teacher-roster-choice-icon" aria-hidden="true">🗓️</span><strong>Calendar Update</strong><small>Report a change</small></button>
</div>
<div class="teacher-roster-editor">
<h3 id="teacherRosterFormTitle">Submit Weekly Roster</h3>
<p class="teacher-roster-description" id="teacherRosterFormHelp">Copy your current Facebook class roster and paste it below. A complete week or a partial roster is fine.</p>
<label class="teacher-roster-label" for="teacherRosterText">Paste class roster</label>
<textarea id="teacherRosterText" class="teacher-roster-textarea" rows="5" spellcheck="false" placeholder="Paste the class roster from Facebook here…"></textarea>
<button type="button" class="teacher-roster-action" id="teacherRosterReview" disabled>Review Submission <span aria-hidden="true">→</span></button>
</div>
<div class="teacher-roster-review" hidden>
<h3>Review Your Submission</h3>
<p class="teacher-roster-description" id="teacherRosterReviewKind">Weekly Roster</p>
<pre class="teacher-roster-preview" id="teacherRosterPreview"></pre>
<button type="button" class="teacher-roster-secondary" id="teacherRosterEdit">← Back to Edit</button>
<p class="teacher-roster-not-ready" id="teacherRosterStatus" role="status" hidden></p>
<button type="button" class="teacher-roster-action" id="teacherRosterSubmit">Submit to Head Office</button>
</div>`;
workspace.append(root);
const $=id=>root.querySelector('#'+id),textarea=$('teacherRosterText'),reviewBtn=$('teacherRosterReview');
const editor=root.querySelector('.teacher-roster-editor'),review=root.querySelector('.teacher-roster-review'),submitBtn=$('teacherRosterSubmit'),status=$('teacherRosterStatus');
let submitting=false;
function setStatus(message){status.textContent=message;status.hidden=!message;}
function updateReviewButton(){reviewBtn.disabled=!textarea.value.trim()}
function showKind(next){
drafts[kind]=textarea.value;
kind=next;
root.querySelectorAll('[data-roster-kind]').forEach(button=>{const active=button.dataset.rosterKind===kind;button.classList.toggle('is-active',active);button.setAttribute('aria-pressed',String(active))});
const roster=kind==='roster';
$('teacherRosterFormTitle').textContent=roster?'Submit Weekly Roster':'Report Calendar Update';
$('teacherRosterFormHelp').textContent=roster?'Copy your current Facebook class roster and paste it below. A complete week or a partial roster is fine.':'Tell head office what changed. Include the date or day and session time when relevant.';
root.querySelector('label[for="teacherRosterText"]').textContent=roster?'Paste class roster':'What has changed?';
textarea.placeholder=roster?'Paste the class roster from Facebook here…':'Example: We are closed Tuesday due to a power interruption. Or: Wednesday 1:30 PM now has 2 enrolled children.';
textarea.value=drafts[kind];
updateReviewButton();
}
root.querySelectorAll('[data-roster-kind]').forEach(button=>button.addEventListener('click',()=>showKind(button.dataset.rosterKind)));
textarea.addEventListener('input',()=>{drafts[kind]=textarea.value;updateReviewButton()});
reviewBtn.addEventListener('click',()=>{if(!textarea.value.trim())return;drafts[kind]=textarea.value;editor.hidden=true;root.querySelector('.teacher-roster-choices').hidden=true;review.hidden=false;setStatus('');submitBtn.disabled=kind!=='roster';submitBtn.textContent=kind==='roster'?'Submit to Head Office':'Calendar Update — Coming Soon';$('teacherRosterReviewKind').textContent=kind==='roster'?'Weekly Roster':'Calendar Update';$('teacherRosterPreview').textContent=textarea.value.trim()});
$('teacherRosterEdit').addEventListener('click',()=>{if(submitting)return;setStatus('');review.hidden=true;editor.hidden=false;root.querySelector('.teacher-roster-choices').hidden=false;textarea.focus()});
submitBtn.addEventListener('click',async()=>{
if(submitting||kind!=='roster')return;
const rosterText=drafts.roster.trim();if(!rosterText)return;
submitting=true;submitBtn.disabled=true;submitBtn.textContent='Submitting…';$('teacherRosterEdit').disabled=true;setStatus('');
try{
const result=await apiRequest(ROSTER_SUBMIT_API,{method:'POST',body:{roster_text:rosterText}});
if(!result?.weekly_roster?.id)throw new Error('Submission response did not confirm a saved roster. Please check before resubmitting.');
setStatus('Weekly roster submitted successfully. Reference #'+result.weekly_roster.id+'.');
submitBtn.textContent='Submitted';drafts.roster='';
}catch(error){setStatus(error instanceof Error?error.message:'Unable to submit roster.');submitBtn.disabled=false;submitBtn.textContent='Submit to Head Office';}
finally{submitting=false;$('teacherRosterEdit').disabled=false;}
});

}

