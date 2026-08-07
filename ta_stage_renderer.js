import{
    getTeacherStage
}from'./ta_ui.js';

import{
    renderModule
}from'./ta_module_manager.js';

import{
    composeStagePlan
}from'./ta_stage_composition.js';

import{
    createModuleCard
}from'./ta_stage_card.js';

import{
    selectStageModule
}from'./ta_stage_actions.js';

export function renderStage(stagePlan){
    const stage=
        getTeacherStage();

    if(!stage){
        return;
    }

    const composedStagePlan=
        composeStagePlan(
            stagePlan
        );

    stage.innerHTML='';

    if(composedStagePlan.context){
        stage.appendChild(
            createStageContext(
                composedStagePlan.context
            )
        );
    }

    const stageLayout=
        createStageLayout();

    stage.appendChild(
        stageLayout.container
    );

    const moduleCards=
        createStageModuleCards(
            stagePlan,
            composedStagePlan
        );

    moduleCards.forEach(moduleCard=>{
        appendModuleCardToZone(
            stageLayout,
            moduleCard
        );
    });

    moduleCards.forEach(moduleCard=>{
        activateModuleCard(
            moduleCard
        );
    });
}

function createStageContext(context){
    const container=
        document.createElement(
            'section'
        );

    container.className=
        'teacher-stage-context';

    container.textContent=
        context;

    return container;
}

function createStageLayout(){
    const container=
        document.createElement(
            'div'
        );

    container.className=
        'teacher-stage-layout';

    const previousZone=
        createStageZone(
            'previous',
            'Tasks before the living task'
        );

    const livingZone=
        createStageZone(
            'living',
            'Living task'
        );

    const nextZone=
        createStageZone(
            'next',
            'Tasks after the living task'
        );

    container.appendChild(
        previousZone
    );

    container.appendChild(
        livingZone
    );

    container.appendChild(
        nextZone
    );

    return{
        container,
        previousZone,
        livingZone,
        nextZone
    };
}

function createStageZone(
    zoneName,
    ariaLabel
){
    const zone=
        document.createElement(
            'section'
        );

    zone.className=
        `teacher-stage-zone teacher-stage-${zoneName}`;

    zone.dataset.stageZone=
        zoneName;

    zone.setAttribute(
        'aria-label',
        ariaLabel
    );

    return zone;
}

function createStageModuleCards(
    sourceStagePlan,
    composedStagePlan
){
    const modules=
        composedStagePlan.modules||
        [];

    return modules.map(modulePlan=>{
        return createModuleCard(
            composedStagePlan,
            modulePlan,
            moduleId=>{
                handleModuleSelection(
                    sourceStagePlan,
                    moduleId
                );
            }
        );
    });
}

function appendModuleCardToZone(
    stageLayout,
    moduleCard
){
    const stageSide=
        moduleCard.modulePlan
            ?.stageSide||
        'next';

    switch(stageSide){
        case'previous':
            stageLayout.previousZone
                .appendChild(
                    moduleCard.card
                );
            break;

        case'living':
            stageLayout.livingZone
                .appendChild(
                    moduleCard.card
                );
            break;

        default:
            stageLayout.nextZone
                .appendChild(
                    moduleCard.card
                );
    }
}

function activateModuleCard(moduleCard){
    const{
        content,
        modulePlan,
        isExpanded
    }=moduleCard;

    if(
        !isExpanded||
        !content
    ){
        return;
    }

    renderModule(
        modulePlan,
        content
    );
}

function handleModuleSelection(
    stagePlan,
    moduleId
){
    const updatedPlan=
        selectStageModule(
            stagePlan,
            moduleId
        );

    renderStage(
        updatedPlan
    );
}
