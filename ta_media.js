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
applyMediaTaskData
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
configureMediaSave,
handleMediaSave
}from'./ta_media_save.js';

import{
configureMediaSaveOverlay,
renderMediaSaveOverlay,
startMediaSaveProgressUpdates,
stopMediaSaveProgressUpdates
}from'./ta_media_save_overlay.js';

/*  Render Media Module */

export async function renderMediaModule(
taskContext=null
){
const session=getMediaSession();

session.taskContext=
taskContext;

configureMediaSave({
refresh:renderCurrentView
});

configureMediaSaveOverlay({
refresh:renderCurrentView
});

clearWorkspace();

/*  Load Session Choices */

if(
!session.availableSessions.length&&
!session.isLoadingSessions
){
session.isLoadingSessions=true;
session.sessionLoadError=null;

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
session.isLoadingSessions=false;
renderCurrentView();
}

return;
}

renderCurrentView();
}

/*  Render Current View */

export function renderCurrentView(){
const workspace=
getWorkspace();

if(!workspace){
return;
}

const session=
getMediaSession();

workspace.innerHTML='';

const container=
document.createElement(
'section'
);

container.className=
'teacher-media';

/*  Loading Sessions */

if(session.isLoadingSessions){
renderMessage(
container,
'Loading sessions...'
);

workspace.appendChild(
container
);

return;
}

/*  Session Load Error */

if(session.sessionLoadError){
renderMessage(
container,
session.sessionLoadError,
true
);

workspace.appendChild(
container
);

return;
}

/*  Select Session */

if(!session.sessionId){
renderMediaSessionSelect(
container,
{
sessions:session.availableSessions,
selectedSession:session.selectedSession,
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

/*  Loading Media Task */

if(session.isLoadingTask){
renderMessage(
container,
'Preparing media task...'
);

workspace.appendChild(
container
);

return;
}

/*  Media Task Load Error */

if(session.taskLoadError){
renderMessage(
container,
session.taskLoadError,
true
);

workspace.appendChild(
container
);

return;
}

/*  Media Capture */

renderMediaCapture(
container,
{
refresh:renderCurrentView,
saveMedia:saveMedia
}
);

/*  Media Editor Overlay */

renderMediaPreview(
container,
{
refresh:renderCurrentView
}
);

/*  Save Progress Overlay */

renderMediaSaveOverlay(
container
);

/*  Render */

workspace.appendChild(
container
);
}

/*  Session Selection */

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

session.isLoadingTask=true;
session.taskLoadError=null;

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
session.isLoadingTask=false;
renderCurrentView();
}
}

/*  Save Media */

async function saveMedia(
manifest
){
startMediaSaveProgressUpdates();

try{
await handleMediaSave(
manifest
);

}finally{
stopMediaSaveProgressUpdates();
}
}

/*  Message */

function renderMessage(
container,
message,
isError=false
){
const element=
document.createElement(
'p'
);

element.className=
'teacher-media-message';

if(isError){
element.classList.add(
'teacher-media-message-error'
);
}

element.textContent=
message;

container.appendChild(
element
);
}
