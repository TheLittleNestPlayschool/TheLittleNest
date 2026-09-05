const teacherAppState={
    /*   startup context*/
    context:null,
    teacherState:null,
    attendance:null,
    relevantSession:null,
    /*   current user*/
    teacher:null,
    user:null,
    /*   session data*/
    expectedStudents:[],
    attendanceRecords:[],
    sessionAttendanceCompletions:[],
    /*   franchise data*/
    locationStudents:[],
    allTeachers:null
};

export function getState(){
    return teacherAppState;
}

export function setContext(context){
    teacherAppState.context=context;
    teacherAppState.teacher=context?.teacher||null;
    teacherAppState.user=context?.user||null;
}

export function setTeacherState(teacherState){
    teacherAppState.teacherState=teacherState;
}

export function setRelevantSession(session){
    teacherAppState.relevantSession=session;
}

export function setAttendance(attendance){
    teacherAppState.attendance=attendance;
    teacherAppState.expectedStudents=attendance?.expected_students||[];
    teacherAppState.attendanceRecords=attendance?.attendance_records||[];
}

export function setSessionAttendanceCompletions(records){
    teacherAppState.sessionAttendanceCompletions=Array.isArray(records)?records:[];
}

export function markSessionAttendanceComplete(attendanceDate,sessionId){
    if(!attendanceDate||sessionId===undefined||sessionId===null){
        return;
    }
    const exists=teacherAppState.sessionAttendanceCompletions.some(record=>{
        return record?.attendance_date===attendanceDate&&String(record?.session_id)===String(sessionId);
    });
    if(exists){
        return;
    }
    teacherAppState.sessionAttendanceCompletions.push({
        attendance_date:attendanceDate,
        session_id:sessionId,
        local_completion:true
    });
}

export function setLocationStudents(students){
    teacherAppState.locationStudents=Array.isArray(students)?students:[];
}

export function setAllTeachers(teachers){
    teacherAppState.allTeachers=Array.isArray(teachers)?teachers:[];
}

export function clearState(){
    teacherAppState.context=null;
    teacherAppState.teacherState=null;
    teacherAppState.attendance=null;
    teacherAppState.relevantSession=null;
    teacherAppState.teacher=null;
    teacherAppState.user=null;
    teacherAppState.expectedStudents=[];
    teacherAppState.attendanceRecords=[];
    teacherAppState.sessionAttendanceCompletions=[];
    teacherAppState.locationStudents=[];
    teacherAppState.allTeachers=null;
}
