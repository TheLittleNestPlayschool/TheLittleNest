import{
    loadTeacherResourceFormsData
}from'./ta_teacher_resources_api.js';

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
            forms
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
    forms
){
    const heading=
        document.createElement(
            'h3'
        );

    heading.className=
        'teacher-resource-selector-title';

    heading.textContent=
        'Select a form to download';

    const list=
        document.createElement(
            'div'
        );

    list.className=
        'teacher-resource-forms-list';

    forms.forEach(
        form=>{
            const item=
                createFormItem(
                    form
                );

            list.appendChild(
                item
            );
        }
    );

    container.appendChild(
        heading
    );

    container.appendChild(
        list
    );
}

/*==================================================
  Form Item
==================================================*/

function createFormItem(
    form
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
        '⬇';

    item.appendChild(
        text
    );

    item.appendChild(
        icon
    );

    return item;
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
