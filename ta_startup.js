import{
    requireTeacherLogin
}from'./ta_api.js';

import{
    setRelevantSession,
    getState
}from'./ta_state.js';

import{
    startTeacherExperience
}from'./ta_experience_director.js';

import{
    startupDebug
}from'./ta_startup_debug.js';

import{
    getRelevantSession
}from'./ta_startup_helpers.js';

import{
    loadTeacherContext,
    loadTeacherState,
    loadRelevantSessionAttendance,
    loadAttendanceCompletions,
    loadLocationStudents
}from'./ta_startup_load.js';

import{
    renderTeacherHeader
}from'./ta_teacher_header.js';


const teacherStatus=
    document.getElementById(
        'teacherStatus'
    );


export async function startTeacherApp(){
    startupDebug.begin();

    startupDebug.start(
        'login',
        'Validate teacher login'
    );

    if(!requireTeacherLogin()){
        startupDebug.fail(
            'login',
            'Teacher login was not found.'
        );

        return;
    }

    startupDebug.finish(
        'login'
    );

    try{
        //------------------------------------
        // Teacher Context
        //------------------------------------

        teacherStatus.textContent=
            "Loading today's context...";

        const context=
            await loadTeacherContext();

        renderTeacherHeader(
            context
        );


        //------------------------------------
        // Teacher State
        //------------------------------------

        teacherStatus.textContent=
            'Determining teacher state...';

        const teacherState=
            await loadTeacherState(
                context
            );


        //------------------------------------
        // Relevant Session
        //------------------------------------

        startupDebug.start(
            'relevantSession',
            'Choose relevant session'
        );

        const relevantSession=
            getRelevantSession(
                teacherState
            );

        setRelevantSession(
            relevantSession
        );

        startupDebug.finish(
            'relevantSession',
            relevantSession?.id
                ?`Session ${relevantSession.id}`
                :'No relevant session'
        );


        //------------------------------------
        // Relevant Session Attendance
        //------------------------------------

        if(relevantSession?.id){
            teacherStatus.textContent=
                'Loading session attendance...';
        }

        await loadRelevantSessionAttendance(
            relevantSession
        );


        //------------------------------------
        // Attendance History
        //------------------------------------

        teacherStatus.textContent=
            'Loading attendance history...';

        await loadAttendanceCompletions();


        //------------------------------------
        // Location Students
        //------------------------------------

        teacherStatus.textContent=
            'Loading location students...';

        await loadLocationStudents();


        //------------------------------------
        // State Ready
        //------------------------------------

        startupDebug.start(
            'stateReady',
            'Prepare Teacher App state'
        );

        console.log(
            'Teacher App State:',
            getState()
        );

        startupDebug.finish(
            'stateReady'
        );


        //------------------------------------
        // Experience Director and Stage
        //------------------------------------

        teacherStatus.textContent=
            'Building Teacher Experience...';

        startupDebug.start(
            'experience',
            'Build and render Living Stage'
        );

        await Promise.resolve(
            startTeacherExperience()
        );

        startupDebug.finish(
            'experience'
        );


        //------------------------------------
        // Startup Complete
        //------------------------------------

        teacherStatus.textContent=
            'Teacher session loaded.';

        startupDebug.complete();

    }catch(error){
        console.error(
            'Teacher app startup failed:',
            error
        );

        startupDebug.note(
            error instanceof Error
                ?error.message
                :'Unable to load Teacher App.',
            'error'
        );

        teacherStatus.textContent=
            error instanceof Error
                ?error.message
                :'Unable to load Teacher App.';
    }
}
