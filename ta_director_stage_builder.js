import{
    getModule
}from'./ta_module_registry.js';

const STANDARD_LAYOUT_MODE=
    'standard';

const FOCUSED_LAYOUT_MODE=
    'focused';

export function buildStagePlan(
    priorityList
){
    const normalizedPriorityList=
        Array.isArray(priorityList)
            ?priorityList
            :[];

    const modules=
        normalizedPriorityList.map(
            (
                priorityItem,
                index
            )=>{
                const modulePlan=
                    normalizePriorityItem(
                        priorityItem
                    );

                return{
                    ...modulePlan,

                    state:
                        index===0
                            ?'active'
                            :'collapsed'
                };
            }
        );

    return{
        context:null,

        layoutMode:
            getInitialLayoutMode(
                modules
            ),

        modules
    };
}

function normalizePriorityItem(
    priorityItem
){
    if(
        typeof priorityItem===
        'string'
    ){
        return{
            id:priorityItem
        };
    }

    if(
        priorityItem&&
        typeof priorityItem===
        'object'&&
        priorityItem.id
    ){
        return{
            ...priorityItem
        };
    }

    return{
        id:String(
            priorityItem||
            ''
        )
    };
}

function getInitialLayoutMode(
    modules
){
    const activeModule=
        modules.find(modulePlan=>{
            return(
                modulePlan.state===
                'active'
            );
        })||
        null;

    if(!activeModule){
        return STANDARD_LAYOUT_MODE;
    }

    const module=
        getModule(
            activeModule.id
        );

    return(
        module?.defaultStageLayout===
        FOCUSED_LAYOUT_MODE
    )
        ?FOCUSED_LAYOUT_MODE
        :STANDARD_LAYOUT_MODE;
}
