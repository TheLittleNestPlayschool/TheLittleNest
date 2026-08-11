export function getResultDetail(
    result
){
    if(
        Array.isArray(
            result
        )
    ){
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
        :String(
            result
        );
}


export function getRelevantSession(
    teacherState
){
    switch(
        teacherState?.teacher_state
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
                teacherState?.current_session||
                teacherState?.previous_session||
                teacherState?.next_session||
                null
            );
    }
}


export function getTodayDate(){
    return formatManilaDate(
        new Date()
    );
}


export function getSevenDaysAgo(){
    const date=
        new Date();

    date.setDate(
        date.getDate()-7
    );

    return formatManilaDate(
        date
    );
}


export function formatManilaDate(
    date
){
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
        )
            .formatToParts(
                date
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
