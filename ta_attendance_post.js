import{
    API_URLS
}from'./ta_config.js';

import{
    apiRequest
}from'./ta_api.js';

import{
    getState
}from'./ta_state.js';

export async function postAttendance(
    attendance,
    taskContext=null
){
    const payload=
        buildAttendancePayload(
            attendance,
            taskContext
        );

    console.log(
        'Attendance Payload:',
        payload
    );

    return await apiRequest(
        API_URLS.postAttendance,
        {
            method:'POST',
            body:payload
        }
    );
}

function buildAttendancePayload(
    attendance,
    taskContext
){
    const state=
        getState();

    const attendanceDate=
        taskContext?.attendanceDate||
        getTodayDate();

    const sessionId=
        taskContext?.sessionId||
        state.relevantSession?.id||
        null;

    if(!sessionId){
        throw new Error(
            'Attendance session was not found.'
        );
    }

    if(!attendanceDate){
        throw new Error(
            'Attendance date was not found.'
        );
    }

    return{
        attendance:
            attendance.map(
                record=>({
                    student_id:
                        record.student_id,

                    attendance_date:
                        attendanceDate,

                    scheduled_session_id:
                        sessionId,

                    status:
                        record.status,

                    attendance_source:
                        record.attendance_source
                })
            )
    };
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
