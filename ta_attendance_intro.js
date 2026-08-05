
export function renderAttendanceIntro(workspace,context){
    const{state,students,session,actions}=context;

    const container=document.createElement('section');
    container.className='attendance-experience attendance-introduction';

    const eyebrow=document.createElement('p');
    eyebrow.className='attendance-eyebrow';
    eyebrow.textContent=state.relevantSession?.name||'Today’s Session';

    const title=document.createElement('h3');
    title.className='attendance-experience-title';
    title.textContent='Let’s finish today’s session.';

    const description=document.createElement('p');
    description.className='attendance-experience-description';
    description.textContent=getStudentCountMessage(students.length);

    const beginButton=document.createElement('button');
    beginButton.type='button';
    beginButton.className='attendance-primary-button';
    beginButton.textContent=hasSelections(session)
        ?'Continue Attendance'
        :'Begin Attendance';

    if(students.length===0){
        const emptyMessage=document.createElement('p');
        emptyMessage.className='attendance-empty-message';
        emptyMessage.textContent='No students are currently listed for this session.';

        beginButton.textContent='Find a Student';
        beginButton.addEventListener('click',actions.addStudent);

        container.appendChild(eyebrow);
        container.appendChild(title);
        container.appendChild(description);
        container.appendChild(emptyMessage);
        container.appendChild(beginButton);
        workspace.appendChild(container);
        return;
    }

    beginButton.addEventListener('click',actions.begin);

    const reviewButton=document.createElement('button');
    reviewButton.type='button';
    reviewButton.className='attendance-text-button';
    reviewButton.textContent='Review Everyone';
    reviewButton.addEventListener('click',actions.showReview);

    container.appendChild(eyebrow);
    container.appendChild(title);
    container.appendChild(description);
    container.appendChild(beginButton);
    container.appendChild(reviewButton);

    workspace.appendChild(container);
}

function hasSelections(session){
    return Object.keys(session.selections||{}).length>0;
}

function getStudentCountMessage(studentCount){
    if(studentCount===1){
        return'One little learner was expected today.';
    }

    return`${studentCount} little learners were expected today.`;
}
