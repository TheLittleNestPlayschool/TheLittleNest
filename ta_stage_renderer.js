import {
    getTeacherStage,
    clearTeacherStage,
    setActiveWorkspace
} from './ta_ui.js';

import {
    getModule,
    moduleCanRender
} from './ta_module_registry.js';

export function renderStage(stagePlan){
    clearTeacherStage();

    const stage=getTeacherStage();

    if(!stage){
        return;
    }

    if(stagePlan.context){
        stage.appendChild(
            createStageContext(
                stagePlan.context
            )
        );
    }

    const modules=
        stagePlan.modules||[];

    modules.slice(0,6).forEach(
        (modulePlan,index)=>{
            stage.appendChild(
                createModuleCard(
                    modulePlan,
                    index
                )
            );
        }
    );
}

function createStageContext(context){
    const container=
        document.createElement('section');

    container.className=
        'teacher-stage-context';

    container.textContent=
        context;

    return container;
}

function createModuleCard(
    modulePlan,
    index
){
    const module=
        getModule(modulePlan.id);

    const card=
        document.createElement('section');

    card.className=
        'teacher-module-card';

    card.dataset.moduleId=
        modulePlan.id;

    const isExpanded=
        modulePlan.state==='active'||
        modulePlan.state==='expanded'||
        index===0;

    card.classList.toggle(
        'is-expanded',
        isExpanded
    );

    card.classList.toggle(
        'is-collapsed',
        !isExpanded
    );

    const header=
        document.createElement('header');

    header.className=
        'teacher-module-header';

    const title=
        document.createElement('h2');

    title.className=
        'teacher-module-title';

    title.textContent=
        module?.title||
        modulePlan.id;

    header.appendChild(title);

    if(modulePlan.status){
        const status=
            document.createElement('span');

        status.className=
            'teacher-module-status';

        status.textContent=
            modulePlan.status;

        header.appendChild(status);
    }

    card.appendChild(header);

    if(!isExpanded){
        return card;
    }

    const content=
        document.createElement('div');

    content.className=
        'teacher-module-content';

    content.id=
        `teacherModule_${modulePlan.id}`;

    card.appendChild(content);

    if(moduleCanRender(modulePlan.id)){
        setActiveWorkspace(
            content.id
        );

        module.renderer();
    }else{
        const message=
            document.createElement('p');

        message.className=
            'teacher-module-placeholder';

        message.textContent=
            module?.description||
            'This module is not available yet.';

        content.appendChild(message);
    }

    return card;
}
