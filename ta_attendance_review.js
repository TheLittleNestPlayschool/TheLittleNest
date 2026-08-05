export function renderAttendanceReview(workspace,context){
    const{
        students,
        session,
        actions,
        renderStudentPicker
    }=context;

    const container=document.createElement('section');
    container.className='attendance-experience attendance-review';

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

    const addStudentContainer=document.createElement('div');
    addStudentContainer.className='attendance-add-student';

    if(session.addingStudent){
        renderStudentPicker(
            addStudentContainer
        );
    }else{
        const addStudentButton=document.createElement('button');
        addStudentButton.type='button';
        addStudentButton.className='attendance-secondary-button';
        addStudentButton.textContent='Add Another Student';
        addStudentButton.addEventListener(
            'click',
            actions.addStudent
        );

        addStudentContainer.appendChild(
            addStudentButton
        );
    }

    const actionsRow=document.createElement('div');
    actionsRow.className='attendance-review-actions';

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

    submitButton.addEventListener(
        'click',
        actions.submit
    );

    actionsRow.appendChild(
        submitButton
    );

    if(students.length===0){
        const emptyMessage=document.createElement('p');
        emptyMessage.className='attendance-empty-message';
        emptyMessage.textContent=
            'No students have been added yet.';

        container.appendChild(
            emptyMessage
        );
    }else{
        container.appendChild(
            list
        );
    }

    container.appendChild(
        addStudentContainer
    );

    container.appendChild(
        actionsRow
    );

    workspace.appendChild(
        container
    );
}

function createStudentRow(
    student,
    session,
    actions
){
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
        removeButton.className=
            'attendance-review-choice attendance-remove-button';

        removeButton.textContent='Remove';

        removeButton.addEventListener(
            'click',
            ()=>{
                actions.removeStudent(
                    student.id
                );
            }
        );

        row.appendChild(
            removeButton
        );
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

    if(
        session.selections?.[
            student.id
        ]===status
    ){
        button.classList.add(
            'is-selected'
        );
    }

    button.addEventListener(
        'click',
        ()=>{
            actions.selectStatus(
                student.id,
                status
            );
        }
    );

    return button;
}

function attendanceIsComplete(
    students,
    session
){
    return(
        students.length>0&&
        students.every(student=>{
            return Boolean(
                session.selections?.[
                    student.id
                ]
            );
        })
    );
}

function getStudentName(student){
    return(
        student.name||
        [
            student.first_name,
            student.last_name
        ]
            .filter(Boolean)
            .join(' ')||
        `Student ${student.id}`
    );
}

function getStudentInitials(student){
    const name=getStudentName(student);

    const initials=name
        .split(' ')
        .filter(Boolean)
        .slice(0,2)
        .map(part=>
            part.charAt(0)
                .toUpperCase()
        )
        .join('');

    return initials||'•';
}
