import{
    getState
}from'./ta_state.js';

import{
    getWorkspace,
    clearWorkspace
}from'./ta_ui.js';

import{
    buildReceiptUploadContext
}from'./ta_receipt_upload_context.js';

import{
    loadReceiptUploadData
}from'./ta_receipt_upload_data.js';

import{
    createReceiptUploadSession,
    receiptUploadSessionMatches,
    applyReceiptUploadData,
    getReceiptUploadStudents,
    setReceiptFile,
    clearReceiptFile,
    selectReceiptStudent,
    setReceiptAmount,
    selectReceiptPaymentType,
    setReceiptDate,
    receiptUploadIsComplete,
    buildReceiptUploadDraft
}from'./ta_receipt_upload_session.js';

import{
    renderReceiptUploadCapture
}from'./ta_receipt_upload_capture.js';

import{
    renderReceiptUploadStudent
}from'./ta_receipt_upload_student.js';

import{
    renderReceiptUploadDetails
}from'./ta_receipt_upload_details.js';

import{
    renderReceiptUploadReview
}from'./ta_receipt_upload_review.js';

import{
    renderReceiptUploadComplete
}from'./ta_receipt_upload_complete.js';

import{
    postReceiptUpload
}from'./ta_receipt_upload_post.js';

import{
    updateReceiptUploadLiveStatus
}from'./ta_receipt_upload_status.js';


const COMPLETION_DISPLAY_MS=
    2000;


let receiptUploadSession=
    createReceiptUploadSession();


let completionTimer=
    null;


export async function renderReceiptUploadModule(
    taskContext=null
){
    const state=
        getState();

    const receiptContext=
        buildReceiptUploadContext(
            taskContext,
            state
        );

    if(
        !receiptUploadSessionMatches(
            receiptUploadSession,
            receiptContext
        )
    ){
        clearCompletionTimer();

        receiptUploadSession=
            createReceiptUploadSession(
                receiptContext
            );

        receiptUploadSession.isLoading=
            true;

        clearWorkspace();

        renderCurrentView();

        try{
            const receiptData=
                await loadReceiptUploadData(
                    receiptContext,
                    state
                );

            applyReceiptUploadData(
                receiptUploadSession,
                receiptData
            );

        }catch(error){
            console.error(
                'Receipt upload data load failed:',
                error
            );

            receiptUploadSession.loadError=
                error instanceof Error
                    ?error.message
                    :'Unable to prepare receipt upload.';

        }finally{
            receiptUploadSession.isLoading=
                false;

            renderCurrentView();
        }

        return;
    }

    clearWorkspace();

    renderCurrentView();
}


function renderCurrentView(){
    const workspace=
        getWorkspace();

    if(!workspace){
        return;
    }

    workspace.innerHTML='';

    if(receiptUploadSession.isLoading){
        workspace.textContent=
            'Preparing receipt upload...';

        updateReceiptUploadLiveStatus(
            receiptUploadSession
        );

        return;
    }

    if(receiptUploadSession.loadError){
        workspace.textContent=
            receiptUploadSession.loadError;

        updateReceiptUploadLiveStatus(
            receiptUploadSession
        );

        return;
    }

    const context={
        state:
            getState(),

        session:
            receiptUploadSession,

        taskContext:
            receiptUploadSession.taskContext,

        students:
            getReceiptUploadStudents(
                receiptUploadSession,
                getState()
            ),

        paymentTypes:
            receiptUploadSession
                .paymentTypes||
            [],

        actions:{
            showCapture:
                ()=>showView(
                    'capture'
                ),

            showStudent:
                ()=>showView(
                    'student'
                ),

            showDetails:
                ()=>showView(
                    'details'
                ),

            showReview:
                ()=>showView(
                    'review'
                ),

            selectFile:
                handleFileSelection,

            removeFile:
                handleFileRemoval,

            selectStudent:
                handleStudentSelection,

            setAmount:
                handleAmountChange,

            selectPaymentType:
                handlePaymentTypeSelection,

            setReceiptDate:
                handleReceiptDateChange,

            submit:
                submitReceiptUpload
        }
    };

    switch(receiptUploadSession.view){
        case'student':
            renderReceiptUploadStudent(
                workspace,
                context
            );
            break;

        case'details':
            renderReceiptUploadDetails(
                workspace,
                context
            );
            break;

        case'review':
            renderReceiptUploadReview(
                workspace,
                context
            );
            break;

        case'complete':
            renderReceiptUploadComplete(
                workspace,
                context
            );
            break;

        default:
            renderReceiptUploadCapture(
                workspace,
                context
            );
    }

    updateReceiptUploadLiveStatus(
        receiptUploadSession
    );
}


function showView(view){
    receiptUploadSession.view=
        view;

    renderCurrentView();
}


function handleFileSelection(file){
    if(!file){
        return;
    }

    setReceiptFile(
        receiptUploadSession,
        file
    );

    renderCurrentView();
}


function handleFileRemoval(){
    clearReceiptFile(
        receiptUploadSession
    );

    showView(
        'capture'
    );
}


function handleStudentSelection(student){
    if(!student){
        return;
    }

    selectReceiptStudent(
        receiptUploadSession,
        student
    );

    showView(
        'details'
    );
}


function handleAmountChange(amount){
    setReceiptAmount(
        receiptUploadSession,
        amount
    );
}


function handlePaymentTypeSelection(
    paymentType
){
    selectReceiptPaymentType(
        receiptUploadSession,
        paymentType
    );
}


function handleReceiptDateChange(
    receiptDate
){
    setReceiptDate(
        receiptUploadSession,
        receiptDate
    );
}


async function submitReceiptUpload(){
    if(
        receiptUploadSession.isSubmitting||
        !receiptUploadIsComplete(
            receiptUploadSession
        )
    ){
        return;
    }

    receiptUploadSession.isSubmitting=
        true;

    renderCurrentView();

    try{
        const draft=
            buildReceiptUploadDraft(
                receiptUploadSession,
                getState()
            );

        receiptUploadSession.submissionResult=
            await postReceiptUpload(
                draft,
                receiptUploadSession.file,
                receiptUploadSession
                    .taskContext
            );

        console.log(
            'ta_receipt_upload:',
            receiptUploadSession
                .submissionResult
        );

        receiptUploadSession.isSaved=
            true;

        receiptUploadSession.view=
            'complete';

        receiptUploadSession.isSubmitting=
            false;

        renderCurrentView();

        scheduleExperienceRefresh();

    }catch(error){
        console.error(
            'Receipt upload failed:',
            error
        );

        receiptUploadSession.isSubmitting=
            false;

        renderCurrentView();

        window.alert(
            error instanceof Error
                ?error.message
                :'Unable to upload receipt.'
        );
    }
}


function scheduleExperienceRefresh(){
    clearCompletionTimer();

    completionTimer=
        window.setTimeout(
            ()=>{
                completionTimer=
                    null;

                clearReceiptFile(
                    receiptUploadSession
                );

                receiptUploadSession=
                    createReceiptUploadSession();

                window.dispatchEvent(
                    new CustomEvent(
                        'teacher-task-completed',
                        {
                            detail:{
                                taskType:
                                    'receipt_upload'
                            }
                        }
                    )
                );
            },
            COMPLETION_DISPLAY_MS
        );
}


function clearCompletionTimer(){
    if(completionTimer===null){
        return;
    }

    window.clearTimeout(
        completionTimer
    );

    completionTimer=
        null;
}
