import{requireTeacherLogin}from'./ta_api.js';
import{setRelevantSession}from'./ta_state.js';
import{getRelevantSession}from'./ta_startup_helpers.js';
import{loadTeacherContext,loadTeacherState,loadRelevantSessionAttendance,loadAttendanceCompletions,loadLocationStudents}from'./ta_startup_load.js';
import{renderTeacherHeader}from'./ta_teacher_header.js';
import{renderTeacherTestHome}from'./ta_teacherapp_test_home.js';

const teacherStatus=document.getElementById('teacherStatus');

export async function startTeacherTestApp(){
if(!requireTeacherLogin())return;
try{
teacherStatus.textContent="Loading today's context...";
const context=await loadTeacherContext();
renderTeacherHeader(context);
teacherStatus.textContent='Loading teacher information...';
const teacherState=await loadTeacherState(context);
const relevantSession=getRelevantSession(teacherState);
setRelevantSession(relevantSession);
await loadRelevantSessionAttendance(relevantSession);
teacherStatus.textContent='Checking attendance...';
await loadAttendanceCompletions();
teacherStatus.textContent='Loading students...';
await loadLocationStudents();
teacherStatus.textContent='';
renderTeacherTestHome();
}catch(error){
console.error('Teacher test app startup failed:',error);
teacherStatus.textContent=error instanceof Error?error.message:'Unable to load Teacher App.';
}
}
