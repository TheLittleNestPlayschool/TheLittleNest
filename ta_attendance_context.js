import{getTodayDate as getEffectiveTodayDate}from'./ta_startup_helpers.js';

const MANILA_TIME_ZONE=
    'Asia/Manila';

export function buildAttendanceContext(
    taskContext,
    state
){
    const attendanceDate=
        taskContext?.attendanceDate||
        getTodayDate();

    const sessionId=
        taskContext?.sessionId||
        state?.relevantSession?.id||
        null;

    const session=
        taskContext?.session||
        state?.relevantSession||
        null;

    return{
        ...(taskContext||{}),

        type:
            'attendance',

        isOverdue:
            taskContext?.isOverdue===
            true,

        attendanceDate,

        sessionId,

        session,

        attendanceKey:
            createAttendanceKey(
                attendanceDate,
                sessionId
            )
    };
}

export function createAttendanceKey(
    attendanceDate,
    sessionId
){
    return(
        `${attendanceDate||''}|`+
        `${String(sessionId||'')}`
    );
}

export function isStartupAttendance(
    attendanceContext,
    state
){
    if(
        !attendanceContext||
        !state
    ){
        return false;
    }

    return(
        !attendanceContext.isOverdue&&
        attendanceContext.attendanceDate===
            getTodayDate()&&
        attendanceContext.sessionId===
            state.relevantSession?.id
    );
}

export function getAttendanceDisplayDate(
    attendanceContext
){
    const attendanceDate=
        attendanceContext
            ?.attendanceDate||
        '';

    if(!attendanceDate){
        return'';
    }

    const date=
        new Date(
            `${attendanceDate}`+
            'T12:00:00+08:00'
        );

    return new Intl.DateTimeFormat(
        'en-US',
        {
            timeZone:
                MANILA_TIME_ZONE,

            month:
                'long',

            day:
                'numeric'
        }
    ).format(
        date
    );
}

export function getAttendanceTimeRange(
    attendanceContext
){
    const startTime=
        attendanceContext
            ?.startTime||
        attendanceContext
            ?.session
            ?.start_time_slot||
        '';

    const endTime=
        attendanceContext
            ?.endTime||
        attendanceContext
            ?.session
            ?.end_time_slot||
        '';

    if(
        !startTime||
        !endTime
    ){
        return'';
    }

    return(
        `${normalizeTime(startTime)}–`+
        `${normalizeTime(endTime)}`
    );
}

export function getTodayDate(){
    return getEffectiveTodayDate();
}

function normalizeTime(value){
    const[
        hour='00',
        minute='00'
    ]=String(value||'')
        .split(':');

    return(
        `${hour.padStart(2,'0')}:`+
        `${minute.padStart(2,'0')}`
    );
}
