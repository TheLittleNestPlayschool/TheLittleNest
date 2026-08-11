import{
    getActiveMedia
}from'./ta_media_session.js';


export function renderMediaPreview(
    container
){
    const item=
        getActiveMedia();

    if(!item){
        return;
    }


    const section=
        document.createElement(
            'section'
        );

    section.className=
        'teacher-media-selected';


    //------------------------------------
    // Heading
    //------------------------------------

    const heading=
        document.createElement(
            'div'
        );

    heading.className=
        'teacher-media-selected-heading';


    const title=
        document.createElement(
            'strong'
        );

    title.textContent=
        'Selected Media';


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

    section.appendChild(
        heading
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


    section.appendChild(
        preview
    );


    //------------------------------------
    // Future Editor Area
    //------------------------------------

    const editor=
        document.createElement(
            'div'
        );

    editor.className=
        'teacher-media-controls-placeholder';

    editor.textContent=
        'Media type and student tagging will go here.';


    section.appendChild(
        editor
    );


    container.appendChild(
        section
    );
}
