import{
    getActiveMedia,
    clearActiveMedia,
    markActiveMediaComplete
}from'./ta_media_session.js';


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
    // Temporary Editor Area
    //------------------------------------

    const controls=
        document.createElement(
            'div'
        );

    controls.className=
        'teacher-media-controls-placeholder';

    controls.textContent=
        'Media type and student tagging will go here.';


    panel.appendChild(
        controls
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
    // Render Overlay
    //------------------------------------

    overlay.appendChild(
        panel
    );

    container.appendChild(
        overlay
    );
}


function closeEditor(
    actions
){
    clearActiveMedia();

    actions.refresh();
}
