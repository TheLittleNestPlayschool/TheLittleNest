import{getState,markSessionAttendanceComplete}from'./ta_state.js';
import{getWorkspace,clearWorkspace}from'./ta_ui.js';
import{renderInlineStudentPicker}from'./ta_student_picker.js';
import{postAttendance}from'./ta_attendance_post.js';
import{renderAttendanceIntro}from'./ta_attendance_intro.js';
import{renderAttendanceReview}from'./ta_attendance_review.js';
import{renderAttendanceComplete}from'./ta_attendance_complete.js';
import{buildAttendanceContext,getTodayDate}from'./ta_attendance_context.js';
import{loadAttendanceData}from'./ta_attendance_data.js';
import{createAttendanceSession,attendanceSessionMatches,applyAttendanceData,getAllAttendanceStudents,addAttendanceStudent,removeAttendanceStudent,selectAttendanceStatus,attendanceIsComplete,buildAttendanceDraft}from'./ta_attendance_session.js';

const COMPLETION_DISPLAY_MS=2000;
let attendanceSession=createAttendanceSession();
let completionTimer=null;
let showingDailySessions=false;

export async function renderAttendanceModule(taskContext=null){
const state=getState();
if(!taskContext){
clearCompletionTimer();
showingDailySessions=true;
attendanceSession=createAttendanceSession();
clearWorkspace();
await renderDailySessionSelect();
return;
}
showingDailySessions=false;
await openAttendanceContext(buildAttendanceContext(taskContext,state),state);
}

async function openAttendanceContext(attendanceContext,state=getState()){
if(attendanceAlreadyComplete(attendanceContext,state)){
clearCompletionTimer();
attendanceSession=createAttendanceSession(attendanceContext);
clearWorkspace();
await renderDailySessionSelect();
return;
}
if(!attendanceSessionMatches(attendanceSession,attendanceContext)){
clearCompletionTimer();
attendanceSession=createAttendanceSession(attendanceContext);
attendanceSession.isLoading=true;
clearWorkspace();
renderCurrentView();
try{
const attendanceData=await loadAttendanceData(attendanceContext,state);
if(isAttendanceDataComplete(attendanceData)){
markSessionAttendanceComplete(attendanceContext.attendanceDate,attendanceContext.sessionId);
showingDailySessions=true;
attendanceSession=createAttendanceSession();
await renderDailySessionSelect();
return;
}
applyAttendanceData(attendanceSession,attendanceData);
}catch(error){
console.error('Attendance load failed:',error);
attendanceSession.loadError=error instanceof Error?error.message:'Unable to load attendance.';
}finally{
if(!showingDailySessions){
attendanceSession.isLoading=false;
renderCurrentView();
}
}
return;
}
clearWorkspace();
renderCurrentView();
}

async function renderDailySessionSelect(){
const workspace=getWorkspace();
if(!workspace)return;
workspace.innerHTML='';
const state=getState();
const sessions=getTodaySessions(state);
const container=document.createElement('section');
container.className='attendance-experience attendance-introduction';
const eyebrow=document.createElement('p');
eyebrow.className='attendance-eyebrow';
eyebrow.textContent='Today’s Attendance';
const title=document.createElement('h3');
title.className='attendance-experience-title';
title.textContent='Choose a session.';
container.appendChild(eyebrow);
container.appendChild(title);
workspace.appendChild(container);
if(!sessions.length){
appendNoAttendanceMessage(container);
return;
}
const statusBySession=await getTodaySessionStatusMap(sessions,state);
if(!showingDailySessions)return;
const visibleSessions=sessions.filter(session=>{
const status=statusBySession.get(String(session.id));
return status?.hasAttendance===true||status?.complete===true;
});
if(!visibleSessions.length){
appendNoAttendanceMessage(container);
return;
}
visibleSessions.forEach(session=>{
const status=statusBySession.get(String(session.id))||{};
const complete=status.complete===true;
const button=document.createElement('button');
button.type='button';
button.className='attendance-secondary-button';
button.disabled=complete;
button.textContent=complete?`${getSessionLabel(session)} · Completed`:getSessionLabel(session);
if(!complete){
button.addEventListener('click',()=>{
showingDailySessions=false;
openAttendanceContext(buildAttendanceContext({attendanceDate:getTodayDate(),sessionId:session.id,session},state),state);
});
}
container.appendChild(button);
});
}

function appendNoAttendanceMessage(container){
const empty=document.createElement('p');
empty.className='attendance-empty-message';
empty.textContent='No attendance due';
container.appendChild(empty);
}

async function getTodaySessionStatusMap(sessions,state){
const today=getTodayDate();
const statusMap=new Map();
await Promise.all(sessions.map(async session=>{
const key=String(session.id);
if(isSessionCompleteToday(session,state)){
statusMap.set(key,{complete:true,hasAttendance:true});
return;
}
try{
const attendanceContext=buildAttendanceContext({attendanceDate:today,sessionId:session.id,session},state);
const attendanceData=await loadAttendanceData(attendanceContext,state);
const expectedStudents=Array.isArray(attendanceData?.expected_students)?attendanceData.expected_students:[];
const complete=isAttendanceDataComplete(attendanceData);
statusMap.set(key,{complete,hasAttendance:expectedStudents.length>0});
if(complete)markSessionAttendanceComplete(today,session.id);
}catch(error){
console.error('Attendance status check failed:',session.id,error);
statusMap.set(key,{complete:false,hasAttendance:true});
}
}));
return statusMap;
}

function isAttendanceDataComplete(attendanceData){
const expectedStudents=Array.isArray(attendanceData?.expected_students)?attendanceData.expected_students:[];
const attendanceRecords=Array.isArray(attendanceData?.attendance_records)?attendanceData.attendance_records:[];
if(!expectedStudents.length||!attendanceRecords.length)return false;
const recordedStudentIds=new Set(attendanceRecords.map(record=>String(record?.student_id||record?.student?.id||'')).filter(Boolean));
return expectedStudents.every(student=>recordedStudentIds.has(String(student?.id||'')));
}

function getTodaySessions(state){
const sessions=Array.isArray(state?.context?.sessions)?state.context.sessions:[];
const dayName=state?.context?.today_day_name||getTodayDayName();
return sessions.filter(session=>{
if(!session?.id)return false;
if(isFalseValue(session.is_active)||isFalseValue(session.display))return false;
return isScheduledForDay(session,dayName);
}).sort(compareSessionTimes);
}

function isScheduledForDay(session,dayName){
const scheduledDays=normalizeScheduledDays(session?.scheduled_days);
const normalizedDay=normalizeDayName(dayName);
return scheduledDays.some(day=>normalizeDayName(day)===normalizedDay);
}

function normalizeScheduledDays(value){
if(Array.isArray(value))return value;
if(typeof value!=='string')return[];
const text=value.trim();
if(!text)return[];
try{
const parsed=JSON.parse(text);
if(Array.isArray(parsed))return parsed;
}catch(error){}
return text.split(',').map(day=>day.trim()).filter(Boolean);
}

function normalizeDayName(dayName){
const value=String(dayName||'').trim().toLowerCase();
const aliases={mon:'monday',monday:'monday',tue:'tuesday',tues:'tuesday',tuesday:'tuesday',wed:'wednesday',weds:'wednesday',wednesday:'wednesday',thu:'thursday',thur:'thursday',thurs:'thursday',thursday:'thursday',fri:'friday',friday:'friday',sat:'saturday',saturday:'saturday',sun:'sunday',sunday:'sunday'};
return aliases[value]||value;
}

function getTodayDayName(){
return new Intl.DateTimeFormat('en-US',{timeZone:'Asia/Manila',weekday:'long'}).format(new Date());
}

function compareSessionTimes(first,second){
return getSessionStart(first).localeCompare(getSessionStart(second));
}

function getSessionStart(session){
return String(session?.start_time_slot||session?.start_time||session?.session_start||session?.time_start||'');
}

function getSessionLabel(session){
const name=String(session?.name||'').trim();
if(name)return name;
const start=getSessionStart(session);
const end=String(session?.end_time_slot||session?.end_time||session?.session_end||session?.time_end||'');
if(start&&end)return`${start} - ${end}`;
return start||end||`Session ${session?.id||''}`;
}

function isFalseValue(value){
return value===false||value===0||value==='0'||String(value||'').trim().toLowerCase()==='false';
}

function isSessionCompleteToday(session,state){
const today=getTodayDate();
return(state.sessionAttendanceCompletions||[]).some(record=>record?.attendance_date===today&&String(record?.session_id)===String(session?.id));
}

function attendanceAlreadyComplete(attendanceContext,state){
return(state.sessionAttendanceCompletions||[]).some(record=>record?.attendance_date===attendanceContext.attendanceDate&&String(record?.session_id)===String(attendanceContext.sessionId));
}

function renderCurrentView(){
const workspace=getWorkspace();
if(!workspace)return;
workspace.innerHTML='';
if(showingDailySessions){renderDailySessionSelect();return;}
if(attendanceSession.isLoading){workspace.textContent='Loading attendance...';return;}
if(attendanceSession.loadError){workspace.textContent=attendanceSession.loadError;return;}
const expectedStudents=attendanceSession.attendanceData?.expected_students||[];
if(attendanceSession.attendanceData&&expectedStudents.length===0){workspace.textContent='No attendance due';return;}
const context={state:getState(),session:attendanceSession,taskContext:attendanceSession.taskContext,students:getAllAttendanceStudents(attendanceSession),renderStudentPicker,actions:{begin:beginAttendance,showIntro:()=>showView('intro'),showReview:()=>showView('review'),selectStatus:handleStatusSelection,addStudent:openStudentPicker,removeStudent:handleRemoveStudent,submit:submitAttendance}};
switch(attendanceSession.view){
case'review':renderAttendanceReview(workspace,context);break;
case'complete':renderAttendanceComplete(workspace,context);break;
default:renderAttendanceIntro(workspace,context);
}
applyAttendanceAnalyticsContext(workspace);
updateAttendanceLiveStatus();
}

function applyAttendanceAnalyticsContext(workspace){
const sessionId=Number(attendanceSession.taskContext?.sessionId);
if(!Number.isFinite(sessionId)||sessionId<=0)return;
Array.from(workspace.children).forEach(child=>{if(child instanceof HTMLElement)child.dataset.sessionId=String(sessionId);});
}

function showView(view){attendanceSession.view=view;renderCurrentView();}
function beginAttendance(){showView('review');}
function handleStatusSelection(studentId,status){selectAttendanceStatus(attendanceSession,studentId,status);renderCurrentView();}
function openStudentPicker(){attendanceSession.addingStudent=true;renderCurrentView();}
function handleRemoveStudent(studentId){removeAttendanceStudent(attendanceSession,studentId);renderCurrentView();}

function renderStudentPicker(container){
const expectedStudents=attendanceSession.attendanceData?.expected_students||[];
renderInlineStudentPicker(container,{locationStudents:getState().locationStudents,excludedStudentIds:[...expectedStudents.map(student=>student.id),...attendanceSession.addedStudents.map(student=>student.id)],onStudentSelected:student=>{addAttendanceStudent(attendanceSession,student);renderCurrentView();},onCancel:()=>{attendanceSession.addingStudent=false;renderCurrentView();}});
}

async function submitAttendance(){
if(attendanceSession.isSubmitting||!attendanceIsComplete(attendanceSession))return;
attendanceSession.isSubmitting=true;
renderCurrentView();
try{
const draft=buildAttendanceDraft(attendanceSession);
attendanceSession.submissionResult=await postAttendance(draft,attendanceSession.taskContext);
console.log('ta_post_attendance:',attendanceSession.submissionResult);
markSessionAttendanceComplete(attendanceSession.taskContext?.attendanceDate,attendanceSession.taskContext?.sessionId);
attendanceSession.isSaved=true;
attendanceSession.view='complete';
attendanceSession.isSubmitting=false;
renderCurrentView();
scheduleExperienceRefresh();
}catch(error){
console.error('Attendance submission failed:',error);
attendanceSession.isSubmitting=false;
renderCurrentView();
window.alert(error instanceof Error?error.message:'Unable to save attendance.');
}
}

function scheduleExperienceRefresh(){
clearCompletionTimer();
completionTimer=window.setTimeout(()=>{
completionTimer=null;
attendanceSession=createAttendanceSession();
showingDailySessions=true;
renderDailySessionSelect();
window.dispatchEvent(new CustomEvent('teacher-task-completed',{detail:{taskType:'attendance'}}));
},COMPLETION_DISPLAY_MS);
}

function clearCompletionTimer(){if(completionTimer===null)return;window.clearTimeout(completionTimer);completionTimer=null;}
function updateAttendanceLiveStatus(){}
