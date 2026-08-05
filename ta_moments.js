import{
    getWorkspace,
    clearWorkspace
}from'./ta_ui.js';

export function renderMomentsModule(){
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
        'teacher-moments';

    const message=
        document.createElement(
            'p'
        );

    message.className=
        'teacher-moments-message';

    message.textContent=
        'Moment capture will be added here.';

    container.appendChild(
        message
    );

    workspace.appendChild(
        container
    );

    updateMomentsLiveStatus();
}

function updateMomentsLiveStatus(){
    const card=document.querySelector(
        '.teacher-module-card[data-module-id="moments"]'
    );

    const subtitle=card?.querySelector(
        '.teacher-module-subtitle'
    );

    if(!subtitle){
        return;
    }

    subtitle.textContent=
        'Ready to capture moments.';
}
