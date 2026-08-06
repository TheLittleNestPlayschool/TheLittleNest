const TASKS_ABOVE_LIVING=5;

const ANCHORED_LAST_MODULE_ID=
    'teacher_information';

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

    const arrangedModules=
        livingModule.id===
        ANCHORED_LAST_MODULE_ID
            ?arrangeWithAnchoredModuleLiving(
                modules,
                livingModule
            )
            :arrangeWithAnchoredModuleLast(
                modules,
                livingModule
            );

    return{
        ...stagePlan,
        modules:arrangedModules
    };
}

function findLivingModule(modules){
    const activeModule=
        modules.find(modulePlan=>{
            return(
                modulePlan.state==='active'||
                modulePlan.state==='expanded'
            );
        });

    return(
        activeModule||
        modules[0]||
        null
    );
}

function arrangeWithAnchoredModuleLast(
    modules,
    livingModule
){
    const anchoredModule=
        modules.find(modulePlan=>{
            return(
                modulePlan.id===
                ANCHORED_LAST_MODULE_ID
            );
        });

    const rotatingModules=
        modules.filter(modulePlan=>{
            return(
                modulePlan.id!==
                ANCHORED_LAST_MODULE_ID
            );
        });

    const livingIndex=
        rotatingModules.findIndex(
            modulePlan=>{
                return(
                    modulePlan.id===
                    livingModule.id
                );
            }
        );

    const arrangedModules=
        arrangeAroundLiving(
            rotatingModules,
            livingIndex>=0
                ?livingIndex
                :0
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
                side:'next',
                distance:nextDistance,
                position:
                    `next-${nextDistance}`
            }
        )
    );

    return arrangedModules;
}

function arrangeWithAnchoredModuleLiving(
    modules,
    livingModule
){
    const otherModules=
        modules.filter(modulePlan=>{
            return(
                modulePlan.id!==
                ANCHORED_LAST_MODULE_ID
            );
        });

    const aboveCount=
        Math.min(
            TASKS_ABOVE_LIVING,
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

    const belowModules=
        otherModules.slice(
            0,
            Math.max(
                0,
                otherModules.length-
                aboveCount
            )
        );

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
            livingModule,
            {
                side:'living',
                distance:0,
                position:'living'
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

function arrangeAroundLiving(
    modules,
    livingIndex
){
    const moduleCount=
        modules.length;

    if(moduleCount===0){
        return[];
    }

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

    return nextModules.length+1;
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
