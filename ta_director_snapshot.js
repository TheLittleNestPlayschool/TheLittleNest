import{
    getState
}from'./ta_state.js';

import{
    buildTeacherCapacity
}from'./ta_teacher_capacity.js';

export async function buildDirectorSnapshot(){

    const state=
        getState();

    const teacherCapacity=
        await buildTeacherCapacity(
            state.expectedStudents
        );

    const snapshot={

        //------------------------------------
        // Teacher
        //------------------------------------

        teacher:
            state.teacher,

        user:
            state.user,

        //------------------------------------
        // Current State
        //------------------------------------

        teacherState:
            state.teacherState,

        relevantSession:
            state.relevantSession,

        //------------------------------------
        // Teacher Capacity
        //------------------------------------

        teacherCapacity,

        //------------------------------------
        // Attendance
        //------------------------------------

        attendance:
            state.attendance,

        expectedStudents:
            state.expectedStudents,

        attendanceRecords:
            state.attendanceRecords,

        sessionAttendanceCompletions:
            state.sessionAttendanceCompletions||[],

        //------------------------------------
        // Franchise
        //------------------------------------

        locationStudents:
            state.locationStudents

    };

    console.log(
        'Director Snapshot:',
        snapshot
    );

    return snapshot;
}
