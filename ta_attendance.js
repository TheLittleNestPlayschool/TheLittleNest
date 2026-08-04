import {getState} from './ta_state.js';
import {clearWorkspace} from './ta_ui.js';
import {showStudentPicker} from './ta_student_picker.js';
import {postAttendance} from './ta_attendance_post.js';
import {renderAttendanceScreen} from './ta_attendance_screen.js';

let addedStudents=[];
let attendanceSelections={};

export function renderAttendanceModule(){
    addedStudents=[];
    attendanceSelections={};
    clearWorkspace();
    renderAttendance();
}

function renderAttendance(){
    const state=getState();

    renderAttendanceScreen({
        expectedStudents:
            state.attendance?.expected_students||[],

        addedStudents,

        attendanceSelections,

        onSelectionChange:
            updateAttendanceSelection,

        onFindStudent:
            openStudentPicker,

        onRemoveStudent:
            removeAddedStudent,

        onSubmit:
            handleAttendanceSubmit
    });
}

function updateAttendanceSelection(
    studentId,
    status
){
    attendanceSelections[studentId]=
        status;
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
            renderAttendance
    });
}

function addStudentToAttendance(student){
    addedStudents.push(student);

    attendanceSelections[student.id]=
        'present';

    renderAttendance();
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

    renderAttendance();
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

    return allStudents.map(
        student=>({
            student_id:
                student.id,

            status:
                attendanceSelections[
                    student.id
                ]||null,

            attendance_source:
                student.attendance_source
        })
    );
}
