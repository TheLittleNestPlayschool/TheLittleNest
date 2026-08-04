import {
    getWorkspace
} from './ta_ui.js';

export function showStudentPicker({
    locationStudents = [],
    excludedStudentIds = [],
    onStudentSelected,
    onCancel
}) {
    const workspace = getWorkspace();

    workspace.innerHTML = '';

    const excludedIds =
        new Set(excludedStudentIds);

    const availableStudents =
        locationStudents.filter(
            (student) =>
                !excludedIds.has(student.id)
        );

    const container =
        document.createElement('section');

    const title =
        document.createElement('h2');

    title.textContent =
        'Find a Student';

    const searchInput =
        document.createElement('input');

    searchInput.type = 'search';
    searchInput.placeholder =
        'Search student name';
    searchInput.autocomplete = 'off';

    const studentList =
        document.createElement('div');

    const cancelButton =
        document.createElement('button');

    cancelButton.type = 'button';
    cancelButton.textContent =
        'Back to Attendance';

    cancelButton.addEventListener(
        'click',
        onCancel
    );

    container.appendChild(title);
    container.appendChild(searchInput);
    container.appendChild(studentList);
    container.appendChild(cancelButton);

    workspace.appendChild(container);

    function renderStudentList(
        searchValue = ''
    ) {
        studentList.innerHTML = '';

        const normalizedSearch =
            searchValue
                .trim()
                .toLowerCase();

        const filteredStudents =
            availableStudents.filter(
                (student) => {
                    const studentName =
                        student.name || '';

                    return studentName
                        .toLowerCase()
                        .includes(
                            normalizedSearch
                        );
                }
            );

        if (
            filteredStudents.length === 0
        ) {
            const noResults =
                document.createElement('p');

            noResults.textContent =
                'No matching students found.';

            studentList.appendChild(
                noResults
            );

            return;
        }

        filteredStudents.forEach(
            (student) => {
                const studentButton =
                    document.createElement(
                        'button'
                    );

                studentButton.type =
                    'button';

                studentButton.textContent =
                    student.name ||
                    `Student ${student.id}`;

                studentButton.addEventListener(
                    'click',
                    () => {
                        showAttendanceSourcePicker({
                            student,
                            onStudentSelected,
                            onCancel: () => {
                                showStudentPicker({
                                    locationStudents,
                                    excludedStudentIds,
                                    onStudentSelected,
                                    onCancel
                                });
                            }
                        });
                    }
                );

                studentList.appendChild(
                    studentButton
                );
            }
        );
    }

    searchInput.addEventListener(
        'input',
        () => {
            renderStudentList(
                searchInput.value
            );
        }
    );

    renderStudentList();
}

function showAttendanceSourcePicker({
    student,
    onStudentSelected,
    onCancel
}) {
    const workspace = getWorkspace();

    workspace.innerHTML = '';

    const container =
        document.createElement('section');

    const title =
        document.createElement('h2');

    title.textContent =
        student.name ||
        `Student ${student.id}`;

    const question =
        document.createElement('p');

    question.textContent =
        'Why is this student attending today?';

    container.appendChild(title);
    container.appendChild(question);

    const sources = [
        {
            value: 'makeup',
            label: 'Makeup Class'
        },
        {
            value: 'new_enrollment',
            label: 'New Enrollment'
        },
        {
            value: 'trial',
            label: 'Trial Class'
        },
        {
            value: 'manual',
            label: 'Manual'
        }
    ];

    sources.forEach((source) => {
        const button =
            document.createElement('button');

        button.type = 'button';
        button.textContent = source.label;

        button.addEventListener(
            'click',
            () => {
                onStudentSelected({
                    ...student,
                    attendance_source:
                        source.value
                });
            }
        );

        container.appendChild(button);
    });

    const cancelButton =
        document.createElement('button');

    cancelButton.type = 'button';
    cancelButton.textContent =
        'Back to Student Search';

    cancelButton.addEventListener(
        'click',
        onCancel
    );

    container.appendChild(
        cancelButton
    );

    workspace.appendChild(container);
}
