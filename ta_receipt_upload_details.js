import{
    createAmountField,
    createPaymentTypeField,
    createReceiptDateField
}from'./ta_receipt_upload_details_fields.js';

import{
    createSelectedStudentSummary,
    detailsAreComplete
}from'./ta_receipt_upload_details_helpers.js';


export function renderReceiptUploadDetails(
    workspace,
    context
){
    const{
        session,
        paymentTypes,
        actions
    }=context;

    const container=
        document.createElement(
            'section'
        );

    container.className=
        'receipt-upload-experience receipt-upload-details';


    const eyebrow=
        document.createElement(
            'p'
        );

    eyebrow.className=
        'receipt-upload-eyebrow';

    eyebrow.textContent=
        'Payment Receipt';


    const title=
        document.createElement(
            'h3'
        );

    title.className=
        'receipt-upload-title';

    title.textContent=
        'Payment Details';


    const description=
        document.createElement(
            'p'
        );

    description.className=
        'receipt-upload-description';

    description.textContent=
        'Enter the amount, payment type, and receipt date.';


    const selectedStudent=
        createSelectedStudentSummary(
            session.selectedStudent
        );


    const form=
        document.createElement(
            'div'
        );

    form.className=
        'receipt-upload-form';


    form.appendChild(
        createAmountField(
            session,
            actions
        )
    );

    form.appendChild(
        createPaymentTypeField(
            session,
            paymentTypes,
            actions
        )
    );

    form.appendChild(
        createReceiptDateField(
            session,
            actions
        )
    );


    const navigation=
        createNavigation(
            session,
            actions
        );


    container.appendChild(
        eyebrow
    );

    container.appendChild(
        title
    );

    container.appendChild(
        description
    );

    if(selectedStudent){
        container.appendChild(
            selectedStudent
        );
    }

    container.appendChild(
        form
    );

    container.appendChild(
        navigation
    );


    workspace.appendChild(
        container
    );
}


function createNavigation(
    session,
    actions
){
    const navigation=
        document.createElement(
            'div'
        );

    navigation.className=
        'receipt-upload-navigation';


    const reviewButton=
        document.createElement(
            'button'
        );

    reviewButton.type=
        'button';

    reviewButton.className=
        'receipt-upload-primary-button';

    reviewButton.textContent=
        'Review Receipt';

    reviewButton.disabled=
        !detailsAreComplete(
            session
        );

    reviewButton.addEventListener(
        'click',
        actions.showReview
    );


    const backButton=
        document.createElement(
            'button'
        );

    backButton.type=
        'button';

    backButton.className=
        'receipt-upload-text-button';

    backButton.textContent=
        'Back to Student';

    backButton.addEventListener(
        'click',
        actions.showStudent
    );


    navigation.appendChild(
        reviewButton
    );

    navigation.appendChild(
        backButton
    );


    return navigation;
}
