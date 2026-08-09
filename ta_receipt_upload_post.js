/*
==================================================
    Temporary Test Mode

    Keep this true while testing the receipt
    upload screens without the final APIs.

    Change to false after both API functions
    below are connected.
==================================================
*/

const RECEIPT_UPLOAD_TEST_MODE=
    true;


/*
==================================================
    Receipt Submission
==================================================
*/

export async function postReceiptUpload(
    draft,
    file,
    taskContext=null
){
    validateReceiptSubmission(
        draft,
        file
    );

    if(RECEIPT_UPLOAD_TEST_MODE){
        return createTestSubmissionResult(
            draft,
            file
        );
    }

    /*
        STEP 1

        Upload the receipt image and receive
        the permanent media URL.
    */
    const uploadResult=
        await uploadReceiptFile(
            file,
            draft,
            taskContext
        );

    const mediaUrl=
        getUploadedMediaUrl(
            uploadResult
        );

    if(!mediaUrl){
        throw new Error(
            'The receipt image was uploaded, but no media URL was returned.'
        );
    }

    /*
        STEP 2

        Create the upload_receipt record using
        the permanent image URL.
    */
    const receiptRecord=
        await createReceiptRecord(
            {
                ...draft,

                media_url:
                    mediaUrl
            },
            taskContext
        );

    return{
        upload:
            uploadResult,

        receipt:
            receiptRecord,

        media_url:
            mediaUrl
    };
}


/*
==================================================
    Receipt Image Upload API
==================================================
*/

async function uploadReceiptFile(
    file,
    draft,
    taskContext
){
    /*
        API PLACEHOLDER

        This function will:

        1. Build FormData.
        2. Add the receipt image.
        3. Add any required folder/path values.
        4. Call the receipt image upload API.
        5. Return the API response.

        Expected result must contain the permanent
        receipt media URL.

        Do not connect this until we inspect the
        existing upload_file API.
    */

    console.log(
        'Receipt file upload API not connected:',
        {
            file,
            draft,
            taskContext
        }
    );

    throw new Error(
        'Receipt file upload API is not connected.'
    );
}


/*
==================================================
    Create Receipt Record API
==================================================
*/

async function createReceiptRecord(
    receiptDraft,
    taskContext
){
    /*
        API PLACEHOLDER

        This function will create a record in:

        upload_receipt

        Expected input:

        {
            parent,
            student,
            paid_by,
            received_by,
            amount,
            franchise,
            media_url,
            receipt_date
        }

        The backend should set:

        processed = false
        created_at = now
    */

    console.log(
        'Create receipt record API not connected:',
        {
            receiptDraft,
            taskContext
        }
    );

    throw new Error(
        'Create receipt record API is not connected.'
    );
}


/*
==================================================
    Upload Response
==================================================
*/

function getUploadedMediaUrl(
    uploadResult
){
    return(
        uploadResult?.media_url||
        uploadResult?.url||
        uploadResult?.file_url||
        uploadResult?.upload?.media_url||
        uploadResult?.upload?.url||
        null
    );
}


/*
==================================================
    Validation
==================================================
*/

function validateReceiptSubmission(
    draft,
    file
){
    if(!file){
        throw new Error(
            'Please add a receipt photo.'
        );
    }

    if(!draft?.student){
        throw new Error(
            'Please select a student.'
        );
    }

    if(!draft?.parent){
        throw new Error(
            'The selected student does not have a parent record.'
        );
    }

    if(!draft?.franchise){
        throw new Error(
            'The receipt does not have a franchise.'
        );
    }

    if(!draft?.paid_by){
        throw new Error(
            'Please select a payment type.'
        );
    }

    if(!draft?.received_by){
        throw new Error(
            'The receiving teacher could not be identified.'
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


/*
==================================================
    Temporary Test Result
==================================================
*/

async function createTestSubmissionResult(
    draft,
    file
){
    /*
        Small delay so the uploading state can
        be seen during the UI test.
    */
    await wait(
        800
    );

    return{
        test_mode:
            true,

        upload:{
            file_name:
                file.name,

            file_type:
                file.type,

            file_size:
                file.size,

            media_url:
                null
        },

        receipt:{
            id:
                'test-receipt',

            ...draft,

            processed:
                false,

            media_url:
                null
        }
    };
}


function wait(
    milliseconds
){
    return new Promise(resolve=>{
        window.setTimeout(
            resolve,
            milliseconds
        );
    });
}
