
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

import{
    refreshTeacherExperience
}from'./ta_experience_director.js';

const COMPLETION_DISPLAY_MS=
    2000;

let attendanceSession=
    createAttendanceSession();

let completionTimer=
    null;

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
        clearCompletionTimer();

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

    switch(attendanceSession.view){
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
                    student=>student.id
                ),

                ...attendanceSession
                    .addedStudents
                    .map(
                        student=>student.id
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

            onCancel:
                ()=>{
                    attendanceSession
                        .addingStudent=
                        false;

                    renderCurrentView();
                }
        }
    );
}

async function submitAttendance(){
    if(
        attendanceSession.isSubmitting||
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

        console.log(
            'ta_post_attendance:',
            attendanceSession
                .submissionResult
        );

        attendanceSession.isSaved=
            true;

        attendanceSession.view=
            'complete';

        attendanceSession.isSubmitting=
            false;

        renderCurrentView();

        scheduleExperienceRefresh();

    }catch(error){
        console.error(
            'Attendance submission failed:',
            error
        );

        attendanceSession.isSubmitting=
            false;

        renderCurrentView();

        window.alert(
            error instanceof Error
                ?error.message
                :'Unable to save attendance.'
        );
    }
}

function scheduleExperienceRefresh(){
    clearCompletionTimer();

    completionTimer=
        window.setTimeout(
            async()=>{
                completionTimer=
                    null;

                attendanceSession=
                    createAttendanceSession();

                await refreshTeacherExperience();
            },
            COMPLETION_DISPLAY_MS
        );
}

function clearCompletionTimer(){
    if(completionTimer===null){
        return;
    }

    window.clearTimeout(
        completionTimer
    );

    completionTimer=
        null;
}

function updateAttendanceLiveStatus(){
    // Existing live status logic will be restored
    // after the completion-refresh flow is connected.
}
