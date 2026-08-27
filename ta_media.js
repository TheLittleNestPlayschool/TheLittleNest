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
failMediaSave,
clearMediaSaveProgress
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
uploadMediaBatch
}from'./ta_media_upload.js';


const SAVE_PROGRESS_REFRESH_MS=
100;

const SAVE_COMPLETE_DISPLAY_MS=
1800;

let saveProgressTimer=
null;

let saveCompleteTimer=
null;


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
// Save Progress Overlay
//------------------------------------

renderMediaSaveOverlay(
container,
session
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
// Clear Old Completion Timer
//------------------------------------

clearSaveCompleteTimer();


//------------------------------------
// Start Batch
//------------------------------------

startMediaSave();


//------------------------------------
// Mark All Items Saving
//------------------------------------

manifest.forEach(
item=>{
markMediaItemSaving(
item.clientMediaId
);
}
);


renderCurrentView();

startSaveProgressUpdates();


try{

//------------------------------------
// Upload Entire Batch
//------------------------------------

await uploadMediaBatch(
manifest
);


//------------------------------------
// Mark All Items Saved
//------------------------------------

manifest.forEach(
item=>{
markMediaItemSaved(
item.clientMediaId
);
}
);


//------------------------------------
// Batch Complete
//------------------------------------

finishMediaSave();

stopSaveProgressUpdates();

renderCurrentView();

scheduleSaveCompleteClear();


}catch(error){
const errorMessage=
error instanceof Error
?error.message
:'Unable to save media.';


console.error(
'Media batch save failed:',
error
);


//------------------------------------
// Mark Unsaved Items As Error
//------------------------------------

manifest.forEach(
item=>{
const currentItem=
session.items.find(
sessionItem=>{
return(
sessionItem.id===
item.clientMediaId
);
}
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
}
);


//------------------------------------
// Fail Batch
//------------------------------------

failMediaSave(
errorMessage
);


stopSaveProgressUpdates();

renderCurrentView();

scheduleSaveCompleteClear(
3000
);
}
}


/*==================================================*
*Save Progress Overlay*
*==================================================*/

function renderMediaSaveOverlay(
container,
session
){
const progress=
session.saveProgress||
{};

if(!progress.visible){
return;
}


const overlay=
document.createElement(
'div'
);

overlay.className=
'teacher-media-save-overlay';

overlay.dataset.stage=
progress.stage||
'idle';


const panel=
document.createElement(
'div'
);

panel.className=
'teacher-media-save-panel';


const indicator=
document.createElement(
'div'
);

indicator.className=
'teacher-media-save-indicator';


if(
progress.stage===
'complete'
){
indicator.textContent=
'✓';

}else if(
progress.stage===
'error'
){
indicator.textContent=
'!';

}else{
const spinner=
document.createElement(
'span'
);

spinner.className=
'teacher-media-save-spinner';

indicator.appendChild(
spinner
);
}


const title=
document.createElement(
'h3'
);

title.className=
'teacher-media-save-title';

title.textContent=
getSaveProgressTitle(
progress.stage
);


const message=
document.createElement(
'p'
);

message.className=
'teacher-media-save-message';

message.textContent=
progress.message||
'Working...';


panel.appendChild(
indicator
);

panel.appendChild(
title
);

panel.appendChild(
message
);


overlay.appendChild(
panel
);

container.appendChild(
overlay
);
}


function updateMediaSaveOverlay(){
const session=
getMediaSession();

const progress=
session.saveProgress||
{};


const overlay=
document.querySelector(
'.teacher-media-save-overlay'
);


if(
!progress.visible
){
if(overlay){
overlay.remove();
}

return;
}


if(!overlay){
renderCurrentView();

return;
}


overlay.dataset.stage=
progress.stage||
'idle';


const title=
overlay.querySelector(
'.teacher-media-save-title'
);

const message=
overlay.querySelector(
'.teacher-media-save-message'
);

const indicator=
overlay.querySelector(
'.teacher-media-save-indicator'
);


if(title){
title.textContent=
getSaveProgressTitle(
progress.stage
);
}


if(message){
message.textContent=
progress.message||
'Working...';
}


if(indicator){
if(
progress.stage===
'complete'
){
indicator.innerHTML=
'✓';

}else if(
progress.stage===
'error'
){
indicator.innerHTML=
'!';

}else if(
!indicator.querySelector(
'.teacher-media-save-spinner'
)
){
indicator.innerHTML=
'<span class="teacher-media-save-spinner"></span>';
}
}
}


function getSaveProgressTitle(
stage
){
switch(stage){

case'complete':
return'Media Saved';

case'error':
return'Unable to Save';

case'saving':
return'Saving Media';

case'uploading':
return'Uploading Media';

case'preparing':
return'Preparing Media';

default:
return'Saving Media';
}
}


/*==================================================*
*Progress Updates*
*==================================================*/

function startSaveProgressUpdates(){
stopSaveProgressUpdates();

saveProgressTimer=
window.setInterval(
()=>{
updateMediaSaveOverlay();
},
SAVE_PROGRESS_REFRESH_MS
);
}


function stopSaveProgressUpdates(){
if(
saveProgressTimer===
null
){
return;
}

window.clearInterval(
saveProgressTimer
);

saveProgressTimer=
null;
}


function scheduleSaveCompleteClear(
delay=
SAVE_COMPLETE_DISPLAY_MS
){
clearSaveCompleteTimer();

saveCompleteTimer=
window.setTimeout(
()=>{
saveCompleteTimer=
null;

clearMediaSaveProgress();

renderCurrentView();
},
delay
);
}


function clearSaveCompleteTimer(){
if(
saveCompleteTimer===
null
){
return;
}

window.clearTimeout(
saveCompleteTimer
);

saveCompleteTimer=
null;
}
