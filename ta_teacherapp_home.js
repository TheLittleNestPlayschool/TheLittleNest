import{setActiveWorkspace}from'./ta_ui.js';
import{getState}from'./ta_state.js';
import{renderAttendanceModule}from'./ta_attendance.js';
import{renderMediaModule}from'./ta_media.js';
import{clearSelectedMediaSession,clearSavedMedia,clearMediaSaveProgress}from'./ta_media_session.js';
import{renderMomentsModule}from'./ta_moments.js';
import{renderClassExperienceModule}from'./ta_class_experience.js';
import{renderSeeYouTomorrowModule}from'./ta_see_you_tomorrow.js';
import{renderReceiptUploadModule}from'./ta_receipt_upload.js';
import{renderTeacherResourcesModule}from'./ta_teacher_resources.js';
import{renderTeacherInformationModule}from'./ta_teacher_information.js';

const tasks=[
{id:'attendance',icon:'📋',title:'Attendance',subtitle:'Record session attendance.',renderer:renderAttendanceModule},
{id:'media',icon:'📷',title:'Capture Media',subtitle:'Photos, videos, and artwork.',renderer:renderMediaModule},
{id:'moments',icon:'✨',title:'Moments',subtitle:'Save a moment about a child.',renderer:renderMomentsModule},
{id:'class_experience',icon:'🌱',title:'Class Experience',subtitle:'Capture something extra from class.',renderer:renderClassExperienceModule},
{id:'see_tomorrow',icon:'🌞',title:'See You Tomorrow!',subtitle:"Prepare tomorrow's class lists.",renderer:renderSeeYouTomorrowModule},
{id:'receipt_upload',icon:'🧾',title:'Receipt Upload',subtitle:'Capture and save a receipt.',renderer:renderReceiptUploadModule},
{id:'enrollment',icon:'📝',title:'Enrollment',subtitle:'Enroll a new student.',comingSoon:true},
{id:'teacher_resources',icon:'📂',title:'Teacher Resources',subtitle:'Sessions, worksheets, and forms.',renderer:renderTeacherResourcesModule},
{id:'teacher_information',icon:'👩‍🏫',title:'Teacher Information',subtitle:'View teacher information.',renderer:renderTeacherInformationModule}
];

export function renderTeacherHome(){
const stage=document.getElementById('teacherStage');
if(!stage)return;
setActiveWorkspace('teacherStage');
stage.innerHTML=`
<section class="teacher-home">
<div class="teacher-home-intro">
<h1>What would you like to do?</h1>
<p>Choose a task below.</p>
</div>
<div class="teacher-home-grid">
${tasks.map(buildTaskButton).join('')}
</div>
</section>`;
stage.querySelectorAll('[data-teacher-task]:not([disabled])').forEach(button=>{
button.addEventListener('click',()=>openTask(button.dataset.teacherTask));
});
}

function buildTaskButton(task){
const status=task.id==='attendance'?getAttendanceStatus():'';
const comingSoon=task.comingSoon===true;
return`
<button type="button" class="teacher-home-task${comingSoon?' is-coming-soon':''}" data-teacher-task="${task.id}" ${comingSoon?'disabled aria-disabled="true"':''}>
${comingSoon?'<span class="teacher-home-coming-soon">Coming Soon</span>':''}
<span class="teacher-home-task-icon">${task.icon}</span>
<span class="teacher-home-task-title">${task.title}</span>
<span class="teacher-home-task-subtitle">${task.subtitle}</span>
${status?`<span class="teacher-home-task-status">${status}</span>`:''}
</button>`;
}

async function openTask(taskId){
const task=tasks.find(item=>item.id===taskId);
const stage=document.getElementById('teacherStage');
if(!task||!stage||task.comingSoon)return;
stage.innerHTML=`
<section class="teacher-home-module">
<button type="button" class="teacher-home-back" id="teacherHomeBack">← Back</button>
<div id="teacherHomeWorkspace"></div>
</section>`;
document.getElementById('teacherHomeBack')?.addEventListener('click',()=>{
if(taskId==='media'){
clearSelectedMediaSession();
clearSavedMedia();
clearMediaSaveProgress();
}
renderTeacherHome();
});
setActiveWorkspace('teacherHomeWorkspace');
try{
await Promise.resolve(task.renderer(getState()));
}catch(error){
console.error('Teacher task failed:',error);
const workspace=document.getElementById('teacherHomeWorkspace');
if(workspace)workspace.textContent=error instanceof Error?error.message:'Unable to open task.';
}
}

function getAttendanceStatus(){
const state=getState();
const completions=Array.isArray(state.sessionAttendanceCompletions)?state.sessionAttendanceCompletions:[];
const relevant=state.relevantSession;
if(!relevant?.id)return'';
const today=new Date().toISOString().slice(0,10);
const complete=completions.some(record=>String(record?.session_id)===String(relevant.id)&&record?.attendance_date===today);
return complete?'Completed':'';
}
