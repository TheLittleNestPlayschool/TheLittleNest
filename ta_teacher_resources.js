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

    const workspace=
        getWorkspace();

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

        renderSessionRangeSelector(
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
  Session Range Selector
==================================================*/

function renderSessionRangeSelector(
    container,
    sessionGroups
){
    const selectedRanges=
        new Set();

    const heading=
        document.createElement(
            'h3'
        );

    heading.className=
        'teacher-resource-selector-title';

    heading.textContent=
        'Select session numbers to download';

    const grid=
        document.createElement(
            'div'
        );

    grid.className=
        'teacher-resource-range-grid';

    const downloadArea=
        document.createElement(
            'div'
        );

    downloadArea.className=
        'teacher-resource-download-area';

    const downloadButton=
        document.createElement(
            'button'
        );

    downloadButton.type=
        'button';

    downloadButton.className=
        'teacher-resource-download-button';

    downloadButton.disabled=
        true;

    updateDownloadButton(
        downloadButton,
        selectedRanges
    );

    sessionGroups.forEach(
        group=>{
            const button=
                createRangeButton(
                    group
                );

            button.addEventListener(
                'click',
                ()=>{
                    toggleRangeSelection(
                        button,
                        group,
                        selectedRanges
                    );

                    updateDownloadButton(
                        downloadButton,
                        selectedRanges
                    );
                }
            );

            grid.appendChild(
                button
            );
        }
    );

    downloadArea.appendChild(
        downloadButton
    );

    container.appendChild(
        heading
    );

    container.appendChild(
        grid
    );

    container.appendChild(
        downloadArea
    );
}

function createRangeButton(
    group
){
    const button=
        document.createElement(
            'button'
        );

    button.type=
        'button';

    button.className=
        'teacher-resource-range-button';

    button.dataset.rangeStart=
        group.start;

    button.dataset.rangeEnd=
        group.end;

    const check=
        document.createElement(
            'span'
        );

    check.className=
        'teacher-resource-range-check';

    check.textContent=
        '✓';

    const label=
        document.createElement(
            'span'
        );

    label.className=
        'teacher-resource-range-label';

    label.textContent=
        `${group.start}–${group.end}`;

    button.appendChild(
        check
    );

    button.appendChild(
        label
    );

    return button;
}

function toggleRangeSelection(
    button,
    group,
    selectedRanges
){
    const key=
        `${group.start}-${group.end}`;

    const isSelected=
        selectedRanges.has(
            key
        );

    if(isSelected){
        selectedRanges.delete(
            key
        );

        button.classList.remove(
            'is-selected'
        );

        button.setAttribute(
            'aria-pressed',
            'false'
        );

        return;
    }

    selectedRanges.add(
        key
    );

    button.classList.add(
        'is-selected'
    );

    button.setAttribute(
        'aria-pressed',
        'true'
    );
}

function updateDownloadButton(
    button,
    selectedRanges
){
    const count=
        selectedRanges.size;

    button.disabled=
        count===0;

    button.textContent=
        count>0
            ?`Download Selected (${count})`
            :'Download Selected';
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
    const card=
        document.querySelector(
            '.teacher-module-card[data-module-id="teacher_resources"]'
        );

    const subtitle=
        card?.querySelector(
            '.teacher-module-subtitle'
        );

    if(!subtitle){
        return;
    }

    subtitle.textContent=
        'Sessions, worksheets, and printable forms.';
}
