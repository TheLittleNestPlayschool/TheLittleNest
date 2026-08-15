
import{
    getWorkspace,
    clearWorkspace
}from'./ta_ui.js';

export function renderTeacherResourcesModule(){
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
        'teacher-resources';

    const message=
        document.createElement(
            'p'
        );

    message.className=
        'teacher-resources-message';

    message.textContent=
        'Teacher resources will be available here.';

    container.appendChild(
        message
    );

    workspace.appendChild(
        container
    );

    updateTeacherResourcesLiveStatus();
}

function updateTeacherResourcesLiveStatus(){
    const card=document.querySelector(
        '.teacher-module-card[data-module-id="teacher_resources"]'
    );

    const subtitle=card?.querySelector(
        '.teacher-module-subtitle'
    );

    if(!subtitle){
        return;
    }

    subtitle.textContent=
        'Sessions, worksheets, and printable forms.';
}
