import{
    getModule
}from'./ta_module_registry.js';

const STANDARD_LAYOUT_MODE=
    'standard';

const FOCUSED_LAYOUT_MODE=
    'focused';

export function selectStageModule(
    stagePlan,
    moduleId
){
    return{
        ...stagePlan,

        layoutMode:
            getModuleLayoutMode(
                moduleId
            ),

        modules:
            getUpdatedModules(
                stagePlan,
                moduleId
            )
    };
}

export function toggleStageLayout(
    stagePlan
){
    const currentLayoutMode=
        stagePlan?.layoutMode||
        STANDARD_LAYOUT_MODE;

    return{
        ...stagePlan,

        layoutMode:
            currentLayoutMode===
            FOCUSED_LAYOUT_MODE
                ?STANDARD_LAYOUT_MODE
                :FOCUSED_LAYOUT_MODE
    };
}

function getUpdatedModules(
    stagePlan,
    moduleId
){
    const modules=
        Array.isArray(
            stagePlan?.modules
        )
            ?stagePlan.modules
            :[];

    return modules.map(
        modulePlan=>{
            return{
                ...modulePlan,

                state:
                    getNextModuleState(
                        modulePlan,
                        moduleId
                    )
            };
        }
    );
}

function getModuleLayoutMode(
    moduleId
){
    const module=
        getModule(
            moduleId
        );

    return(
        module?.defaultStageLayout===
        FOCUSED_LAYOUT_MODE
    )
        ?FOCUSED_LAYOUT_MODE
        :STANDARD_LAYOUT_MODE;
}

function getNextModuleState(
    modulePlan,
    selectedModuleId
){
    if(
        modulePlan.id===
        selectedModuleId
    ){
        return'active';
    }

    if(
        modulePlan.state===
        'completed'
    ){
        return'completed';
    }

    if(
        modulePlan.state===
        'needs_attention'
    ){
        return'needs_attention';
    }

    return'collapsed';
}
