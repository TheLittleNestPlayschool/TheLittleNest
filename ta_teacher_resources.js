import{
    getWorkspace,
    clearWorkspace
}from'./ta_ui.js';

import{
    loadTeacherResourceSessionsData
}from'./ta_teacher_resources_api.js';

import{
    buildSessionGroups
}from'./ta_teacher_resources_sessions.js';

import{
    cleanSelectedRanges,
    renderSessionRangeSelector
}from'./ta_teacher_resources_selector.js';

import{
    downloadTeacherResourceBlocks
}from'./ta_teacher_resources_download.js';

import{
    renderTeacherResourcesMenu
}from'./ta_teacher_resources_menu.js';

import{
    renderTeacherResourceForms
}from'./ta_teacher_resources_forms.js';

/*==================================================
  Teacher Resources Module
==================================================*/

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
        createTeacherResourcesContainer();

    const resourceContent=
        createResourceContent();

    workspace.appendChild(
        container
    );

    renderTeacherResourcesMenu(
        container,
        {
            onSessions:
                async()=>{
                    await showSessionResources(
                        resourceContent,
                        state
                    );
                },

            onForms:
                async()=>{
                    await showFormsResources(
                        resourceContent,
                        state
                    );
                }
        }
    );

    container.appendChild(
        resourceContent
    );

    renderResourceStartMessage(
        resourceContent
    );

    updateTeacherResourcesLiveStatus();
}

/*==================================================
  Main Container
==================================================*/

function createTeacherResourcesContainer(){
    const container=
        document.createElement(
            'section'
        );

    container.className=
        'teacher-resources';

    return container;
}

/*==================================================
  Resource Content
==================================================*/

function createResourceContent(){
    const content=
        document.createElement(
            'div'
        );

    content.className=
        'teacher-resource-content';

    return content;
}

function clearResourceContent(
    content
){
    if(!content){
        return;
    }

    content.innerHTML=
        '';
}

/*==================================================
  Start Message
==================================================*/

function renderResourceStartMessage(
    content
){
    clearResourceContent(
        content
    );

    const message=
        document.createElement(
            'p'
        );

    message.className=
        'teacher-resources-message';

    message.textContent=
        'Choose the resources you would like to download.';

    content.appendChild(
        message
    );
}

/*==================================================
  Session Resources
==================================================*/

async function showSessionResources(
    content,
    state
){
    clearResourceContent(
        content
    );

    const status=
        createLoadingStatus(
            'Loading sessions...'
        );

    content.appendChild(
        status
    );

    try{
        const resourceData=
            await loadTeacherResourceSessionsData(
                state
            );

        const sessions=
            Array.isArray(
                resourceData?.sessions
            )
                ?resourceData.sessions
                :[];

        status.remove();

        if(!sessions.length){
            renderEmptyMessage(
                content,
                'No sessions are currently available.'
            );

            return;
        }

        const sessionGroups=
            buildSessionGroups(
                sessions
            );

        cleanSelectedRanges(
            sessionGroups
        );

        renderSessionRangeSelector(
            content,
            sessionGroups,
            async(
                blocks,
                downloadButton
            )=>{
                await downloadTeacherResourceBlocks(
                    blocks,
                    state,
                    downloadButton
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
  Forms Resources
==================================================*/

async function showFormsResources(
    content,
    state
){
    clearResourceContent(
        content
    );

    await renderTeacherResourceForms(
        content,
        state
    );
}

/*==================================================
  Status
==================================================*/

function createLoadingStatus(
    message
){
    const status=
        document.createElement(
            'p'
        );

    status.className=
        'teacher-resources-message';

    status.textContent=
        message;

    return status;
}

/*==================================================
  Empty State
==================================================*/

function renderEmptyMessage(
    content,
    message
){
    const emptyMessage=
        document.createElement(
            'p'
        );

    emptyMessage.className=
        'teacher-resources-message';

    emptyMessage.textContent=
        message;

    content.appendChild(
        emptyMessage
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
