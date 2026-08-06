
import{
    getWorkspace,
    clearWorkspace
}from'./ta_ui.js';

export function renderReceiptUploadModule(){
    clearWorkspace();

    const workspace=getWorkspace();

    if(!workspace){
        return;
    }

    const container=
        document.createElement(
            'section'
        );

    container.className=
        'teacher-receipt-upload';

    const message=
        document.createElement(
            'p'
        );

    message.className=
        'teacher-receipt-upload-message';

    message.textContent=
        'Receipt capture and upload will be added here.';

    container.appendChild(
        message
    );

    workspace.appendChild(
        container
    );

    updateReceiptUploadLiveStatus();
}

function updateReceiptUploadLiveStatus(){
    const card=document.querySelector(
        '.teacher-module-card[data-module-id="receipt_upload"]'
    );

    const subtitle=card?.querySelector(
        '.teacher-module-subtitle'
    );

    if(!subtitle){
        return;
    }

    subtitle.textContent=
        'Ready to capture a receipt.';
}
