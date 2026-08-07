import{
    API_URLS
}from'./ta_config.js';

import{
    apiRequest
}from'./ta_api.js';

import{
    setSessionAttendanceCompletions
}from'./ta_state.js';

import{
    renderStage
}from'./ta_stage_renderer.js';

import{
    buildDirectorStage
}from'./ta_director.js';

let refreshPromise=null;

window.addEventListener(
    'teacher-task-completed',
    ()=>{
        refreshTeacherExperience();
    }
);

export async function startTeacherExperience(){
    const stagePlan=
        await buildDirectorStage();

    renderStage(
        stagePlan
    );
}

export async function refreshTeacherExperience(){
    if(refreshPromise){
        return refreshPromise;
    }

    refreshPromise=
        performExperienceRefresh();

    try{
        await refreshPromise;
    }finally{
        refreshPromise=null;
    }
}

async function performExperienceRefresh(){
    await refreshSessionAttendanceCompletions();

    await startTeacherExperience();
}

async function refreshSessionAttendanceCompletions(){
    const completionsUrl=
        new URL(
            API_URLS
                .getSessionAttendanceCompletions
        );

    completionsUrl.searchParams.set(
        'seven_days_ago',
        getSevenDaysAgo()
    );

    const completions=
        await apiRequest(
            completionsUrl.toString()
        );

    setSessionAttendanceCompletions(
        completions
    );

    console.log(
        'Refreshed Session Attendance Completions:',
        completions
    );
}

function getSevenDaysAgo(){
    const date=
        new Date();

    date.setDate(
        date.getDate()-7
    );

    return formatManilaDate(
        date
    );
}

function formatManilaDate(date){
    const parts=
        new Intl.DateTimeFormat(
            'en-CA',
            {
                timeZone:
                    'Asia/Manila',

                year:
                    'numeric',

                month:
                    '2-digit',

                day:
                    '2-digit'
            }
        ).formatToParts(
            date
        );

    const values=
        Object.fromEntries(
            parts.map(
                part=>[
                    part.type,
                    part.value
                ]
            )
        );

    return(
        `${values.year}-`+
        `${values.month}-`+
        `${values.day}`
    );
}
