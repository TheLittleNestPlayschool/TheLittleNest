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
            renderEmptyMessage(
                container
            );

            return;
        }

        const sessionGroups=
            buildSessionGroups(
                sessions
            );

        renderSessionGroupSelector(
            container,
            sessionGroups
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

    const groupList=
        Array.from(
            groups.values()
        ).sort(
            (
                a,
                b
            )=>
                a.start-b.start
        );

    groupList.forEach(
        group=>{
            group.sessions.sort(
                (
                    a,
                    b
                )=>
                    Number(
                        a.session_num
                    )-
                    Number(
                        b.session_num
                    )
            );
        }
    );

    return groupList;
}

/*==================================================
  Group Selector
==================================================*/

function renderSessionGroupSelector(
    container,
    sessionGroups
){
    const selector=
        document.createElement(
            'div'
        );

    selector.className=
        'teacher-resource-range-grid';

    const sessionArea=
        document.createElement(
            'div'
        );

    sessionArea.className=
        'teacher-resource-session-area';

    sessionGroups.forEach(
        (
            group,
            index
        )=>{
            const button=
                document.createElement(
                    'button'
                );

            button.type=
                'button';

            button.className=
                'teacher-resource-range-button';

            button.textContent=
                `${group.start}–${group.end}`;

            button.dataset.rangeStart=
                group.start;

            button.dataset.rangeEnd=
                group.end;

            button.addEventListener(
                'click',
                ()=>{
                    setActiveRangeButton(
                        selector,
                        button
                    );

                    renderSelectedSessionGroup(
                        sessionArea,
                        group
                    );
                }
            );

            selector.appendChild(
                button
            );

            if(index===0){
                button.classList.add(
                    'is-active'
                );
            }
        }
    );

    container.appendChild(
        selector
    );

    container.appendChild(
        sessionArea
    );

    if(sessionGroups.length){
        renderSelectedSessionGroup(
            sessionArea,
            sessionGroups[0]
        );
    }
}

function setActiveRangeButton(
    selector,
    activeButton
){
    const buttons=
        selector.querySelectorAll(
            '.teacher-resource-range-button'
        );

    buttons.forEach(
        button=>{
            button.classList.toggle(
                'is-active',
                button===activeButton
            );
        }
    );
}

/*==================================================
  Selected Session Group
==================================================*/

function renderSelectedSessionGroup(
    sessionArea,
    group
){
    sessionArea.innerHTML=
        '';

    const heading=
        document.createElement(
            'h3'
        );

    heading.className=
        'teacher-resource-session-group-title';

    heading.textContent=
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
                createSessionButton(
                    session
                );

            grid.appendChild(
                button
            );
        }
    );

    sessionArea.appendChild(
        heading
    );

    sessionArea.appendChild(
        grid
    );
}

function createSessionButton(
    session
){
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

    return button;
}

/*==================================================
  Empty State
==================================================*/

function renderEmptyMessage(
    container
){
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
