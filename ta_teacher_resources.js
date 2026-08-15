import{
    getWorkspace,
    clearWorkspace
}from'./ta_ui.js';

const TEACHER_RESOURCE_SESSIONS_ENDPOINT=
    'https://x8ki-letl-twmt.n7.xano.io/api:EpDLPKN0/ta_teacher_resources';

export async function renderTeacherResourcesModule(){
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

    const status=
        document.createElement(
            'p'
        );

    status.className=
        'teacher-resources-message';

    status.textContent=
        'Loading sessions...';

    container.appendChild(
        status
    );

    workspace.appendChild(
        container
    );

    updateTeacherResourcesLiveStatus();

    await loadTeacherResourceSessions(
        container,
        status
    );
}

async function loadTeacherResourceSessions(
    container,
    status
){
    try{
        const response=
            await fetch(
                TEACHER_RESOURCE_SESSIONS_ENDPOINT
            );

        if(!response.ok){
            throw new Error(
                `Session request failed: ${response.status}`
            );
        }

        const data=
            await response.json();

        const sessions=
            Array.isArray(
                data.session_details
            )
                ? data.session_details
                : [];

        status.remove();

        if(sessions.length===0){
            const emptyMessage=
                document.createElement(
                    'p'
                );

            emptyMessage.className=
                'teacher-resources-message';

            emptyMessage.textContent=
                'No sessions are currently available.';

            container.appendChild(
                emptyMessage
            );

            return;
        }

        sessions.forEach(session=>{
            const card=
                document.createElement(
                    'article'
                );

            card.className=
                'teacher-resource-session';

            const title=
                document.createElement(
                    'h3'
                );

            title.className=
                'teacher-resource-session-title';

            title.textContent=
                `Session ${session.session_num}`;

            const description=
                document.createElement(
                    'p'
                );

            description.className=
                'teacher-resource-session-description';

            description.textContent=
                [
                    session.lesson_1_title,
                    session.lesson_2_title
                ]
                    .filter(Boolean)
                    .join(' • ');

            card.appendChild(
                title
            );

            card.appendChild(
                description
            );

            container.appendChild(
                card
            );
        });

    }catch(error){
        console.error(
            'Teacher resource sessions failed:',
            error
        );

        status.textContent=
            'Unable to load sessions.';
    }
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
