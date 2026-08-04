import {
    getTeacherStage,
    setActiveWorkspace
} from './ta_ui.js';

import {
    getModule,
    moduleCanRender
} from './ta_module_registry.js';

export function renderStage(stagePlan){
    const stage=getTeacherStage();

    if(!stage){
        return;
    }

    stage.innerHTML='';

    if(stagePlan.context){
        stage.appendChild(
            createStageContext(
                stagePlan.context
            )
        );
    }

    const modules=
        stagePlan.modules||[];

    const moduleCards=
        modules.slice(0,6).map(
            (modulePlan,index)=>
                createModuleCard(
                    modulePlan,
                    index
                )
        );

    moduleCards.forEach(
        moduleCard=>{
            stage.appendChild(
                moduleCard.card
            );
        }
    );

    moduleCards.forEach(
        moduleCard=>{
            activateModuleCard(
                moduleCard
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

    let content=null;

    if(isExpanded){
        content=
            document.createElement('div');

        content.className=
            'teacher-module-content';

        content.id=
            `teacherModule_${modulePlan.id}`;

        card.appendChild(content);
    }

    return{
        card,
        content,
        module,
        modulePlan,
        isExpanded
    };
}

function activateModuleCard(
    moduleCard
){
    const {
        content,
        module,
        modulePlan,
        isExpanded
    }=moduleCard;

    if(
        !isExpanded||
        !content
    ){
        return;
    }

    if(moduleCanRender(modulePlan.id)){
        setActiveWorkspace(
            content.id
        );

        module.renderer();

        return;
    }

    const message=
        document.createElement('p');

    message.className=
        'teacher-module-placeholder';

    message.textContent=
        module?.description||
        'This module is not available yet.';

    content.appendChild(message);
}
