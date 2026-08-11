import{
getMediaSession,
removeMediaItem,
selectMediaItem
}from'./ta_media_session.js';


export function createMediaGrid(
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
// Delete Control
//------------------------------------

preview.appendChild(
    createDeleteControl(
        item,
        actions
    )
);


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


function createDeleteControl(
item,
actions
){
const control=
document.createElement(
'span'
);


control.className=
'teacher-media-delete';

control.textContent=
'×';

control.setAttribute(
    'role',
    'button'
);

control.setAttribute(
    'tabindex',
    '0'
);

control.setAttribute(
    'aria-label',
    'Remove selected media'
);


//------------------------------------
// Delete
//------------------------------------

const removeItem=
event=>{
    event.preventDefault();
    event.stopPropagation();


    removeMediaItem(
        item.id
    );


    actions.refresh();
};


control.addEventListener(
    'click',
    removeItem
);


control.addEventListener(
    'keydown',
    event=>{
        if(
            event.key!=='Enter'&&
            event.key!==' '
        ){
            return;
        }


        removeItem(
            event
        );
    }
);


return control;
}
