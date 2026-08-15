import{
    getWorkspace,
    clearWorkspace
}from'./ta_ui.js';

const TEACHER_RESOURCE_SESSIONS_ENDPOINT=
    'https://x8ki-letl-twmt.n7.xano.io/api:EpDLPKN0/ta_teacher_resources';

export async function renderTeacherResourcesModule(
    state
){
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
        status,
        state
    );
}

async function loadTeacherResourceSessions(
    container,
    status,
    state
){
    try{
        const response=
            await fetch(
                TEACHER_RESOURCE_SESSIONS_ENDPOINT,
                {
                    method:
                    'GET',

                    headers:
                    buildRequestHeaders(
                        state
                    )
                }
            );

        const responseData=
            await readResponseData(
                response
            );

        if(!response.ok){
            throw new Error(
                getApiErrorMessage(
                    responseData,
                    'Unable to load sessions.'
                )
            );
        }

        const sessions=
            Array.isArray(
                responseData
                ?.session_details
            )
                ?responseData
                .session_details
                :[];

        status.remove();

        if(!sessions.length){
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

        sessions.forEach(
            session=>{
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
                        .filter(
                            Boolean
                        )
                        .join(
                            ' • '
                        );

                card.appendChild(
                    title
                );

                card.appendChild(
                    description
                );

                container.appendChild(
                    card
                );
            }
        );

    }catch(error){
        console.error(
            'Teacher resource sessions failed:',
            error
        );

        status.textContent=
            'Unable to load sessions.';
    }
}

/*==================================================
  Request Headers
==================================================*/

function buildRequestHeaders(
    state
){
    const headers={
        Accept:
        'application/json'
    };

    const authToken=
        getAuthToken(
            state
        );

    if(authToken){
        headers.Authorization=
            `Bearer ${authToken}`;
    }

    return headers;
}

function getAuthToken(
    state
){
    return(
        state?.authToken||
        state?.auth_token||
        state?.context?.authToken||
        state?.context?.auth_token||
        window.localStorage.getItem(
            'authToken'
        )||
        window.localStorage.getItem(
            'auth_token'
        )||
        ''
    );
}

/*==================================================
  Response Helpers
==================================================*/

async function readResponseData(
    response
){
    const responseText=
        await response.text();

    if(!responseText){
        return null;
    }

    try{
        return JSON.parse(
            responseText
        );

    }catch(error){
        return{
            message:
            responseText
        };
    }
}

function getApiErrorMessage(
    responseData,
    fallbackMessage
){
    return(
        responseData?.message||
        responseData?.error||
        fallbackMessage
    );
}

/*==================================================
  Live Status
==================================================*/

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
