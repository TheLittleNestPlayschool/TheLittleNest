import {API_URLS,APP_CONFIG} from './ta_config.js';
import {apiRequest} from './ta_api.js';
import {getState} from './ta_state.js';

export async function postAttendance(attendance){

    const payload=
        buildAttendancePayload(attendance);

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

function buildAttendancePayload(attendance){

    const state=getState();

    return{

        teacher_id:
            state.teacher.id,

        attendance_date:
            getTodayDate(),

        scheduled_session_id:
            state.relevantSession.id,

        attendance

    };

}

function getTodayDate(){

    const parts=
        new Intl.DateTimeFormat(
            'en-CA',
            {
                timeZone:
                    APP_CONFIG.timeZone,
                year:'numeric',
                month:'2-digit',
                day:'2-digit'
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

    return`${values.year}-${values.month}-${values.day}`;

}
