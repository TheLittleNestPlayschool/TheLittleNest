/*  Media Thumbnail Helpers */

const IMAGE_THUMBNAIL_MAX_WIDTH=500;
const IMAGE_THUMBNAIL_QUALITY=.8;
const VIDEO_THUMBNAIL_TIME=1;

/*  Create Thumbnail */

export async function createMediaThumbnail(
file
){
if(!file){
throw new Error(
'Media file is required.'
);
}

if(
file.type?.startsWith(
'image/'
)
){
return createImageThumbnail(
file
);
}

if(
file.type?.startsWith(
'video/'
)
){
return createVideoThumbnail(
file
);
}

return null;
}

/*  Image Thumbnail */

export async function createImageThumbnail(
file
){
const image=
await loadImageFromFile(
file
);

const size=
getThumbnailSize(
image.naturalWidth,
image.naturalHeight
);

const canvas=
document.createElement(
'canvas'
);

canvas.width=
size.width;

canvas.height=
size.height;

const context=
canvas.getContext(
'2d'
);

context.drawImage(
image,
0,
0,
size.width,
size.height
);

const blob=
await canvasToBlob(
canvas,
'image/jpeg',
IMAGE_THUMBNAIL_QUALITY
);

return createThumbnailFile(
blob,
file
);
}

/*  Video Thumbnail */

export async function createVideoThumbnail(
file
){
const video=
await loadVideoFromFile(
file
);

const captureTime=
Math.min(
VIDEO_THUMBNAIL_TIME,
Math.max(
0,
(video.duration||0)-.1
)
);

await seekVideo(
video,
captureTime
);

const size=
getThumbnailSize(
video.videoWidth,
video.videoHeight
);

const canvas=
document.createElement(
'canvas'
);

canvas.width=
size.width;

canvas.height=
size.height;

const context=
canvas.getContext(
'2d'
);

context.drawImage(
video,
0,
0,
size.width,
size.height
);

const blob=
await canvasToBlob(
canvas,
'image/jpeg',
IMAGE_THUMBNAIL_QUALITY
);

cleanupVideo(
video
);

return createThumbnailFile(
blob,
file
);
}

/*  File Loaders */

function loadImageFromFile(
file
){
return new Promise(
(resolve,reject)=>{
const url=
URL.createObjectURL(
file
);

const image=
new Image();

image.onload=
()=>{
URL.revokeObjectURL(
url
);

resolve(
image
);
};

image.onerror=
()=>{
URL.revokeObjectURL(
url
);

reject(
new Error(
'Unable to create image thumbnail.'
)
);
};

image.src=
url;
}
);
}

function loadVideoFromFile(
file
){
return new Promise(
(resolve,reject)=>{
const url=
URL.createObjectURL(
file
);

const video=
document.createElement(
'video'
);

video.preload=
'metadata';

video.muted=
true;

video.playsInline=
true;

video.dataset.objectUrl=
url;

video.onloadedmetadata=
()=>{
resolve(
video
);
};

video.onerror=
()=>{
cleanupVideo(
video
);

reject(
new Error(
'Unable to load video for thumbnail.'
)
);
};

video.src=
url;
}
);
}

/*  Video Seek */

function seekVideo(
video,
time
){
return new Promise(
(resolve,reject)=>{
const handleSeeked=
()=>{
cleanup();
resolve();
};

const handleError=
()=>{
cleanup();

reject(
new Error(
'Unable to capture video thumbnail.'
)
);
};

const cleanup=
()=>{
video.removeEventListener(
'seeked',
handleSeeked
);

video.removeEventListener(
'error',
handleError
);
};

video.addEventListener(
'seeked',
handleSeeked
);

video.addEventListener(
'error',
handleError
);

video.currentTime=
time;
}
);
}

/*  Thumbnail Size */

function getThumbnailSize(
width,
height
){
if(
!width||
!height
){
return{
width:
IMAGE_THUMBNAIL_MAX_WIDTH,
height:
IMAGE_THUMBNAIL_MAX_WIDTH
};
}

if(
width<=
IMAGE_THUMBNAIL_MAX_WIDTH
){
return{
width,
height
};
}

const ratio=
IMAGE_THUMBNAIL_MAX_WIDTH/
width;

return{
width:
IMAGE_THUMBNAIL_MAX_WIDTH,

height:
Math.round(
height*
ratio
)
};
}

/*  Blob */

function canvasToBlob(
canvas,
type,
quality
){
return new Promise(
(resolve,reject)=>{
canvas.toBlob(
blob=>{
if(!blob){
reject(
new Error(
'Unable to create thumbnail.'
)
);

return;
}

resolve(
blob
);
},
type,
quality
);
}
);
}

/*  Thumbnail File */

function createThumbnailFile(
blob,
sourceFile
){
const baseName=
getBaseFileName(
sourceFile?.name
);

const fileName=
`${baseName}_thumb.jpg`;

return new File(
[
blob
],
fileName,
{
type:'image/jpeg',
lastModified:
Date.now()
}
);
}

/*  Helpers */

function getBaseFileName(
fileName
){
const name=
String(
fileName||
'media'
);

const dotIndex=
name.lastIndexOf(
'.'
);

if(dotIndex<=0){
return name;
}

return name.slice(
0,
dotIndex
);
}

function cleanupVideo(
video
){
const url=
video?.dataset?.objectUrl;

if(url){
URL.revokeObjectURL(
url
);
}

if(video){
video.removeAttribute(
'src'
);

video.load();
}
}
