import{
    getWorkspace,
    clearWorkspace
}from'./ta_ui.js';

const TEACHER_INFORMATION_ENDPOINT=
    'https://x8ki-letl-twmt.n7.xano.io/api:EpDLPKN0/ta_get_teacher_display';

let teacherInformationSession=
    createTeacherInformationSession();

export function renderTeacherInformationModule(){
    clearWorkspace();

    if(
        teacherInformationSession.data||
        teacherInformationSession.error
    ){
        renderCurrentView();
        return;
    }

    renderCurrentView();
    loadTeacherInformation();
}

function createTeacherInformationSession(){
    return{
        data:null,
        isLoading:false,
        error:null
    };
}

async function loadTeacherInformation(){
    if(teacherInformationSession.isLoading){
        return;
    }

    teacherInformationSession.isLoading=true;
    teacherInformationSession.error=null;

    renderCurrentView();

    try{
        const authToken=
            localStorage.getItem(
                'authToken'
            );

        if(!authToken){
            throw new Error(
                'Teacher authentication was not found.'
            );
        }

        const response=await fetch(
            TEACHER_INFORMATION_ENDPOINT,
            {
                method:'GET',

                headers:{
                    Authorization:
                        `Bearer ${authToken}`,

                    Accept:
                        'application/json'
                }
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
                    response.status
                )
            );
        }

        teacherInformationSession.data=
            normalizeTeacherInformation(
                responseData
            );

    }catch(error){
        console.error(
            'Teacher information load failed:',
            error
        );

        teacherInformationSession.error=
            error instanceof Error
                ?error.message
                :'Unable to load teacher information.';

    }finally{
        teacherInformationSession.isLoading=false;
        renderCurrentView();
    }
}

function renderCurrentView(){
    const workspace=getWorkspace();

    if(!workspace){
        return;
    }

    workspace.innerHTML='';

    const container=
        document.createElement(
            'section'
        );

    container.className=
        'teacher-information';

    if(teacherInformationSession.isLoading){
        renderLoadingState(
            container
        );

    }else if(teacherInformationSession.error){
        renderErrorState(
            container
        );

    }else if(teacherInformationSession.data){
        renderInformation(
            container,
            teacherInformationSession.data
        );

    }else{
        renderLoadingState(
            container
        );
    }

    workspace.appendChild(
        container
    );

    updateTeacherInformationLiveStatus();
}

function renderLoadingState(container){
    const message=
        document.createElement(
            'p'
        );

    message.className=
        'teacher-information-message';

    message.textContent=
        'Loading teacher information...';

    container.appendChild(
        message
    );
}

function renderErrorState(container){
    const message=
        document.createElement(
            'p'
        );

    message.className=
        'teacher-information-message teacher-information-error';

    message.textContent=
        teacherInformationSession.error;

    const retryButton=
        document.createElement(
            'button'
        );

    retryButton.type='button';

    retryButton.className=
        'teacher-button teacher-button-secondary teacher-information-retry';

    retryButton.textContent='Try Again';

    retryButton.addEventListener(
        'click',
        retryTeacherInformation
    );

    container.appendChild(
        message
    );

    container.appendChild(
        retryButton
    );
}

function renderInformation(
    container,
    teacherInformation
){
    const fields=
        teacherInformation.fields||[];

    if(fields.length===0){
        const message=
            document.createElement(
                'p'
            );

        message.className=
            'teacher-information-message';

        message.textContent=
            'No teacher information is available.';

        container.appendChild(
            message
        );

        return;
    }

    const list=
        document.createElement(
            'div'
        );

    list.className=
        'teacher-information-list';

    fields.forEach(field=>{
        list.appendChild(
            createInformationRow(
                field
            )
        );
    });

    container.appendChild(
        list
    );
}

function createInformationRow(field){
    const row=
        document.createElement(
            'div'
        );

    row.className=
        'teacher-information-row';

    const label=
        document.createElement(
            'span'
        );

    label.className=
        'teacher-information-label';

    label.textContent=
        field.label;

    const value=
        document.createElement(
            'span'
        );

    value.className=
        'teacher-information-value';

    value.textContent=
        field.value;

    row.appendChild(
        label
    );

    row.appendChild(
        value
    );

    return row;
}

function retryTeacherInformation(){
    teacherInformationSession=
        createTeacherInformationSession();

    renderCurrentView();
    loadTeacherInformation();
}

function normalizeTeacherInformation(
    responseData
){
    const teacher=
        responseData?.teacher_display||
        {};

    const franchise=
        responseData?.franchise_display||
        {};

    const teacherName=[
        cleanDisplayValue(
            teacher.first_name
        ),
        cleanDisplayValue(
            teacher.last_name
        )
    ]
        .filter(Boolean)
        .join(' ');

    const fields=[
        createDisplayField(
            'Teacher',
            teacherName
        ),

        createDisplayField(
            'Location',
            franchise.name
        ),

        createDisplayField(
            'City',
            teacher.city
        ),

        createDisplayField(
            'Barangay',
            teacher.brgy
        ),

        createDisplayField(
            'Phone',
            teacher.phone
        ),

        createDisplayField(
            'Email',
            teacher.email
        )
    ].filter(Boolean);

    return{
        subtitle:
            teacherName||
            cleanDisplayValue(
                franchise.name
            )||
            'Teacher information',

        fields
    };
}

function createDisplayField(
    label,
    value
){
    const cleanValue=
        cleanDisplayValue(
            value
        );

    if(!cleanValue){
        return null;
    }

    return{
        label,
        value:cleanValue
    };
}

function updateTeacherInformationLiveStatus(){
    const card=document.querySelector(
        '.teacher-module-card[data-module-id="teacher_information"]'
    );

    const subtitle=card?.querySelector(
        '.teacher-module-subtitle'
    );

    if(!subtitle){
        return;
    }

    if(teacherInformationSession.isLoading){
        subtitle.textContent=
            'Loading teacher information...';

        return;
    }

    if(teacherInformationSession.error){
        subtitle.textContent=
            'Teacher information unavailable.';

        return;
    }

    subtitle.textContent=
        teacherInformationSession
            .data
            ?.subtitle||
        'Teacher information';
}

async function readResponseData(response){
    const contentType=
        response.headers.get(
            'content-type'
        )||'';

    if(
        contentType.includes(
            'application/json'
        )
    ){
        return await response.json();
    }

    const text=
        await response.text();

    return text
        ?{message:text}
        :{};
}

function getApiErrorMessage(
    responseData,
    status
){
    return(
        responseData?.message||
        responseData?.error||
        responseData?.detail||
        `Unable to load teacher information (${status}).`
    );
}

function cleanDisplayValue(value){
    if(
        value===null||
        value===undefined
    ){
        return'';
    }

    return String(value).trim();
}
