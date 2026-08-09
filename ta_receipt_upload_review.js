export function renderReceiptUploadReview(
    workspace,
    context
){
    const{
        session,
        state,
        actions
    }=context;

    const container=
        document.createElement(
            'section'
        );

    container.className=
        'receipt-upload-experience receipt-upload-review';


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
        'Review Receipt';


    const description=
        document.createElement(
            'p'
        );

    description.className=
        'receipt-upload-description';

    description.textContent=
        'Check the receipt information before submitting.';


    container.appendChild(
        eyebrow
    );

    container.appendChild(
        title
    );

    container.appendChild(
        description
    );


    if(session.previewUrl){
        const preview=
            document.createElement(
                'div'
            );

        preview.className=
            'receipt-upload-review-preview';


        const image=
            document.createElement(
                'img'
            );

        image.className=
            'receipt-upload-review-image';

        image.src=
            session.previewUrl;

        image.alt=
            'Receipt preview';


        preview.appendChild(
            image
        );

        container.appendChild(
            preview
        );
    }


    const details=
        document.createElement(
            'div'
        );

    details.className=
        'receipt-upload-review-details';


    addReviewRow(
        details,
        'Student',
        getStudentName(
            session.selectedStudent
        )
    );


    const parentName=
        getParentName(
            session.selectedStudent
        );

    if(parentName){
        addReviewRow(
            details,
            'Parent',
            parentName
        );
    }


    addReviewRow(
        details,
        'Amount',
        formatAmount(
            session.amount
        )
    );


    addReviewRow(
        details,
        'Payment Type',
        getPaymentTypeName(
            session.selectedPaymentType
        )
    );


    addReviewRow(
        details,
        'Received By',
        getTeacherName(
            state?.teacher
        )
    );


    addReviewRow(
        details,
        'Receipt Date',
        formatDate(
            session.receiptDate
        )
    );


    container.appendChild(
        details
    );


    const actionsContainer=
        document.createElement(
            'div'
        );

    actionsContainer.className=
        'receipt-upload-review-actions';


    const submitButton=
        document.createElement(
            'button'
        );

    submitButton.type=
        'button';

    submitButton.className=
        'receipt-upload-primary-button';

    submitButton.textContent=
        session.isSubmitting
            ?'Uploading...'
            :'Submit Receipt';

    submitButton.disabled=
        session.isSubmitting;

    submitButton.addEventListener(
        'click',
        actions.submit
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
        'Back to Payment Details';

    backButton.disabled=
        session.isSubmitting;

    backButton.addEventListener(
        'click',
        actions.showDetails
    );


    actionsContainer.appendChild(
        submitButton
    );

    actionsContainer.appendChild(
        backButton
    );


    container.appendChild(
        actionsContainer
    );


    workspace.appendChild(
        container
    );
}


function addReviewRow(
    container,
    label,
    value
){
    const row=
        document.createElement(
            'div'
        );

    row.className=
        'receipt-upload-review-row';


    const labelElement=
        document.createElement(
            'span'
        );

    labelElement.className=
        'receipt-upload-review-label';

    labelElement.textContent=
        label;


    const valueElement=
        document.createElement(
            'strong'
        );

    valueElement.className=
        'receipt-upload-review-value';

    valueElement.textContent=
        value||'—';


    row.appendChild(
        labelElement
    );

    row.appendChild(
        valueElement
    );


    container.appendChild(
        row
    );
}


function getStudentName(
    student
){
    return(
        student?.preferred_name||
        student?.name||
        [
            student?.first_name,
            student?.last_name
        ]
            .filter(Boolean)
            .join(' ')||
        `Student ${student?.id||''}`
    );
}


function getParentName(
    student
){
    return(
        student?.parent_name||
        student?.parent_full_name||
        student?.parent?.full_name||
        [
            student?.parent?.first_name,
            student?.parent?.last_name
        ]
            .filter(Boolean)
            .join(' ')
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


function formatAmount(
    amount
){
    const numericAmount=
        Number(
            amount
        );

    if(
        !Number.isFinite(
            numericAmount
        )
    ){
        return'₱0';
    }

    return`₱${numericAmount.toLocaleString()}`;
}


function formatDate(
    date
){
    if(!date){
        return'';
    }

    const parts=
        date.split('-');

    if(parts.length!==3){
        return date;
    }

    const year=
        Number(
            parts[0]
        );

    const month=
        Number(
            parts[1]
        );

    const day=
        Number(
            parts[2]
        );

    const parsedDate=
        new Date(
            year,
            month-1,
            day
        );

    return parsedDate.toLocaleDateString(
        undefined,
        {
            year:'numeric',
            month:'long',
            day:'numeric'
        }
    );
}
