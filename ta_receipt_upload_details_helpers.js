export function createSelectedStudentSummary(
    student
){
    if(!student){
        return null;
    }

    const summary=
        document.createElement(
            'div'
        );

    summary.className=
        'receipt-upload-selected-student';


    const name=
        document.createElement(
            'strong'
        );

    name.textContent=
        getStudentName(
            student
        );


    const parentName=
        getParentName(
            student
        );


    summary.appendChild(
        name
    );


    if(parentName){
        const parent=
            document.createElement(
                'span'
            );

        parent.textContent=
            `Parent: ${parentName}`;

        summary.appendChild(
            parent
        );
    }


    return summary;
}


export function createFieldContainer(){
    const field=
        document.createElement(
            'label'
        );

    field.className=
        'receipt-upload-field';

    return field;
}


export function createFieldLabel(
    text
){
    const label=
        document.createElement(
            'span'
        );

    label.className=
        'receipt-upload-field-label';

    label.textContent=
        text;

    return label;
}


export function detailsAreComplete(
    session
){
    const amount=
        Number(
            session.amount
        );

    return Boolean(
        Number.isFinite(
            amount
        )&&
        amount>0&&
        session.selectedPaymentType&&
        session.receiptDate
    );
}


export function updateReviewButtonState(
    element,
    session
){
    const container=
        element.closest(
            '.receipt-upload-details'
        );

    const reviewButton=
        container?.querySelector(
            '.receipt-upload-primary-button'
        );

    if(!reviewButton){
        return;
    }

    reviewButton.disabled=
        !detailsAreComplete(
            session
        );
}


export function paymentTypeMatches(
    paymentType,
    selectedPaymentType
){
    if(
        !paymentType||
        !selectedPaymentType
    ){
        return false;
    }

    return(
        getPaymentTypeValue(
            paymentType
        )===
        getPaymentTypeValue(
            selectedPaymentType
        )
    );
}


export function getPaymentTypeValue(
    paymentType
){
    if(
        typeof paymentType===
        'string'
    ){
        return paymentType;
    }

    return String(
        paymentType?.id||
        paymentType?.payment_type||
        paymentType?.name||
        ''
    );
}


export function getPaymentTypeLabel(
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
        `Payment Type ${paymentType?.id||''}`
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
