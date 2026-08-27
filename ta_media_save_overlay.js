import{
getMediaSession
}from'./ta_media_session.js';

const SAVE_PROGRESS_REFRESH_MS=100;

let saveProgressTimer=null;
let refreshView=null;

/*  Configure Overlay */

export function configureMediaSaveOverlay({
refresh
}={}){
refreshView=
typeof refresh==='function'
?refresh
:null;
}

/*  Render Overlay */

export function renderMediaSaveOverlay(
container
){
const session=getMediaSession();
const progress=session.saveProgress||{};

if(!progress.visible){
return;
}

const overlay=document.createElement(
'div'
);

overlay.className=
'teacher-media-save-overlay';

overlay.dataset.stage=
progress.stage||
'idle';

const panel=document.createElement(
'div'
);

panel.className=
'teacher-media-save-panel';

const indicator=document.createElement(
'div'
);

indicator.className=
'teacher-media-save-indicator';

if(
progress.stage===
'complete'
){
indicator.textContent='✓';

}else if(
progress.stage===
'error'
){
indicator.textContent='!';

}else{
const spinner=document.createElement(
'span'
);

spinner.className=
'teacher-media-save-spinner';

indicator.appendChild(
spinner
);
}

const title=document.createElement(
'h3'
);

title.className=
'teacher-media-save-title';

title.textContent=
getSaveProgressTitle(
progress.stage
);

const message=document.createElement(
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

/*  Progress Updates */

export function startMediaSaveProgressUpdates(){
stopMediaSaveProgressUpdates();

saveProgressTimer=
window.setInterval(
()=>{
updateMediaSaveOverlay();
},
SAVE_PROGRESS_REFRESH_MS
);
}

export function stopMediaSaveProgressUpdates(){
if(
saveProgressTimer===
null
){
return;
}

window.clearInterval(
saveProgressTimer
);

saveProgressTimer=null;
}

function updateMediaSaveOverlay(){
const session=getMediaSession();
const progress=session.saveProgress||{};

const overlay=document.querySelector(
'.teacher-media-save-overlay'
);

if(!progress.visible){
if(overlay){
overlay.remove();
}

return;
}

if(!overlay){
refresh();

return;
}

overlay.dataset.stage=
progress.stage||
'idle';

const title=overlay.querySelector(
'.teacher-media-save-title'
);

const message=overlay.querySelector(
'.teacher-media-save-message'
);

const indicator=overlay.querySelector(
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
indicator.innerHTML='✓';

}else if(
progress.stage===
'error'
){
indicator.innerHTML='!';

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

/*  Progress Title */

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

/*  Refresh */

function refresh(){
if(refreshView){
refreshView();
}
}
