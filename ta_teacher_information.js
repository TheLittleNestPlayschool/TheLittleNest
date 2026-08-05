import{
    getWorkspace,
    clearWorkspace
}from'./ta_ui.js';

const TEACHER_INFORMATION_ENDPOINT=
    '/api:YOUR_API_GROUP/teacher_information';

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
    const source=
        responseData?.teacher_information||
        responseData?.teacher||
        responseData||
        {};

    const explicitFields=
        Array.isArray(
            responseData?.fields
        )
            ?responseData.fields
            :Array.isArray(
                source?.fields
            )
                ?source.fields
                :null;

    const fields=explicitFields
        ?normalizeExplicitFields(
            explicitFields
        )
        :normalizeObjectFields(
            source
        );

    const subtitle=
        cleanDisplayValue(
            responseData?.subtitle||
            source?.subtitle
        )||
        getPreferredSubtitle(
            fields
        );

    return{
        subtitle,
        fields
    };
}

function normalizeExplicitFields(fields){
    return fields
        .map(field=>{
            if(
                !field||
                typeof field!=='object'
            ){
                return null;
            }

            const label=
                cleanDisplayValue(
                    field.label||
                    field.name
                );

            const value=
                cleanDisplayValue(
                    field.value
                );

            if(!label||!value){
                return null;
            }

            return{
                label,
                value
            };
        })
        .filter(Boolean);
}

function normalizeObjectFields(source){
    if(
        !source||
        typeof source!=='object'||
        Array.isArray(source)
    ){
        return[];
    }

    const ignoredFields=
        new Set([
            'id',
            'subtitle',
            'fields'
        ]);

    return Object.entries(source)
        .filter(([key,value])=>{
            return(
                !ignoredFields.has(key)&&
                isDisplayValue(value)
            );
        })
        .map(([key,value])=>({
            label:formatFieldLabel(key),
            value:cleanDisplayValue(value)
        }))
        .filter(field=>{
            return Boolean(
                field.label&&
                field.value
            );
        });
}

function getPreferredSubtitle(fields){
    if(fields.length===0){
        return'Teacher information';
    }

    const preferredLabels=[
        'teacher name',
        'name',
        'first name'
    ];

    const preferredField=
        fields.find(field=>{
            return preferredLabels.includes(
                field.label
                    .trim()
                    .toLowerCase()
            );
        });

    return(
        preferredField?.value||
        fields[0].value||
        'Teacher information'
    );
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

    if(typeof value==='boolean'){
        return value
            ?'Yes'
            :'No';
    }

    if(
        typeof value==='string'||
        typeof value==='number'
    ){
        return String(value).trim();
    }

    return'';
}

function isDisplayValue(value){
    return(
        typeof value==='string'||
        typeof value==='number'||
        typeof value==='boolean'
    );
}

function formatFieldLabel(key){
    return String(key)
        .replace(/_/g,' ')
        .replace(
            /\b\w/g,
            character=>
                character.toUpperCase()
        );
}
