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
                    )
            };


            mediaSession.items.push(
                item
            );


            if(
                mediaSession
                    .activeMediaId===
                null
            ){
                mediaSession
                    .activeMediaId=
                    item.id;
            }
        }
    );
}


export function selectMediaItem(
    mediaId
){
    mediaSession.activeMediaId=
        mediaId;
}


export function getActiveMedia(){
    if(
        !mediaSession.items.length
    ){
        return null;
    }


    const active=
        mediaSession.items.find(
            item=>
                item.id===
                mediaSession
                    .activeMediaId
        );


    return(
        active||
        mediaSession.items[0]
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
