import{
    getWorkspace,
    clearWorkspace
}from'./ta_ui.js';

export function renderStudentReflectionModule(){
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
        'teacher-student-reflection';

    const message=
        document.createElement(
            'p'
        );

    message.className=
        'teacher-student-reflection-message';

    message.textContent=
        'Student reflection will be added here.';

    container.appendChild(
        message
    );

    workspace.appendChild(
        container
    );

    updateStudentReflectionLiveStatus();
}

function updateStudentReflectionLiveStatus(){
    const card=document.querySelector(
        '.teacher-module-card[data-module-id="reflection"]'
    );

    const subtitle=card?.querySelector(
        '.teacher-module-subtitle'
    );

    if(!subtitle){
        return;
    }

    subtitle.textContent=
        'Ready for student reflection.';
}
