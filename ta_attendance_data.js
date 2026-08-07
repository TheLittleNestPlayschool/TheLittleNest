import{
    API_URLS
}from'./ta_config.js';

import{
    apiRequest
}from'./ta_api.js';

import{
    isStartupAttendance
}from'./ta_attendance_context.js';

export async function loadAttendanceData(
    attendanceContext,
    state
){
    if(
        isStartupAttendance(
            attendanceContext,
            state
        )&&
        state?.attendance
    ){
        return state.attendance;
    }

    validateAttendanceContext(
        attendanceContext
    );

    const attendanceUrl=
        new URL(
            API_URLS
                .getSessionAttendance
        );

    attendanceUrl.searchParams.set(
        'session_id',
        String(
            attendanceContext.sessionId
        )
    );

    attendanceUrl.searchParams.set(
        'session_date',
        attendanceContext
            .attendanceDate
    );

    const attendanceData=
        await apiRequest(
            attendanceUrl.toString()
        );

    console.log(
        'Attendance Context Data:',
        {
            attendanceContext,
            attendanceData
        }
    );

    return attendanceData;
}

export function getExpectedStudents(
    attendanceData
){
    const students=
        attendanceData
            ?.expected_students||
        [];

    return Array.isArray(students)
        ?students
        :[];
}

export function getAttendanceRecords(
    attendanceData
){
    const records=
        attendanceData
            ?.attendance_records||
        [];

    return Array.isArray(records)
        ?records
        :[];
}

export function buildAttendanceSelections(
    attendanceData
){
    const selections={};

    const records=
        getAttendanceRecords(
            attendanceData
        );

    records.forEach(record=>{
        const studentId=
            record.student_id||
            record.student?.id||
            null;

        const status=
            record.attendance_status||
            record.status||
            null;

        if(
            !studentId||
            !status
        ){
            return;
        }

        selections[
            studentId
        ]=status;
    });

    return selections;
}

function validateAttendanceContext(
    attendanceContext
){
    if(
        !attendanceContext
            ?.sessionId
    ){
        throw new Error(
            'Attendance session was not found.'
        );
    }

    if(
        !attendanceContext
            ?.attendanceDate
    ){
        throw new Error(
            'Attendance date was not found.'
        );
    }
}
