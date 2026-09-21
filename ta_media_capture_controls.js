
import{
addMediaFiles,
buildMediaSaveManifest
}from'./ta_media_session.js';


export function createMediaInput(
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


export function createUploadButton(
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


export function createMediaInstruction(
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


title.textContent=
remaining===0
    ?'Media Ready'
    :'Finish Your Media';


container.appendChild(
    title
);


//------------------------------------
// Separator
//------------------------------------

const separator=
document.createElement(
'span'
);


separator.className=
'teacher-media-instruction-separator';

separator.textContent=
' · ';


container.appendChild(
    separator
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


export function createSaveButton(
session,
actions
){
if(
    !session.items.length
){
    return null;
}


const allReady=
    session.items.every(
        item=>{
            return(
                item.infoComplete===
                true
            );
        }
    );


if(!allReady){
    return null;
}


const button=
document.createElement(
'button'
);


button.type=
'button';

button.className=
'teacher-media-save-button';


if(session.isSaving){
    button.disabled=
        true;

    button.textContent=
        getSavingLabel(
            session
        );

}else{
    button.textContent=
        'Save Media';
}


//------------------------------------
// Save
//------------------------------------

button.addEventListener(
'click',
()=>{
    if(session.isSaving){
        return;
    }


    const manifest=
        buildMediaSaveManifest();


    if(!manifest.length){
        return;
    }


    if(
        typeof actions.saveMedia===
        'function'
    ){
        actions.saveMedia(
            manifest
        );

        return;
    }


    console.log(
        'Media save manifest:',
        manifest
    );
}
);


return button;
}


function getSavingLabel(
session
){
const completed=
session.saveProgress
?.completed||
0;


const total=
session.saveProgress
?.total||
session.items.length;


return(
    `Saving Media ${completed} of ${total}`
);
}
