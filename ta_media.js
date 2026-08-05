import{
    getWorkspace,
    clearWorkspace
}from'./ta_ui.js';

export function renderMediaModule(){
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
        'teacher-media';

    const message=
        document.createElement(
            'p'
        );

    message.className=
        'teacher-media-message';

    message.textContent=
        'Media capture and upload will be added here.';

    container.appendChild(
        message
    );

    workspace.appendChild(
        container
    );

    updateMediaLiveStatus();
}

function updateMediaLiveStatus(){
    const card=document.querySelector(
        '.teacher-module-card[data-module-id="media"]'
    );

    const subtitle=card?.querySelector(
        '.teacher-module-subtitle'
    );

    if(!subtitle){
        return;
    }

    subtitle.textContent=
        'Ready to capture today’s media.';
}
