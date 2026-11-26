import{getWorkspace,clearWorkspace}from'./ta_ui.js';
import{getState}from'./ta_state.js';
import{apiRequest}from'./ta_api.js';
import{API_URLS}from'./ta_config.js';
import{getTodayDate}from'./ta_startup_helpers.js';

export function renderMomentsModule(){
clearWorkspace();
const workspace=getWorkspace();
if(!workspace)return;
const state=getState();
const students=Array.isArray(state.locationStudents)?state.locationStudents:[];
const sessions=getAvailableSessions(state);
const selected=new Map();
let saving=false;
const container=document.createElement('section');
container.className='teacher-moments';
container.innerHTML=`
<div class="teacher-moments-heading">
<strong>Add a Moment</strong>
<span>Choose the class date, session and children who shared the moment.</span>
</div>
<label class="teacher-moments-field">
<span>Class Date</span>
<input type="date" class="teacher-moments-date teacher-moments-select" required>
</label>
<label class="teacher-moments-field">
<span>Select Session</span>
<select class="teacher-moments-session teacher-moments-select"><option value="">Choose a session...</option></select>
</label>
<label class="teacher-moments-field">
<span>Select Student</span>
<select class="teacher-moments-student teacher-moments-select" disabled><option value="">Choose a student...</option></select>
</label>
<label class="teacher-moments-field">
<span>Extra Student</span>
<select class="teacher-moments-extra teacher-moments-select" disabled><option value="">Choose an extra student...</option></select>
</label>
<div class="teacher-moments-field teacher-moments-selected" style="display:none">
<span>Selected Students</span>
<div class="teacher-moments-selected-list" style="display:flex;flex-wrap:wrap;gap:6px"></div>
</div>
<label class="teacher-moments-field">
<span>Moment</span>
<textarea class="teacher-moments-text" rows="5" placeholder="What happened?"></textarea>
</label>
<div class="teacher-moments-actions"><button type="button" class="teacher-moments-save">Save Moment</button></div>
<p class="teacher-moments-status" aria-live="polite"></p>`;
workspace.appendChild(container);
const dateInput=container.querySelector('.teacher-moments-date');
const sessionSelect=container.querySelector('.teacher-moments-session');
const studentSelect=container.querySelector('.teacher-moments-student');
const extraSelect=container.querySelector('.teacher-moments-extra');
const selectedSection=container.querySelector('.teacher-moments-selected');
const selectedList=container.querySelector('.teacher-moments-selected-list');
const textarea=container.querySelector('.teacher-moments-text');
const saveButton=container.querySelector('.teacher-moments-save');
const status=container.querySelector('.teacher-moments-status');
dateInput.value=getTodayDate();
dateInput.max=getTodayDate();

/*   Date and session selection*/
function renderSessions(){
const available=dateInput.value&&dateInput.value<=dateInput.max?getSessionsForDate(sessions,dateInput.value):[];
sessionSelect.replaceChildren(new Option(available.length?'Choose a session...':'No sessions scheduled for this date',''));
available.forEach(session=>sessionSelect.add(new Option(getSessionLabel(session),String(session.id))));
sessionSelect.disabled=saving||!available.length;
resetStudents();
}
function resetStudents(){
selected.clear();
const sessionId=Number(sessionSelect.value);
if(sessionId)container.dataset.sessionId=String(sessionId);else delete container.dataset.sessionId;
renderStudents();
status.textContent='';
}
function renderStudents(){
const sessionId=Number(sessionSelect.value);
const remaining=students.filter(student=>student?.id&&!selected.has(Number(student.id)));
renderStudentOptions(studentSelect,sessionId?remaining.filter(student=>Number(student.session_enrolled)===sessionId):[],'Choose a student...');
renderStudentOptions(extraSelect,sessionId?remaining.filter(student=>Number(student.session_enrolled)!==sessionId):[],'Choose an extra student...');
studentSelect.disabled=saving||!sessionId||studentSelect.options.length===1;
extraSelect.disabled=saving||!sessionId||extraSelect.options.length===1;
selectedSection.style.display=selected.size?'flex':'none';
selectedList.replaceChildren();
selected.forEach((student,id)=>{
const button=document.createElement('button');
button.type='button';
button.className='teacher-moments-save';
button.textContent=`${getStudentName(student)} ×`;
button.setAttribute('aria-label',`Remove ${getStudentName(student)}`);
button.disabled=saving;
button.addEventListener('click',()=>{selected.delete(id);renderStudents();status.textContent='';});
selectedList.appendChild(button);
});
saveButton.textContent=selected.size>1?`Save Moment for ${selected.size} Students`:'Save Moment';
}
function addStudent(select){
const id=Number(select.value);
const student=students.find(item=>Number(item?.id)===id);
if(student)selected.set(id,student);
renderStudents();
status.textContent='';
}
renderSessions();
dateInput.addEventListener('change',renderSessions);
sessionSelect.addEventListener('change',resetStudents);
studentSelect.addEventListener('change',()=>addStudent(studentSelect));
extraSelect.addEventListener('change',()=>addStudent(extraSelect));

/*   Save one moment for each selected student*/
saveButton.addEventListener('click',async()=>{
if(saving)return;
const sessionDate=dateInput.value;
const sessionId=Number(sessionSelect.value);
const moment=textarea.value.trim();
if(!sessionDate||sessionDate>getTodayDate()){status.textContent='Please select a valid class date.';dateInput.focus();return;}
if(!sessionId||!getSessionsForDate(sessions,sessionDate).some(session=>Number(session.id)===sessionId)){status.textContent='Please select a session.';sessionSelect.focus();return;}
if(!selected.size){status.textContent='Please select a student.';studentSelect.focus();return;}
if(!moment){status.textContent='Enter the moment first.';textarea.focus();return;}
saving=true;
dateInput.disabled=true;
sessionSelect.disabled=true;
textarea.disabled=true;
saveButton.disabled=true;
renderStudents();
const ids=[...selected.keys()];
let saved=0;
try{
for(const id of ids){
status.textContent=`Saving ${saved+1} of ${ids.length}...`;
await apiRequest(API_URLS.postStudentMoment,{method:'POST',body:{student_id:id,session_id:sessionId,session_date:sessionDate,moment}});
selected.delete(id);
saved++;
renderStudents();
}
textarea.value='';
status.textContent=saved===1?'Moment saved.':`Moment saved for ${saved} students.`;
}catch(error){
status.textContent=`${saved?`${saved} saved. `:''}${error?.message||'Unable to save moment.'} ${selected.size} remaining.`;
}finally{
saving=false;
dateInput.disabled=false;
sessionSelect.disabled=false;
textarea.disabled=false;
saveButton.disabled=false;
renderStudents();
}
});
}

function renderStudentOptions(select,students,placeholder){
select.replaceChildren(new Option(placeholder,''));
[...students].sort((a,b)=>getStudentName(a).localeCompare(getStudentName(b))).forEach(student=>{
if(student?.id)select.add(new Option(getStudentName(student),String(student.id)));
});
}
function getAvailableSessions(state){
const sessions=Array.isArray(state?.context?.sessions)?state.context.sessions:[];
return sessions.filter(session=>session?.id&&!isFalseValue(session.is_active)&&!isFalseValue(session.display)).sort((a,b)=>getSessionStart(a).localeCompare(getSessionStart(b)));
}
function getSessionsForDate(sessions,dateValue){
const date=new Date(`${dateValue}T12:00:00+08:00`);
if(Number.isNaN(date.getTime()))return[];
const day=new Intl.DateTimeFormat('en-US',{timeZone:'Asia/Manila',weekday:'long'}).format(date).toLowerCase().slice(0,3);
return sessions.filter(session=>normalizeScheduledDays(session.scheduled_days).some(value=>String(value).trim().toLowerCase().slice(0,3)===day));
}
function normalizeScheduledDays(value){
if(Array.isArray(value))return value;
if(typeof value!=='string')return[];
try{const parsed=JSON.parse(value);if(Array.isArray(parsed))return parsed;}catch(error){}
return value.split(',');
}
function getSessionLabel(session){
const name=String(session?.name||'').trim();
if(name)return name;
const start=getSessionStart(session);
const end=String(session?.end_time_slot||session?.end_time||session?.session_end||session?.time_end||'');
if(start&&end)return`${start} - ${end}`;
return start||end||`Session ${session?.id||''}`;
}
function getSessionStart(session){
return String(session?.start_time_slot||session?.start_time||session?.session_start||session?.time_start||'');
}
function isFalseValue(value){
return value===false||value===0||value==='0'||String(value||'').trim().toLowerCase()==='false';
}
function getStudentName(student){
return student?.name||student?.full_name||[student?.first_name,student?.last_name].filter(Boolean).join(' ')||`Student ${student?.id||''}`;
}
