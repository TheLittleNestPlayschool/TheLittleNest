import{getTeacherStage}from'./ta_ui.js';
import{getModule}from'./ta_module_registry.js';
import{renderModule}from'./ta_module_manager.js';
import{centerLivingModule}from'./ta_stage_motion.js';
import{composeStagePlan}from'./ta_stage_composition.js';

export function renderStage(stagePlan){
    const stage=getTeacherStage();

    if(!stage){
        return;
    }

    const composedStagePlan=
        composeStagePlan(
            stagePlan
        );

    stage.innerHTML='';

    stage.appendChild(
        createStageSpacer('top')
    );

    if(composedStagePlan.context){
        stage.appendChild(
            createStageContext(
                composedStagePlan.context
            )
        );
    }

    const modules=
        composedStagePlan.modules||[];

    const moduleCards=
        modules.map(modulePlan=>{
            return createModuleCard(
                composedStagePlan,
                modulePlan
            );
        });

    moduleCards.forEach(moduleCard=>{
        stage.appendChild(
            moduleCard.card
        );
    });

    stage.appendChild(
        createStageSpacer('bottom')
    );

    moduleCards.forEach(moduleCard=>{
        activateModuleCard(
            moduleCard
        );
    });

    centerLivingModule();
}

function createStageSpacer(position){
    const spacer=document.createElement(
        'div'
    );

    spacer.className=
        `teacher-stage-spacer teacher-stage-spacer-${position}`;

    spacer.setAttribute(
        'aria-hidden',
        'true'
    );

    return spacer;
}

function createStageContext(context){
    const container=document.createElement(
        'section'
    );

    container.className=
        'teacher-stage-context';

    container.textContent=context;

    return container;
}

function createModuleCard(
    stagePlan,
    modulePlan
){
    const module=getModule(
        modulePlan.id
    );

    const card=document.createElement(
        'section'
    );

    card.className=
        'teacher-module-card';

    card.dataset.moduleId=
        modulePlan.id;

    card.dataset.stagePosition=
        modulePlan.stagePosition||
        '';

    card.dataset.stageSide=
        modulePlan.stageSide||
        '';

    card.dataset.stageDistance=
        String(
            modulePlan.stageDistance??''
        );

    const isExpanded=
        modulePlan.state==='active'||
        modulePlan.state==='expanded';

    card.classList.toggle(
        'is-expanded',
        isExpanded
    );

    card.classList.toggle(
        'is-collapsed',
        !isExpanded
    );

    if(
        modulePlan.stagePosition===
        'living'
    ){
        card.classList.add(
            'is-living'
        );
    }

    if(modulePlan.state==='completed'){
        card.classList.add(
            'is-completed'
        );
    }

    if(
        modulePlan.state===
        'needs_attention'
    ){
        card.classList.add(
            'needs-attention'
        );
    }

    const header=document.createElement(
        'header'
    );

    header.className=
        'teacher-module-header';

    header.setAttribute(
        'role',
        'button'
    );

    header.setAttribute(
        'tabindex',
        '0'
    );

    header.setAttribute(
        'aria-expanded',
        String(isExpanded)
    );

    const identity=document.createElement(
        'div'
    );

    identity.className=
        'teacher-module-identity';

    const icon=document.createElement(
        'span'
    );

    icon.className=
        'teacher-module-icon';

    icon.textContent=
        module?.icon||'';

    const text=document.createElement(
        'div'
    );

    text.className=
        'teacher-module-text';

    const title=document.createElement(
        'h2'
    );

    title.className=
        'teacher-module-title';

    title.textContent=
        module?.title||
        modulePlan.id;

    const liveStatus=
        modulePlan.liveStatus||
        module?.subtitle||
        module?.description||
        '';

    text.appendChild(
        title
    );

    if(liveStatus){
        const subtitle=
            document.createElement(
                'p'
            );

        subtitle.className=
            'teacher-module-subtitle';

        subtitle.textContent=
            liveStatus;

        text.appendChild(
            subtitle
        );
    }

    identity.appendChild(
        icon
    );

    identity.appendChild(
        text
    );

    header.appendChild(
        identity
    );

    if(modulePlan.status){
        const status=
            document.createElement(
                'span'
            );

        status.className=
            'teacher-module-status';

        status.textContent=
            modulePlan.status;

        header.appendChild(
            status
        );
    }

    header.addEventListener(
        'click',
        ()=>{
            selectModule(
                stagePlan,
                modulePlan.id
            );
        }
    );

    header.addEventListener(
        'keydown',
        event=>{
            if(
                event.key==='Enter'||
                event.key===' '
            ){
                event.preventDefault();

                selectModule(
                    stagePlan,
                    modulePlan.id
                );
            }
        }
    );

    card.appendChild(
        header
    );

    let content=null;

    if(isExpanded){
        content=document.createElement(
            'div'
        );

        content.className=
            'teacher-module-content';

        content.id=
            `teacherModule_${modulePlan.id}`;

        card.appendChild(
            content
        );
    }

    return{
        card,
        content,
        modulePlan,
        isExpanded
    };
}

function activateModuleCard(moduleCard){
    const{
        content,
        modulePlan,
        isExpanded
    }=moduleCard;

    if(!isExpanded||!content){
        return;
    }

    renderModule(
        modulePlan.id,
        content
    );
}

function selectModule(
    stagePlan,
    moduleId
){
    const updatedPlan={
        ...stagePlan,

        modules:(stagePlan.modules||[])
            .map(modulePlan=>({
                ...modulePlan,

                state:
                    modulePlan.id===moduleId
                        ?'active'
                        :modulePlan.state===
                            'completed'
                            ?'completed'
                            :'collapsed'
            }))
    };

    renderStage(
        updatedPlan
    );
}
