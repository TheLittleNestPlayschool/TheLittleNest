import{
    getWorkspace,
    clearWorkspace
}from'./ta_ui.js';

export function renderSeeYouTomorrowModule(){
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
        'teacher-see-you-tomorrow';

    const message=
        document.createElement(
            'p'
        );

    message.className=
        'teacher-see-you-tomorrow-message';

    message.textContent=
        'Tomorrow preparation will be added here.';

    container.appendChild(
        message
    );

    workspace.appendChild(
        container
    );

    updateSeeYouTomorrowLiveStatus();
}

function updateSeeYouTomorrowLiveStatus(){
    const card=document.querySelector(
        '.teacher-module-card[data-module-id="see_tomorrow"]'
    );

    const subtitle=card?.querySelector(
        '.teacher-module-subtitle'
    );

    if(!subtitle){
        return;
    }

    subtitle.textContent=
        'Ready to prepare tomorrow.';
}
