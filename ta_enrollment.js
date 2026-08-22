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

    const message=
        document.createElement(
            'p'
        );

    message.className=
        'teacher-enrollment-message';

    message.textContent=
        'Loading enrollment...';

    container.appendChild(
        message
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

        message.textContent=
            `${franchise?.branch_name||
            franchise?.name||
            'Branch'} — ${sessions.length} sessions available`;

        updateEnrollmentLiveStatus(
            sessions.length
        );

    }catch(error){
        console.error(
            'Enrollment failed:',
            error
        );

        message.textContent=
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
    sessionCount
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
