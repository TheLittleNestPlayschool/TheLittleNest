const teacherAppState = {

    //------------------------------------
    // Startup Context
    //------------------------------------

    context: null,

    teacherState: null,

    attendance: null,

    relevantSession: null,

    //------------------------------------
    // Current User
    //------------------------------------

    teacher: null,

    user: null,

    //------------------------------------
    // Session Data
    //------------------------------------

    expectedStudents: [],

    attendanceRecords: [],

    sessionAttendanceCompletions: [],

    //------------------------------------
    // Franchise Data
    //------------------------------------

    locationStudents: []

};

export function getState() {

    return teacherAppState;

}

export function setContext(context) {

    teacherAppState.context = context;

    teacherAppState.teacher =
        context?.teacher || null;

    teacherAppState.user =
        context?.user || null;

}

export function setTeacherState(teacherState) {

    teacherAppState.teacherState =
        teacherState;

}

export function setRelevantSession(session) {

    teacherAppState.relevantSession =
        session;

}

export function setAttendance(attendance) {

    teacherAppState.attendance =
        attendance;

    teacherAppState.expectedStudents =
        attendance?.expected_students || [];

    teacherAppState.attendanceRecords =
        attendance?.attendance_records || [];

}

export function setSessionAttendanceCompletions(records) {

    teacherAppState.sessionAttendanceCompletions =
        Array.isArray(records)
            ? records
            : [];

}

export function setLocationStudents(students) {

    teacherAppState.locationStudents =
        Array.isArray(students)
            ? students
            : [];

}

export function clearState() {

    teacherAppState.context = null;

    teacherAppState.teacherState = null;

    teacherAppState.attendance = null;

    teacherAppState.relevantSession = null;

    teacherAppState.teacher = null;

    teacherAppState.user = null;

    teacherAppState.expectedStudents = [];

    teacherAppState.attendanceRecords = [];

    teacherAppState.sessionAttendanceCompletions = [];

    teacherAppState.locationStudents = [];

}
