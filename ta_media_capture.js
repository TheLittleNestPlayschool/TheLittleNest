import{
getMediaSession
}from'./ta_media_session.js';

import{
createMediaInput,
createUploadButton,
createMediaInstruction,
createSaveButton
}from'./ta_media_capture_controls.js';

import{
createMediaGrid
}from'./ta_media_capture_grid.js';

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

/*  Nothing Selected Yet */

if(
    !session.items.length
){
    return;
}

/*  Media Instructions */

container.appendChild(
    createMediaInstruction(
        session
    )
);

/*  Selected Media */

container.appendChild(
    createMediaGrid(
        actions
    )
);

/*  Save Media */

const hasUnsavedItems=
session.items.some(
    item=>{
        return(
            item.saveStatus!==
            'saved'
        );
    }
);

if(!hasUnsavedItems){
    return;
}

const saveButton=
createSaveButton(
    session,
    actions
);

if(saveButton){
    container.appendChild(
        saveButton
    );
}
