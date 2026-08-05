export function renderAttendanceComplete(workspace,context){
    const{students,session,actions}=context;

    const presentCount=students.filter(student=>{
        return session.selections?.[student.id]==='present';
    }).length;

    const absentCount=students.filter(student=>{
        return session.selections?.[student.id]==='absent';
    }).length;

    const container=document.createElement('section');
    container.className='attendance-experience attendance-complete';

    const mark=document.createElement('div');
    mark.className='attendance-complete-mark';
    mark.textContent='✓';

    const title=document.createElement('h3');
    title.className='attendance-experience-title';
    title.textContent='Attendance Complete';

    const summary=document.createElement('p');
    summary.className='attendance-complete-summary';
    summary.textContent=
        `${presentCount} here today · `+
        `${absentCount} not here`;

    const correctionButton=document.createElement('button');
    correctionButton.type='button';
    correctionButton.className='attendance-secondary-button';
    correctionButton.textContent='Review or Correct Attendance';
    correctionButton.addEventListener('click',actions.showReview);

    container.appendChild(mark);
    container.appendChild(title);
    container.appendChild(summary);
    container.appendChild(correctionButton);

    workspace.appendChild(container);
}
