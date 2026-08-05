export function getPriorityList(
    snapshot
){

    switch(
        snapshot.teacherState?.teacher_state
    ){

        case 'BEFORE_FIRST_SESSION':
            return beforeFirstSession();

        case 'IN_SESSION':
            return inSession(
                snapshot
            );

        case 'BETWEEN_SESSIONS':
            return betweenSessions();

        case 'AFTER_LAST_SESSION':
            return afterLastSession();

        default:
            return afterSession();

    }

}

function beforeFirstSession(){

    return[
        'see_tomorrow',
        'head_office_messages',
        'attendance',
        'media',
        'observations',
        'moments',
        'reflection',
        'messages',
        'teacher_information'
    ];

}

function inSession(
    snapshot
){

    const capacityState=
        snapshot.teacherCapacity
            ?.teacherCapacityState||
        'unknown';

    switch(capacityState){

        case 'very_busy':
        case 'busy':
            return[
                'moments',
                'observations',
                'reflection',
                'messages',
                'head_office_messages',
                'attendance',
                'media',
                'see_tomorrow',
                'teacher_information'
            ];

        case 'moderately_busy':
            return[
                'moments',
                'observations',
                'reflection',
                'messages',
                'head_office_messages',
                'attendance',
                'media',
                'see_tomorrow',
                'teacher_information'
            ];

        case 'slow':
            return[
                'observations',
                'moments',
                'reflection',
                'messages',
                'head_office_messages',
                'attendance',
                'media',
                'see_tomorrow',
                'teacher_information'
            ];

        case 'very_slow':
            return[
                'observations',
                'moments',
                'reflection',
                'messages',
                'head_office_messages',
                'attendance',
                'media',
                'see_tomorrow',
                'teacher_information'
            ];

        default:
            return[
                'moments',
                'observations',
                'reflection',
                'messages',
                'head_office_messages',
                'attendance',
                'media',
                'see_tomorrow',
                'teacher_information'
            ];

    }

}

function betweenSessions(){

    return[
        'attendance',
        'media',
        'observations',
        'moments',
        'reflection',
        'messages',
        'see_tomorrow',
        'head_office_messages',
        'teacher_information'
    ];

}

function afterLastSession(){

    return[
        'attendance',
        'media',
        'observations',
        'moments',
        'reflection',
        'messages',
        'see_tomorrow',
        'head_office_messages',
        'teacher_information'
    ];

}

function afterSession(){

    return[
        'attendance',
        'media',
        'observations',
        'moments',
        'reflection',
        'messages',
        'see_tomorrow',
        'head_office_messages',
        'teacher_information'
    ];

}
