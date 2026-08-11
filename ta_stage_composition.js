const DESKTOP_TASKS_ABOVE_LIVING=
    5;

const MOBILE_TASKS_AROUND_LIVING=
    3;

const MOBILE_BREAKPOINT=
    600;

const ANCHORED_LAST_MODULE_ID=
    'teacher_information';


export function composeStagePlan(
    stagePlan
){
    const modules=
        Array.isArray(
            stagePlan?.modules
        )
            ?stagePlan.modules
            :[];


    if(modules.length===0){
        return{
            ...stagePlan,
            modules:[]
        };
    }


    const livingModule=
        findLivingModule(
            modules
        );


    if(!livingModule){
        return{
            ...stagePlan,
            modules:[]
        };
    }


    const limits=
        getStageLimits();


    const arrangedModules=
        livingModule.id===
        ANCHORED_LAST_MODULE_ID
            ?arrangeWithAnchoredModuleLiving(
                modules,
                livingModule,
                limits
            )
            :arrangeWithAnchoredModuleLast(
                modules,
                livingModule,
                limits
            );


    return{
        ...stagePlan,
        modules:
            arrangedModules
    };
}


function findLivingModule(
    modules
){
    const activeModule=
        modules.find(
            modulePlan=>{
                return(
                    modulePlan.state===
                    'active'||
                    modulePlan.state===
                    'expanded'
                );
            }
        );


    return(
        activeModule||
        modules[0]||
        null
    );
}


function arrangeWithAnchoredModuleLast(
    modules,
    livingModule,
    limits
){
    const anchoredModule=
        modules.find(
            modulePlan=>{
                return(
                    modulePlan.id===
                    ANCHORED_LAST_MODULE_ID
                );
            }
        );


    const rotatingModules=
        modules.filter(
            modulePlan=>{
                return(
                    modulePlan.id!==
                    ANCHORED_LAST_MODULE_ID
                );
            }
        );


    const livingIndex=
        rotatingModules.findIndex(
            modulePlan=>{
                return(
                    modulePlan.id===
                    livingModule.id
                );
            }
        );


    /*
      Teacher Information is anchored at the
      bottom.

      On mobile it counts as one of the visible
      tasks below the Living Task.
    */

    const rotatingNextLimit=
        anchoredModule
            ?reduceLimitByOne(
                limits.next
            )
            :limits.next;


    const arrangedModules=
        arrangeAroundLiving(
            rotatingModules,
            livingIndex>=0
                ?livingIndex
                :0,
            limits.previous,
            rotatingNextLimit
        );


    if(!anchoredModule){
        return arrangedModules;
    }


    const nextDistance=
        getNextDistance(
            arrangedModules
        );


    arrangedModules.push(
        createPositionedModule(
            anchoredModule,
            {
                side:
                    'next',

                distance:
                    nextDistance,

                position:
                    `next-${nextDistance}`
            }
        )
    );


    return arrangedModules;
}


function arrangeWithAnchoredModuleLiving(
    modules,
    livingModule,
    limits
){
    const otherModules=
        modules.filter(
            modulePlan=>{
                return(
                    modulePlan.id!==
                    ANCHORED_LAST_MODULE_ID
                );
            }
        );


    const aboveCount=
        Math.min(
            limits.previous,
            otherModules.length
        );


    const aboveModules=
        otherModules.slice(
            Math.max(
                0,
                otherModules.length-
                aboveCount
            )
        );


    let belowModules=
        otherModules.slice(
            0,
            Math.max(
                0,
                otherModules.length-
                aboveCount
            )
        );


    if(
        Number.isFinite(
            limits.next
        )
    ){
        belowModules=
            belowModules.slice(
                0,
                limits.next
            );
    }


    const arrangedModules=[];


    aboveModules.forEach(
        (
            modulePlan,
            positionIndex
        )=>{
            const distance=
                aboveCount-
                positionIndex;


            arrangedModules.push(
                createPositionedModule(
                    modulePlan,
                    {
                        side:
                            'previous',

                        distance,

                        position:
                            `previous-${distance}`
                    }
                )
            );
        }
    );


    arrangedModules.push(
        createPositionedModule(
            livingModule,
            {
                side:
                    'living',

                distance:
                    0,

                position:
                    'living'
            }
        )
    );


    belowModules.forEach(
        (
            modulePlan,
            positionIndex
        )=>{
            const distance=
                positionIndex+1;


            arrangedModules.push(
                createPositionedModule(
                    modulePlan,
                    {
                        side:
                            'next',

                        distance,

                        position:
                            `next-${distance}`
                    }
                )
            );
        }
    );


    return arrangedModules;
}


function arrangeAroundLiving(
    modules,
    livingIndex,
    previousLimit,
    nextLimit
){
    const moduleCount=
        modules.length;


    if(moduleCount===0){
        return[];
    }


    const aboveCount=
        Math.min(
            previousLimit,
            moduleCount-1
        );


    const aboveIndices=
        getAboveIndices(
            moduleCount,
            livingIndex,
            aboveCount
        );


    const reservedIndices=
        new Set([
            livingIndex,
            ...aboveIndices
        ]);


    const belowIndices=
        getBelowIndices(
            moduleCount,
            livingIndex,
            reservedIndices,
            nextLimit
        );


    const arrangedModules=[];


    aboveIndices.forEach(
        (
            moduleIndex,
            positionIndex
        )=>{
            const distance=
                aboveCount-
                positionIndex;


            arrangedModules.push(
                createPositionedModule(
                    modules[moduleIndex],
                    {
                        side:
                            'previous',

                        distance,

                        position:
                            `previous-${distance}`
                    }
                )
            );
        }
    );


    arrangedModules.push(
        createPositionedModule(
            modules[livingIndex],
            {
                side:
                    'living',

                distance:
                    0,

                position:
                    'living'
            }
        )
    );


    belowIndices.forEach(
        (
            moduleIndex,
            positionIndex
        )=>{
            const distance=
                positionIndex+1;


            arrangedModules.push(
                createPositionedModule(
                    modules[moduleIndex],
                    {
                        side:
                            'next',

                        distance,

                        position:
                            `next-${distance}`
                    }
                )
            );
        }
    );


    return arrangedModules;
}


function getAboveIndices(
    moduleCount,
    livingIndex,
    aboveCount
){
    const indices=[];


    for(
        let distance=aboveCount;
        distance>=1;
        distance-=1
    ){
        indices.push(
            wrapIndex(
                livingIndex-distance,
                moduleCount
            )
        );
    }


    return indices;
}


function getBelowIndices(
    moduleCount,
    livingIndex,
    reservedIndices,
    limit
){
    const indices=[];


    for(
        let step=1;
        step<moduleCount;
        step+=1
    ){
        if(
            Number.isFinite(
                limit
            )&&
            indices.length>=
            limit
        ){
            break;
        }


        const moduleIndex=
            wrapIndex(
                livingIndex+step,
                moduleCount
            );


        if(
            reservedIndices.has(
                moduleIndex
            )
        ){
            continue;
        }


        indices.push(
            moduleIndex
        );
    }


    return indices;
}


function getNextDistance(
    arrangedModules
){
    const nextModules=
        arrangedModules.filter(
            modulePlan=>{
                return(
                    modulePlan.stageSide===
                    'next'
                );
            }
        );


    return(
        nextModules.length+
        1
    );
}


function createPositionedModule(
    modulePlan,
    stagePosition
){
    return{
        ...modulePlan,

        stageSide:
            stagePosition.side,

        stageDistance:
            stagePosition.distance,

        stagePosition:
            stagePosition.position
    };
}


function getStageLimits(){
    const isMobile=
        typeof window!==
        'undefined'&&
        window.matchMedia(
            `(max-width:${MOBILE_BREAKPOINT}px)`
        ).matches;


    if(isMobile){
        return{
            previous:
                MOBILE_TASKS_AROUND_LIVING,

            next:
                MOBILE_TASKS_AROUND_LIVING
        };
    }


    return{
        previous:
            DESKTOP_TASKS_ABOVE_LIVING,

        next:
            Number.POSITIVE_INFINITY
    };
}


function reduceLimitByOne(
    limit
){
    if(
        !Number.isFinite(
            limit
        )
    ){
        return limit;
    }


    return Math.max(
        0,
        limit-1
    );
}


function wrapIndex(
    index,
    itemCount
){
    return(
        (
            index%
            itemCount
        )+
        itemCount
    )%
    itemCount;
}
