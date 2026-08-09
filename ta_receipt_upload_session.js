
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

        view:
            'capture',

        file:
            null,

        previewUrl:
            null,

        selectedStudent:
            null,

        paymentTypes:
            [],

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
    receiptSession,
    receiptContext
){
    return(
        receiptSession
            ?.receiptUploadKey===
        receiptContext
            ?.receiptUploadKey
    );
}


export function applyReceiptUploadData(
    receiptSession,
    receiptData
){
    receiptSession.receiptData=
        receiptData;

    receiptSession.paymentTypes=
        Array.isArray(
            receiptData?.paymentTypes
        )
            ?receiptData.paymentTypes
            :[];

    return receiptSession;
}


export function getReceiptUploadStudents(
    receiptSession,
    state
){
    const students=
        state?.locationStudents;

    return Array.isArray(students)
        ?students
        :[];
}


export function setReceiptFile(
    receiptSession,
    file
){
    clearPreviewUrl(
        receiptSession
    );

    receiptSession.file=
        file;

    receiptSession.previewUrl=
        URL.createObjectURL(
            file
        );

    receiptSession.isSaved=
        false;
}


export function clearReceiptFile(
    receiptSession
){
    clearPreviewUrl(
        receiptSession
    );

    receiptSession.file=
        null;

    receiptSession.previewUrl=
        null;

    receiptSession.isSaved=
        false;
}


export function selectReceiptStudent(
    receiptSession,
    student
){
    receiptSession.selectedStudent=
        student;

    receiptSession.isSaved=
        false;
}


export function setReceiptAmount(
    receiptSession,
    amount
){
    receiptSession.amount=
        amount;

    receiptSession.isSaved=
        false;
}


export function selectReceiptPaymentType(
    receiptSession,
    paymentType
){
    receiptSession.selectedPaymentType=
        paymentType;

    receiptSession.isSaved=
        false;
}


export function setReceiptDate(
    receiptSession,
    receiptDate
){
    receiptSession.receiptDate=
        receiptDate;

    receiptSession.isSaved=
        false;
}


export function receiptUploadIsComplete(
    receiptSession
){
    return Boolean(
        receiptSession.file&&
        receiptSession.selectedStudent&&
        receiptSession.selectedPaymentType&&
        receiptSession.amount&&
        receiptSession.receiptDate
    );
}


export function buildReceiptUploadDraft(
    receiptSession,
    state
){
    const student=
        receiptSession.selectedStudent;

    const teacher=
        state?.teacher||
        null;

    return{
        parent:
            student?.parent_id||
            null,

        student:
            student?.id||
            null,

        paid_by:
            getPaymentTypeName(
                receiptSession
                    .selectedPaymentType
            ),

        received_by:
            getTeacherName(
                teacher
            ),

        amount:
            receiptSession.amount,

        franchise:
            student?.franchise_id||
            teacher?.franchise_id||
            null,

        receipt_date:
            receiptSession.receiptDate
    };
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
        return '';
    }

    return[
        teacher.first_name,
        teacher.last_name
    ]
        .filter(Boolean)
        .join(' ');
}


function clearPreviewUrl(
    receiptSession
){
    if(
        !receiptSession?.previewUrl
    ){
        return;
    }

    URL.revokeObjectURL(
        receiptSession.previewUrl
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
