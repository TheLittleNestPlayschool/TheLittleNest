import { getState } from './ta_state.js';
import {
    getWorkspace,
    clearWorkspace
} from './ta_ui.js';

export function renderAttendanceModule() {

    const state = getState();

    const students =
        state.attendance?.expected_students || [];

    clearWorkspace();

    const workspace = getWorkspace();

    if (students.length === 0) {

        workspace.innerHTML =
            '<p>No students are enrolled for this session.</p>';

        return;
    }

    const form =
        document.createElement('form');

    form.id = 'attendanceForm';

    students.forEach((student) => {

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

            <hr>
        `;

        form.appendChild(row);

    });

    const submitButton =
        document.createElement('button');

    submitButton.type = 'button';

    submitButton.textContent =
        'Collect Attendance';

    submitButton.addEventListener(
        'click',
        handleAttendanceSubmit
    );

    form.appendChild(submitButton);

    workspace.appendChild(form);

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

    const state =
        getState();

    const students =
        state.attendance?.expected_students || [];

    return students.map((student) => {

        const selected =
            document.querySelector(
                `input[name="student_${student.id}"]:checked`
            );

        return {

            student_id: student.id,

            status:
                selected
                    ? selected.value
                    : null

        };

    });

}
