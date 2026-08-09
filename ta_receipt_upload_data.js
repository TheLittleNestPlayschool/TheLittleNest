export async function loadReceiptUploadData(
    receiptContext,
    state
){
    const paymentTypes=
        await loadPaymentTypes(
            receiptContext,
            state
        );

    return{
        paymentTypes
    };
}


async function loadPaymentTypes(
    receiptContext,
    state
){
    /*
        API PLACEHOLDER

        This function will call the API that returns
        the available records from payment_type.

        Expected response shape:

        [
            {
                id:1,
                payment_type:'Cash'
            },
            {
                id:2,
                payment_type:'GCash'
            }
        ]

        receiptContext currently contains:

        - teacherId
        - franchiseId
        - taskContext
        - teacher

        state contains the full teacher app state.
    */

    console.log(
        'Receipt payment types not connected yet:',
        {
            receiptContext,
            state
        }
    );

    return[];
}
