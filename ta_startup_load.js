import{
    API_URLS
}from'./ta_config.js';

import{
    apiRequest
}from'./ta_api.js';

import{
    setContext,
    setTeacherState,
    setAttendance,
    setSessionAttendanceCompletions,
    setLocationStudents
}from'./ta_state.js';

import{
    startupDebug
}from'./ta_startup_debug.js';

import{
    getEffectiveTime
}from'./ta_demo_clock.js';

import{
    getResultDetail,
    getTodayDate,
    getSevenDaysAgo
}from'./ta_startup_helpers.js';


export async function loadTeacherContext(){
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

    return context;
}


export async function loadTeacherState(
    context
){
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
            context?.teacher||
            {}
        )
    );

    stateUrl.searchParams.set(
        'sessions',
        JSON.stringify(
            context?.sessions||
            []
        )
    );

    stateUrl.searchParams.set(
        'today_day_name',
        context?.today_day_name||
        ''
    );

    stateUrl.searchParams.set(
        'current_time',
        getEffectiveTime(
            context?.current_time||
            ''
        )
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

    return teacherState;
}


export async function loadRelevantSessionAttendance(
    relevantSession
){
    if(!relevantSession?.id){
        startupDebug.note(
            'Attendance request skipped: no relevant session.'
        );

        return null;
    }

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

    return attendance;
}


export async function loadAttendanceCompletions(){
    startupDebug.start(
        'attendanceCompletions',
        'Load attendance completions'
    );

    const completionsUrl=
        new URL(
            API_URLS
                .getSessionAttendanceCompletions
        );

    completionsUrl.searchParams.set(
        'seven_days_ago',
        getSevenDaysAgo()
    );

    const sessionAttendanceCompletions=
        await apiRequest(
            completionsUrl.toString()
        );

    setSessionAttendanceCompletions(
        sessionAttendanceCompletions
    );

    startupDebug.finish(
        'attendanceCompletions',
        getResultDetail(
            sessionAttendanceCompletions
        )
    );

    console.log(
        'ta_get_session_attendance_completions:',
        sessionAttendanceCompletions
    );

    return sessionAttendanceCompletions;
}


export async function loadLocationStudents(){
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

    return locationStudents;
}
