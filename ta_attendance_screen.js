import {getWorkspace} from './ta_ui.js';

export function renderAttendanceScreen({
    expectedStudents=[],
    addedStudents=[],
    attendanceSelections={},
    onSelectionChange,
    onFindStudent,
    onRemoveStudent,
    onSubmit
}){
    const workspace=getWorkspace();

    workspace.innerHTML='';

    const form=
        document.createElement('form');

    form.id='attendanceForm';
    form.className='attendance-form';

    form.addEventListener(
        'submit',
        event=>{
            event.preventDefault();
            onSubmit();
        }
    );

    const header=
        document.createElement('header');

    header.className=
        'attendance-header';

    const title=
        document.createElement('h2');

    title.className=
        'attendance-title';

    title.textContent=
        'Session Attendance';

    const instructions=
        document.createElement('p');

    instructions.className=
        'attendance-instructions';

    instructions.textContent=
        'Mark each student present or absent.';

    header.appendChild(title);
    header.appendChild(instructions);
    form.appendChild(header);

    const studentList=
        document.createElement('div');

    studentList.className=
        'attendance-student-list';

    expectedStudents.forEach(
        student=>{
            studentList.appendChild(
                createStudentRow({
                    student,
                    attendanceSource:
                        'scheduled',
                    selectedStatus:
                        attendanceSelections[
                            student.id
                        ],
                    canRemove:false,
                    onSelectionChange,
                    onRemoveStudent
                })
            );
        }
    );

    addedStudents.forEach(
        student=>{
            studentList.appendChild(
                createStudentRow({
                    student,
                    attendanceSource:
                        student.attendance_source,
                    selectedStatus:
                        attendanceSelections[
                            student.id
                        ],
                    canRemove:true,
                    onSelectionChange,
                    onRemoveStudent
                })
            );
        }
    );

    form.appendChild(studentList);

    const findSection=
        document.createElement('div');

    findSection.className=
        'attendance-find-section';

    const findText=
        document.createElement('p');

    findText.className=
        'attendance-find-text';

    findText.textContent=
        "Don't see the student here?";

    const findButton=
        document.createElement('button');

    findButton.type='button';
    findButton.className=
        'attendance-find-button';

    findButton.textContent=
        'View All Location Students';

    findButton.addEventListener(
        'click',
        onFindStudent
    );

    findSection.appendChild(findText);
    findSection.appendChild(findButton);
    form.appendChild(findSection);

    const submitButton=
        document.createElement('button');

    submitButton.type='submit';
    submitButton.className=
        'attendance-submit-button';

    submitButton.textContent=
        'Collect Attendance';

    form.appendChild(submitButton);
    workspace.appendChild(form);
}

function createStudentRow({
    student,
    attendanceSource,
    selectedStatus,
    canRemove,
    onSelectionChange,
    onRemoveStudent
}){
    const row=
        document.createElement('article');

    row.className='attendance-row';

    if(canRemove){
        row.classList.add(
            'attendance-row-added'
        );
    }

    updateRowStatus(
        row,
        selectedStatus
    );

    const heading=
        document.createElement('div');

    heading.className=
        'attendance-row-heading';

    const name=
        document.createElement('h3');

    name.className=
        'attendance-student-name';

    name.textContent=
        student.name||
        `Student ${student.id}`;

    heading.appendChild(name);

    if(canRemove){
        const sourceBadge=
            document.createElement('span');

        sourceBadge.className=
            'attendance-source-badge';

        sourceBadge.textContent=
            formatAttendanceSource(
                attendanceSource
            );

        heading.appendChild(
            sourceBadge
        );
    }

    row.appendChild(heading);

    const choices=
        document.createElement('div');

    choices.className=
        'attendance-choices';

    choices.appendChild(
        createStatusChoice({
            studentId:
                student.id,
            status:'present',
            label:'Present',
            selectedStatus,
            row,
            onSelectionChange
        })
    );

    choices.appendChild(
        createStatusChoice({
            studentId:
                student.id,
            status:'absent',
            label:'Absent',
            selectedStatus,
            row,
            onSelectionChange
        })
    );

    row.appendChild(choices);

    if(canRemove){
        const removeButton=
            document.createElement('button');

        removeButton.type='button';
        removeButton.className=
            'attendance-remove-button';

        removeButton.textContent=
            'Remove Student';

        removeButton.addEventListener(
            'click',
            ()=>{
                onRemoveStudent(
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

function createStatusChoice({
    studentId,
    status,
    label,
    selectedStatus,
    row,
    onSelectionChange
}){
    const choice=
        document.createElement('label');

    choice.className=
        `attendance-choice attendance-choice-${status}`;

    const input=
        document.createElement('input');

    input.type='radio';
    input.name=
        `student_${studentId}`;
    input.value=status;
    input.checked=
        selectedStatus===status;

    const text=
        document.createElement('span');

    text.textContent=label;

    input.addEventListener(
        'change',
        ()=>{
            if(!input.checked){
                return;
            }

            onSelectionChange(
                studentId,
                status
            );

            updateRowStatus(
                row,
                status
            );
        }
    );

    choice.appendChild(input);
    choice.appendChild(text);

    return choice;
}

function updateRowStatus(
    row,
    status
){
    row.classList.remove(
        'is-present',
        'is-absent'
    );

    if(status==='present'){
        row.classList.add(
            'is-present'
        );
    }

    if(status==='absent'){
        row.classList.add(
            'is-absent'
        );
    }
}

function formatAttendanceSource(source){
    switch(source){
        case 'makeup':
            return 'Makeup Class';

        case 'new_enrollment':
            return 'New Enrollment';

        case 'trial':
            return 'Trial Class';

        case 'manual':
            return 'Manual';

        default:
            return source;
    }
}
