import{getWorkspace,clearWorkspace}from'./ta_ui.js';

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
<div class="teacher-roster-heading"><div class="teacher-roster-heading-icon" aria-hidden="true">📋</div><div><h2>Class Rosters &amp; Updates</h2><p>Keep head office informed about your classes and schedule.</p></div></div>
<div class="teacher-roster-choices" aria-label="Choose what to send">
<button type="button" class="teacher-roster-choice is-active" data-roster-kind="roster" aria-pressed="true"><span class="teacher-roster-choice-icon" aria-hidden="true">📋</span><strong>Weekly Roster</strong><small>Paste your class list</small></button>
<button type="button" class="teacher-roster-choice" data-roster-kind="update" aria-pressed="false"><span class="teacher-roster-choice-icon" aria-hidden="true">🗓️</span><strong>Calendar Update</strong><small>Report a change</small></button>
</div>
<div class="teacher-roster-editor">
<h3 id="teacherRosterFormTitle">Submit Weekly Roster</h3>
<p class="teacher-roster-description" id="teacherRosterFormHelp">Copy your current Facebook class roster and paste it below. A complete week or a partial roster is fine.</p>
<label class="teacher-roster-label" for="teacherRosterText">Paste class roster</label>
<textarea id="teacherRosterText" class="teacher-roster-textarea" rows="9" spellcheck="false" placeholder="Paste the class roster from Facebook here…"></textarea>
<p class="teacher-roster-private-note">Your location and teacher identity will be attached when submissions are enabled.</p>
<button type="button" class="teacher-roster-action" id="teacherRosterReview" disabled>Review Submission <span aria-hidden="true">→</span></button>
</div>
<div class="teacher-roster-review" hidden>
<h3>Review Your Submission</h3>
<p class="teacher-roster-description" id="teacherRosterReviewKind">Weekly Roster</p>
<pre class="teacher-roster-preview" id="teacherRosterPreview"></pre>
<button type="button" class="teacher-roster-secondary" id="teacherRosterEdit">← Back to Edit</button>
<p class="teacher-roster-not-ready" role="status">The form is ready for review. Sending to head office will be enabled when the Xano submission endpoint is connected.</p>
<button type="button" class="teacher-roster-action" disabled>Submit to Head Office</button>
</div>`;
workspace.append(root);
const $=id=>root.querySelector('#'+id),textarea=$('teacherRosterText'),reviewBtn=$('teacherRosterReview');
const editor=root.querySelector('.teacher-roster-editor'),review=root.querySelector('.teacher-roster-review');
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
reviewBtn.addEventListener('click',()=>{if(!textarea.value.trim())return;drafts[kind]=textarea.value;editor.hidden=true;root.querySelector('.teacher-roster-choices').hidden=true;review.hidden=false;$('teacherRosterReviewKind').textContent=kind==='roster'?'Weekly Roster':'Calendar Update';$('teacherRosterPreview').textContent=textarea.value.trim()});
$('teacherRosterEdit').addEventListener('click',()=>{review.hidden=true;editor.hidden=false;root.querySelector('.teacher-roster-choices').hidden=false;textarea.focus()});
}
