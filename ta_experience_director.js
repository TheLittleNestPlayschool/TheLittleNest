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
            },
            {
                id:'head_office_messages',
                state:'collapsed'
            },
            {
                id:'teacher_information',
                state:'collapsed'
            }
        ]
    };

    renderStage(stagePlan);
}
