const mediaSession={
taskContext:null,

//------------------------------------
// Session Selection
//------------------------------------

availableSessions:[],

selectedSession:null,

sessionId:null,

isLoadingSessions:false,

sessionLoadError:null,

//------------------------------------
// Media Task Data
//------------------------------------

user:null,

studentsBySession:[],

studentsByLocation:[],

isLoadingTask:false,

taskLoadError:null,

//------------------------------------
// Selected Media
//------------------------------------

items:[],

activeMediaId:null
};


export function getMediaSession(){
return mediaSession;
}


/*==================================================*
*Session Data*
*==================================================*/

export function setAvailableSessions(
sessions
){
mediaSession.availableSessions=
Array.isArray(
sessions
)
?sessions
:[];
}


export function selectMediaSession(
session
){
mediaSession.selectedSession=
session||null;

mediaSession.sessionId=
    session?.id||
    null;
}


export function clearSelectedMediaSession(){
mediaSession.selectedSession=
null;

mediaSession.sessionId=
    null;

mediaSession.user=
    null;

mediaSession.studentsBySession=
    [];

mediaSession.studentsByLocation=
    [];

mediaSession.taskLoadError=
    null;
}


/*==================================================*
*Media Task Data*
*==================================================*/

export function applyMediaTaskData(
data
){
mediaSession.user=
data?.user||
null;

mediaSession.studentsBySession=
    Array.isArray(
        data?.studentsBySession
    )
        ?data.studentsBySession
        :[];

mediaSession.studentsByLocation=
    Array.isArray(
        data?.studentsByLocation
    )
        ?data.studentsByLocation
        :[];
}


/*==================================================*
*Media Files*
*==================================================*/

export function addMediaFiles(
files
){
files.forEach(
file=>{
    const item={
        id:
            createMediaId(),

        file:
            file,

        previewUrl:
            URL.createObjectURL(
                file
            ),

        mediaKind:
            getMediaKind(
                file
            ),

        mediaType:
            null,

        studentIds:
            [],

        infoComplete:
            false
    };

    mediaSession.items.push(
        item
    );
}
);
}


export function removeMediaItem(
mediaId
){
const itemIndex=
mediaSession.items.findIndex(
item=>{
    return(
        item.id===
        mediaId
    );
}
);


if(itemIndex===-1){
    return;
}


const item=
mediaSession.items[
    itemIndex
];


if(item?.previewUrl){
    URL.revokeObjectURL(
        item.previewUrl
    );
}


mediaSession.items.splice(
    itemIndex,
    1
);


if(
    mediaSession.activeMediaId===
    mediaId
){
    mediaSession.activeMediaId=
        null;
}
}


export function selectMediaItem(
mediaId
){
mediaSession.activeMediaId=
mediaId;
}


export function clearActiveMedia(){
mediaSession.activeMediaId=
null;
}


export function getActiveMedia(){
if(
!mediaSession.activeMediaId
){
return null;
}

return(
    mediaSession.items.find(
        item=>
            item.id===
            mediaSession.activeMediaId
    )||
    null
);
}


/*==================================================*
*Media Details*
*==================================================*/

export function setActiveMediaType(
mediaType
){
const item=
getActiveMedia();

if(!item){
    return;
}

item.mediaType=
    mediaType;

updateInfoComplete(
    item
);
}


export function toggleActiveMediaStudent(
studentId
){
const item=
getActiveMedia();

if(!item){
    return;
}

const normalizedStudentId=
    Number(
        studentId
    );


const alreadySelected=
    item.studentIds.some(
        selectedId=>{
            return(
                Number(
                    selectedId
                )===
                normalizedStudentId
            );
        }
    );


if(alreadySelected){
    item.studentIds=
        item.studentIds.filter(
            selectedId=>{
                return(
                    Number(
                        selectedId
                    )!==
                    normalizedStudentId
                );
            }
        );

}else{
    item.studentIds.push(
        normalizedStudentId
    );
}


updateInfoComplete(
    item
);
}


export function markActiveMediaComplete(){
const item=
getActiveMedia();

if(!item){
    return;
}

updateInfoComplete(
    item
);
}


/*==================================================*
*Helpers*
*==================================================*/

function updateInfoComplete(
item
){
item.infoComplete=
Boolean(
item.mediaType&&
item.studentIds.length
);
}


function createMediaId(){
return(
Date.now()
.toString(36)+
'-'+
Math.random()
.toString(36)
.slice(
2,
8
)
);
}


function getMediaKind(
file
){
if(
file?.type
?.startsWith(
'video/'
)
){
return'video';
}

return'image';
}
