import {
    getState
} from './ta_state.js';

import {
    getWorkspace,
    clearWorkspace
} from './ta_ui.js';

import {
    showStudentPicker
} from './ta_student_picker.js';

let addedStudents = [];

export function renderAttendanceModule() {
    addedStudents = [];

    clearWorkspace();

    renderAttendanceForm();
}

function renderAttendanceForm() {
    const state = getState();

    const expectedStudents =
        state.attendance?.expected_students || [];

    const workspace = getWorkspace();

    workspace.innerHTML = '';

    const form =
        document.createElement('form');

    form.id = 'attendanceForm';

    expectedStudents.forEach(
        (student) => {
            form.appendChild(
                createAttendanceRow(
                    student,
                    'scheduled'
                )
            );
        }
    );

    addedStudents.forEach(
        (student) => {
            form.appendChild(
                createAttendanceRow(
                    student,
                    student.attendance_source,
                    true
                )
            );
        }
    );

    const findStudentText =
        document.createElement('p');

    findStudentText.textContent =
        "Don't see the student here?";

    const findStudentButton =
        document.createElement('button');

    findStudentButton.type = 'button';

    findStudentButton.textContent =
        'View All Location Students';

    findStudentButton.addEventListener(
        'click',
        openStudentPicker
    );

    const submitButton =
        document.createElement('button');

    submitButton.type = 'button';

    submitButton.textContent =
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
    canRemove = false
) {
    const row =
        document.createElement('div');

    row.className = 'attendance-row';

    const studentName =
        student.name ||
        `Student ${student.id}`;

    row.innerHTML = `
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

    row.dataset.attendanceSource =
        attendanceSource;

    if (canRemove) {
        const sourceText =
            document.createElement('p');

        sourceText.textContent =
            `Attendance source: ${
                formatAttendanceSource(
                    attendanceSource
                )
            }`;

        const removeButton =
            document.createElement('button');

        removeButton.type = 'button';
        removeButton.textContent = 'Remove';

        removeButton.addEventListener(
            'click',
            () => {
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

function openStudentPicker() {
    const state = getState();

    const expectedStudents =
        state.attendance?.expected_students || [];

    const excludedStudentIds = [
        ...expectedStudents.map(
            (student) => student.id
        ),
        ...addedStudents.map(
            (student) => student.id
        )
    ];

    showStudentPicker({
        locationStudents:
            state.locationStudents || [],

        excludedStudentIds,

        onStudentSelected:
            addStudentToAttendance,

        onCancel:
            renderAttendanceForm
    });
}

function addStudentToAttendance(
    student
) {
    addedStudents.push(student);

    renderAttendanceForm();
}

function removeAddedStudent(
    studentId
) {
    addedStudents =
        addedStudents.filter(
            (student) =>
                student.id !== studentId
        );

    renderAttendanceForm();
}

function handleAttendanceSubmit() {
    const attendanceDraft =
        getAttendanceDraft();

    console.log(
        'Attendance Draft:',
        attendanceDraft
    );
}

export function getAttendanceDraft() {
    const state = getState();

    const expectedStudents =
        state.attendance?.expected_students || [];

    const allStudents = [
        ...expectedStudents.map(
            (student) => ({
                ...student,
                attendance_source:
                    'scheduled'
            })
        ),
        ...addedStudents
    ];

    return allStudents.map(
        (student) => {
            const selected =
                document.querySelector(
                    `input[name="student_${student.id}"]:checked`
                );

            return {
                student_id: student.id,

                status:
                    selected
                        ? selected.value
                        : null,

                attendance_source:
                    student.attendance_source
            };
        }
    );
}

function formatAttendanceSource(
    source
) {
    switch (source) {
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
