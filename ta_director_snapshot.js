import {
    getState
} from './ta_state.js';

import {
    buildTeacherCapacity
} from './ta_teacher_capacity.js';

export async function buildDirectorSnapshot(){

    const state=
        getState();

    const teacherCapacity=
        await buildTeacherCapacity(
            state.expectedStudents
        );

    return{

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

        //------------------------------------
        // Franchise
        //------------------------------------

        locationStudents:
            state.locationStudents

    };

}
