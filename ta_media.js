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
        'Add photos and videos from today.';


    intro.appendChild(
        title
    );

    intro.appendChild(
        description
    );


    //------------------------------------
    // Hidden Media Input
    //------------------------------------

    const mediaInput=
        document.createElement(
            'input'
        );

    mediaInput.type=
        'file';

    mediaInput.accept=
        'image/*,video/*';

    mediaInput.multiple=
        true;

    mediaInput.className=
        'teacher-media-input';


    //------------------------------------
    // Upload Media Button
    //------------------------------------

    const uploadButton=
        document.createElement(
            'button'
        );

    uploadButton.type=
        'button';

    uploadButton.className=
        'teacher-media-upload-button';


    const uploadIcon=
        document.createElement(
            'span'
        );

    uploadIcon.className=
        'teacher-media-upload-icon';

    uploadIcon.textContent=
        '📷';


    const uploadText=
        document.createElement(
            'span'
        );

    uploadText.className=
        'teacher-media-upload-text';


    const uploadTitle=
        document.createElement(
            'strong'
        );

    uploadTitle.textContent=
        'Upload Media';


    const uploadDescription=
        document.createElement(
            'small'
        );

    uploadDescription.textContent=
        'Choose photos and videos from this device.';


    uploadText.appendChild(
        uploadTitle
    );

    uploadText.appendChild(
        uploadDescription
    );


    uploadButton.appendChild(
        uploadIcon
    );

    uploadButton.appendChild(
        uploadText
    );


    uploadButton.addEventListener(
        'click',
        ()=>{
            mediaInput.click();
        }
    );


    mediaInput.addEventListener(
        'change',
        ()=>{
            const files=
                Array.from(
                    mediaInput.files||[]
                );

            console.log(
                'ta_media selected:',
                files
            );

            mediaInput.value='';
        }
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
        'Selected media will appear here.';


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
        mediaInput
    );

    container.appendChild(
        uploadButton
    );

    container.appendChild(
        mediaWorkspace
    );


    return container;
}
