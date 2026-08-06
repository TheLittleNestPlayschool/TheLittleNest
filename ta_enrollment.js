import{
    getWorkspace,
    clearWorkspace
}from'./ta_ui.js';

export function renderEnrollmentModule(){
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
        'teacher-enrollment';

    const message=
        document.createElement(
            'p'
        );

    message.className=
        'teacher-enrollment-message';

    message.textContent=
        'Enrollment will be added here.';

    container.appendChild(
        message
    );

    workspace.appendChild(
        container
    );

    updateEnrollmentLiveStatus();
}

function updateEnrollmentLiveStatus(){
    const card=document.querySelector(
        '.teacher-module-card[data-module-id="enrollment"]'
    );

    const subtitle=card?.querySelector(
        '.teacher-module-subtitle'
    );

    if(!subtitle){
        return;
    }

    subtitle.textContent=
        'Ready to begin an enrollment.';
}
