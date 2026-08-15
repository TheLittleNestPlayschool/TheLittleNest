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

        const sessionGroups=
            buildSessionGroups(
                sessions
            );

        sessionGroups.forEach(
            group=>{
                const groupSection=
                    document.createElement(
                        'section'
                    );

                groupSection.className=
                    'teacher-resource-group';

                const groupTitle=
                    document.createElement(
                        'h3'
                    );

                groupTitle.className=
                    'teacher-resource-group-title';

                groupTitle.textContent=
                    `Sessions ${group.start}–${group.end}`;

                const grid=
                    document.createElement(
                        'div'
                    );

                grid.className=
                    'teacher-resource-session-grid';

                group.sessions.forEach(
                    session=>{
                        const button=
                            document.createElement(
                                'button'
                            );

                        button.type=
                            'button';

                        button.className=
                            'teacher-resource-session';

                        button.dataset.sessionId=
                            session.id;

                        button.dataset.sessionNum=
                            session.session_num;

                        const title=
                            document.createElement(
                                'span'
                            );

                        title.className=
                            'teacher-resource-session-title';

                        title.textContent=
                            `Session ${session.session_num}`;

                        const description=
                            document.createElement(
                                'span'
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

                        button.appendChild(
                            title
                        );

                        button.appendChild(
                            description
                        );

                        grid.appendChild(
                            button
                        );
                    }
                );

                groupSection.appendChild(
                    groupTitle
                );

                groupSection.appendChild(
                    grid
                );

                container.appendChild(
                    groupSection
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
  Session Groups
==================================================*/

function buildSessionGroups(
    sessions
){
    const groups=
        new Map();

    sessions.forEach(
        session=>{
            const sessionNum=
                Number(
                    session.session_num
                );

            if(
                !Number.isFinite(
                    sessionNum
                )||
                sessionNum<1
            ){
                return;
            }

            const groupIndex=
                Math.floor(
                    (sessionNum-1)/10
                );

            const start=
                (groupIndex*10)+1;

            const end=
                start+9;

            if(
                !groups.has(
                    groupIndex
                )
            ){
                groups.set(
                    groupIndex,
                    {
                        start,
                        end,
                        sessions:[]
                    }
                );
            }

            groups
                .get(
                    groupIndex
                )
                .sessions
                .push(
                    session
                );
        }
    );

    return Array.from(
        groups.values()
    ).sort(
        (
            a,
            b
        )=>
            a.start-b.start
    );
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
