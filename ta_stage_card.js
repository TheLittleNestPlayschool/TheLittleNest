import{
    getModule
}from'./ta_module_registry.js';

export function createModuleCard(
    stagePlan,
    modulePlan,
    onSelect
){
    const module=getModule(
        modulePlan.id
    );

    const card=document.createElement(
        'section'
    );

    configureCard(
        card,
        modulePlan
    );

    const header=createModuleHeader({
        stagePlan,
        modulePlan,
        module,
        onSelect
    });

    card.appendChild(
        header
    );

    const isExpanded=
        modulePlan.state==='active'||
        modulePlan.state==='expanded';

    let content=null;

    if(isExpanded){
        content=createModuleContent(
            modulePlan.id
        );

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

function configureCard(
    card,
    modulePlan
){
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

    if(
        modulePlan.state===
        'completed'
    ){
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
}

function createModuleHeader({
    modulePlan,
    module,
    onSelect
}){
    const header=document.createElement(
        'header'
    );

    const isExpanded=
        modulePlan.state==='active'||
        modulePlan.state==='expanded';

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

    const identity=createModuleIdentity(
        module,
        modulePlan
    );

    header.appendChild(
        identity
    );

    if(modulePlan.status){
        header.appendChild(
            createModuleStatus(
                modulePlan.status
            )
        );
    }

    connectHeaderEvents({
        header,
        moduleId:modulePlan.id,
        onSelect
    });

    return header;
}

function createModuleIdentity(
    module,
    modulePlan
){
    const identity=document.createElement(
        'div'
    );

    identity.className=
        'teacher-module-identity';

    identity.appendChild(
        createModuleIcon(
            module
        )
    );

    identity.appendChild(
        createModuleText(
            module,
            modulePlan
        )
    );

    return identity;
}

function createModuleIcon(module){
    const icon=document.createElement(
        'span'
    );

    icon.className=
        'teacher-module-icon';

    icon.textContent=
        module?.icon||
        '';

    return icon;
}

function createModuleText(
    module,
    modulePlan
){
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

    text.appendChild(
        title
    );

    const liveStatus=
        modulePlan.liveStatus||
        module?.subtitle||
        module?.description||
        '';

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

    return text;
}

function createModuleStatus(statusText){
    const status=document.createElement(
        'span'
    );

    status.className=
        'teacher-module-status';

    status.textContent=
        statusText;

    return status;
}

function createModuleContent(moduleId){
    const content=document.createElement(
        'div'
    );

    content.className=
        'teacher-module-content';

    content.id=
        `teacherModule_${moduleId}`;

    return content;
}

function connectHeaderEvents({
    header,
    moduleId,
    onSelect
}){
    header.addEventListener(
        'click',
        ()=>{
            selectModule(
                moduleId,
                onSelect
            );
        }
    );

    header.addEventListener(
        'keydown',
        event=>{
            if(
                event.key!=='Enter'&&
                event.key!==' '
            ){
                return;
            }

            event.preventDefault();

            selectModule(
                moduleId,
                onSelect
            );
        }
    );
}

function selectModule(
    moduleId,
    onSelect
){
    if(
        typeof onSelect!=='function'
    ){
        return;
    }

    onSelect(
        moduleId
    );
}
