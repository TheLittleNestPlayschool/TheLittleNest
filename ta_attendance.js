import{
    getState
}from'./ta_state.js';

import{
    getWorkspace,
    clearWorkspace
}from'./ta_ui.js';

import{
    renderInlineStudentPicker
}from'./ta_student_picker.js';

import{
    postAttendance
}from'./ta_attendance_post.js';

import{
    renderAttendanceIntro
}from'./ta_attendance_intro.js';

import{
    renderAttendanceReview
}from'./ta_attendance_review.js';

import{
    renderAttendanceComplete
}from'./ta_attendance_complete.js';

import{
    buildAttendanceContext
}from'./ta_attendance_context.js';

import{
    loadAttendanceData
}from'./ta_attendance_data.js';

import{
    createAttendanceSession,
    attendanceSessionMatches,
    applyAttendanceData,
    getAllAttendanceStudents,
    addAttendanceStudent,
    removeAttendanceStudent,
    selectAttendanceStatus,
    attendanceIsComplete,
    buildAttendanceDraft
}from'./ta_attendance_session.js';

let attendanceSession=
    createAttendanceSession();

export async function renderAttendanceModule(
    taskContext=null
){
    const state=
        getState();

    const attendanceContext=
        buildAttendanceContext(
            taskContext,
            state
        );

    if(
        !attendanceSessionMatches(
            attendanceSession,
            attendanceContext
        )
    ){
        attendanceSession=
            createAttendanceSession(
                attendanceContext
            );

        attendanceSession.isLoading=
            true;

        clearWorkspace();
        renderCurrentView();

        try{

            const attendanceData=
                await loadAttendanceData(
                    attendanceContext,
                    state
                );

            applyAttendanceData(
                attendanceSession,
                attendanceData
            );

        }catch(error){

            console.error(
                'Attendance load failed:',
                error
            );

            attendanceSession.loadError=
                error instanceof Error
                    ?error.message
                    :'Unable to load attendance.';

        }finally{

            attendanceSession.isLoading=
                false;

            renderCurrentView();

        }

        return;
    }

    clearWorkspace();

    renderCurrentView();
}

function renderCurrentView(){

    const workspace=
        getWorkspace();

    if(!workspace){
        return;
    }

    workspace.innerHTML='';

    if(attendanceSession.isLoading){

        workspace.textContent=
            'Loading attendance...';

        return;
    }

    if(attendanceSession.loadError){

        workspace.textContent=
            attendanceSession.loadError;

        return;
    }

    const context={

        state:
            getState(),

        session:
            attendanceSession,

        taskContext:
            attendanceSession.taskContext,

        students:
            getAllAttendanceStudents(
                attendanceSession
            ),

        renderStudentPicker,

        actions:{

            begin:
                beginAttendance,

            showIntro:
                ()=>showView(
                    'intro'
                ),

            showReview:
                ()=>showView(
                    'review'
                ),

            selectStatus:
                handleStatusSelection,

            addStudent:
                openStudentPicker,

            removeStudent:
                handleRemoveStudent,

            submit:
                submitAttendance
        }
    };

    switch(
        attendanceSession.view
    ){

        case'review':

            renderAttendanceReview(
                workspace,
                context
            );

            break;

        case'complete':

            renderAttendanceComplete(
                workspace,
                context
            );

            break;

        default:

            renderAttendanceIntro(
                workspace,
                context
            );
    }

    updateAttendanceLiveStatus();
}

function showView(view){

    attendanceSession.view=
        view;

    renderCurrentView();
}

function beginAttendance(){

    showView(
        'review'
    );
}

function handleStatusSelection(
    studentId,
    status
){

    selectAttendanceStatus(
        attendanceSession,
        studentId,
        status
    );

    renderCurrentView();
}

function openStudentPicker(){

    attendanceSession.addingStudent=
        true;

    renderCurrentView();
}

function handleRemoveStudent(
    studentId
){

    removeAttendanceStudent(
        attendanceSession,
        studentId
    );

    renderCurrentView();
}

function renderStudentPicker(
    container
){

    const expectedStudents=
        attendanceSession
            .attendanceData
            ?.expected_students||
        [];

    renderInlineStudentPicker(
        container,
        {

            locationStudents:
                getState()
                    .locationStudents,

            excludedStudentIds:[
                ...expectedStudents.map(
                    s=>s.id
                ),
                ...attendanceSession
                    .addedStudents
                    .map(
                        s=>s.id
                    )
            ],

            onStudentSelected:
                student=>{

                    addAttendanceStudent(
                        attendanceSession,
                        student
                    );

                    renderCurrentView();
                },

            onCancel:()=>{

                attendanceSession.addingStudent=
                    false;

                renderCurrentView();
            }
        }
    );
}

async function submitAttendance(){

    if(
        attendanceSession
            .isSubmitting||
        !attendanceIsComplete(
            attendanceSession
        )
    ){
        return;
    }

    attendanceSession.isSubmitting=
        true;

    renderCurrentView();

    try{

        const draft=
            buildAttendanceDraft(
                attendanceSession
            );

        attendanceSession.submissionResult=
            await postAttendance(
                draft,
                attendanceSession
                    .taskContext
            );

        attendanceSession.isSaved=
            true;

        attendanceSession.view=
            'complete';

    }catch(error){

        console.error(
            error
        );

        alert(
            error.message
        );

    }finally{

        attendanceSession.isSubmitting=
            false;

        renderCurrentView();
    }
}

function updateAttendanceLiveStatus(){

    // Existing live status logic stays here.

}
