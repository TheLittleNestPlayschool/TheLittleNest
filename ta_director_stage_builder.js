export function buildStagePlan(
    priorityList
){

    return{

        context:null,

        modules:
            priorityList.map(
                (moduleId,index)=>({

                    id:moduleId,

                    state:
                        index===0
                            ? 'active'
                            : 'collapsed'

                })
            )

    };

}
