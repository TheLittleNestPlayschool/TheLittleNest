import {
    buildDirectorSnapshot
} from './ta_director_snapshot.js';

import {
    getPriorityList
} from './ta_director_priorities.js';

import {
    buildStagePlan
} from './ta_director_stage_builder.js';

export async function buildDirectorStage(){

    const snapshot=
        await buildDirectorSnapshot();

    const priorityList=
        getPriorityList(
            snapshot
        );

    return buildStagePlan(
        priorityList
    );

}
