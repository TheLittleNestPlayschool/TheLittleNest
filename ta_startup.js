import{requireTeacherLogin}from'./ta_api.js';
import{setRelevantSession,getState}from'./ta_state.js';
import{startTeacherExperience}from'./ta_experience_director.js';
import{startupDebug}from'./ta_startup_debug.js';
import{getRelevantSession}from'./ta_startup_helpers.js';
import{
    loadTeacherContext,
    loadTeacherState,
    loadRelevantSessionAttendance,
    loadAttendanceCompletions,
    loadLocationStudents
}from'./ta_startup_load.js';
import{renderTeacherHeader}from'./ta_teacher_header.js';
import{
    startAnalyticsSession,
    setAnalyticsContext,
    trackAnalyticsEvent,
    markAnalyticsReady
}from'./ta_analytics.js';

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

    await startAnalyticsSession();
    trackAnalyticsEvent(
        'login_validated'
    );

    try{
        /*   teacher context*/
        teacherStatus.textContent=
            "Loading today's context...";

        const context=
            await loadTeacherContext();

        renderTeacherHeader(
            context
        );

        /*   teacher state*/
        teacherStatus.textContent=
            'Determining teacher state...';

        const teacherState=
            await loadTeacherState(
                context
            );

        /*   relevant session*/
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

        /*   relevant session attendance*/
        if(relevantSession?.id){
            teacherStatus.textContent=
                'Loading session attendance...';
        }

        await loadRelevantSessionAttendance(
            relevantSession
        );

        /*   attendance history*/
        teacherStatus.textContent=
            'Loading attendance history...';

        await loadAttendanceCompletions();

        /*   location students*/
        teacherStatus.textContent=
            'Loading location students...';

        await loadLocationStudents();

        /*   state ready*/
        startupDebug.start(
            'stateReady',
            'Prepare Teacher App state'
        );

        const state=getState();

        console.log(
            'Teacher App State:',
            state
        );

        setAnalyticsContext({
            teacher_state:
                state.teacherState
                    ?.teacher_state||
                null,
            relevant_session_id:
                state.relevantSession
                    ?.id||
                null,
            today_day_name:
                state.context
                    ?.today_day_name||
                null,
            current_time:
                state.context
                    ?.current_time||
                null,
            expected_student_count:
                Array.isArray(
                    state.expectedStudents
                )
                    ?state.expectedStudents.length
                    :0,
            attendance_record_count:
                Array.isArray(
                    state.attendanceRecords
                )
                    ?state.attendanceRecords.length
                    :0,
            attendance_completion_count:
                Array.isArray(
                    state.sessionAttendanceCompletions
                )
                    ?state.sessionAttendanceCompletions.length
                    :0,
            location_student_count:
                Array.isArray(
                    state.locationStudents
                )
                    ?state.locationStudents.length
                    :0
        });

        startupDebug.finish(
            'stateReady'
        );

        /*   experience director and stage*/
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

        /*   startup complete*/
        teacherStatus.textContent=
            'Teacher session loaded.';

        markAnalyticsReady();
        startupDebug.complete();

    }catch(error){
        console.error(
            'Teacher app startup failed:',
            error
        );

        trackAnalyticsEvent(
            'startup_failed',
            {
                data:{
                    message:
                        error instanceof Error
                            ?error.message
                            :'Unable to load Teacher App.'
                }
            }
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
