
export function renderAttendanceReview(workspace,context){
    const{students,session,actions}=context;

    const container=document.createElement('section');
    container.className='attendance-experience attendance-review';

    const header=document.createElement('div');
    header.className='attendance-review-header';

    const heading=document.createElement('div');

    const title=document.createElement('h3');
    title.className='attendance-experience-title';
    title.textContent='Review Today’s Attendance';

    const description=document.createElement('p');
    description.className='attendance-experience-description';
    description.textContent=getReviewSummary(students,session);

    heading.appendChild(title);
    heading.appendChild(description);
    header.appendChild(heading);

    const list=document.createElement('div');
    list.className='attendance-review-list';

    students.forEach((student,index)=>{
        list.appendChild(
            createStudentRow(
                student,
                index,
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

    const continueButton=document.createElement('button');
    continueButton.type='button';
    continueButton.className='attendance-text-button';
    continueButton.textContent='Continue Checking';
    continueButton.addEventListener('click',actions.begin);

    const submitButton=document.createElement('button');
    submitButton.type='button';
    submitButton.className='attendance-primary-button';
    submitButton.textContent=session.isSubmitting
        ?'Saving Attendance...'
        :'Complete Attendance';

    submitButton.disabled=
        session.isSubmitting||
        !attendanceIsComplete(
            students,
            session
        );

    submitButton.addEventListener('click',actions.submit);

    actionsRow.appendChild(continueButton);
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

function createStudentRow(student,index,session,actions){
    const row=document.createElement('div');
    row.className='attendance-review-row';

    const studentButton=document.createElement('button');
    studentButton.type='button';
    studentButton.className='attendance-review-student';

    studentButton.addEventListener('click',()=>{
        actions.showStudent(index);
    });

    const avatar=document.createElement('span');
    avatar.className='attendance-review-avatar';
    avatar.textContent=getStudentInitials(student);

    const name=document.createElement('span');
    name.className='attendance-review-name';
    name.textContent=getStudentName(student);

    studentButton.appendChild(avatar);
    studentButton.appendChild(name);

    const selectedStatus=
        session.selections?.[student.id]||
        null;

    const statusButton=document.createElement('button');
    statusButton.type='button';
    statusButton.className='attendance-review-status';
    statusButton.textContent=formatAttendanceStatus(selectedStatus);

    if(selectedStatus){
        statusButton.classList.add(
            `is-${selectedStatus}`
        );
    }else{
        statusButton.classList.add('is-unanswered');
    }

    statusButton.addEventListener('click',()=>{
        actions.showStudent(index);
    });

    row.appendChild(studentButton);
    row.appendChild(statusButton);

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

function attendanceIsComplete(students,session){
    return students.length>0&&students.every(student=>{
        return Boolean(
            session.selections?.[student.id]
        );
    });
}

function getReviewSummary(students,session){
    const completedCount=students.filter(student=>{
        return Boolean(
            session.selections?.[student.id]
        );
    }).length;

    if(
        students.length>0&&
        completedCount===students.length
    ){
        return'Everyone has been checked. Tap a student to make a correction.';
    }

    return`${completedCount} of ${students.length} students checked`;
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

function formatAttendanceStatus(status){
    switch(status){
        case'present':
            return'Here Today';

        case'absent':
            return'Not Here';

        default:
            return'Not Checked';
    }
}
