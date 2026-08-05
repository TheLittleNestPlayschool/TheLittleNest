import {
    renderStage
} from './ta_stage_renderer.js';

import {
    buildDirectorStage
} from './ta_director.js';

export async function startTeacherExperience(){

    const stagePlan=
        await buildDirectorStage();

    renderStage(
        stagePlan
    );

}
