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
<button type="button" class="teacher-roster-action" id="teacherRosterSubmit">Submit to Head Office</button>
</div>
<div id="teacherRosterPopup" role="dialog" aria-modal="true" aria-labelledby="teacherRosterPopupTitle" hidden style="position:fixed;inset:0;z-index:9999;display:none;align-items:center;justify-content:center;background:rgba(26,38,47,.32);padding:20px;backdrop-filter:blur(5px)">
<div style="width:min(340px,100%);border-radius:22px;background:#fff;padding:30px 24px;text-align:center;box-shadow:0 20px 65px rgba(25,39,48,.22)">
<div id="teacherRosterPopupIcon" style="font-size:34px;margin-bottom:10px">⏳</div>
<h3 id="teacherRosterPopupTitle" style="margin:0 0 10px;color:#263449;font-size:1.3rem">Submitting…</h3>
<p id="teacherRosterPopupMessage" style="margin:0;color:#637282;font-size:.92rem;line-height:1.5">Sending your weekly roster.</p>
<button type="button" id="teacherRosterPopupOk" class="teacher-roster-action" style="width:100%;margin-top:22px" hidden>OK</button>
</div>
</div>`;
workspace.append(root);
const $=id=>root.querySelector('#'+id),textarea=$('teacherRosterText'),reviewBtn=$('teacherRosterReview');
const editor=root.querySelector('.teacher-roster-editor'),review=root.querySelector('.teacher-roster-review'),submitBtn=$('teacherRosterSubmit');
const popup=$('teacherRosterPopup'),popupIcon=$('teacherRosterPopupIcon'),popupTitle=$('teacherRosterPopupTitle'),popupMessage=$('teacherRosterPopupMessage'),popupOk=$('teacherRosterPopupOk');
let submitting=false;
function showPopup(title,message,icon,buttonLabel='OK'){
popup.hidden=false;popup.style.display='flex';popupTitle.textContent=title;popupMessage.textContent=message;popupIcon.textContent=icon;
popupOk.hidden=buttonLabel===null;if(buttonLabel!==null)popupOk.textContent=buttonLabel;
}
function closePopup(){popup.style.display='none';popup.hidden=true;}
function updateReviewButton(){reviewBtn.disabled=!textarea.value.trim()}
function showKind(next){
drafts[kind]=textarea.value;kind=next;
root.querySelectorAll('[data-roster-kind]').forEach(button=>{const active=button.dataset.rosterKind===kind;button.classList.toggle('is-active',active);button.setAttribute('aria-pressed',String(active))});
const roster=kind==='roster';
$('teacherRosterFormTitle').textContent=roster?'Submit Weekly Roster':'Report Calendar Update';
$('teacherRosterFormHelp').textContent=roster?'Copy your current Facebook class roster and paste it below. A complete week or a partial roster is fine.':'Tell head office what changed. Include the date or day and session time when relevant.';
root.querySelector('label[for="teacherRosterText"]').textContent=roster?'Paste class roster':'What has changed?';
textarea.placeholder=roster?'Paste the class roster from Facebook here…':'Example: We are closed Tuesday due to a power interruption. Or: Wednesday 1:30 PM now has 2 enrolled children.';
textarea.value=drafts[kind];updateReviewButton();
}
root.querySelectorAll('[data-roster-kind]').forEach(button=>button.addEventListener('click',()=>showKind(button.dataset.rosterKind)));
textarea.addEventListener('input',()=>{drafts[kind]=textarea.value;updateReviewButton()});
reviewBtn.addEventListener('click',()=>{if(!textarea.value.trim())return;drafts[kind]=textarea.value;editor.hidden=true;root.querySelector('.teacher-roster-choices').hidden=true;review.hidden=false;submitBtn.disabled=kind!=='roster';submitBtn.textContent=kind==='roster'?'Submit to Head Office':'Calendar Update — Coming Soon';$('teacherRosterReviewKind').textContent=kind==='roster'?'Weekly Roster':'Calendar Update';$('teacherRosterPreview').textContent=textarea.value.trim()});
popupOk.addEventListener('click',()=>{const done=popupTitle.textContent==='Done';closePopup();if(done)document.getElementById('teacherHomeBack')?.click();});
submitBtn.addEventListener('click',async()=>{
if(submitting||kind!=='roster')return;
const rosterText=drafts.roster.trim();if(!rosterText)return;
submitting=true;submitBtn.disabled=true;showPopup('Submitting…','Sending your weekly roster.','⏳',null);
try{
const result=await apiRequest(ROSTER_SUBMIT_API,{method:'POST',body:{roster_text:rosterText}});
if(!result?.weekly_roster?.id)throw new Error('Submission response did not confirm a saved roster. Please check before resubmitting.');
drafts.roster='';showPopup('Done','Your weekly roster has been sent to head office.','✓');
}catch(error){
showPopup('Unable to submit',error instanceof Error?error.message:'Unable to submit roster.','!', 'OK');
submitBtn.disabled=false;
}finally{submitting=false;}
});
}
