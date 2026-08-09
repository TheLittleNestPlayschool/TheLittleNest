import{
    createFieldContainer,
    createFieldLabel,
    getPaymentTypeValue,
    getPaymentTypeLabel,
    paymentTypeMatches,
    updateReviewButtonState
}from'./ta_receipt_upload_details_helpers.js';


export function createAmountField(
    session,
    actions
){
    const field=
        createFieldContainer();

    const label=
        createFieldLabel(
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


export function createPaymentTypeField(
    session,
    paymentTypes,
    actions
){
    const field=
        createFieldContainer();

    const label=
        createFieldLabel(
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

            updateReviewButtonState(
                select,
                session
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


export function createReceiptDateField(
    session,
    actions
){
    const field=
        createFieldContainer();

    const label=
        createFieldLabel(
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

            updateReviewButtonState(
                input,
                session
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
