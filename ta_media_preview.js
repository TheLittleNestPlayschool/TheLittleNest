import{
    getState
}from'./ta_state.js';

import{
    getActiveMedia,
    clearActiveMedia,
    setActiveMediaType,
    toggleActiveMediaStudent,
    markActiveMediaComplete
}from'./ta_media_session.js';

import{
    renderMediaStudents
}from'./ta_media_students.js';


export function renderMediaPreview(
    container,
    actions
){
    const item=
        getActiveMedia();

    if(!item){
        return;
    }


    //------------------------------------
    // Overlay
    //------------------------------------

    const overlay=
        document.createElement(
            'div'
        );

    overlay.className=
        'teacher-media-overlay';


    overlay.addEventListener(
        'click',
        event=>{
            if(
                event.target!==
                overlay
            ){
                return;
            }

            closeEditor(
                actions
            );
        }
    );


    //------------------------------------
    // Editor Panel
    //------------------------------------

    const panel=
        document.createElement(
            'section'
        );

    panel.className=
        'teacher-media-editor-panel';


    //------------------------------------
    // Header
    //------------------------------------

    const header=
        document.createElement(
            'div'
        );

    header.className=
        'teacher-media-editor-header';


    const heading=
        document.createElement(
            'div'
        );

    heading.className=
        'teacher-media-editor-heading';


    const title=
        document.createElement(
            'strong'
        );

    title.textContent=
        'Media Details';


    const fileName=
        document.createElement(
            'span'
        );

    fileName.textContent=
        item.file?.name||'';


    heading.appendChild(
        title
    );

    heading.appendChild(
        fileName
    );


    const closeButton=
        document.createElement(
            'button'
        );

    closeButton.type=
        'button';

    closeButton.className=
        'teacher-media-editor-close';

    closeButton.textContent=
        '×';


    closeButton.addEventListener(
        'click',
        ()=>{
            closeEditor(
                actions
            );
        }
    );


    header.appendChild(
        heading
    );

    header.appendChild(
        closeButton
    );


    panel.appendChild(
        header
    );


    //------------------------------------
    // Large Preview
    //------------------------------------

    const preview=
        document.createElement(
            'div'
        );

    preview.className=
        'teacher-media-large-preview';


    if(
        item.mediaKind===
        'video'
    ){
        const video=
            document.createElement(
                'video'
            );

        video.src=
            item.previewUrl;

        video.controls=
            true;

        video.playsInline=
            true;

        video.preload=
            'metadata';


        preview.appendChild(
            video
        );

    }else{
        const image=
            document.createElement(
                'img'
            );

        image.src=
            item.previewUrl;

        image.alt=
            'Selected media preview';


        preview.appendChild(
            image
        );
    }


    panel.appendChild(
        preview
    );


    //------------------------------------
    // Media Type
    //------------------------------------

    panel.appendChild(
        createMediaTypeSelector(
            item,
            actions
        )
    );


    //------------------------------------
    // Students
    //------------------------------------

    const state=
        getState();


    const students=
        Array.isArray(
            state?.locationStudents
        )
            ?state.locationStudents
            :[];


    renderMediaStudents(
        panel,
        {
            students,

            selectedStudentIds:
                item.studentIds,

            actions:{
                toggleStudent:
                    student=>{
                        toggleActiveMediaStudent(
                            student.id
                        );

                        actions.refresh();
                    },

                findStudent:
                    ()=>{
                        console.log(
                            'ta_media: find student'
                        );
                    }
            }
        }
    );


    //------------------------------------
    // Done
    //------------------------------------

    const actionsRow=
        document.createElement(
            'div'
        );

    actionsRow.className=
        'teacher-media-editor-actions';


    const doneButton=
        document.createElement(
            'button'
        );

    doneButton.type=
        'button';

    doneButton.className=
        'teacher-media-editor-done';

    doneButton.textContent=
        'Done';


    doneButton.disabled=
        !item.mediaType||
        !item.studentIds.length;


    doneButton.addEventListener(
        'click',
        ()=>{
            markActiveMediaComplete();

            closeEditor(
                actions
            );
        }
    );


    actionsRow.appendChild(
        doneButton
    );

    panel.appendChild(
        actionsRow
    );


    //------------------------------------
    // Render
    //------------------------------------

    overlay.appendChild(
        panel
    );

    container.appendChild(
        overlay
    );
}


function createMediaTypeSelector(
    item,
    actions
){
    const section=
        document.createElement(
            'section'
        );

    section.className=
        'teacher-media-type-selector';


    const heading=
        document.createElement(
            'strong'
        );

    heading.textContent=
        'Type';


    const options=
        document.createElement(
            'div'
        );

    options.className=
        'teacher-media-type-options';


    options.appendChild(
        createTypeButton(
            'Media',
            'media',
            item,
            actions
        )
    );


    options.appendChild(
        createTypeButton(
            'Art',
            'art',
            item,
            actions
        )
    );


    section.appendChild(
        heading
    );

    section.appendChild(
        options
    );


    return section;
}


function createTypeButton(
    label,
    value,
    item,
    actions
){
    const button=
        document.createElement(
            'button'
        );

    button.type=
        'button';

    button.className=
        'teacher-media-type-button';

    button.textContent=
        label;


    if(
        item.mediaType===
        value
    ){
        button.classList.add(
            'is-selected'
        );
    }


    button.addEventListener(
        'click',
        ()=>{
            setActiveMediaType(
                value
            );

            actions.refresh();
        }
    );


    return button;
}


function closeEditor(
    actions
){
    clearActiveMedia();

    actions.refresh();
}
