import{
    getWorkspace,
    clearWorkspace
}from'./ta_ui.js';


export function renderMediaModule(
    taskContext=null
){
    clearWorkspace();

    const workspace=
        getWorkspace();

    if(!workspace){
        return;
    }

    workspace.appendChild(
        createMediaExperience(
            taskContext
        )
    );
}


function createMediaExperience(
    taskContext
){
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
        'Add photos, videos, and artwork from today.';


    intro.appendChild(
        title
    );

    intro.appendChild(
        description
    );


    //------------------------------------
    // Capture Actions
    //------------------------------------

    const actions=
        document.createElement(
            'div'
        );

    actions.className=
        'teacher-media-actions';


    actions.appendChild(
        createMediaAction(
            '📷',
            'Photos',
            'Take or choose photos',
            'photo'
        )
    );


    actions.appendChild(
        createMediaAction(
            '🎥',
            'Video',
            'Add a video',
            'video'
        )
    );


    actions.appendChild(
        createMediaAction(
            '🎨',
            'Artwork',
            'Capture student artwork',
            'artwork'
        )
    );


    //------------------------------------
    // Media Workspace
    //------------------------------------

    const mediaWorkspace=
        document.createElement(
            'div'
        );

    mediaWorkspace.className=
        'teacher-media-workspace';

    mediaWorkspace.dataset
        .mediaWorkspace=
        'true';


    const emptyState=
        document.createElement(
            'div'
        );

    emptyState.className=
        'teacher-media-empty';


    const emptyIcon=
        document.createElement(
            'span'
        );

    emptyIcon.className=
        'teacher-media-empty-icon';

    emptyIcon.textContent=
        '📸';


    const emptyText=
        document.createElement(
            'p'
        );

    emptyText.textContent=
        'Your selected media will appear here.';


    emptyState.appendChild(
        emptyIcon
    );

    emptyState.appendChild(
        emptyText
    );

    mediaWorkspace.appendChild(
        emptyState
    );


    //------------------------------------
    // Assemble
    //------------------------------------

    container.appendChild(
        intro
    );

    container.appendChild(
        actions
    );

    container.appendChild(
        mediaWorkspace
    );


    return container;
}


function createMediaAction(
    icon,
    title,
    description,
    action
){
    const button=
        document.createElement(
            'button'
        );

    button.type=
        'button';

    button.className=
        'teacher-media-action';

    button.dataset
        .mediaAction=
        action;


    const iconElement=
        document.createElement(
            'span'
        );

    iconElement.className=
        'teacher-media-action-icon';

    iconElement.textContent=
        icon;


    const text=
        document.createElement(
            'span'
        );

    text.className=
        'teacher-media-action-text';


    const titleElement=
        document.createElement(
            'strong'
        );

    titleElement.textContent=
        title;


    const descriptionElement=
        document.createElement(
            'small'
        );

    descriptionElement.textContent=
        description;


    text.appendChild(
        titleElement
    );

    text.appendChild(
        descriptionElement
    );


    button.appendChild(
        iconElement
    );

    button.appendChild(
        text
    );


    button.addEventListener(
        'click',
        ()=>{
            console.log(
                'ta_media:',
                action
            );
        }
    );


    return button;
}
