import{
    getState
}from'./ta_state.js';

import{
    getWorkspace,
    clearWorkspace
}from'./ta_ui.js';

import{
    getMediaSession,
    setAvailableSessions,
    selectMediaSession,
    applyMediaTaskData
}from'./ta_media_session.js';

import{
    loadMediaSessions,
    loadMediaTaskData
}from'./ta_media_data.js';

import{
    renderMediaSessionSelect
}from'./ta_media_session_select.js';

import{
    renderMediaCapture
}from'./ta_media_capture.js';

import{
    renderMediaPreview
}from'./ta_media_preview.js';


export async function renderMediaModule(
    taskContext=null
){
    const session=
        getMediaSession();

    session.taskContext=
        taskContext;

    clearWorkspace();


    //------------------------------------
    // Load Session Choices
    //------------------------------------

    if(
        !session.availableSessions.length&&
        !session.isLoadingSessions
    ){
        session.isLoadingSessions=
            true;

        session.sessionLoadError=
            null;

        renderCurrentView();

        try{
            const data=
                await loadMediaSessions(
                    getState()
                );

            setAvailableSessions(
                data.sessions
            );

        }catch(error){
            console.error(
                'Media sessions load failed:',
                error
            );

            session.sessionLoadError=
                error instanceof Error
                    ?error.message
                    :'Unable to load sessions.';

        }finally{
            session.isLoadingSessions=
                false;

            renderCurrentView();
        }

        return;
    }


    renderCurrentView();
}


export function renderCurrentView(){
    const workspace=
        getWorkspace();

    if(!workspace){
        return;
    }


    const session=
        getMediaSession();


    workspace.innerHTML='';


    //------------------------------------
    // Main Container
    //------------------------------------

    const container=
        document.createElement(
            'section'
        );

    container.className=
        'teacher-media';


    //------------------------------------
    // Introduction
    //------------------------------------

    const intro=
        document.createElement(
            'div'
        );

    intro.className=
        'teacher-media-intro';


    const title=
        document.createElement(
            'h3'
        );

    title.textContent=
        'Capture Moments';


    const description=
        document.createElement(
            'p'
        );

    description.textContent=
        'Add photos and videos from today.';


    intro.appendChild(
        title
    );

    intro.appendChild(
        description
    );

    container.appendChild(
        intro
    );


    //------------------------------------
    // Loading Sessions
    //------------------------------------

    if(
        session.isLoadingSessions
    ){
        const message=
            document.createElement(
                'p'
            );

        message.className=
            'teacher-media-message';

        message.textContent=
            'Loading sessions...';

        container.appendChild(
            message
        );

        workspace.appendChild(
            container
        );

        return;
    }


    //------------------------------------
    // Session Load Error
    //------------------------------------

    if(
        session.sessionLoadError
    ){
        const message=
            document.createElement(
                'p'
            );

        message.className=
            'teacher-media-message teacher-media-message-error';

        message.textContent=
            session.sessionLoadError;

        container.appendChild(
            message
        );

        workspace.appendChild(
            container
        );

        return;
    }


    //------------------------------------
    // Select Session
    //------------------------------------

    if(
        !session.sessionId
    ){
        renderMediaSessionSelect(
            container,
            {
                sessions:
                    session.availableSessions,

                selectedSession:
                    session.selectedSession,

                actions:{
                    selectSession:
                        handleSessionSelection
                }
            }
        );

        workspace.appendChild(
            container
        );

        return;
    }


    //------------------------------------
    // Loading Media Task
    //------------------------------------

    if(
        session.isLoadingTask
    ){
        const message=
            document.createElement(
                'p'
            );

        message.className=
            'teacher-media-message';

        message.textContent=
            'Preparing media task...';

        container.appendChild(
            message
        );

        workspace.appendChild(
            container
        );

        return;
    }


    //------------------------------------
    // Media Task Load Error
    //------------------------------------

    if(
        session.taskLoadError
    ){
        const message=
            document.createElement(
                'p'
            );

        message.className=
            'teacher-media-message teacher-media-message-error';

        message.textContent=
            session.taskLoadError;

        container.appendChild(
            message
        );

        workspace.appendChild(
            container
        );

        return;
    }


    //------------------------------------
    // Media Capture
    //------------------------------------

    renderMediaCapture(
        container,
        {
            refresh:
                renderCurrentView
        }
    );


    //------------------------------------
    // Media Editor Overlay
    //------------------------------------

    renderMediaPreview(
        container,
        {
            refresh:
                renderCurrentView
        }
    );


    //------------------------------------
    // Render
    //------------------------------------

    workspace.appendChild(
        container
    );
}


async function handleSessionSelection(
    selectedSession
){
    if(!selectedSession){
        return;
    }


    const session=
        getMediaSession();


    selectMediaSession(
        selectedSession
    );


    session.isLoadingTask=
        true;

    session.taskLoadError=
        null;


    renderCurrentView();


    try{
        const data=
            await loadMediaTaskData(
                session.sessionId,
                getState()
            );

        applyMediaTaskData(
            data
        );

    }catch(error){
        console.error(
            'Media task load failed:',
            error
        );

        session.taskLoadError=
            error instanceof Error
                ?error.message
                :'Unable to prepare media task.';

    }finally{
        session.isLoadingTask=
            false;

        renderCurrentView();
    }
}
