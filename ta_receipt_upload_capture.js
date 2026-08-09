export function renderReceiptUploadCapture(
    workspace,
    context
){
    const{
        session,
        actions
    }=context;

    const container=
        document.createElement(
            'section'
        );

    container.className=
        'receipt-upload-experience receipt-upload-capture';


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
        'Capture Receipt';


    const description=
        document.createElement(
            'p'
        );

    description.className=
        'receipt-upload-description';

    description.textContent=
        'Take a clear photo of the payment receipt.';


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
        renderPreview(
            container,
            session,
            actions
        );
    }else{
        renderCaptureOptions(
            container,
            actions
        );
    }


    workspace.appendChild(
        container
    );
}


function renderCaptureOptions(
    container,
    actions
){
    const actionsContainer=
        document.createElement(
            'div'
        );

    actionsContainer.className=
        'receipt-upload-capture-actions';


    const cameraInput=
        createFileInput(
            'environment'
        );


    const cameraButton=
        document.createElement(
            'button'
        );

    cameraButton.type=
        'button';

    cameraButton.className=
        'receipt-upload-primary-button';

    cameraButton.textContent=
        'Take Photo';

    cameraButton.addEventListener(
        'click',
        ()=>{
            cameraInput.click();
        }
    );


    cameraInput.addEventListener(
        'change',
        ()=>{
            const file=
                cameraInput
                    .files?.[0];

            if(file){
                actions.selectFile(
                    file
                );
            }
        }
    );


    const galleryInput=
        createFileInput();


    const galleryButton=
        document.createElement(
            'button'
        );

    galleryButton.type=
        'button';

    galleryButton.className=
        'receipt-upload-secondary-button';

    galleryButton.textContent=
        'Choose Photo';

    galleryButton.addEventListener(
        'click',
        ()=>{
            galleryInput.click();
        }
    );


    galleryInput.addEventListener(
        'change',
        ()=>{
            const file=
                galleryInput
                    .files?.[0];

            if(file){
                actions.selectFile(
                    file
                );
            }
        }
    );


    actionsContainer.appendChild(
        cameraButton
    );

    actionsContainer.appendChild(
        galleryButton
    );

    actionsContainer.appendChild(
        cameraInput
    );

    actionsContainer.appendChild(
        galleryInput
    );


    container.appendChild(
        actionsContainer
    );
}


function renderPreview(
    container,
    session,
    actions
){
    const preview=
        document.createElement(
            'div'
        );

    preview.className=
        'receipt-upload-preview';


    const image=
        document.createElement(
            'img'
        );

    image.className=
        'receipt-upload-preview-image';

    image.src=
        session.previewUrl;

    image.alt=
        'Receipt preview';


    preview.appendChild(
        image
    );


    const actionsContainer=
        document.createElement(
            'div'
        );

    actionsContainer.className=
        'receipt-upload-preview-actions';


    const continueButton=
        document.createElement(
            'button'
        );

    continueButton.type=
        'button';

    continueButton.className=
        'receipt-upload-primary-button';

    continueButton.textContent=
        'Use Photo';

    continueButton.addEventListener(
        'click',
        actions.showStudent
    );


    const retakeButton=
        document.createElement(
            'button'
        );

    retakeButton.type=
        'button';

    retakeButton.className=
        'receipt-upload-secondary-button';

    retakeButton.textContent=
        'Retake';

    retakeButton.addEventListener(
        'click',
        actions.removeFile
    );


    actionsContainer.appendChild(
        continueButton
    );

    actionsContainer.appendChild(
        retakeButton
    );


    container.appendChild(
        preview
    );

    container.appendChild(
        actionsContainer
    );
}


function createFileInput(
    capture=null
){
    const input=
        document.createElement(
            'input'
        );

    input.type=
        'file';

    input.accept=
        'image/*';

    input.hidden=
        true;

    if(capture){
        input.setAttribute(
            'capture',
            capture
        );
    }

    return input;
}
