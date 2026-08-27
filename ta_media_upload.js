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

import{
createMediaThumbnail
}from'./ta_media_thumbnail.js';

/*  Upload Media Batch */

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

/*  Prepare Entire Batch */

setMediaSaveProgress({
stage:'preparing',
message:'Preparing media...',
current:0
});

const thumbnails=
await createThumbnails(
manifest
);

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

const mediaRecords=
Array.isArray(
prepared?.mediaRecords
)
?prepared.mediaRecords
:[];

if(!uploadTargets.length){
throw new Error(
'No upload targets were returned.'
);
}

if(!mediaRecords.length){
throw new Error(
'No media records were returned.'
);
}

/*  Upload Physical Media */

setMediaSaveProgress({
stage:'uploading',
message:
`Uploading 1 of ${uploadTargets.length}...`,
current:0,
total:uploadTargets.length
});

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

setMediaSaveProgress({
stage:'uploading',
message:
`Uploading ${uploadIndex+1} of ${uploadTargets.length}...`,
current:uploadIndex+1,
total:uploadTargets.length
});

await uploadFileToAws(
manifestItem.file,
uploadTarget.signed_url
);

/*  Upload Thumbnail */

const thumbnail=
thumbnails.get(
String(
uploadTarget.media_group_id||
''
)
);

if(
thumbnail&&
uploadTarget.thumbnail_signed_url
){
await uploadFileToAws(
thumbnail,
uploadTarget.thumbnail_signed_url
);
}
}

/*  Save Student Media Records */

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

/*  Create Thumbnails */

async function createThumbnails(
manifest
){
const thumbnails=
new Map();

for(
const item
of manifest
){
const mediaGroupId=
String(
item?.clientMediaId||
item?.id||
''
);

if(!mediaGroupId){
continue;
}

const thumbnail=
await createMediaThumbnail(
item.file
);

if(!thumbnail){
continue;
}

thumbnails.set(
mediaGroupId,
thumbnail
);
}

return thumbnails;
}

/*  Match Manifest Item */

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
manifest.find(item=>{
return(
String(
item?.clientMediaId||
item?.id||
''
)===
mediaGroupId
);
});

if(groupMatch){
return groupMatch;
}
}

const fileName=
uploadTarget?.file_name||
'';

if(!fileName){
return null;
}

return(
manifest.find(item=>{
return(
item?.file?.name===
fileName
);
})
||null
);
}

/*  AWS Upload */

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
method:'PUT',
body:file
}
);

if(!response.ok){
throw new Error(
`AWS upload failed with status ${response.status}.`
);
}

return true;
}
