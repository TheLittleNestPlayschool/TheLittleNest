
import{getState}from'./ta_state.js';
import{getWorkspace,clearWorkspace}from'./ta_ui.js';
import{showStudentPicker}from'./ta_student_picker.js';
import{postAttendance}from'./ta_attendance_post.js';
import{renderAttendanceIntro}from'./ta_attendance_intro.js';
import{renderAttendanceReview}from'./ta_attendance_review.js';
import{renderAttendanceComplete}from'./ta_attendance_complete.js';

let attendanceSession=createEmptySession();

export function renderAttendanceModule(){
    const state=getState();
    const sessionId=state.relevantSession?.id||null;

    if(attendanceSession.sessionId!==sessionId){
        resetAttendanceSession(sessionId);
    }

    clearWorkspace();
    renderCurrentView();
}

function createEmptySession(sessionId=null){
    return{
        sessionId,
        view:'intro',
        addedStudents:[],
        selections:{},
        isSubmitting:false,
        submissionResult:null
    };
}

function resetAttendanceSession(sessionId){
    attendanceSession=createEmptySession(sessionId);
    loadExistingAttendance();
}

function loadExistingAttendance(){
    const state=getState();
    const records=state.attendance?.attendance_records||[];

    records.forEach(record=>{
        const studentId=record.student_id||record.student?.id||null;
        const status=record.attendance_status||record.status||null;

        if(!studentId){
            return;
        }

        attendanceSession.selections[studentId]=status;
    });

    if(records.length>0){
        attendanceSession.view='review';
    }
}

function renderCurrentView(){
    const workspace=getWorkspace();

    if(!workspace){
        return;
    }

    workspace.innerHTML='';

    const context={
        state:getState(),
        session:attendanceSession,
        students:getAllAttendanceStudents(),
        actions:{
            begin:beginAttendance,
            showIntro:()=>showView('intro'),
            showReview:()=>showView('review'),
            selectStatus:selectAttendanceStatus,
            addStudent:openStudentPicker,
            removeStudent:removeAddedStudent,
            submit:submitAttendance
        }
    };

    switch(attendanceSession.view){
        case'review':
            renderAttendanceReview(workspace,context);
            break;

        case'complete':
            renderAttendanceComplete(workspace,context);
            break;

        default:
            renderAttendanceIntro(workspace,context);
    }
}

function showView(view){
    attendanceSession.view=view;
    renderCurrentView();
}

function beginAttendance(){
    const students=getAllAttendanceStudents();

    if(students.length===0){
        openStudentPicker();
        return;
    }

    showView('review');
}

function selectAttendanceStatus(studentId,status){
    attendanceSession.selections[studentId]=status;
    renderCurrentView();
}

function openStudentPicker(){
    const state=getState();
    const expectedStudents=state.attendance?.expected_students||[];

    const excludedStudentIds=[
        ...expectedStudents.map(student=>student.id),
        ...attendanceSession.addedStudents.map(student=>student.id)
    ];

    showStudentPicker({
        locationStudents:state.locationStudents||[],
        excludedStudentIds,
        onStudentSelected:addStudentToAttendance,
        onCancel:()=>showView('review')
    });
}

function addStudentToAttendance(student){
    attendanceSession.addedStudents.push({
        ...student,
        isAddedStudent:true
    });

    attendanceSession.selections[student.id]='present';
    showView('review');
}

function removeAddedStudent(studentId){
    attendanceSession.addedStudents=
        attendanceSession.addedStudents.filter(student=>{
            return student.id!==studentId;
        });

    delete attendanceSession.selections[studentId];
    showView('review');
}

async function submitAttendance(){
    if(attendanceSession.isSubmitting||!attendanceIsComplete()){
        return;
    }

    attendanceSession.isSubmitting=true;
    renderCurrentView();

    try{
        const attendanceDraft=getAttendanceDraft();

        attendanceSession.submissionResult=
            await postAttendance(attendanceDraft);

        console.log(
            'ta_post_attendance:',
            attendanceSession.submissionResult
        );

        attendanceSession.view='complete';
    }catch(error){
        console.error(
            'Attendance submission failed:',
            error
        );

        window.alert(
            error instanceof Error
                ?error.message
                :'Unable to save attendance.'
        );
    }finally{
        attendanceSession.isSubmitting=false;
        renderCurrentView();
    }
}

function getAllAttendanceStudents(){
    const state=getState();
    const expectedStudents=state.attendance?.expected_students||[];

    return[
        ...expectedStudents.map(student=>({
            ...student,
            attendance_source:'scheduled',
            isAddedStudent:false
        })),
        ...attendanceSession.addedStudents
    ];
}

function attendanceIsComplete(){
    const students=getAllAttendanceStudents();

    return students.length>0&&students.every(student=>{
        return Boolean(attendanceSession.selections[student.id]);
    });
}

export function getAttendanceDraft(){
    return getAllAttendanceStudents().map(student=>({
        student_id:student.id,
        status:attendanceSession.selections[student.id]||null,
        attendance_source:student.attendance_source||'scheduled'
    }));
}
