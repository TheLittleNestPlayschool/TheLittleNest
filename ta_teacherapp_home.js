
import{setActiveWorkspace}from'./ta_ui.js';
import{getState}from'./ta_state.js';
import{apiRequest}from'./ta_api.js';
import{API_URLS}from'./ta_config.js';
import{getTodayDate}from'./ta_startup_helpers.js';
import{renderAttendanceModule}from'./ta_attendance.js';
import{renderMediaModule}from'./ta_media.js';
import{renderMomentsModule}from'./ta_moments.js';
import{renderClassExperienceModule}from'./ta_class_experience.js';
import{renderSeeYouTomorrowModule}from'./ta_see_you_tomorrow.js';
import{renderReceiptUploadModule}from'./ta_receipt_upload.js';
import{renderTeacherResourcesModule}from'./ta_teacher_resources.js';
import{renderTeacherInformationModule}from'./ta_teacher_information.js';
import{renderRosterUpdatesModule}from'./ta_roster_updates.js?v=20261105-calendar-view';

const tasks=[
{id:'attendance',icon:'📋',title:'Attendance',subtitle:'Record session attendance.',renderer:renderAttendanceModule},
{id:'media',icon:'📷',title:'Capture Media',subtitle:'Photos, videos, and artwork.',renderer:renderMediaModule},
{id:'moments',icon:'✨',title:'Moments',subtitle:'Save a moment about a child.',renderer:renderMomentsModule},
{id:'class_experience',icon:'🌱',title:'Class Experience',subtitle:'Capture something extra from class.',renderer:renderClassExperienceModule},
{id:'see_tomorrow',icon:'🌞',title:'See You Tomorrow!',subtitle:"Prepare tomorrow's class lists.",renderer:renderSeeYouTomorrowModule},
{id:'roster_updates',icon:'📅',title:'Class Rosters & Updates',subtitle:'Submit a roster or report a calendar change.',renderer:renderRosterUpdatesModule},
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
${getState().context?.training_mode===true?buildTaskButton({id:'training_time',icon:'🕒',title:'Set Current Time',subtitle:'Training Mode · '+getState().context.current_time}):''}
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
if(taskId==='training_time'){renderTrainingTime();return;}
const task=tasks.find(item=>item.id===taskId);
const stage=document.getElementById('teacherStage');
if(!task||!stage||task.comingSoon)return;
stage.innerHTML=`
<section class="teacher-home-module">
<button type="button" class="teacher-home-back" id="teacherHomeBack">← Back</button>
<div id="teacherHomeWorkspace"></div>
</section>`;
document.getElementById('teacherHomeBack')?.addEventListener('click',renderTeacherHome);
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
const today=state.context?.training_mode===true?getTodayDate():new Date().toISOString().slice(0,10);
const complete=completions.some(record=>String(record?.session_id)===String(relevant.id)&&record?.attendance_date===today);
return complete?'Completed':'';
}

function renderTrainingTime(){
const context=getState().context;
const stage=document.getElementById('teacherStage');
if(!stage||context?.training_mode!==true)return;
const current=/^([01]\d|2[0-3]):[0-5]\d$/.test(context.current_time)?context.current_time:'';
const date=getTodayDate();
stage.innerHTML=`<section class="teacher-home-module">
<button type="button" class="teacher-home-back" id="teacherHomeBack">← Back</button>
<form class="teacher-home-task" id="trainingTimeForm" style="cursor:default;max-width:360px;margin:0 auto;gap:14px;padding:24px">
<span class="teacher-home-task-icon">🕒</span>
<span class="teacher-home-task-title">Set Current Time</span>
<span class="teacher-home-task-subtitle">Training Mode · ${date}</span>
<label for="trainingTimeInput">Simulated time</label>
<input type="time" id="trainingTimeInput" value="${current}" required style="font:inherit;padding:10px;border:1px solid #cbd5e1;border-radius:12px;background:white;color:#334155">
<button type="submit" class="teacher-home-back" style="margin:0">Set Time</button>
<span id="trainingTimeStatus" class="teacher-home-task-subtitle" role="status">NestGuide will reload using this time.</span>
</form></section>`;
document.getElementById('teacherHomeBack').addEventListener('click',renderTeacherHome);
const form=document.getElementById('trainingTimeForm');
form.addEventListener('submit',async event=>{
event.preventDefault();
const time=document.getElementById('trainingTimeInput').value;
const timestamp=Date.parse(date+'T'+time+':00+08:00');
const status=document.getElementById('trainingTimeStatus');
const submit=form.querySelector('button[type="submit"]');
if(!Number.isFinite(timestamp)){status.textContent='Enter a valid time.';return;}
submit.disabled=true;
status.textContent='Setting training time…';
try{
await apiRequest(API_URLS.setTrainingTime,{method:'POST',body:{training_datetime:timestamp}});
window.location.reload();
}catch(error){status.textContent=error.message||'Unable to set training time.';submit.disabled=false;}
});
}
