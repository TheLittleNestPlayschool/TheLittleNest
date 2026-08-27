import{
getMediaSession,
startMediaSave,
markMediaItemSaving,
markMediaItemSaved,
markMediaItemSaveError,
finishMediaSave,
failMediaSave,
clearMediaSaveProgress,
clearSavedMedia
}from'./ta_media_session.js';

import{
uploadMediaBatch
}from'./ta_media_upload.js';

const SAVE_COMPLETE_DISPLAY_MS=1800;
const SAVE_ERROR_DISPLAY_MS=3000;

let saveCompleteTimer=null;
let refreshView=null;

/*  Configure Media Save */

export function configureMediaSave({
refresh
}={}){
refreshView=
typeof refresh==='function'
?refresh
:null;
}

/*  Handle Media Save */

export async function handleMediaSave(
manifest
){
const session=getMediaSession();

if(session.isSaving){
return;
}

if(
!Array.isArray(manifest)||
!manifest.length
){
return;
}

const invalidItem=
findInvalidManifestItem(
manifest
);

if(invalidItem){
console.error(
'ta_media_save: invalid save manifest item',
invalidItem
);

window.alert(
'One or more media items are incomplete.'
);

return;
}

if(allMediaSaved(session)){
return;
}

clearSaveCompleteTimer();
startMediaSave();

manifest.forEach(item=>{
markMediaItemSaving(
item.clientMediaId
);
});

refresh();

try{
await uploadMediaBatch(
manifest
);

manifest.forEach(item=>{
markMediaItemSaved(
item.clientMediaId
);
});

finishMediaSave();
refresh();

scheduleSaveCompleteClear({
delay:SAVE_COMPLETE_DISPLAY_MS,
clearMedia:true
});

}catch(error){
const errorMessage=
error instanceof Error
?error.message
:'Unable to save media.';

console.error(
'Media batch save failed:',
error
);

manifest.forEach(item=>{
const currentItem=
session.items.find(
sessionItem=>
sessionItem.id===
item.clientMediaId
);

if(
currentItem?.saveStatus===
'saved'
){
return;
}

markMediaItemSaveError(
item.clientMediaId,
errorMessage
);
});

failMediaSave(
errorMessage
);

refresh();

scheduleSaveCompleteClear({
delay:SAVE_ERROR_DISPLAY_MS,
clearMedia:false
});
}
}

/*  Validate Manifest */

function findInvalidManifestItem(
manifest
){
return manifest.find(item=>{
return(
!item?.clientMediaId||
!item?.sessionId||
!item?.file||
!item?.mediaKind||
!item?.mediaType||
!Array.isArray(item?.studentIds)||
!item.studentIds.length||
item.infoComplete!==true
);
});
}

function allMediaSaved(
session
){
return(
session.items.length>0&&
session.items.every(
item=>
item.saveStatus===
'saved'
)
);
}

/*  Save Completion */

function scheduleSaveCompleteClear({
delay,
clearMedia
}){
clearSaveCompleteTimer();

saveCompleteTimer=
window.setTimeout(
()=>{
saveCompleteTimer=null;

clearMediaSaveProgress();

if(clearMedia){
clearSavedMedia();
}

refresh();
},
delay
);
}

function clearSaveCompleteTimer(){
if(saveCompleteTimer===null){
return;
}

window.clearTimeout(
saveCompleteTimer
);

saveCompleteTimer=null;
}

/*  Refresh */

function refresh(){
if(refreshView){
refreshView();
}
}
