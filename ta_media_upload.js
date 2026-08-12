import{
getState
}from'./ta_state.js';

import{
prepareMediaUpload,
saveMediaRecord
}from'./ta_media_data.js';


export async function uploadMediaItem(
mediaItem,
sessionId,
mediaGroupId
){
const state=
getState();


//------------------------------------
// Prepare Upload Targets
//------------------------------------

const prepared=
await prepareMediaUpload(
mediaItem,
sessionId,
mediaGroupId,
state
);


const uploadTargets=
Array.isArray(
prepared?.uploadTargets
)
?prepared.uploadTargets
:[];


if(!uploadTargets.length){
throw new Error(
'No upload targets were returned.'
);
}


//------------------------------------
// Upload For Each Student
//------------------------------------

const savedRecords=[];


for(
const uploadTarget
of uploadTargets
){
    //--------------------------------
    // Upload File To AWS
    //--------------------------------

    await uploadFileToAws(
        mediaItem.file,
        uploadTarget.signed_url
    );


    //--------------------------------
    // Save Xano Record
    //--------------------------------

    const savedRecord=
        await saveMediaRecord(
            mediaItem,
            uploadTarget,
            sessionId,
            mediaGroupId,
            state
        );


    savedRecords.push(
        savedRecord
    );
}


return{
mediaItemId:
mediaItem.id,

mediaGroupId,

savedRecords
};
}


async function uploadFileToAws(
file,
signedUrl
){
if(
!file||
!signedUrl
){
throw new Error(
'Media upload information is incomplete.'
);
}


const response=
await fetch(
signedUrl,
{
method:
'PUT',

body:
file
}
);


if(!response.ok){
throw new Error(
`AWS upload failed with status ${response.status}.`
);
}


return true;
}
