const TASKS_ABOVE_LIVING=5;

export function composeStagePlan(
    stagePlan
){
    const modules=
        Array.isArray(stagePlan?.modules)
            ?stagePlan.modules
            :[];

    if(modules.length===0){
        return{
            ...stagePlan,
            modules:[]
        };
    }

    const livingIndex=
        findLivingIndex(
            modules
        );

    const arrangedModules=
        arrangeAroundLiving(
            modules,
            livingIndex
        );

    return{
        ...stagePlan,
        modules:arrangedModules
    };
}

function findLivingIndex(modules){
    const activeIndex=
        modules.findIndex(modulePlan=>{
            return(
                modulePlan.state==='active'||
                modulePlan.state==='expanded'
            );
        });

    return activeIndex>=0
        ?activeIndex
        :0;
}

function arrangeAroundLiving(
    modules,
    livingIndex
){
    const moduleCount=
        modules.length;

    const aboveCount=
        Math.min(
            TASKS_ABOVE_LIVING,
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
            reservedIndices
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
                        side:'previous',
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
                side:'living',
                distance:0,
                position:'living'
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
                        side:'next',
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
    reservedIndices
){
    const indices=[];

    for(
        let step=1;
        step<moduleCount;
        step+=1
    ){
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

function wrapIndex(
    index,
    itemCount
){
    return(
        (
            index%itemCount
        )+
        itemCount
    )%itemCount;
}
