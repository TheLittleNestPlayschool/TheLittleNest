export function createReceiptUploadSession(
    receiptContext=null
){
    return{
        receiptUploadKey:
            receiptContext
                ?.receiptUploadKey||
            null,

        taskContext:
            receiptContext,

        receiptData:
            null,

        user:
            null,

        teacher:
            null,

        students:
            [],

        paymentTypes:
            [],

        view:
            'capture',

        file:
            null,

        previewUrl:
            null,

        selectedStudent:
            null,

        selectedPaymentType:
            null,

        amount:
            '',

        receiptDate:
            getTodayDate(),

        isLoading:
            false,

        loadError:
            null,

        isSubmitting:
            false,

        submissionResult:
            null,

        isSaved:
            false
    };
}


export function receiptUploadSessionMatches(
    receiptState,
    receiptContext
){
    return(
        receiptState
            ?.receiptUploadKey===
        receiptContext
            ?.receiptUploadKey
    );
}


export function applyReceiptUploadData(
    receiptState,
    receiptData
){
    receiptState.receiptData=
        receiptData;

    receiptState.user=
        receiptData?.user||
        null;

    receiptState.teacher=
        receiptData?.teacher||
        null;

    receiptState.students=
        Array.isArray(
            receiptData?.students
        )
            ?receiptData.students
            :[];

    receiptState.paymentTypes=
        Array.isArray(
            receiptData?.paymentTypes
        )
            ?receiptData.paymentTypes
            :[];

    return receiptState;
}


export function getReceiptUploadStudents(
    receiptState
){
    return Array.isArray(
        receiptState?.students
    )
        ?receiptState.students
        :[];
}


export function setReceiptFile(
    receiptState,
    file
){
    clearPreviewUrl(
        receiptState
    );

    receiptState.file=
        file;

    receiptState.previewUrl=
        URL.createObjectURL(
            file
        );

    receiptState.isSaved=
        false;
}


export function clearReceiptFile(
    receiptState
){
    clearPreviewUrl(
        receiptState
    );

    receiptState.file=
        null;

    receiptState.previewUrl=
        null;

    receiptState.isSaved=
        false;
}


export function selectReceiptStudent(
    receiptState,
    student
){
    receiptState.selectedStudent=
        student;

    receiptState.isSaved=
        false;
}


export function setReceiptAmount(
    receiptState,
    amount
){
    receiptState.amount=
        amount;

    receiptState.isSaved=
        false;
}


export function selectReceiptPaymentType(
    receiptState,
    paymentType
){
    receiptState.selectedPaymentType=
        paymentType;

    receiptState.isSaved=
        false;
}


export function setReceiptDate(
    receiptState,
    receiptDate
){
    receiptState.receiptDate=
        receiptDate;

    receiptState.isSaved=
        false;
}


export function receiptUploadIsComplete(
    receiptState
){
    const amount=
        Number(
            receiptState?.amount
        );

    return Boolean(
        receiptState?.file&&
        receiptState?.selectedStudent&&
        receiptState?.selectedPaymentType&&
        receiptState?.teacher&&
        Number.isFinite(
            amount
        )&&
        amount>0&&
        receiptState?.receiptDate
    );
}


export function buildReceiptUploadDraft(
    receiptState
){
    const student=
        receiptState.selectedStudent;

    const teacher=
        receiptState.teacher;

    return{
        parent:
            getStudentParentId(
                student
            ),

        student:
            student?.id||
            null,

        paid_by:
            getPaymentTypeName(
                receiptState
                    .selectedPaymentType
            ),

        received_by:
            getTeacherName(
                teacher
            ),

        amount:
            Number(
                receiptState.amount
            ),

        franchise:
            student?.franchise_id||
            teacher?.franchise_id||
            null,

        receipt_date:
            receiptState.receiptDate
    };
}


function getStudentParentId(
    student
){
    return(
        student?.parent_id||
        student?.parent||
        null
    );
}


function getPaymentTypeName(
    paymentType
){
    if(
        typeof paymentType===
        'string'
    ){
        return paymentType;
    }

    return(
        paymentType?.payment_type||
        paymentType?.name||
        ''
    );
}


function getTeacherName(
    teacher
){
    if(!teacher){
        return'';
    }

    return[
        teacher.first_name,
        teacher.last_name
    ]
        .filter(Boolean)
        .join(' ');
}


function clearPreviewUrl(
    receiptState
){
    if(
        !receiptState?.previewUrl
    ){
        return;
    }

    URL.revokeObjectURL(
        receiptState.previewUrl
    );
}


function getTodayDate(){
    const now=
        new Date();

    const year=
        now.getFullYear();

    const month=
        String(
            now.getMonth()+1
        )
            .padStart(
                2,
                '0'
            );

    const day=
        String(
            now.getDate()
        )
            .padStart(
                2,
                '0'
            );

    return`${year}-${month}-${day}`;
}
