const RECEIPT_UPLOAD_API=
    'https://x8ki-letl-twmt.n7.xano.io/api:EpDLPKN0/ta_post_receipt_upload';


export async function postReceiptUpload(
    draft,
    file,
    taskContext=null
){
    validateReceiptSubmission(
        draft,
        file
    );

    const formData=
        buildReceiptFormData(
            draft,
            file
        );

    const response=
        await fetch(
            RECEIPT_UPLOAD_API,
            {
                method:
                    'POST',

                headers:
                    buildRequestHeaders(
                        taskContext
                    ),

                body:
                    formData
            }
        );

    const responseData=
        await readResponseData(
            response
        );

    if(!response.ok){
        throw new Error(
            getApiErrorMessage(
                responseData
            )
        );
    }

    return responseData;
}


function buildReceiptFormData(
    draft,
    file
){
    const formData=
        new FormData();

    formData.append(
        'file_resource',
        file
    );

    formData.append(
        'file_name',
        getReceiptFileName(
            file
        )
    );

    formData.append(
        'student_id',
        String(
            draft.student_id
        )
    );

    formData.append(
        'payment_type_id',
        String(
            draft.payment_type_id
        )
    );

    formData.append(
        'amount',
        String(
            draft.amount
        )
    );

    formData.append(
        'receipt_date',
        draft.receipt_date
    );

    return formData;
}


function buildRequestHeaders(
    taskContext
){
    const headers={
        Accept:
            'application/json'
    };

    const authToken=
        getAuthToken(
            taskContext
        );

    if(authToken){
        headers.Authorization=
            `Bearer ${authToken}`;
    }

    return headers;
}


function getAuthToken(
    taskContext
){
    return(
        taskContext
            ?.authToken||
        taskContext
            ?.auth_token||
        taskContext
            ?.state
            ?.authToken||
        taskContext
            ?.state
            ?.auth_token||
        window.localStorage.getItem(
            'authToken'
        )||
        window.localStorage.getItem(
            'auth_token'
        )||
        ''
    );
}


function getReceiptFileName(
    file
){
    return(
        file?.name||
        'receipt.jpg'
    );
}


function validateReceiptSubmission(
    draft,
    file
){
    if(!file){
        throw new Error(
            'Please add a receipt photo.'
        );
    }

    if(!draft?.student_id){
        throw new Error(
            'Please select a student.'
        );
    }

    if(!draft?.payment_type_id){
        throw new Error(
            'Please select a payment type.'
        );
    }

    const amount=
        Number(
            draft.amount
        );

    if(
        !Number.isFinite(
            amount
        )||
        amount<=0
    ){
        throw new Error(
            'Please enter a valid payment amount.'
        );
    }

    if(!draft?.receipt_date){
        throw new Error(
            'Please select the receipt date.'
        );
    }
}


async function readResponseData(
    response
){
    const responseText=
        await response.text();

    if(!responseText){
        return null;
    }

    try{
        return JSON.parse(
            responseText
        );

    }catch(error){
        return{
            message:
                responseText
        };
    }
}


function getApiErrorMessage(
    responseData
){
    return(
        responseData?.message||
        responseData?.error||
        'Unable to upload receipt.'
    );
}
