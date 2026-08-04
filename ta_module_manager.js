import {
    getModule,
    moduleCanRender
} from './ta_module_registry.js';

import {
    setActiveWorkspace
} from './ta_ui.js';

export function renderModule(
    moduleId,
    container
){
    const module=
        getModule(moduleId);

    if(!module||!container){
        return false;
    }

    if(!moduleCanRender(moduleId)){
        renderModulePlaceholder(
            module,
            container
        );

        return false;
    }

    setActiveWorkspace(
        container.id
    );

    module.renderer();

    return true;
}

function renderModulePlaceholder(
    module,
    container
){
    const message=
        document.createElement('p');

    message.className=
        'teacher-module-placeholder';

    message.textContent=
        module.description||
        'This module is not available yet.';

    container.appendChild(message);
}
