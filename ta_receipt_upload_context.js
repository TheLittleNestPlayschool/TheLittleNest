export function buildReceiptUploadContext(
    taskContext,
    state
){
    const teacher=
        state?.teacher||
        null;

    const user=
        state?.user||
        null;

    const teacherId=
        teacher?.id||
        null;

    const franchiseId=
        teacher?.franchise_id||
        user?.franchise_id||
        taskContext?.franchise_id||
        null;

    return{
        receiptUploadKey:
            buildReceiptUploadKey(
                teacherId,
                franchiseId,
                taskContext
            ),

        taskContext,

        teacherId,

        franchiseId,

        teacher
    };
}


function buildReceiptUploadKey(
    teacherId,
    franchiseId,
    taskContext
){
    const taskId=
        taskContext?.id||
        taskContext?.task_id||
        taskContext?.taskId||
        null;

    return[
        'receipt_upload',
        teacherId,
        franchiseId,
        taskId
    ]
        .filter(value=>{
            return(
                value!==null&&
                value!==undefined&&
                value!==''
            );
        })
        .join(':');
}
