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


    const amountField=
        createAmountField(
            session,
            actions
        );


    const paymentTypeField=
        createPaymentTypeField(
            session,
            paymentTypes,
            actions
        );


    const receiptDateField=
        createReceiptDateField(
            session,
            actions
        );


    form.appendChild(
        amountField
    );

    form.appendChild(
        paymentTypeField
    );

    form.appendChild(
        receiptDateField
    );


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


function createSelectedStudentSummary(
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


function createAmountField(
    session,
    actions
){
    const field=
        createFieldContainer();


    const label=
        createLabel(
            'Amount'
        );


    const inputWrapper=
        document.createElement(
            'div'
        );

    inputWrapper.className=
        'receipt-upload-amount-wrapper';


    const currency=
        document.createElement(
            'span'
        );

    currency.className=
        'receipt-upload-currency';

    currency.textContent=
        '₱';


    const input=
        document.createElement(
            'input'
        );

    input.type=
        'number';

    input.className=
        'receipt-upload-input receipt-upload-amount-input';

    input.min=
        '0';

    input.step=
        '1';

    input.inputMode=
        'decimal';

    input.placeholder=
        '0';

    input.value=
        session.amount??'';


    input.addEventListener(
        'input',
        ()=>{
            actions.setAmount(
                input.value
            );

            updateReviewButtonState(
                input,
                session
            );
        }
    );


    inputWrapper.appendChild(
        currency
    );

    inputWrapper.appendChild(
        input
    );


    field.appendChild(
        label
    );

    field.appendChild(
        inputWrapper
    );


    return field;
}


function createPaymentTypeField(
    session,
    paymentTypes,
    actions
){
    const field=
        createFieldContainer();


    const label=
        createLabel(
            'Payment Type'
        );


    const select=
        document.createElement(
            'select'
        );

    select.className=
        'receipt-upload-input receipt-upload-select';


    const placeholder=
        document.createElement(
            'option'
        );

    placeholder.value=
        '';

    placeholder.textContent=
        'Select payment type';

    select.appendChild(
        placeholder
    );


    const normalizedPaymentTypes=
        Array.isArray(
            paymentTypes
        )
            ?paymentTypes
            :[];


    normalizedPaymentTypes.forEach(
        paymentType=>{
            const option=
                document.createElement(
                    'option'
                );

            option.value=
                getPaymentTypeValue(
                    paymentType
                );

            option.textContent=
                getPaymentTypeLabel(
                    paymentType
                );

            if(
                paymentTypeMatches(
                    paymentType,
                    session.selectedPaymentType
                )
            ){
                option.selected=
                    true;
            }

            select.appendChild(
                option
            );
        }
    );


    select.addEventListener(
        'change',
        ()=>{
            const selectedPaymentType=
                normalizedPaymentTypes
                    .find(paymentType=>{
                        return(
                            getPaymentTypeValue(
                                paymentType
                            )===
                            select.value
                        );
                    })||
                null;

            actions.selectPaymentType(
                selectedPaymentType
            );
        }
    );


    field.appendChild(
        label
    );

    field.appendChild(
        select
    );


    return field;
}


function createReceiptDateField(
    session,
    actions
){
    const field=
        createFieldContainer();


    const label=
        createLabel(
            'Receipt Date'
        );


    const input=
        document.createElement(
            'input'
        );

    input.type=
        'date';

    input.className=
        'receipt-upload-input';

    input.value=
        session.receiptDate||'';


    input.addEventListener(
        'change',
        ()=>{
            actions.setReceiptDate(
                input.value
            );
        }
    );


    field.appendChild(
        label
    );

    field.appendChild(
        input
    );


    return field;
}


function createFieldContainer(){
    const field=
        document.createElement(
            'label'
        );

    field.className=
        'receipt-upload-field';

    return field;
}


function createLabel(
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


function detailsAreComplete(
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


function updateReviewButtonState(
    input,
    session
){
    session.amount=
        input.value;

    const container=
        input.closest(
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


function paymentTypeMatches(
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


function getPaymentTypeValue(
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


function getPaymentTypeLabel(
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
