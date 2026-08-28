import{
    buildEndedSessionOccurrences
}from'./ta_director_session_occurrences.js';

export function buildOverdueAttendanceQueue(
    snapshot
){
    const endedOccurrences=
        buildEndedSessionOccurrences(
            snapshot
        );

    const completionKeys=
        buildCompletionKeys(
            snapshot
                .sessionAttendanceCompletions
        );

    const locationStudents=
        Array.isArray(
            snapshot?.locationStudents
        )
            ?snapshot.locationStudents
            :[];

    const overdueAttendance=
        endedOccurrences
            .filter(occurrence=>{
                const hasStudents=
                    locationStudents.some(
                        student=>{
                            return(
                                student?.is_active!==false&&
                                Number(
                                    student
                                        ?.session_enrolled
                                )===
                                Number(
                                    occurrence
                                        .sessionId
                                )
                            );
                        }
                    );

                if(!hasStudents){
                    return false;
                }

                const completionKey=
                    createCompletionKey(
                        occurrence
                            .attendanceDate,
                        occurrence
                            .sessionId
                    );

                return(
                    !completionKeys.has(
                        completionKey
                    )
                );
            })
            .map(occurrence=>{
                return{
                    type:
                        'attendance',

                    attendanceDate:
                        occurrence
                            .attendanceDate,

                    sessionId:
                        occurrence
                            .sessionId,

                    session:
                        occurrence.session,

                    scheduledDay:
                        occurrence
                            .scheduledDay,

                    startTime:
                        occurrence
                            .startTime,

                    endTime:
                        occurrence
                            .endTime,

                    endedAt:
                        occurrence
                            .endedAt
                };
            });

    console.log(
        'Director Overdue Attendance:',
        overdueAttendance
    );

    return overdueAttendance;
}

function buildCompletionKeys(
    completionRecords
){
    const records=
        Array.isArray(
            completionRecords
        )
            ?completionRecords
            :[];

    return new Set(
        records
            .filter(record=>{
                return(
                    record
                        ?.attendance_date&&
                    record
                        ?.session_id!==undefined&&
                    record
                        ?.session_id!==null
                );
            })
            .map(record=>{
                return createCompletionKey(
                    record.attendance_date,
                    record.session_id
                );
            })
    );
}

function createCompletionKey(
    attendanceDate,
    sessionId
){
    return(
        `${attendanceDate}|`+
        `${String(sessionId)}`
    );
}
