
export function buildStagePlan(
    priorityList
){
    const normalizedPriorityList=
        Array.isArray(priorityList)
            ?priorityList
            :[];

    return{
        context:null,

        modules:
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
            )
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
