import{
    getWorkspace,
    clearWorkspace
}from'./ta_ui.js';

const ENROLLMENT_API=
    'https://x8ki-letl-twmt.n7.xano.io/api:EpDLPKN0/ta_enrollment';

/*==================================================
  Enrollment Module
==================================================*/

export async function renderEnrollmentModule(
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
        'teacher-enrollment';

    const loadingMessage=
        createMessage(
            'Loading enrollment...'
        );

    container.appendChild(
        loadingMessage
    );

    workspace.appendChild(
        container
    );

    try{
        const enrollmentData=
            await loadEnrollmentData(
                state
            );

        const franchise=
            enrollmentData?.franchise||
            null;

        const sessions=
            Array.isArray(
                enrollmentData?.sessions
            )
                ?enrollmentData.sessions
                :[];

        const parents=
            Array.isArray(
                enrollmentData?.parents
            )
                ?enrollmentData.parents
                :[];

        loadingMessage.remove();

        renderParentStep(
            container,
            parents
        );

        updateEnrollmentLiveStatus(
            sessions.length,
            franchise
        );

    }catch(error){
        console.error(
            'Enrollment failed:',
            error
        );

        loadingMessage.textContent=
            'Unable to load enrollment.';

        updateEnrollmentErrorStatus();
    }
}

/*==================================================
  Load Enrollment Data
==================================================*/

async function loadEnrollmentData(
    state
){
    const response=
        await fetch(
            ENROLLMENT_API,
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
                responseData
            )
        );
    }

    return responseData;
}

/*==================================================
  Parent Step
==================================================*/

function renderParentStep(
    container,
    parents
){
    const step=
        document.createElement(
            'section'
        );

    step.className=
        'teacher-enrollment-parent-step';

    const heading=
        document.createElement(
            'h3'
        );

    heading.className=
        'teacher-enrollment-step-title';

    heading.textContent=
        'Parent';

    const description=
        document.createElement(
            'p'
        );

    description.className=
        'teacher-enrollment-step-description';

    description.textContent=
        'Choose an existing parent or enter a new parent.';

    const select=
        createParentSelect(
            parents
        );

    const divider=
        document.createElement(
            'div'
        );

    divider.className=
        'teacher-enrollment-divider';

    divider.textContent=
        'or';

    const newParentButton=
        document.createElement(
            'button'
        );

    newParentButton.type=
        'button';

    newParentButton.className=
        'teacher-enrollment-new-parent-button';

    newParentButton.textContent=
        '+ New Parent';

    newParentButton.addEventListener(
        'click',
        ()=>{
            select.value=
                '';

            select.dispatchEvent(
                new Event(
                    'change'
                )
            );

            newParentButton.classList.add(
                'is-selected'
            );
        }
    );

    select.addEventListener(
        'change',
        ()=>{
            if(select.value){
                newParentButton.classList.remove(
                    'is-selected'
                );
            }
        }
    );

    step.appendChild(
        heading
    );

    step.appendChild(
        description
    );

    step.appendChild(
        select
    );

    step.appendChild(
        divider
    );

    step.appendChild(
        newParentButton
    );

    container.appendChild(
        step
    );
}

/*==================================================
  Parent Select
==================================================*/

function createParentSelect(
    parents
){
    const select=
        document.createElement(
            'select'
        );

    select.className=
        'teacher-enrollment-parent-select';

    const placeholder=
        document.createElement(
            'option'
        );

    placeholder.value=
        '';

    placeholder.textContent=
        'Select Existing Parent';

    select.appendChild(
        placeholder
    );

    parents.forEach(
        parent=>{
            const option=
                document.createElement(
                    'option'
                );

            option.value=
                String(
                    parent?.id||
                    ''
                );

            option.textContent=
                parent?.full_name||
                'Parent';

            select.appendChild(
                option
            );
        }
    );

    return select;
}

/*==================================================
  Message
==================================================*/

function createMessage(
    text
){
    const message=
        document.createElement(
            'p'
        );

    message.className=
        'teacher-enrollment-message';

    message.textContent=
        text;

    return message;
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
    responseData
){
    return(
        responseData?.message||
        responseData?.error||
        'Unable to load enrollment.'
    );
}

/*==================================================
  Live Status
==================================================*/

function updateEnrollmentLiveStatus(
    sessionCount,
    franchise
){
    const card=
        document.querySelector(
            '.teacher-module-card[data-module-id="enrollment"]'
        );

    const subtitle=
        card?.querySelector(
            '.teacher-module-subtitle'
        );

    if(!subtitle){
        return;
    }

    const branchName=
        franchise?.branch_name||
        franchise?.name||
        '';

    if(branchName){
        subtitle.textContent=
            `${branchName} — ready to enroll.`;

        return;
    }

    if(sessionCount===1){
        subtitle.textContent=
            '1 session available for enrollment.';

        return;
    }

    subtitle.textContent=
        `${sessionCount} sessions available for enrollment.`;
}

function updateEnrollmentErrorStatus(){
    const card=
        document.querySelector(
            '.teacher-module-card[data-module-id="enrollment"]'
        );

    const subtitle=
        card?.querySelector(
            '.teacher-module-subtitle'
        );

    if(!subtitle){
        return;
    }

    subtitle.textContent=
        'Unable to load enrollment.';
}
