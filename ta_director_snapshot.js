import {
    getState
} from './ta_state.js';

export function buildDirectorSnapshot(){

    const state=
        getState();

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
