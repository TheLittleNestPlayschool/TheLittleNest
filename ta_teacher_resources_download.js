import{
    loadTeacherResourceDownloads
}from'./ta_teacher_resources_api.js';

/*==================================================
  Download Selected Resource Blocks
==================================================*/

export async function downloadTeacherResourceBlocks(
    blocks,
    state,
    downloadButton
){
    if(
        !Array.isArray(
            blocks
        )||
        !blocks.length
    ){
        return;
    }

    const originalText=
        downloadButton
            ?.textContent||
        'Download Selected';

    try{
        setDownloadPreparingState(
            downloadButton
        );

        const downloadData=
            await loadTeacherResourceDownloads(
                blocks,
                state
            );

        const signedFiles=
            Array.isArray(
                downloadData
                    ?.signedFiles
            )
                ?downloadData
                    .signedFiles
                :[];

        if(!signedFiles.length){
            throw new Error(
                'No session files were available to download.'
            );
        }

        await triggerSignedDownloads(
            signedFiles
        );

        setDownloadSuccessState(
            downloadButton
        );

        await wait(
            1200
        );

    }catch(error){
        console.error(
            'Teacher resource download failed:',
            error
        );

        setDownloadErrorState(
            downloadButton
        );

        await wait(
            1800
        );

    }finally{
        restoreDownloadButton(
            downloadButton,
            originalText
        );
    }
}

/*==================================================
  Trigger Downloads
==================================================*/

async function triggerSignedDownloads(
    signedFiles
){
    for(
        const signedUrl
        of signedFiles
    ){
        if(
            typeof signedUrl!=='string'||
            !signedUrl
        ){
            continue;
        }

        triggerSignedDownload(
            signedUrl
        );

        await wait(
            250
        );
    }
}

function triggerSignedDownload(
    signedUrl
){
    const link=
        document.createElement(
            'a'
        );

    link.href=
        signedUrl;

    link.setAttribute(
        'download',
        ''
    );

    link.style.display=
        'none';

    document.body.appendChild(
        link
    );

    link.click();

    document.body.removeChild(
        link
    );
}

/*==================================================
  Download Button State
==================================================*/

function setDownloadPreparingState(
    button
){
    if(!button){
        return;
    }

    button.disabled=
        true;

    button.textContent=
        'Preparing Downloads...';
}

function setDownloadSuccessState(
    button
){
    if(!button){
        return;
    }

    button.textContent=
        'Downloads Started';
}

function setDownloadErrorState(
    button
){
    if(!button){
        return;
    }

    button.textContent=
        'Download Failed';
}

function restoreDownloadButton(
    button,
    originalText
){
    if(!button){
        return;
    }

    button.disabled=
        false;

    button.textContent=
        originalText;
}

/*==================================================
  Timing
==================================================*/

function wait(
    milliseconds
){
    return new Promise(
        resolve=>{
            window.setTimeout(
                resolve,
                milliseconds
            );
        }
    );
}
