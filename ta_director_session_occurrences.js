const LOOKBACK_DAYS=7;

const MANILA_TIME_ZONE=
    'Asia/Manila';

export function buildEndedSessionOccurrences(
    snapshot
){
    const sessions=
        getSessions(
            snapshot
        );

    const currentDate=
        getManilaDate();

    const currentTime=
        snapshot.teacherState
            ?.current_time||
        getManilaTime();

    const occurrences=[];

    for(
        let daysAgo=LOOKBACK_DAYS;
        daysAgo>=0;
        daysAgo-=1
    ){
        const attendanceDate=
            getDateOffset(
                currentDate,
                -daysAgo
            );

        const scheduledDay=
            getDayName(
                attendanceDate
            );

        sessions.forEach(session=>{
            if(
                !isActiveSession(
                    session
                )
            ){
                return;
            }

            if(
                !isScheduledForDay(
                    session,
                    scheduledDay
                )
            ){
                return;
            }

            if(
                !hasSessionEnded(
                    attendanceDate,
                    session,
                    currentDate,
                    currentTime
                )
            ){
                return;
            }

            occurrences.push({
                attendanceDate,

                sessionId:
                    session.id,

                session,

                scheduledDay,

                startTime:
                    session.start_time_slot||
                    '',

                endTime:
                    session.end_time_slot||
                    '',

                endedAt:
                    createEndedAt(
                        attendanceDate,
                        session.end_time_slot
                    )
            });
        });
    }

    return occurrences.sort(
        compareOccurrences
    );
}

function getSessions(snapshot){
    const sessions=
        snapshot.teacherState
            ?.sessions||
        [];

    return Array.isArray(sessions)
        ?sessions
        :[];
}

function isActiveSession(session){
    return(
        Boolean(session)&&
        session.is_active!==false
    );
}

function isScheduledForDay(
    session,
    dayName
){
    const scheduledDays=
        normalizeScheduledDays(
            session.scheduled_days
        );

    const normalizedDay=
        normalizeDayName(
            dayName
        );

    return scheduledDays.some(
        scheduledDay=>{
            return(
                normalizeDayName(
                    scheduledDay
                )===
                normalizedDay
            );
        }
    );
}

function normalizeScheduledDays(
    scheduledDays
){
    if(Array.isArray(scheduledDays)){
        return scheduledDays;
    }

    if(
        typeof scheduledDays!==
        'string'
    ){
        return[];
    }

    const value=
        scheduledDays.trim();

    if(!value){
        return[];
    }

    try{
        const parsedValue=
            JSON.parse(
                value
            );

        if(Array.isArray(parsedValue)){
            return parsedValue;
        }
    }catch(error){
        // Use comma-separated fallback.
    }

    return value
        .split(',')
        .map(dayName=>{
            return dayName.trim();
        })
        .filter(Boolean);
}

function normalizeDayName(dayName){
    return String(
        dayName||
        ''
    )
        .trim()
        .toLowerCase();
}

function hasSessionEnded(
    attendanceDate,
    session,
    currentDate,
    currentTime
){
    if(attendanceDate<currentDate){
        return true;
    }

    if(attendanceDate>currentDate){
        return false;
    }

    const endTime=
        session.end_time_slot||
        '';

    if(!endTime){
        return false;
    }

    return(
        normalizeTime(
            currentTime
        )>=
        normalizeTime(
            endTime
        )
    );
}

function normalizeTime(value){
    const[
        hour='00',
        minute='00'
    ]=String(value||'')
        .trim()
        .split(':');

    return(
        `${hour.padStart(2,'0')}:`+
        `${minute.padStart(2,'0')}`
    );
}

function createEndedAt(
    attendanceDate,
    endTime
){
    return(
        `${attendanceDate}T`+
        `${normalizeTime(endTime)}`+
        ':00+08:00'
    );
}

function compareOccurrences(
    firstOccurrence,
    secondOccurrence
){
    return String(
        firstOccurrence.endedAt
    ).localeCompare(
        String(
            secondOccurrence.endedAt
        )
    );
}

function getManilaDate(){
    return formatManilaDate(
        new Date()
    );
}

function getManilaTime(){
    const parts=
        new Intl.DateTimeFormat(
            'en-US',
            {
                timeZone:
                    MANILA_TIME_ZONE,

                hour:
                    '2-digit',

                minute:
                    '2-digit',

                hourCycle:
                    'h23'
            }
        ).formatToParts(
            new Date()
        );

    const values=
        Object.fromEntries(
            parts.map(part=>[
                part.type,
                part.value
            ])
        );

    return(
        `${values.hour}:`+
        `${values.minute}`
    );
}

function getDateOffset(
    manilaDate,
    dayOffset
){
    const date=
        new Date(
            `${manilaDate}`+
            'T12:00:00+08:00'
        );

    date.setUTCDate(
        date.getUTCDate()+
        dayOffset
    );

    return formatManilaDate(
        date
    );
}

function getDayName(manilaDate){
    const date=
        new Date(
            `${manilaDate}`+
            'T12:00:00+08:00'
        );

    return new Intl.DateTimeFormat(
        'en-US',
        {
            timeZone:
                MANILA_TIME_ZONE,

            weekday:
                'long'
        }
    ).format(
        date
    );
}

function formatManilaDate(date){
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
            date
        );

    const values=
        Object.fromEntries(
            parts.map(part=>[
                part.type,
                part.value
            ])
        );

    return(
        `${values.year}-`+
        `${values.month}-`+
        `${values.day}`
    );
}
