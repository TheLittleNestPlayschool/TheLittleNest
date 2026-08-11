 const mediaSession={
    taskContext:null,

    items:[],

    activeMediaId:null
};


export function getMediaSession(){
    return mediaSession;
}


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
