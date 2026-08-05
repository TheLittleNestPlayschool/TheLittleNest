export function renderInlineStudentPicker(
    container,
    {
        locationStudents=[],
        excludedStudentIds=[],
        onStudentSelected,
        onCancel
    }
){
    const excludedIds=
        new Set(
            excludedStudentIds
        );

    const availableStudents=
        locationStudents.filter(student=>{
            return!excludedIds.has(
                student.id
            );
        });

    renderStudentSearch();

    function renderStudentSearch(){
        container.innerHTML='';
        container.className=
            'attendance-inline-picker';

        const searchRow=
            document.createElement('div');

        searchRow.className=
            'attendance-picker-search-row';

        const searchInput=
            document.createElement('input');

        searchInput.type='search';
        searchInput.className=
            'attendance-picker-search';

        searchInput.placeholder=
            'Search or select a student';

        searchInput.autocomplete='off';

        const cancelButton=
            createCancelButton(
                onCancel
            );

        searchRow.appendChild(
            searchInput
        );

        searchRow.appendChild(
            cancelButton
        );

        const studentList=
            document.createElement('div');

        studentList.className=
            'attendance-picker-list';

        container.appendChild(
            searchRow
        );

        container.appendChild(
            studentList
        );

        searchInput.addEventListener(
            'input',
            ()=>{
                renderStudentList(
                    searchInput.value,
                    studentList
                );
            }
        );

        renderStudentList(
            '',
            studentList
        );

        searchInput.focus();
    }

    function renderStudentList(
        searchValue,
        studentList
    ){
        studentList.innerHTML='';

        const normalizedSearch=
            searchValue
                .trim()
                .toLowerCase();

        const filteredStudents=
            availableStudents.filter(
                student=>{
                    return getStudentName(
                        student
                    )
                        .toLowerCase()
                        .includes(
                            normalizedSearch
                        );
                }
            );

        if(filteredStudents.length===0){
            const noResults=
                document.createElement('p');

            noResults.className=
                'attendance-picker-empty';

            noResults.textContent=
                'No matching students found.';

            studentList.appendChild(
                noResults
            );

            return;
        }

        filteredStudents.forEach(
            student=>{
                const button=
                    document.createElement(
                        'button'
                    );

                button.type='button';

                button.className=
                    'attendance-picker-student';

                button.textContent=
                    getStudentName(
                        student
                    );

                button.addEventListener(
                    'click',
                    ()=>{
                        renderSourcePicker(
                            student
                        );
                    }
                );

                studentList.appendChild(
                    button
                );
            }
        );
    }

    function renderSourcePicker(
        student
    ){
        container.innerHTML='';

        const selectedStudent=
            document.createElement('div');

        selectedStudent.className=
            'attendance-picker-selected';

        const studentName=
            document.createElement('strong');

        studentName.textContent=
            getStudentName(
                student
            );

        const question=
            document.createElement('span');

        question.textContent=
            'Why are they joining today?';

        selectedStudent.appendChild(
            studentName
        );

        selectedStudent.appendChild(
            question
        );

        const sourceList=
            document.createElement('div');

        sourceList.className=
            'attendance-source-list';

        getAttendanceSources().forEach(
            source=>{
                const button=
                    document.createElement(
                        'button'
                    );

                button.type='button';

                button.className=
                    'attendance-source-button';

                button.textContent=
                    source.label;

                button.addEventListener(
                    'click',
                    ()=>{
                        onStudentSelected({
                            ...student,
                            attendance_source:
                                source.value
                        });
                    }
                );

                sourceList.appendChild(
                    button
                );
            }
        );

        const controls=
            document.createElement('div');

        controls.className=
            'attendance-picker-controls';

        const backButton=
            document.createElement('button');

        backButton.type='button';

        backButton.className=
            'attendance-text-button';

        backButton.textContent=
            'Choose Another Student';

        backButton.addEventListener(
            'click',
            renderStudentSearch
        );

        const cancelButton=
            createCancelButton(
                onCancel
            );

        controls.appendChild(
            backButton
        );

        controls.appendChild(
            cancelButton
        );

        container.appendChild(
            selectedStudent
        );

        container.appendChild(
            sourceList
        );

        container.appendChild(
            controls
        );
    }
}

function createCancelButton(
    onCancel
){
    const button=
        document.createElement('button');

    button.type='button';

    button.className=
        'attendance-picker-cancel';

    button.textContent='Cancel';

    button.addEventListener(
        'click',
        onCancel
    );

    return button;
}

function getAttendanceSources(){
    return[
        {
            value:'makeup',
            label:'Makeup Class'
        },
        {
            value:'new_enrollment',
            label:'New Enrollment'
        },
        {
            value:'trial',
            label:'Trial Class'
        },
        {
            value:'manual',
            label:'Other'
        }
    ];
}

function getStudentName(
    student
){
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
