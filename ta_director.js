import {
    getState
} from './ta_state.js';

import {
    getPriorityList
} from './ta_director_priorities.js';

import {
    buildStagePlan
} from './ta_director_stage_builder.js';

export function buildDirectorStage(){

    const state=
        getState();

    const priorityList=
        getPriorityList(
            state
        );

    return buildStagePlan(
        priorityList
    );

}
