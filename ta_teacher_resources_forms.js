import{
    loadTeacherResourceFormsData
}from'./ta_teacher_resources_api.js';

import{
    downloadTeacherResourceForms
}from'./ta_teacher_resources_download.js';

/*==================================================
  Forms State
==================================================*/

const selectedFormIds=
    new Set();

/*==================================================
  Render Teacher Resource Forms
==================================================*/

export async function renderTeacherResourceForms(
    container,
    state
){
    if(!container){
        return;
    }

    container.innerHTML=
        '';

    const status=
        document.createElement(
            'p'
        );

    status.className=
        'teacher-resources-message';

    status.textContent=
        'Loading forms...';

    container.appendChild(
        status
    );

    try{
        const resourceData=
            await loadTeacherResourceFormsData(
                state
            );

        const forms=
            Array.isArray(
                resourceData?.forms
            )
                ?resourceData.forms
                :[];

        status.remove();

        if(!forms.length){
            renderEmptyFormsMessage(
                container
            );

            return;
        }

        renderFormsList(
            container,
            forms,
            state
        );

    }catch(error){
        console.error(
            'Teacher resource forms failed:',
            error
        );

        status.textContent=
            'Unable to load forms.';
    }
}

/*==================================================
  Forms List
==================================================*/

function renderFormsList(
    container,
    forms,
    state
){
    const heading=
        document.createElement(
            'h3'
        );

    heading.className=
        'teacher-resource-selector-title';

    heading.textContent=
        'Select forms to download';

    const list=
        document.createElement(
            'div'
        );

    list.className=
        'teacher-resource-forms-list';

    const downloadButton=
        createDownloadButton();

    forms.forEach(
        form=>{
            const item=
                createFormItem(
                    form,
                    selectedFormIds,
                    downloadButton
                );

            list.appendChild(
                item
            );
        }
    );

    updateDownloadButton(
        downloadButton,
        selectedFormIds.size
    );

    downloadButton.addEventListener(
        'click',
        async()=>{
            const formsId=
                Array.from(
                    selectedFormIds
                );

            if(!formsId.length){
                return;
            }

            const downloadComplete=
                await downloadTeacherResourceForms(
                    formsId,
                    state,
                    downloadButton
                );

            if(!downloadComplete){
                return;
            }

            selectedFormIds.clear();

            list.querySelectorAll(
                '.teacher-resource-form-item'
            ).forEach(
                item=>{
                    item.classList.remove(
                        'is-selected'
                    );

                    item.setAttribute(
                        'aria-pressed',
                        'false'
                    );

                    const icon=
                        item.querySelector(
                            '.teacher-resource-form-download-icon'
                        );

                    if(icon){
                        icon.textContent=
                            '○';
                    }
                }
            );

            updateDownloadButton(
                downloadButton,
                0
            );
        }
    );

    container.appendChild(
        heading
    );

    container.appendChild(
        list
    );

    container.appendChild(
        downloadButton
    );
}

/*==================================================
  Form Item
==================================================*/

function createFormItem(
    form,
    selectedFormIds,
    downloadButton
){
    const item=
        document.createElement(
            'button'
        );

    item.type=
        'button';

    item.className=
        'teacher-resource-form-item';

    item.dataset.formId=
        form.id||'';

    item.dataset.fileName=
        form.file_name||'';

    const formId=
        Number(
            form.id
        );

    const isSelected=
        selectedFormIds.has(
            formId
        );

    item.setAttribute(
        'aria-pressed',
        isSelected
            ?'true'
            :'false'
    );

    const text=
        document.createElement(
            'div'
        );

    text.className=
        'teacher-resource-form-text';

    const name=
        document.createElement(
            'div'
        );

    name.className=
        'teacher-resource-form-name';

    name.textContent=
        form.form_name||
        'Form';

    text.appendChild(
        name
    );

    if(form.form_description){
        const description=
            document.createElement(
                'div'
            );

        description.className=
            'teacher-resource-form-description';

        description.textContent=
            form.form_description;

        text.appendChild(
            description
        );
    }

    const icon=
        document.createElement(
            'span'
        );

    icon.className=
        'teacher-resource-form-download-icon';

    icon.textContent=
        isSelected
            ?'✓'
            :'○';

    if(isSelected){
        item.classList.add(
            'is-selected'
        );
    }

    item.appendChild(
        text
    );

    item.appendChild(
        icon
    );

    item.addEventListener(
        'click',
        ()=>{
            if(
                !Number.isFinite(
                    formId
                )
            ){
                return;
            }

            if(
                selectedFormIds.has(
                    formId
                )
            ){
                selectedFormIds.delete(
                    formId
                );

                item.classList.remove(
                    'is-selected'
                );

                item.setAttribute(
                    'aria-pressed',
                    'false'
                );

                icon.textContent=
                    '○';

            }else{
                selectedFormIds.add(
                    formId
                );

                item.classList.add(
                    'is-selected'
                );

                item.setAttribute(
                    'aria-pressed',
                    'true'
                );

                icon.textContent=
                    '✓';
            }

            updateDownloadButton(
                downloadButton,
                selectedFormIds.size
            );
        }
    );

    return item;
}

/*==================================================
  Download Button
==================================================*/

function createDownloadButton(){
    const button=
        document.createElement(
            'button'
        );

    button.type=
        'button';

    button.className=
        'teacher-resource-download-button teacher-resource-form-download-button';

    button.textContent=
        'Download Selected';

    button.disabled=
        true;

    return button;
}

function updateDownloadButton(
    button,
    selectedCount
){
    if(!button){
        return;
    }

    button.disabled=
        selectedCount===0;

    if(selectedCount===0){
        button.textContent=
            'Download Selected';

        return;
    }

    button.textContent=
        `Download Selected (${selectedCount})`;
}

/*==================================================
  Empty State
==================================================*/

function renderEmptyFormsMessage(
    container
){
    const message=
        document.createElement(
            'p'
        );

    message.className=
        'teacher-resources-message';

    message.textContent=
        'No forms are currently available.';

    container.appendChild(
        message
    );
}
