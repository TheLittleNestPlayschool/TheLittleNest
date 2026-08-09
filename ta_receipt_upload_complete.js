export function renderReceiptUploadComplete(
    workspace,
    context
){
    const{
        session
    }=context;

    const container=
        document.createElement(
            'section'
        );

    container.className=
        'receipt-upload-experience receipt-upload-complete';


    const mark=
        document.createElement(
            'div'
        );

    mark.className=
        'receipt-upload-complete-mark';

    mark.textContent=
        '✓';


    const title=
        document.createElement(
            'h3'
        );

    title.className=
        'receipt-upload-title';

    title.textContent=
        'Receipt Uploaded';


    const summary=
        document.createElement(
            'p'
        );

    summary.className=
        'receipt-upload-complete-summary';

    summary.textContent=
        buildCompletionSummary(
            session
        );


    container.appendChild(
        mark
    );

    container.appendChild(
        title
    );

    container.appendChild(
        summary
    );


    workspace.appendChild(
        container
    );
}


function buildCompletionSummary(
    session
){
    const studentName=
        getStudentName(
            session.selectedStudent
        );

    const amount=
        formatAmount(
            session.amount
        );

    if(
        studentName&&
        amount
    ){
        return`${amount} receipt for ${studentName} was uploaded successfully.`;
    }

    return'Receipt was uploaded successfully.';
}


function getStudentName(
    student
){
    if(!student){
        return'';
    }

    return(
        student.preferred_name||
        student.name||
        [
            student.first_name,
            student.last_name
        ]
            .filter(Boolean)
            .join(' ')||
        ''
    );
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
        )||
        numericAmount<=0
    ){
        return'';
    }

    return`₱${numericAmount.toLocaleString()}`;
}
