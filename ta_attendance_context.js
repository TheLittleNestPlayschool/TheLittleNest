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

            weekday:
                'long',

            month:
                'long',

            day:
                'numeric',

            year:
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
        `${formatTime(startTime)}–`+
        `${formatTime(endTime)}`
    );
}

export function getTodayDate(){
    const parts=
        new Intl.DateTimeFormat(
            'en-CA',
            {
                timeZone:
                    MANILA_TIME_ZONE,

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

function formatTime(value){
    const[
        hourValue='0',
        minuteValue='00'
    ]=String(value||'')
        .split(':');

    const hour=
        Number(hourValue);

    const suffix=
        hour>=12
            ?'PM'
            :'AM';

    const displayHour=
        hour%12||
        12;

    return(
        `${displayHour}:`+
        `${minuteValue}`+
        ` ${suffix}`
    );
}
