export function updateReceiptUploadLiveStatus(
    receiptSession
){
    const card=
        document.querySelector(
            '.teacher-module-card[data-module-id="receipt_upload"]'
        );

    const subtitle=
        card?.querySelector(
            '.teacher-module-subtitle'
        );

    if(!subtitle){
        return;
    }

    subtitle.textContent=
        getReceiptUploadStatus(
            receiptSession
        );
}


function getReceiptUploadStatus(
    receiptSession
){
    if(receiptSession?.isLoading){
        return'Preparing receipt upload.';
    }

    if(receiptSession?.loadError){
        return'Receipt upload unavailable.';
    }

    if(receiptSession?.isSubmitting){
        return'Uploading receipt.';
    }

    switch(receiptSession?.view){
        case'complete':
            return'Receipt uploaded.';

        case'review':
            return'Review receipt before submitting.';

        case'details':
            return'Enter the payment details.';

        case'student':
            return'Select the student for this payment.';

        default:
            return receiptSession?.file
                ?'Receipt photo ready.'
                :'Ready to capture a receipt.';
    }
}
