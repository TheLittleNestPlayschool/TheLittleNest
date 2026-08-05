
export function renderAttendanceStudent(workspace,context){
    const{students,session,actions}=context;
    const index=session.currentStudentIndex||0;
    const student=students[index];

    if(!student){
        actions.showReview();
        return;
    }

    const container=document.createElement('section');
    container.className='attendance-experience attendance-student';

    const progress=document.createElement('p');
    progress.className='attendance-progress';
    progress.textContent=`${index+1} of ${students.length}`;

    const avatar=document.createElement('div');
    avatar.className='attendance-student-avatar';
    avatar.textContent=getStudentInitials(student);

    const name=document.createElement('h3');
    name.className='attendance-student-name';
    name.textContent=getStudentName(student);

    const question=document.createElement('p');
    question.className='attendance-student-question';
    question.textContent=`Was ${getFirstName(student)} with us today?`;

    const choices=document.createElement('div');
    choices.className='attendance-choice-grid';

    const presentButton=createChoiceButton({
        label:'Here Today',
        value:'present',
        student,
        session,
        onSelect:actions.selectStatus
    });

    const absentButton=createChoiceButton({
        label:'Not Here',
        value:'absent',
        student,
        session,
        onSelect:actions.selectStatus
    });

    choices.appendChild(presentButton);
    choices.appendChild(absentButton);

    const navigation=document.createElement('div');
    navigation.className='attendance-navigation';

    const backButton=document.createElement('button');
    backButton.type='button';
    backButton.className='attendance-text-button';
    backButton.textContent=index===0?'Back':'Previous Student';

    backButton.addEventListener('click',()=>{
        if(index===0){
            actions.showIntro();
            return;
        }

        actions.showStudent(index-1);
    });

    const reviewButton=document.createElement('button');
    reviewButton.type='button';
    reviewButton.className='attendance-text-button';
    reviewButton.textContent='Review Attendance';
    reviewButton.addEventListener('click',actions.showReview);

    navigation.appendChild(backButton);
    navigation.appendChild(reviewButton);

    container.appendChild(progress);
    container.appendChild(avatar);
    container.appendChild(name);
    container.appendChild(question);
    container.appendChild(choices);
    container.appendChild(navigation);

    workspace.appendChild(container);
}

function createChoiceButton({
    label,
    value,
    student,
    session,
    onSelect
}){
    const button=document.createElement('button');

    button.type='button';
    button.className='attendance-choice-button';
    button.dataset.value=value;
    button.textContent=label;

    if(session.selections?.[student.id]===value){
        button.classList.add('is-selected');
    }

    button.addEventListener('click',()=>{
        onSelect(student.id,value);
    });

    return button;
}

function getStudentName(student){
    return student.name||
        [student.first_name,student.last_name]
            .filter(Boolean)
            .join(' ')||
        `Student ${student.id}`;
}

function getFirstName(student){
    const name=getStudentName(student);

    return student.first_name||
        name.split(' ')[0]||
        'this student';
}

function getStudentInitials(student){
    const name=getStudentName(student);

    const initials=name
        .split(' ')
        .filter(Boolean)
        .slice(0,2)
        .map(part=>part.charAt(0).toUpperCase())
        .join('');

    return initials||'•';
}
