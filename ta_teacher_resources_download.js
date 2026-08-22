import{
    loadTeacherResourceDownloads,
    loadTeacherResourceFormDownloads
}from'./ta_teacher_resources_api.js';

/*==================================================
  Download Settings
==================================================*/

const DOWNLOAD_DELAY=
    2000;

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

    const progressOverlay=
        createDownloadProgressOverlay();

    try{
        setDownloadButtonBusy(
            downloadButton
        );

        setProgressPreparing(
            progressOverlay
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
            progressOverlay
        );

        setProgressComplete(
            progressOverlay,
            signedFiles.length
        );

    }catch(error){
        console.error(
            'Teacher resource download failed:',
            error
        );

        setProgressError(
            progressOverlay
        );

    }finally{
        restoreDownloadButton(
            downloadButton,
            originalText
        );
    }
}

/*==================================================
  Download Selected Forms
==================================================*/

export async function downloadTeacherResourceForms(
    formsId,
    state,
    downloadButton
){
    if(
        !Array.isArray(
            formsId
        )||
        !formsId.length
    ){
        return false;
    }

    const originalText=
        downloadButton
            ?.textContent||
        'Download Selected';

    const progressOverlay=
        createDownloadProgressOverlay();

    try{
        setDownloadButtonBusy(
            downloadButton
        );

        setProgressPreparing(
            progressOverlay
        );

        const downloadData=
            await loadTeacherResourceFormDownloads(
                formsId,
                state
            );

        const signedFiles=
            Array.isArray(
                downloadData
                    ?.signedFiles
            )
                ?downloadData
                    .signedFiles
                    .map(
                        signedFile=>{
                            if(
                                typeof signedFile===
                                'string'
                            ){
                                return signedFile;
                            }

                            return(
                                signedFile?.url||
                                ''
                            );
                        }
                    )
                    .filter(
                        signedUrl=>
                            typeof signedUrl==='string'&&
                            signedUrl
                    )
                :[];

        if(!signedFiles.length){
            throw new Error(
                'No form files were available to download.'
            );
        }

        await triggerSignedDownloads(
            signedFiles,
            progressOverlay
        );

        setProgressComplete(
            progressOverlay,
            signedFiles.length
        );

        return true;

    }catch(error){
        console.error(
            'Teacher resource form download failed:',
            error
        );

        setProgressError(
            progressOverlay
        );

        return false;

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
    progressOverlay
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
            progressOverlay,
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
  Progress Overlay
==================================================*/

function createDownloadProgressOverlay(){
    removeExistingProgressOverlay();

    const overlay=
        document.createElement(
            'div'
        );

    overlay.className=
        'teacher-resource-download-overlay';

    const panel=
        document.createElement(
            'div'
        );

    panel.className=
        'teacher-resource-download-progress';

    const spinner=
        document.createElement(
            'div'
        );

    spinner.className=
        'teacher-resource-download-spinner';

    const title=
        document.createElement(
            'div'
        );

    title.className=
        'teacher-resource-download-progress-title';

    title.textContent=
        'Preparing Downloads';

    const status=
        document.createElement(
            'div'
        );

    status.className=
        'teacher-resource-download-progress-status';

    status.textContent=
        'Getting your files ready...';

    const doneButton=
        document.createElement(
            'button'
        );

    doneButton.type=
        'button';

    doneButton.className=
        'teacher-resource-download-done-button';

    doneButton.textContent=
        'All Done';

    doneButton.disabled=
        true;

    doneButton.addEventListener(
        'click',
        ()=>{
            overlay.remove();
        }
    );

    panel.appendChild(
        spinner
    );

    panel.appendChild(
        title
    );

    panel.appendChild(
        status
    );

    panel.appendChild(
        doneButton
    );

    overlay.appendChild(
        panel
    );

    document.body.appendChild(
        overlay
    );

    return{
        overlay,
        panel,
        spinner,
        title,
        status,
        doneButton
    };
}

function removeExistingProgressOverlay(){
    const existing=
        document.querySelector(
            '.teacher-resource-download-overlay'
        );

    if(existing){
        existing.remove();
    }
}

/*==================================================
  Progress States
==================================================*/

function setProgressPreparing(
    progressOverlay
){
    progressOverlay.title.textContent=
        'Preparing Downloads';

    progressOverlay.status.textContent=
        'Getting your files ready...';

    progressOverlay.doneButton.disabled=
        true;
}

function updateDownloadProgress(
    progressOverlay,
    current,
    total
){
    progressOverlay.title.textContent=
        'Downloading Files';

    progressOverlay.status.textContent=
        `Downloading ${current} of ${total}`;

    progressOverlay.doneButton.disabled=
        true;
}

function setProgressComplete(
    progressOverlay,
    total
){
    progressOverlay.spinner.classList.add(
        'is-complete'
    );

    progressOverlay.title.textContent=
        'Downloads Complete';

    progressOverlay.status.textContent=
        `${total} files have been sent to your Downloads folder.`;

    progressOverlay.doneButton.disabled=
        false;
}

function setProgressError(
    progressOverlay
){
    progressOverlay.spinner.classList.add(
        'is-error'
    );

    progressOverlay.title.textContent=
        'Download Problem';

    progressOverlay.status.textContent=
        'Some files could not be prepared. Please try again.';

    progressOverlay.doneButton.textContent=
        'Close';

    progressOverlay.doneButton.disabled=
        false;
}

/*==================================================
  Main Download Button
==================================================*/

function setDownloadButtonBusy(
    button
){
    if(!button){
        return;
    }

    button.disabled=
        true;

    button.textContent=
        'Downloading...';
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
