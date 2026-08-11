import{
    getWorkspace,
    clearWorkspace
}from'./ta_ui.js';

import{
    getMediaSession
}from'./ta_media_session.js';

import{
    renderMediaCapture
}from'./ta_media_capture.js';

import{
    renderMediaPreview
}from'./ta_media_preview.js';


export function renderMediaModule(
    taskContext=null
){
    clearWorkspace();

    const workspace=
        getWorkspace();

    if(!workspace){
        return;
    }

    const session=
        getMediaSession();

    session.taskContext=
        taskContext;

    renderCurrentView();
}


export function renderCurrentView(){
    const workspace=
        getWorkspace();

    if(!workspace){
        return;
    }

    workspace.innerHTML='';

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
    // Capture Area
    //------------------------------------

    renderMediaCapture(
        container,
        {
            refresh:
                renderCurrentView
        }
    );


    //------------------------------------
    // Selected Preview
    //------------------------------------

    renderMediaPreview(
        container
    );


    workspace.appendChild(
        container
    );
}
