import{
    getWorkspace,
    clearWorkspace
}from'./ta_ui.js';

export function renderFamilyMessagesModule(){
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
        'teacher-family-messages';

    const message=
        document.createElement(
            'p'
        );

    message.className=
        'teacher-family-messages-message';

    message.textContent=
        'Family messaging will be added here.';

    container.appendChild(
        message
    );

    workspace.appendChild(
        container
    );

    updateFamilyMessagesLiveStatus();
}

function updateFamilyMessagesLiveStatus(){
    const card=document.querySelector(
        '.teacher-module-card[data-module-id="messages"]'
    );

    const subtitle=card?.querySelector(
        '.teacher-module-subtitle'
    );

    if(!subtitle){
        return;
    }

    subtitle.textContent=
        'Ready to communicate with families.';
}
