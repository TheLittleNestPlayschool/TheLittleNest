import{
    buildAttendanceSelections,
    getAttendanceRecords,
    getExpectedStudents
}from'./ta_attendance_data.js';

export function createAttendanceSession(
    attendanceContext=null
){
    return{
        attendanceKey:
            attendanceContext
                ?.attendanceKey||
            null,

        taskContext:
            attendanceContext,

        attendanceData:
            null,

        view:
            'intro',

        addedStudents:
            [],

        selections:
            {},

        isLoading:
            false,

        loadError:
            null,

        isSubmitting:
            false,

        submissionResult:
            null,

        addingStudent:
            false,

        isSaved:
            false
    };
}

export function attendanceSessionMatches(
    attendanceSession,
    attendanceContext
){
    return(
        attendanceSession
            ?.attendanceKey===
        attendanceContext
            ?.attendanceKey
    );
}

export function applyAttendanceData(
    attendanceSession,
    attendanceData
){
    attendanceSession.attendanceData=
        attendanceData;

    attendanceSession.selections=
        buildAttendanceSelections(
            attendanceData
        );

    const records=
        getAttendanceRecords(
            attendanceData
        );

    if(records.length>0){
        attendanceSession.view=
            'review';

        attendanceSession.isSaved=
            true;
    }

    return attendanceSession;
}

export function getAllAttendanceStudents(
    attendanceSession
){
    const expectedStudents=
        getExpectedStudents(
            attendanceSession
                ?.attendanceData
        );

    const addedStudents=
        Array.isArray(
            attendanceSession
                ?.addedStudents
        )
            ?attendanceSession
                .addedStudents
            :[];

    return[
        ...expectedStudents.map(
            student=>({
                ...student,

                attendance_source:
                    'scheduled',

                isAddedStudent:
                    false
            })
        ),

        ...addedStudents
    ];
}

export function addAttendanceStudent(
    attendanceSession,
    student
){
    attendanceSession
        .addedStudents
        .push({
            ...student,

            isAddedStudent:
                true
        });

    attendanceSession.selections[
        student.id
    ]='present';

    attendanceSession.addingStudent=
        false;

    attendanceSession.isSaved=
        false;
}

export function removeAttendanceStudent(
    attendanceSession,
    studentId
){
    attendanceSession.addedStudents=
        attendanceSession
            .addedStudents
            .filter(student=>{
                return(
                    student.id!==
                    studentId
                );
            });

    delete attendanceSession
        .selections[
            studentId
        ];

    attendanceSession.isSaved=
        false;
}

export function selectAttendanceStatus(
    attendanceSession,
    studentId,
    status
){
    attendanceSession.selections[
        studentId
    ]=status;

    attendanceSession.isSaved=
        false;
}

export function attendanceIsComplete(
    attendanceSession
){
    const students=
        getAllAttendanceStudents(
            attendanceSession
        );

    return students.every(student=>{
        return Boolean(
            attendanceSession
                .selections[
                    student.id
                ]
        );
    });
}

export function buildAttendanceDraft(
    attendanceSession
){
    return getAllAttendanceStudents(
        attendanceSession
    ).map(student=>({
        student_id:
            student.id,

        status:
            attendanceSession
                .selections[
                    student.id
                ]||
            null,

        attendance_source:
            student
                .attendance_source||
            'scheduled'
    }));
}

export function getAttendanceCounts(
    attendanceSession
){
    const students=
        getAllAttendanceStudents(
            attendanceSession
        );

    const checkedCount=
        students.filter(student=>{
            return Boolean(
                attendanceSession
                    .selections[
                        student.id
                    ]
            );
        }).length;

    const presentCount=
        students.filter(student=>{
            return(
                attendanceSession
                    .selections[
                        student.id
                    ]===
                'present'
            );
        }).length;

    const absentCount=
        students.filter(student=>{
            return(
                attendanceSession
                    .selections[
                        student.id
                    ]===
                'absent'
            );
        }).length;

    return{
        studentCount:
            students.length,

        checkedCount,

        presentCount,

        absentCount
    };
}
