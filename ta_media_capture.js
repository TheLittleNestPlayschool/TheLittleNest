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


//------------------------------------
// Nothing Selected Yet
//------------------------------------

if(
    !session.items.length
){
    return;
}


//------------------------------------
// Media Instructions
//------------------------------------

container.appendChild(
    createMediaInstruction(
        session
    )
);


//------------------------------------
// Selected Media
//------------------------------------

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


        if(!files.length){
            return;
        }


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


function createMediaInstruction(
session
){
const container=
    document.createElement(
        'div'
    );


container.className=
    'teacher-media-instruction';


const total=
    session.items.length;


const completed=
    session.items.filter(
        item=>{
            return(
                item.infoComplete===
                true
            );
        }
    ).length;


const remaining=
    total-
    completed;


//------------------------------------
// Title
//------------------------------------

const title=
    document.createElement(
        'strong'
    );


if(remaining===0){
    title.textContent=
        'Media Ready';

}else{
    title.textContent=
        'Finish Your Media';
}


container.appendChild(
    title
);


//------------------------------------
// Message
//------------------------------------

const message=
    document.createElement(
        'span'
    );


if(remaining===0){
    message.textContent=
        `${completed} of ${total} ready.`;

}else if(completed===0){
    message.textContent=
        'Tap each photo or video to select the type and students.';

}else{
    message.textContent=
        `${completed} of ${total} ready. Tap the remaining ${remaining} to finish.`;
}


container.appendChild(
    message
);


return container;
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


//------------------------------------
// Thumbnail
//------------------------------------

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


//------------------------------------
// Info Badge
//------------------------------------

if(
    item.infoComplete
){
    const info=
        document.createElement(
            'span'
        );


    info.className=
        'teacher-media-info-badge';

    info.textContent=
        'i';


    preview.appendChild(
        info
    );
}


button.appendChild(
    preview
);


//------------------------------------
// Open Editor
//------------------------------------

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
