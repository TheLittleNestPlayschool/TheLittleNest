import{
getState
}from'./ta_state.js';

import{
getWorkspace,
clearWorkspace
}from'./ta_ui.js';

import{
getMediaSession,
setAvailableSessions,
selectMediaSession,
applyMediaTaskData,
startMediaSave,
markMediaItemSaving,
markMediaItemSaved,
markMediaItemSaveError,
finishMediaSave,
failMediaSave
}from'./ta_media_session.js';

import{
loadMediaSessions,
loadMediaTaskData
}from'./ta_media_data.js';

import{
renderMediaSessionSelect
}from'./ta_media_session_select.js';

import{
renderMediaCapture
}from'./ta_media_capture.js';

import{
renderMediaPreview
}from'./ta_media_preview.js';

import{
uploadMediaItem
}from'./ta_media_upload.js';


export async function renderMediaModule(
taskContext=null
){
const session=
getMediaSession();

session.taskContext=
taskContext;

clearWorkspace();


//------------------------------------
// Load Session Choices
//------------------------------------

if(
!session.availableSessions.length&&
!session.isLoadingSessions
){
session.isLoadingSessions=
true;

session.sessionLoadError=
null;

renderCurrentView();

try{
const data=
await loadMediaSessions(
getState()
);

setAvailableSessions(
    data.sessions
);

}catch(error){
console.error(
'Media sessions load failed:',
error
);

session.sessionLoadError=
    error instanceof Error
        ?error.message
        :'Unable to load sessions.';

}finally{
session.isLoadingSessions=
false;

renderCurrentView();
}

return;
}


renderCurrentView();
}


export function renderCurrentView(){
const workspace=
getWorkspace();

if(!workspace){
return;
}


const session=
getMediaSession();


workspace.innerHTML='';


//------------------------------------
// Main Container
//------------------------------------

const container=
document.createElement(
'section'
);

container.className=
'teacher-media';


//------------------------------------
// Loading Sessions
//------------------------------------

if(
session.isLoadingSessions
){
const message=
document.createElement(
'p'
);

message.className=
'teacher-media-message';

message.textContent=
'Loading sessions...';

container.appendChild(
message
);

workspace.appendChild(
container
);

return;
}


//------------------------------------
// Session Load Error
//------------------------------------

if(
session.sessionLoadError
){
const message=
document.createElement(
'p'
);

message.className=
'teacher-media-message teacher-media-message-error';

message.textContent=
session.sessionLoadError;

container.appendChild(
message
);

workspace.appendChild(
container
);

return;
}


//------------------------------------
// Select Session
//------------------------------------

if(
!session.sessionId
){
renderMediaSessionSelect(
container,
{
sessions:
session.availableSessions,

selectedSession:
    session.selectedSession,

actions:{
    selectSession:
        handleSessionSelection
}
}
);

workspace.appendChild(
container
);

return;
}


//------------------------------------
// Loading Media Task
//------------------------------------

if(
session.isLoadingTask
){
const message=
document.createElement(
'p'
);

message.className=
'teacher-media-message';

message.textContent=
'Preparing media task...';

container.appendChild(
message
);

workspace.appendChild(
container
);

return;
}


//------------------------------------
// Media Task Load Error
//------------------------------------

if(
session.taskLoadError
){
const message=
document.createElement(
'p'
);

message.className=
'teacher-media-message teacher-media-message-error';

message.textContent=
session.taskLoadError;

container.appendChild(
message
);

workspace.appendChild(
container
);

return;
}


//------------------------------------
// Media Capture
//------------------------------------

renderMediaCapture(
container,
{
refresh:
    renderCurrentView,

saveMedia:
    handleMediaSave
}
);


//------------------------------------
// Media Editor Overlay
//------------------------------------

renderMediaPreview(
container,
{
refresh:
    renderCurrentView
}
);


//------------------------------------
// Render
//------------------------------------

workspace.appendChild(
container
);
}


async function handleSessionSelection(
selectedSession
){
if(!selectedSession){
return;
}


const session=
getMediaSession();


selectMediaSession(
selectedSession
);


session.isLoadingTask=
true;

session.taskLoadError=
null;


renderCurrentView();


try{
const data=
await loadMediaTaskData(
session.sessionId,
getState()
);

applyMediaTaskData(
data
);

}catch(error){
console.error(
'Media task load failed:',
error
);

session.taskLoadError=
error instanceof Error
?error.message
:'Unable to prepare media task.';

}finally{
session.isLoadingTask=
false;

renderCurrentView();
}
}


/*==================================================*
*Media Save*
*==================================================*/

async function handleMediaSave(
manifest
){
const session=
getMediaSession();


if(
session.isSaving
){
return;
}


if(
!Array.isArray(
manifest
)||
!manifest.length
){
return;
}


//------------------------------------
// Validate Manifest
//------------------------------------

const invalidItem=
manifest.find(
item=>{
return(
!item?.clientMediaId||
!item?.sessionId||
!item?.file||
!item?.mediaKind||
!item?.mediaType||
!Array.isArray(
item?.studentIds
)||
!item.studentIds.length||
item.infoComplete!==true
);
}
);


if(invalidItem){
console.error(
'ta_media: invalid save manifest item',
invalidItem
);

window.alert(
'One or more media items are incomplete.'
);

return;
}


//------------------------------------
// Avoid Saving Completed Batch Again
//------------------------------------

const alreadySaved=
session.items.length>0&&
session.items.every(
item=>{
return(
item.saveStatus===
'saved'
);
}
);


if(alreadySaved){
return;
}


//------------------------------------
// Start Batch
//------------------------------------

startMediaSave();

renderCurrentView();


try{

//------------------------------------
// Process Media One At A Time
//------------------------------------

for(
const manifestItem
of manifest
){
    const mediaId=
        manifestItem.clientMediaId;


    //--------------------------------
    // Saving
    //--------------------------------

    markMediaItemSaving(
        mediaId
    );

    renderCurrentView();


    try{

        //--------------------------------
        // Upload Item
        //--------------------------------

        await uploadMediaItem(
            {
                ...manifestItem,

                id:
                    mediaId
            },
            manifestItem.sessionId,
            mediaId
        );


        //--------------------------------
        // Saved
        //--------------------------------

        markMediaItemSaved(
            mediaId
        );

        renderCurrentView();


    }catch(error){
        const errorMessage=
            error instanceof Error
                ?error.message
                :'Unable to save media.';


        console.error(
            'Media item save failed:',
            {
                mediaId,
                error
            }
        );


        markMediaItemSaveError(
            mediaId,
            errorMessage
        );


        throw error;
    }
}


//------------------------------------
// Batch Complete
//------------------------------------

finishMediaSave();

renderCurrentView();


}catch(error){
const errorMessage=
error instanceof Error
?error.message
:'Unable to save media.';


failMediaSave(
errorMessage
);


console.error(
'Media save failed:',
error
);


renderCurrentView();
}
}
