const RECEIPT_TABLES_API=
    'https://x8ki-letl-twmt.n7.xano.io/api:EpDLPKN0/ta_get_upload_receipt_tables';


export async function loadReceiptUploadData(
    receiptContext,
    state
){
    const response=
        await fetch(
            RECEIPT_TABLES_API,
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

    return normalizeReceiptUploadData(
        responseData
    );
}


function normalizeReceiptUploadData(
    responseData
){
    const user=
        responseData?.user||
        null;

    const students=
        Array.isArray(
            responseData?.student
        )
            ?responseData.student
            :[];

    const paymentTypes=
        Array.isArray(
            responseData?.payment_type
        )
            ?responseData.payment_type
            :[];

    const teacher=
        findCurrentTeacher(
            responseData?.teacher,
            user
        );

    return{
        user,

        teacher,

        students,

        paymentTypes
    };
}


function findCurrentTeacher(
    teacherData,
    user
){
    if(
        teacherData&&
        !Array.isArray(
            teacherData
        )
    ){
        return teacherData;
    }

    if(
        !Array.isArray(
            teacherData
        )
    ){
        return null;
    }

    const teacherId=
        user?.teacher_id||
        null;

    if(!teacherId){
        return null;
    }

    return teacherData.find(
        teacher=>{
            return(
                Number(
                    teacher?.id
                )===
                Number(
                    teacherId
                )
            );
        }
    )||
    null;
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
    responseData
){
    return(
        responseData?.message||
        responseData?.error||
        'Unable to load receipt upload data.'
    );
}
