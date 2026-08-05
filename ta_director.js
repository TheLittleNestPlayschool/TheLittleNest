import {
    buildDirectorSnapshot
} from './ta_director_snapshot.js';

import {
    getPriorityList
} from './ta_director_priorities.js';

import {
    buildStagePlan
} from './ta_director_stage_builder.js';

export function buildDirectorStage(){

    const snapshot=
        buildDirectorSnapshot();

    const priorityList=
        getPriorityList(
            snapshot
        );

    return buildStagePlan(
        priorityList
    );

}
