import{getWorkspace,clearWorkspace}from'./ta_ui.js';
import{getState}from'./ta_state.js';
import{apiRequest}from'./ta_api.js';
import{API_URLS}from'./ta_config.js';

export function renderClassExperienceModule(){
    clearWorkspace();
    const workspace=getWorkspace();
    if(!workspace)return;
    const state=getState();
    const container=document.createElement('section');
    container.className='teacher-class-experience';
    container.innerHTML=`
        <div class="teacher-class-experience-heading">
            <strong>Add Class Experience</strong>
            <span>Something happened in this class that wasn't already captured by the planned session.</span>
        </div>
        <label class="teacher-class-experience-field">
            <span>Select Session</span>
            <select class="teacher-class-experience-select"><option value="">Choose a session...</option></select>
        </label>
        <label class="teacher-class-experience-field">
            <span>What happened?</span>
            <textarea class="teacher-class-experience-text" rows="5" placeholder="Tell us what happened in class today..."></textarea>
        </label>
        <div class="teacher-class-experience-actions">
            <button type="button" class="teacher-class-experience-save">Save Class Experience</button>
        </div>
        <p class="teacher-class-experience-status" aria-live="polite"></p>
    `;
    workspace.appendChild(container);
    const select=container.querySelector('.teacher-class-experience-select');
    const textarea=container.querySelector('.teacher-class-experience-text');
    const saveButton=container.querySelector('.teacher-class-experience-save');
    const status=container.querySelector('.teacher-class-experience-status');
    const sessions=Array.isArray(state.context?.sessions)?state.context.sessions:[];
    sessions.filter(session=>session?.id).forEach(session=>{
        const option=document.createElement('option');
        option.value=String(session.id);
        option.textContent=getSessionLabel(session);
        select.appendChild(option);
    });
    if(state.relevantSession?.id){
        select.value=String(state.relevantSession.id);
    }
    saveButton.addEventListener('click',async()=>{
        const sessionId=Number(select.value);
        const experienceRaw=textarea.value.trim();
        if(!sessionId){status.textContent='Please select a session.';select.focus();return;}
        if(!experienceRaw){status.textContent='Tell us what happened first.';textarea.focus();return;}
        saveButton.disabled=true;
        status.textContent='Saving...';
        try{
            await apiRequest(API_URLS.postSessionExperience,{method:'POST',body:{session_id:sessionId,experience_raw:experienceRaw}});
            textarea.value='';
            status.textContent='Class experience saved.';
        }catch(error){
            status.textContent=error?.message||'Unable to save class experience.';
        }finally{
            saveButton.disabled=false;
        }
    });
}

function getSessionLabel(session){
    const name=session?.name||session?.session_name||session?.title||'';
    const start=session?.start_time||session?.session_start||'';
    const end=session?.end_time||session?.session_end||'';
    const time=start&&end?`${start} - ${end}`:(start||end);
    return[name,time].filter(Boolean).join(' · ')||`Session ${session.id}`;
}
