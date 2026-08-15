/*==================================================
  Teacher Resources Menu
==================================================*/

export function renderTeacherResourcesMenu(
    container,
    options={}
){
    if(!container){
        return null;
    }

    const menu=
        document.createElement(
            'div'
        );

    menu.className=
        'teacher-resource-menu';

    const sessionsButton=
        createResourceButton(
            'sessions',
            '📚',
            'Download Sessions'
        );

    const formsButton=
        createResourceButton(
            'forms',
            '📄',
            'Download Forms'
        );

    sessionsButton.addEventListener(
        'click',
        ()=>{
            setActiveResourceButton(
                menu,
                sessionsButton
            );

            if(
                typeof options.onSessions==='function'
            ){
                options.onSessions();
            }
        }
    );

    formsButton.addEventListener(
        'click',
        ()=>{
            setActiveResourceButton(
                menu,
                formsButton
            );

            if(
                typeof options.onForms==='function'
            ){
                options.onForms();
            }
        }
    );

    menu.appendChild(
        sessionsButton
    );

    menu.appendChild(
        formsButton
    );

    container.appendChild(
        menu
    );

    return{
        menu,
        sessionsButton,
        formsButton
    };
}

/*==================================================
  Resource Button
==================================================*/

function createResourceButton(
    resourceId,
    icon,
    label
){
    const button=
        document.createElement(
            'button'
        );

    button.type=
        'button';

    button.className=
        'teacher-resource-menu-button';

    button.dataset.resource=
        resourceId;

    const iconElement=
        document.createElement(
            'span'
        );

    iconElement.className=
        'teacher-resource-menu-icon';

    iconElement.textContent=
        icon;

    const labelElement=
        document.createElement(
            'span'
        );

    labelElement.className=
        'teacher-resource-menu-label';

    labelElement.textContent=
        label;

    button.appendChild(
        iconElement
    );

    button.appendChild(
        labelElement
    );

    return button;
}

/*==================================================
  Active Resource
==================================================*/

function setActiveResourceButton(
    menu,
    activeButton
){
    menu
        .querySelectorAll(
            '.teacher-resource-menu-button'
        )
        .forEach(
            button=>{
                const isActive=
                    button===
                    activeButton;

                button.classList.toggle(
                    'is-active',
                    isActive
                );

                button.setAttribute(
                    'aria-pressed',
                    isActive
                        ?'true'
                        :'false'
                );
            }
        );
}
