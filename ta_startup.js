
import{
    API_URLS
}from'./ta_config.js';

import{
    apiRequest,
    requireTeacherLogin
}from'./ta_api.js';

import{
    setContext,
    setTeacherState,
    setRelevantSession,
    setAttendance,
    setLocationStudents,
    getState
}from'./ta_state.js';

import{
    startTeacherExperience
}from'./ta_experience_director.js';

import{
    startupDebug
}from'./ta_startup_debug.js';

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
        teacherStatus.textContent=
            "Loading today's context...";

        //------------------------------------
        // Teacher Context
        //------------------------------------

        startupDebug.start(
            'context',
            'Load teacher context'
        );

        const context=
            await apiRequest(
                API_URLS.getContext
            );

        setContext(
            context
        );

        startupDebug.finish(
            'context',
            getResultDetail(
                context
            )
        );

        console.log(
            'ta_get_context:',
            context
        );

        //------------------------------------
        // Teacher State
        //------------------------------------

        startupDebug.start(
            'teacherState',
            'Determine teacher state'
        );

        const stateUrl=
            new URL(
                API_URLS
                    .determineTeacherState
            );

        stateUrl.searchParams.set(
            'teacher',
            JSON.stringify(
                context.teacher||{}
            )
        );

        stateUrl.searchParams.set(
            'sessions',
            JSON.stringify(
                context.sessions||[]
            )
        );

        stateUrl.searchParams.set(
            'today_day_name',
            context.today_day_name||''
        );

        stateUrl.searchParams.set(
            'current_time',
            context.current_time||''
        );

        const teacherState=
            await apiRequest(
                stateUrl.toString()
            );

        setTeacherState(
            teacherState
        );

        startupDebug.finish(
            'teacherState',
            teacherState
                ?.teacher_state||
            ''
        );

        console.log(
            'ta_determine_teacher_state:',
            teacherState
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
        // Session Attendance
        //------------------------------------

        if(relevantSession?.id){
            teacherStatus.textContent=
                'Loading session attendance...';

            startupDebug.start(
                'attendance',
                'Load session attendance'
            );

            const attendanceUrl=
                new URL(
                    API_URLS
                        .getSessionAttendance
                );

            attendanceUrl.searchParams.set(
                'session_id',
                String(
                    relevantSession.id
                )
            );

            attendanceUrl.searchParams.set(
                'session_date',
                getTodayDate()
            );

            const attendance=
                await apiRequest(
                    attendanceUrl.toString()
                );

            setAttendance(
                attendance
            );

            startupDebug.finish(
                'attendance',
                getResultDetail(
                    attendance
                )
            );

            console.log(
                'ta_get_session_attendance:',
                attendance
            );
        }else{
            startupDebug.note(
                'Attendance request skipped: no relevant session.'
            );
        }

        //------------------------------------
        // All Location Students
        //------------------------------------

        teacherStatus.textContent=
            'Loading location students...';

        startupDebug.start(
            'locationStudents',
            'Load location students'
        );

        const locationStudents=
            await apiRequest(
                API_URLS
                    .getLocationStudents
            );

        setLocationStudents(
            locationStudents
        );

        startupDebug.finish(
            'locationStudents',
            getResultDetail(
                locationStudents
            )
        );

        console.log(
            'ta_get_location_students:',
            locationStudents
        );

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

function getResultDetail(result){
    if(Array.isArray(result)){
        return(
            `${result.length} records`
        );
    }

    if(
        result&&
        typeof result==='object'
    ){
        return(
            `${Object.keys(result).length} fields`
        );
    }

    return result===undefined
        ?''
        :String(result);
}

function getRelevantSession(
    teacherState
){
    switch(
        teacherState.teacher_state
    ){
        case'IN_SESSION':
            return(
                teacherState.current_session
            );

        case'BEFORE_FIRST_SESSION':
            return(
                teacherState.next_session
            );

        case'BETWEEN_SESSIONS':
            return(
                teacherState.next_session
            );

        case'AFTER_LAST_SESSION':
            return(
                teacherState.previous_session
            );

        default:
            return(
                teacherState.current_session||
                teacherState.previous_session||
                teacherState.next_session||
                null
            );
    }
}

function getTodayDate(){
    const parts=
        new Intl.DateTimeFormat(
            'en-CA',
            {
                timeZone:
                    'Asia/Manila',
                year:
                    'numeric',
                month:
                    '2-digit',
                day:
                    '2-digit'
            }
        ).formatToParts(
            new Date()
        );

    const values=
        Object.fromEntries(
            parts.map(
                part=>[
                    part.type,
                    part.value
                ]
            )
        );

    return(
        `${values.year}-`+
        `${values.month}-`+
        `${values.day}`
    );
}
