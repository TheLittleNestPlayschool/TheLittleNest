
import {
    renderStage
} from './ta_stage_renderer.js';

import {
    buildDirectorStage
} from './ta_director.js';

export function startTeacherExperience(){

    const stagePlan=
        buildDirectorStage();

    renderStage(
        stagePlan
    );

}
