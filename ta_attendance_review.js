export function renderAttendanceReview(workspace,context){
    const{students,session,actions}=context;

    const container=document.createElement('section');
    container.className='attendance-experience attendance-review';

    const header=document.createElement('div');
    header.className='attendance-review-header';

    const heading=document.createElement('div');

    const title=document.createElement('h3');
    title.className='attendance-experience-title';
    title.textContent='Today’s Attendance';

    const description=document.createElement('p');
    description.className='attendance-experience-description';
    description.textContent=getAttendanceSummary(students,session);

    heading.appendChild(title);
    heading.appendChild(description);
    header.appendChild(heading);

    const list=document.createElement('div');
    list.className='attendance-review-list';

    students.forEach(student=>{
        list.appendChild(
            createStudentRow(
                student,
                session,
                actions
            )
        );
    });

    const addStudentButton=document.createElement('button');
    addStudentButton.type='button';
    addStudentButton.className='attendance-secondary-button';
    addStudentButton.textContent='Add Another Student';
    addStudentButton.addEventListener('click',actions.addStudent);

    const actionsRow=document.createElement('div');
    actionsRow.className='attendance-review-actions';

    const backButton=document.createElement('button');
    backButton.type='button';
    backButton.className='attendance-text-button';
    backButton.textContent='Back';
    backButton.addEventListener('click',actions.showIntro);

    const submitButton=document.createElement('button');
    submitButton.type='button';
    submitButton.className='attendance-primary-button';
    submitButton.textContent=session.isSubmitting
        ?'Saving Attendance...'
        :'Complete Attendance';

    submitButton.disabled=
        session.isSubmitting||
        !attendanceIsComplete(students,session);

    submitButton.addEventListener('click',actions.submit);

    actionsRow.appendChild(backButton);
    actionsRow.appendChild(submitButton);

    container.appendChild(header);

    if(students.length===0){
        const emptyMessage=document.createElement('p');
        emptyMessage.className='attendance-empty-message';
        emptyMessage.textContent='No students have been added yet.';
        container.appendChild(emptyMessage);
    }else{
        container.appendChild(list);
    }

    container.appendChild(addStudentButton);
    container.appendChild(actionsRow);

    workspace.appendChild(container);
}

function createStudentRow(student,session,actions){
    const row=document.createElement('div');
    row.className='attendance-review-row';

    const studentInfo=document.createElement('div');
    studentInfo.className='attendance-review-student';

    const avatar=document.createElement('span');
    avatar.className='attendance-review-avatar';
    avatar.textContent=getStudentInitials(student);

    const name=document.createElement('span');
    name.className='attendance-review-name';
    name.textContent=getStudentName(student);

    studentInfo.appendChild(avatar);
    studentInfo.appendChild(name);

    const choices=document.createElement('div');
    choices.className='attendance-review-choices';

    const presentButton=createStatusButton({
        student,
        status:'present',
        label:'Here',
        session,
        actions
    });

    const absentButton=createStatusButton({
        student,
        status:'absent',
        label:'Not Here',
        session,
        actions
    });

    choices.appendChild(presentButton);
    choices.appendChild(absentButton);

    row.appendChild(studentInfo);
    row.appendChild(choices);

    if(student.isAddedStudent){
        const removeButton=document.createElement('button');
        removeButton.type='button';
        removeButton.className='attendance-remove-button';
        removeButton.textContent='Remove';

        removeButton.addEventListener('click',()=>{
            actions.removeStudent(student.id);
        });

        row.appendChild(removeButton);
    }

    return row;
}

function createStatusButton({
    student,
    status,
    label,
    session,
    actions
}){
    const button=document.createElement('button');
    button.type='button';
    button.className='attendance-review-choice';
    button.dataset.status=status;
    button.textContent=label;

    if(session.selections?.[student.id]===status){
        button.classList.add('is-selected');
    }

    button.addEventListener('click',()=>{
        actions.selectStatus(
            student.id,
            status
        );
    });

    return button;
}

function attendanceIsComplete(students,session){
    return students.length>0&&students.every(student=>{
        return Boolean(session.selections?.[student.id]);
    });
}

function getAttendanceSummary(students,session){
    const completedCount=students.filter(student=>{
        return Boolean(session.selections?.[student.id]);
    }).length;

    if(students.length===0){
        return'Add the learners who attended this session.';
    }

    if(completedCount===students.length){
        return'Everyone has been checked. Make any changes before completing attendance.';
    }

    return`${completedCount} of ${students.length} learners checked`;
}

function getStudentName(student){
    return student.name||
        [student.first_name,student.last_name]
            .filter(Boolean)
            .join(' ')||
        `Student ${student.id}`;
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
