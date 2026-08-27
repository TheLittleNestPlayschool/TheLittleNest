import{
getState
}from'./ta_state.js';

import{
prepareMediaUpload,
saveMediaRecords
}from'./ta_media_data.js';

import{
setMediaSaveProgress
}from'./ta_media_session.js';


/*==================================================*
*Upload Media Batch*
*==================================================*/

export async function uploadMediaBatch(
manifest
){
const state=
getState();


if(
!Array.isArray(
manifest
)||
!manifest.length
){
throw new Error(
'No media items are available to upload.'
);
}


//------------------------------------
// Prepare Entire Batch
//------------------------------------

setMediaSaveProgress({
stage:'preparing',
message:'Preparing media...',
current:0
});


const prepared=
await prepareMediaUpload(
manifest,
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
// Set Upload Progress
//------------------------------------

setMediaSaveProgress({
stage:'uploading',
message:
    `Uploading 1 of ${uploadTargets.length}...`,
current:0,
total:uploadTargets.length
});


//------------------------------------
// Match Files To Upload Targets
//------------------------------------

const mediaRecords=[];


for(
let uploadIndex=0;
uploadIndex<uploadTargets.length;
uploadIndex+=1
){
    const uploadTarget=
        uploadTargets[
            uploadIndex
        ];


    const manifestItem=
        findManifestItem(
            manifest,
            uploadTarget
        );


    if(!manifestItem){
        throw new Error(
            `Unable to locate media file for ${uploadTarget.file_name||'upload target'}.`
        );
    }


    //--------------------------------
    // Show Current Upload
    //--------------------------------

    setMediaSaveProgress({
        stage:'uploading',
        message:
            `Uploading ${uploadIndex+1} of ${uploadTargets.length}...`,
        current:uploadIndex+1,
        total:uploadTargets.length
    });


    //--------------------------------
    // Upload File To AWS
    //--------------------------------

    await uploadFileToAws(
        manifestItem.file,
        uploadTarget.signed_url
    );


    //--------------------------------
    // Build Xano Save Record
    //--------------------------------

    mediaRecords.push(
        buildMediaRecord(
            uploadTarget,
            manifestItem
        )
    );
}


//------------------------------------
// Save Entire Batch To Xano
//------------------------------------

if(!mediaRecords.length){
throw new Error(
'No uploaded media records are available to save.'
);
}


setMediaSaveProgress({
stage:'saving',
message:'Saving media records...',
current:uploadTargets.length,
total:uploadTargets.length
});


const saveResult=
await saveMediaRecords(
mediaRecords,
state
);


return{
uploadTargets,
mediaRecords,
saveResult
};
}


/*==================================================*
*Match Manifest Item*
*==================================================*/

function findManifestItem(
manifest,
uploadTarget
){
const mediaGroupId=
String(
uploadTarget?.media_group_id||
''
);


if(mediaGroupId){
const groupMatch=
manifest.find(
item=>{
return(
String(
item?.clientMediaId||
item?.id||
''
)===
mediaGroupId
);
}
);


if(groupMatch){
return groupMatch;
}
}


//------------------------------------
// Fallback To File Name
//------------------------------------

const fileName=
uploadTarget?.file_name||
'';


if(!fileName){
return null;
}


return(
manifest.find(
item=>{
return(
item?.file?.name===
fileName
);
}
)||
null
);
}


/*==================================================*
*Build Save Record*
*==================================================*/

function buildMediaRecord(
uploadTarget,
manifestItem
){
return{
student_id:
uploadTarget.student_id,

parent_id:
uploadTarget.parent_id,

session_id:
uploadTarget.session_id||
manifestItem.sessionId,

media_group_id:
uploadTarget.media_group_id||
manifestItem.clientMediaId||
manifestItem.id||
'',

media_type:
uploadTarget.media_type||
manifestItem.mediaType||
'',

media_kind:
uploadTarget.media_kind||
manifestItem.mediaKind||
'',

file_name:
uploadTarget.file_name||
manifestItem.file?.name||
'',

content_type:
uploadTarget.content_type||
manifestItem.file?.type||
'',

file_size:
Number(
uploadTarget.file_size||
manifestItem.file?.size||
0
),

file_key:
uploadTarget.file_key
};
}


/*==================================================*
*AWS Upload*
*==================================================*/

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
