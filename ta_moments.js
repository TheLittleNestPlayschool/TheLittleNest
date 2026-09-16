import{getWorkspace,clearWorkspace}from'./ta_ui.js';
import{getState}from'./ta_state.js';
import{apiRequest}from'./ta_api.js';
import{API_URLS}from'./ta_config.js';

export function renderMomentsModule(){
    clearWorkspace();
    const workspace=getWorkspace();
    if(!workspace)return;
    const state=getState();
    const students=Array.isArray(state.locationStudents)?state.locationStudents:[];
    const container=document.createElement('section');
    container.className='teacher-moments';
    container.innerHTML=`
        <div class="teacher-moments-heading">
            <strong>Add a Moment</strong>
            <span>Choose a child and capture the moment exactly as it happened.</span>
        </div>
        <label class="teacher-moments-field">
            <span>Select Student</span>
            <select class="teacher-moments-select"><option value="">Choose a student...</option></select>
        </label>
        <label class="teacher-moments-field">
            <span>Moment</span>
            <textarea class="teacher-moments-text" rows="5" placeholder="What happened?"></textarea>
        </label>
        <div class="teacher-moments-actions">
            <button type="button" class="teacher-moments-save">Save Moment</button>
        </div>
        <p class="teacher-moments-status" aria-live="polite"></p>
    `;
    workspace.appendChild(container);
    const select=container.querySelector('.teacher-moments-select');
    const textarea=container.querySelector('.teacher-moments-text');
    const saveButton=container.querySelector('.teacher-moments-save');
    const status=container.querySelector('.teacher-moments-status');
    [...students].sort((a,b)=>getStudentName(a).localeCompare(getStudentName(b))).forEach(student=>{
        if(!student?.id)return;
        const option=document.createElement('option');
        option.value=String(student.id);
        option.textContent=getStudentName(student);
        select.appendChild(option);
    });
    saveButton.addEventListener('click',async()=>{
        const studentId=Number(select.value);
        const moment=textarea.value.trim();
        if(!studentId){status.textContent='Please select a student.';select.focus();return;}
        if(!moment){status.textContent='Enter the moment first.';textarea.focus();return;}
        const student=students.find(item=>String(item?.id)===String(studentId));
        const sessionId=getStudentSessionId(student,state);
        saveButton.disabled=true;
        status.textContent='Saving...';
        try{
            await apiRequest(API_URLS.postStudentMoment,{method:'POST',body:{student_id:studentId,session_id:sessionId,moment}});
            select.value='';
            textarea.value='';
            status.textContent='Moment saved.';
            select.focus();
        }catch(error){
            status.textContent=error?.message||'Unable to save moment.';
        }finally{
            saveButton.disabled=false;
        }
    });
}

function getStudentSessionId(student,state){
    const enrolledSessionId=Number(student?.session_enrolled);
    if(Number.isFinite(enrolledSessionId)&&enrolledSessionId>0){
        return enrolledSessionId;
    }
    const relevantSessionId=Number(state?.relevantSession?.id);
    if(!Number.isFinite(relevantSessionId)||relevantSessionId<=0){
        return null;
    }
    const belongsToRelevantSession=(state?.expectedStudents||[]).some(item=>{
        return String(item?.id)===String(student?.id);
    });
    return belongsToRelevantSession?relevantSessionId:null;
}

function getStudentName(student){
    return student?.name||student?.full_name||[student?.first_name,student?.last_name].filter(Boolean).join(' ')||`Student ${student?.id||''}`;
}
