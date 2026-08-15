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

    const status=
        createLoadingStatus();

    container.appendChild(
        status
    );

    workspace.appendChild(
        container
    );

    updateTeacherResourcesLiveStatus();

    await loadTeacherResources(
        container,
        status,
        state
    );
}

/*==================================================
  Container
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

function createLoadingStatus(){
    const status=
        document.createElement(
            'p'
        );

    status.className=
        'teacher-resources-message';

    status.textContent=
        'Loading sessions...';

    return status;
}

/*==================================================
  Load Resources
==================================================*/

async function loadTeacherResources(
    container,
    status,
    state
){
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
                container
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
            container,
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
