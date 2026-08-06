export function selectStageModule(
    stagePlan,
    moduleId
){
    const modules=
        Array.isArray(
            stagePlan?.modules
        )
            ?stagePlan.modules
            :[];

    return{
        ...stagePlan,

        modules:modules.map(
            modulePlan=>{
                return{
                    ...modulePlan,

                    state:getNextModuleState(
                        modulePlan,
                        moduleId
                    )
                };
            }
        )
    };
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
