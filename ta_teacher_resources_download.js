import{
    loadTeacherResourceDownloads
}from'./ta_teacher_resources_api.js';

/*==================================================
  Download Settings
==================================================*/

const DOWNLOAD_DELAY=
    1200;

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
                    .filter(
                        signedUrl=>
                            typeof signedUrl==='string'&&
                            signedUrl
                    )
                :[];

        if(!signedFiles.length){
            throw new Error(
                'No session files were available to download.'
            );
        }

        await triggerSignedDownloads(
            signedFiles,
            downloadButton
        );

        setDownloadSuccessState(
            downloadButton
        );

        await wait(
            1500
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
            2000
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
    signedFiles,
    downloadButton
){
    const total=
        signedFiles.length;

    for(
        let index=0;
        index<total;
        index++
    ){
        const signedUrl=
            signedFiles[
                index
            ];

        updateDownloadProgress(
            downloadButton,
            index+1,
            total
        );

        triggerSignedDownload(
            signedUrl
        );

        if(
            index<
            total-1
        ){
            await wait(
                DOWNLOAD_DELAY
            );
        }
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

    window.setTimeout(
        ()=>{
            link.remove();
        },
        500
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

function updateDownloadProgress(
    button,
    current,
    total
){
    if(!button){
        return;
    }

    button.textContent=
        `Downloading ${current} of ${total}...`;
}

function setDownloadSuccessState(
    button
){
    if(!button){
        return;
    }

    button.textContent=
        'Downloads Complete';
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
