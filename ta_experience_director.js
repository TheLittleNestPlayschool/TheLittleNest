import{renderStage}from'./ta_stage_renderer.js';
import{buildDirectorStage}from'./ta_director.js';

let refreshPromise=null;

window.addEventListener('teacher-task-completed',()=>{
    refreshTeacherExperience();
});

export async function startTeacherExperience(){
    const stagePlan=await buildDirectorStage();
    renderStage(stagePlan);
}

export async function refreshTeacherExperience(){
    if(refreshPromise){return refreshPromise;}
    refreshPromise=startTeacherExperience();
    try{
        await refreshPromise;
    }finally{
        refreshPromise=null;
    }
}
