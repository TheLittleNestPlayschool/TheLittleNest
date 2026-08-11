import{
    getMediaSession,
    addMediaFiles,
    selectMediaItem
}from'./ta_media_session.js';


export function renderMediaCapture(
    container,
    actions
){
    const input=
        createMediaInput(
            actions
        );

    container.appendChild(
        input
    );

    container.appendChild(
        createUploadButton(
            input
        )
    );

    const session=
        getMediaSession();

    if(
        !session.items.length
    ){
        container.appendChild(
            createEmptyState()
        );

        return;
    }

    container.appendChild(
        createMediaGrid(
            actions
        )
    );
}


function createMediaInput(
    actions
){
    const input=
        document.createElement(
            'input'
        );

    input.type=
        'file';

    input.accept=
        'image/*,video/*';

    input.multiple=
        true;

    input.className=
        'teacher-media-input';

    input.addEventListener(
        'change',
        ()=>{
            const files=
                Array.from(
                    input.files||[]
                );

            addMediaFiles(
                files
            );

            input.value='';

            actions.refresh();
        }
    );

    return input;
}


function createUploadButton(
    input
){
    const button=
        document.createElement(
            'button'
        );

    button.type=
        'button';

    button.className=
        'teacher-media-upload-button';

    button.textContent=
        'Upload Media';

    button.addEventListener(
        'click',
        ()=>{
            input.click();
        }
    );

    return button;
}


function createEmptyState(){
    const empty=
        document.createElement(
            'div'
        );

    empty.className=
        'teacher-media-empty';

    const icon=
        document.createElement(
            'span'
        );

    icon.className=
        'teacher-media-empty-icon';

    icon.textContent=
        '📸';

    const text=
        document.createElement(
            'p'
        );

    text.textContent=
        'Selected media will appear here.';

    empty.appendChild(
        icon
    );

    empty.appendChild(
        text
    );

    return empty;
}


function createMediaGrid(
    actions
){
    const session=
        getMediaSession();

    const grid=
        document.createElement(
            'div'
        );

    grid.className=
        'teacher-media-grid';

    session.items.forEach(
        item=>{
            grid.appendChild(
                createMediaCard(
                    item,
                    actions
                )
            );
        }
    );

    return grid;
}


function createMediaCard(
    item,
    actions
){
    const session=
        getMediaSession();

    const button=
        document.createElement(
            'button'
        );

    button.type=
        'button';

    button.className=
        'teacher-media-card';

    if(
        item.id===
        session.activeMediaId
    ){
        button.classList.add(
            'is-active'
        );
    }

    const preview=
        document.createElement(
            'div'
        );

    preview.className=
        'teacher-media-card-preview';

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

        video.muted=
            true;

        video.playsInline=
            true;

        video.preload=
            'metadata';

        preview.appendChild(
            video
        );

        const mark=
            document.createElement(
                'span'
            );

        mark.className=
            'teacher-media-video-mark';

        mark.textContent=
            '▶';

        preview.appendChild(
            mark
        );

    }else{
        const image=
            document.createElement(
                'img'
            );

        image.src=
            item.previewUrl;

        image.alt=
            'Selected media';

        preview.appendChild(
            image
        );
    }

    button.appendChild(
        preview
    );

    button.addEventListener(
        'click',
        ()=>{
            selectMediaItem(
                item.id
            );

            actions.refresh();
        }
    );

    return button;
}
