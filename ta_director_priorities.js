export function getPriorityList(
    snapshot
){

    switch(
        snapshot.teacherState?.teacher_state
    ){

        case 'BEFORE_FIRST_SESSION':
            return beforeFirstSession();

        case 'IN_SESSION':
            return inSession();

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
        'teacher_information',
        'head_office_messages',
        'attendance',
        'media',
        'observations',
        'moments',
        'reflection',
        'messages'
    ];

}

function inSession(){

    return[
        'media',
        'moments',
        'observations',
        'attendance',
        'reflection',
        'messages',
        'see_tomorrow',
        'head_office_messages',
        'teacher_information'
    ];

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
        'reflection',
        'messages',
        'see_tomorrow',
        'head_office_messages',
        'teacher_information',
        'attendance',
        'media',
        'observations',
        'moments'
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
