import{
    getWorkspace,
    clearWorkspace
}from'./ta_ui.js';

export function renderHeadOfficeMessagesModule(){
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
        'teacher-head-office-messages';

    const message=
        document.createElement(
            'p'
        );

    message.className=
        'teacher-head-office-messages-message';

    message.textContent=
        'Head office messaging will be added here.';

    container.appendChild(
        message
    );

    workspace.appendChild(
        container
    );

    updateHeadOfficeMessagesLiveStatus();
}

function updateHeadOfficeMessagesLiveStatus(){
    const card=document.querySelector(
        '.teacher-module-card[data-module-id="head_office_messages"]'
    );

    const subtitle=card?.querySelector(
        '.teacher-module-subtitle'
    );

    if(!subtitle){
        return;
    }

    subtitle.textContent=
        'Ready to communicate with head office.';
}
