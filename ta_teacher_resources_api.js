const TEACHER_RESOURCE_SESSIONS_ENDPOINT=
    'https://x8ki-letl-twmt.n7.xano.io/api:EpDLPKN0/ta_teacher_resources';

const TEACHER_RESOURCE_DOWNLOAD_ENDPOINT=
    'https://x8ki-letl-twmt.n7.xano.io/api:EpDLPKN0/ta_teacher_resource_download';

/*==================================================
  Load Teacher Resource Sessions
==================================================*/

export async function loadTeacherResourceSessionsData(
    state
){
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

    return{
        sessions:
            Array.isArray(
                responseData
                ?.session_details
            )
                ?responseData
                .session_details
                :[]
    };
}

/*==================================================
  Download Teacher Resource Sessions
==================================================*/

export async function loadTeacherResourceDownloads(
    blocks,
    state
){
    const response=
        await fetch(
            TEACHER_RESOURCE_DOWNLOAD_ENDPOINT,
            {
                method:
                    'POST',

                headers:{
                    ...buildRequestHeaders(
                        state
                    ),

                    'Content-Type':
                        'application/json'
                },

                body:
                    JSON.stringify({
                        blocks
                    })
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
                'Unable to prepare session downloads.'
            )
        );
    }

    return{
        signedFiles:
            Array.isArray(
                responseData
                ?.signed_files
            )
                ?responseData
                .signed_files
                :[]
    };
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
