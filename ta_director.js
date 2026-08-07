import{
    buildDirectorSnapshot
}from'./ta_director_snapshot.js';

import{
    buildOverdueAttendanceQueue
}from'./ta_director_overdue.js';

import{
    getPriorityList
}from'./ta_director_priorities.js';

import{
    buildStagePlan
}from'./ta_director_stage_builder.js';

export async function buildDirectorStage(){

    const snapshot=
        await buildDirectorSnapshot();

    const overdueAttendanceQueue=
        buildOverdueAttendanceQueue(
            snapshot
        );

    const priorityList=
        getPriorityList(
            snapshot,
            overdueAttendanceQueue
        );

    return buildStagePlan(
        priorityList
    );
}
