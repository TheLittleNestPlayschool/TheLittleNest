import {getState} from './ta_state.js';
import {getWorkspace,clearWorkspace} from './ta_ui.js';
import {showStudentPicker} from './ta_student_picker.js';
import {postAttendance} from './ta_attendance_post.js';
let addedStudents=[];
let attendanceSelections={};
export function renderAttendanceModule(){
    addedStudents=[];
    attendanceSelections={};
    clearWorkspace();
    renderAttendanceForm();
}
function renderAttendanceForm(){
    const state=getState();
    const expectedStudents=
        state.attendance?.expected_students||[];
    const workspace=getWorkspace();
    workspace.innerHTML='';
    const form=document.createElement('form');
    form.id='attendanceForm';
    expectedStudents.forEach(student=>{
        form.appendChild(
            createAttendanceRow(
                student,
                'scheduled'
            )
        );
    });
    addedStudents.forEach(student=>{
        form.appendChild(
            createAttendanceRow(
                student,
                student.attendance_source,
                true
            )
        );
    });

    const findStudentText=document.createElement('p');
    findStudentText.textContent=
        "Don't see the student here?";
    const findStudentButton=document.createElement('button');
    findStudentButton.type='button';
    findStudentButton.textContent=
        'View All Location Students';

    findStudentButton.addEventListener(
        'click',
        openStudentPicker
    );

    const submitButton=
        document.createElement('button');

    submitButton.type='button';
    submitButton.textContent=
        'Collect Attendance';

    submitButton.addEventListener(
        'click',
        handleAttendanceSubmit
    );

    form.appendChild(findStudentText);
    form.appendChild(findStudentButton);
    form.appendChild(
        document.createElement('br')
    );
    form.appendChild(submitButton);

    workspace.appendChild(form);
}

function createAttendanceRow(
    student,
    attendanceSource,
    canRemove=false
){
    const row=document.createElement('div');
    row.className='attendance-row';

    const studentName=
        student.name||
        `Student ${student.id}`;

    row.innerHTML=`
        <h3>${studentName}</h3>

        <label>
            <input
                type="radio"
                name="student_${student.id}"
                value="present"
            >
            Present
        </label>

        <label>
            <input
                type="radio"
                name="student_${student.id}"
                value="absent"
            >
            Absent
        </label>
    `;

    row.dataset.attendanceSource=
        attendanceSource;

    const presentInput=
        row.querySelector(
            'input[value="present"]'
        );

    const absentInput=
        row.querySelector(
            'input[value="absent"]'
        );

    if(
        canRemove&&
        !attendanceSelections[student.id]
    ){
        attendanceSelections[student.id]=
            'present';
    }

    if(
        attendanceSelections[student.id]===
        'present'
    ){
        presentInput.checked=true;
    }

    if(
        attendanceSelections[student.id]===
        'absent'
    ){
        absentInput.checked=true;
    }

    presentInput.addEventListener(
        'change',
        ()=>{
            if(presentInput.checked){
                attendanceSelections[student.id]=
                    'present';
            }
        }
    );

    absentInput.addEventListener(
        'change',
        ()=>{
            if(absentInput.checked){
                attendanceSelections[student.id]=
                    'absent';
            }
        }
    );

    if(canRemove){
        const sourceText=
            document.createElement('p');

        sourceText.textContent=
            `Attendance source: ${
                formatAttendanceSource(
                    attendanceSource
                )
            }`;

        const removeButton=
            document.createElement('button');

        removeButton.type='button';
        removeButton.textContent='Remove';

        removeButton.addEventListener(
            'click',
            ()=>{
                removeAddedStudent(
                    student.id
                );
            }
        );

        row.appendChild(sourceText);
        row.appendChild(removeButton);
    }

    row.appendChild(
        document.createElement('hr')
    );

    return row;
}

function openStudentPicker(){
    const state=getState();

    const expectedStudents=
        state.attendance?.expected_students||[];

    const excludedStudentIds=[
        ...expectedStudents.map(
            student=>student.id
        ),
        ...addedStudents.map(
            student=>student.id
        )
    ];

    showStudentPicker({
        locationStudents:
            state.locationStudents||[],

        excludedStudentIds,

        onStudentSelected:
            addStudentToAttendance,

        onCancel:
            renderAttendanceForm
    });
}

function addStudentToAttendance(student){
    addedStudents.push(student);

    attendanceSelections[student.id]=
        'present';

    renderAttendanceForm();
}

function removeAddedStudent(studentId){
    addedStudents=
        addedStudents.filter(
            student=>
                student.id!==studentId
        );

    delete attendanceSelections[
        studentId
    ];

    renderAttendanceForm();
}

async function handleAttendanceSubmit(){
    const attendanceDraft=
        getAttendanceDraft();

    const result=
        await postAttendance(
            attendanceDraft
        );

    console.log(
        'ta_post_attendance:',
        result
    );
}

export function getAttendanceDraft(){
    const state=getState();

    const expectedStudents=
        state.attendance?.expected_students||[];

    const allStudents=[
        ...expectedStudents.map(
            student=>({
                ...student,
                attendance_source:
                    'scheduled'
            })
        ),
        ...addedStudents
    ];

    return allStudents.map(student=>({
        student_id:
            student.id,

        status:
            attendanceSelections[
                student.id
            ]||null,

        attendance_source:
            student.attendance_source
    }));
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
