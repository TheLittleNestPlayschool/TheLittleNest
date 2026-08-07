export function getPriorityList(
    snapshot,
    overdueAttendanceQueue=[]
){
    const teacherState=
        snapshot.teacherState
            ?.teacher_state||
        '';

    const oldestOverdueAttendance=
        getOldestOverdueAttendance(
            overdueAttendanceQueue
        );

    const normalPriorityList=
        getNormalPriorityList(
            snapshot,
            teacherState
        );

    if(!oldestOverdueAttendance){
        return normalPriorityList;
    }

    if(teacherState==='IN_SESSION'){
        return placeOverdueAttendanceBelowLiving(
            normalPriorityList,
            oldestOverdueAttendance
        );
    }

    return placeOverdueAttendanceAsLiving(
        normalPriorityList,
        oldestOverdueAttendance
    );
}

function getNormalPriorityList(
    snapshot,
    teacherState
){
    switch(teacherState){

        case'BEFORE_FIRST_SESSION':
            return beforeFirstSession();

        case'IN_SESSION':
            return inSession(
                snapshot
            );

        case'BETWEEN_SESSIONS':
            return betweenSessions();

        case'AFTER_LAST_SESSION':
            return afterLastSession();

        default:
            return afterSession();
    }
}

function beforeFirstSession(){
    return[
        'see_tomorrow',
        'head_office_messages',
        'observations',
        'moments',
        'reflection',
        'messages',
        'receipt_upload',
        'enrollment',
        'teacher_resources',
        'attendance',
        'media',
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

        case'very_busy':
        case'busy':
            return[
                'moments',
                'observations',
                'reflection',
                'messages',
                'head_office_messages',
                'receipt_upload',
                'enrollment',
                'see_tomorrow',
                'teacher_resources',
                'attendance',
                'media',
                'teacher_information'
            ];

        case'moderately_busy':
            return[
                'moments',
                'observations',
                'reflection',
                'messages',
                'head_office_messages',
                'receipt_upload',
                'enrollment',
                'see_tomorrow',
                'teacher_resources',
                'attendance',
                'media',
                'teacher_information'
            ];

        case'slow':
        case'very_slow':
            return[
                'observations',
                'moments',
                'reflection',
                'messages',
                'head_office_messages',
                'receipt_upload',
                'enrollment',
                'see_tomorrow',
                'teacher_resources',
                'attendance',
                'media',
                'teacher_information'
            ];

        default:
            return[
                'moments',
                'observations',
                'reflection',
                'messages',
                'head_office_messages',
                'receipt_upload',
                'enrollment',
                'see_tomorrow',
                'teacher_resources',
                'attendance',
                'media',
                'teacher_information'
            ];
    }
}

function betweenSessions(){
    return[
        'media',
        'observations',
        'moments',
        'reflection',
        'messages',
        'receipt_upload',
        'enrollment',
        'see_tomorrow',
        'head_office_messages',
        'teacher_resources',
        'attendance',
        'teacher_information'
    ];
}

function afterLastSession(){
    return[
        'media',
        'observations',
        'moments',
        'reflection',
        'messages',
        'receipt_upload',
        'enrollment',
        'see_tomorrow',
        'head_office_messages',
        'teacher_resources',
        'attendance',
        'teacher_information'
    ];
}

function afterSession(){
    return[
        'media',
        'observations',
        'moments',
        'reflection',
        'messages',
        'receipt_upload',
        'enrollment',
        'see_tomorrow',
        'head_office_messages',
        'teacher_resources',
        'attendance',
        'teacher_information'
    ];
}

function getOldestOverdueAttendance(
    overdueAttendanceQueue
){
    if(
        !Array.isArray(
            overdueAttendanceQueue
        )||
        overdueAttendanceQueue.length===0
    ){
        return null;
    }

    return(
        overdueAttendanceQueue[0]||
        null
    );
}

function placeOverdueAttendanceAsLiving(
    normalPriorityList,
    overdueAttendance
){
    const remainingModules=
        removeModules(
            normalPriorityList,
            [
                'attendance',
                'media',
                'teacher_information'
            ]
        );

    return[
        createOverdueAttendanceModule(
            overdueAttendance
        ),

        'media',

        ...remainingModules,

        'teacher_information'
    ];
}

function placeOverdueAttendanceBelowLiving(
    normalPriorityList,
    overdueAttendance
){
    const livingModule=
        normalPriorityList[0];

    const remainingModules=
        removeModules(
            normalPriorityList.slice(1),
            [
                'attendance',
                'media',
                'teacher_information'
            ]
        );

    return[
        livingModule,

        createOverdueAttendanceModule(
            overdueAttendance
        ),

        'media',

        ...remainingModules,

        'teacher_information'
    ];
}

function createOverdueAttendanceModule(
    overdueAttendance
){
    return{
        id:
            'attendance',

        status:
            'Overdue',

        liveStatus:
            buildOverdueLiveStatus(
                overdueAttendance
            ),

        taskContext:{
            type:
                'attendance',

            isOverdue:
                true,

            attendanceDate:
                overdueAttendance
                    .attendanceDate,

            sessionId:
                overdueAttendance
                    .sessionId,

            session:
                overdueAttendance
                    .session,

            scheduledDay:
                overdueAttendance
                    .scheduledDay,

            startTime:
                overdueAttendance
                    .startTime,

            endTime:
                overdueAttendance
                    .endTime,

            endedAt:
                overdueAttendance
                    .endedAt
        }
    };
}

function buildOverdueLiveStatus(
    overdueAttendance
){
    const date=
        overdueAttendance
            ?.attendanceDate||
        '';

    const startTime=
        overdueAttendance
            ?.startTime||
        '';

    const endTime=
        overdueAttendance
            ?.endTime||
        '';

    if(
        date&&
        startTime&&
        endTime
    ){
        return(
            `Overdue · ${date} · `+
            `${startTime}–${endTime}`
        );
    }

    if(date){
        return(
            `Overdue · ${date}`
        );
    }

    return'Overdue attendance';
}

function removeModules(
    priorityList,
    moduleIds
){
    const excludedIds=
        new Set(
            moduleIds
        );

    return priorityList.filter(
        moduleItem=>{
            const moduleId=
                typeof moduleItem==='string'
                    ?moduleItem
                    :moduleItem?.id;

            return(
                !excludedIds.has(
                    moduleId
                )
            );
        }
    );
}
