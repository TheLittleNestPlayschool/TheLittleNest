
const MEDIA_SESSION_API=
    'https://x8ki-letl-twmt.n7.xano.io/api:EpDLPKN0/ta_get_session';

const MEDIA_TASK_API=
    'https://x8ki-letl-twmt.n7.xano.io/api:EpDLPKN0/ta_get_media_task';


export async function loadMediaSessions(
    state
){
    const response=
        await fetch(
            MEDIA_SESSION_API,
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
                responseData?.sessions
            )
                ?responseData.sessions
                :[]
    };
}


export async function loadMediaTaskData(
    sessionId,
    state
){
    const url=
        new URL(
            MEDIA_TASK_API
        );


    url.searchParams.set(
        'session_id',
        sessionId
    );


    const response=
        await fetch(
            url.toString(),
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
                'Unable to load media task.'
            )
        );
    }


    return{
        user:
            responseData?.user||
            null,

        studentsBySession:
            Array.isArray(
                responseData
                    ?.students_by_session
            )
                ?responseData
                    .students_by_session
                :[],

        studentsByLocation:
            Array.isArray(
                responseData
                    ?.students_by_location
            )
                ?responseData
                    .students_by_location
                :(
                    Array.isArray(
                        responseData
                            ?.student_by_location
                    )
                        ?responseData
                            .student_by_location
                        :[]
                )
    };
}


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
