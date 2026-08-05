import{
    getWorkspace,
    clearWorkspace
}from'./ta_ui.js';

export function renderObservationsModule(){
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
        'teacher-observations';

    const message=
        document.createElement(
            'p'
        );

    message.className=
        'teacher-observations-message';

    message.textContent=
        'Observation capture will be added here.';

    container.appendChild(
        message
    );

    workspace.appendChild(
        container
    );

    updateObservationsLiveStatus();
}

function updateObservationsLiveStatus(){
    const card=document.querySelector(
        '.teacher-module-card[data-module-id="observations"]'
    );

    const subtitle=card?.querySelector(
        '.teacher-module-subtitle'
    );

    if(!subtitle){
        return;
    }

    subtitle.textContent=
        'Ready to capture observations.';
}
