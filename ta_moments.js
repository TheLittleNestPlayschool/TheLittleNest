import{getWorkspace,clearWorkspace}from'./ta_ui.js';
import{getState}from'./ta_state.js';
import{apiRequest}from'./ta_api.js';
import{API_URLS}from'./ta_config.js';

export function renderMomentsModule(){
clearWorkspace();
const workspace=getWorkspace();
if(!workspace)return;
const state=getState();
const students=Array.isArray(state.locationStudents)?state.locationStudents:[];
const sessions=getAvailableSessions(state);
const container=document.createElement('section');
container.className='teacher-moments';
container.innerHTML=`
<div class="teacher-moments-heading">
<strong>Add a Moment</strong>
<span>Select the session, then choose the child.</span>
</div>
<label class="teacher-moments-field">
<span>Select Session</span>
<select class="teacher-moments-session"><option value="">Choose a session...</option></select>
</label>
<label class="teacher-moments-field">
<span>Select Student</span>
<select class="teacher-moments-select" disabled><option value="">Choose a student...</option></select>
</label>
<label class="teacher-moments-field">
<span>Extra Student</span>
<select class="teacher-moments-extra" disabled><option value="">Choose an extra student...</option></select>
</label>
<label class="teacher-moments-field">
<span>Moment</span>
<textarea class="teacher-moments-text" rows="5" placeholder="What happened?"></textarea>
</label>
<div class="teacher-moments-actions"><button type="button" class="teacher-moments-save">Save Moment</button></div>
<p class="teacher-moments-status" aria-live="polite"></p>`;
workspace.appendChild(container);
const sessionSelect=container.querySelector('.teacher-moments-session');
const studentSelect=container.querySelector('.teacher-moments-select');
const extraSelect=container.querySelector('.teacher-moments-extra');
const textarea=container.querySelector('.teacher-moments-text');
const saveButton=container.querySelector('.teacher-moments-save');
const status=container.querySelector('.teacher-moments-status');

sessions.forEach(session=>{
const option=document.createElement('option');
option.value=String(session.id);
option.textContent=getSessionLabel(session);
sessionSelect.appendChild(option);
});

sessionSelect.addEventListener('change',()=>{
const sessionId=Number(sessionSelect.value);
renderStudentOptions(studentSelect,students.filter(student=>Number(student?.session_enrolled)===sessionId),'Choose a student...');
renderStudentOptions(extraSelect,students.filter(student=>Number(student?.session_enrolled)!==sessionId),'Choose an extra student...');
studentSelect.disabled=!sessionId;
extraSelect.disabled=!sessionId;
studentSelect.value='';
extraSelect.value='';
if(sessionId)container.dataset.sessionId=String(sessionId);else delete container.dataset.sessionId;
status.textContent='';
});

studentSelect.addEventListener('change',()=>{if(studentSelect.value)extraSelect.value='';});
extraSelect.addEventListener('change',()=>{if(extraSelect.value)studentSelect.value='';});

saveButton.addEventListener('click',async()=>{
const sessionId=Number(sessionSelect.value);
const studentId=Number(studentSelect.value||extraSelect.value);
const moment=textarea.value.trim();
if(!sessionId){status.textContent='Please select a session.';sessionSelect.focus();return;}
if(!studentId){status.textContent='Please select a student.';studentSelect.focus();return;}
if(!moment){status.textContent='Enter the moment first.';textarea.focus();return;}
saveButton.disabled=true;
status.textContent='Saving...';
try{
await apiRequest(API_URLS.postStudentMoment,{method:'POST',body:{student_id:studentId,session_id:sessionId,moment}});
studentSelect.value='';
extraSelect.value='';
textarea.value='';
status.textContent='Moment saved.';
studentSelect.focus();
}catch(error){
status.textContent=error?.message||'Unable to save moment.';
}finally{
saveButton.disabled=false;
}
});
}

function renderStudentOptions(select,students,placeholder){
select.innerHTML=`<option value="">${placeholder}</option>`;
[...students].sort((a,b)=>getStudentName(a).localeCompare(getStudentName(b))).forEach(student=>{
if(!student?.id)return;
const option=document.createElement('option');
option.value=String(student.id);
option.textContent=getStudentName(student);
select.appendChild(option);
});
}

function getAvailableSessions(state){
const sessions=Array.isArray(state?.context?.sessions)?state.context.sessions:[];
return sessions.filter(session=>session?.id&&!isFalseValue(session.is_active)&&!isFalseValue(session.display)).sort((a,b)=>getSessionStart(a).localeCompare(getSessionStart(b)));
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
