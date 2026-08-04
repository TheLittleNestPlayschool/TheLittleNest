import {
    renderStage
} from './ta_stage_renderer.js';

export function startTeacherExperience(){
    const stagePlan={
        context:null,
        modules:[
            {
                id:'attendance',
                state:'active'
            },
            {
                id:'observations',
                state:'collapsed'
            },
            {
                id:'media',
                state:'collapsed'
            },
            {
                id:'moments',
                state:'collapsed'
            },
            {
                id:'reflection',
                state:'collapsed'
            },
            {
                id:'messages',
                state:'collapsed'
            },
            {
                id:'see_tomorrow',
                state:'collapsed'
            }
        ]
    };

    renderStage(stagePlan);
}
