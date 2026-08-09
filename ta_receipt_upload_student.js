export function renderReceiptUploadStudent(
    workspace,
    context
){
    const{
        students,
        session,
        actions
    }=context;

    const container=
        document.createElement(
            'section'
        );

    container.className=
        'receipt-upload-experience receipt-upload-student';


    const eyebrow=
        document.createElement(
            'p'
        );

    eyebrow.className=
        'receipt-upload-eyebrow';

    eyebrow.textContent=
        'Payment Receipt';


    const title=
        document.createElement(
            'h3'
        );

    title.className=
        'receipt-upload-title';

    title.textContent=
        'Select Student';


    const description=
        document.createElement(
            'p'
        );

    description.className=
        'receipt-upload-description';

    description.textContent=
        'Choose the student this payment belongs to.';


    const picker=
        document.createElement(
            'div'
        );

    picker.className=
        'receipt-upload-student-picker';


    const searchInput=
        document.createElement(
            'input'
        );

    searchInput.type=
        'search';

    searchInput.className=
        'receipt-upload-student-search';

    searchInput.placeholder=
        'Search students...';

    searchInput.autocomplete=
        'off';


    const studentList=
        document.createElement(
            'div'
        );

    studentList.className=
        'receipt-upload-student-list';


    function renderStudents(
        searchValue=''
    ){
        studentList.innerHTML='';

        const normalizedSearch=
            searchValue
                .trim()
                .toLowerCase();

        const filteredStudents=
            getActiveStudents(
                students
            )
                .filter(student=>{
                    if(!normalizedSearch){
                        return true;
                    }

                    const searchableText=[
                        getStudentName(
                            student
                        ),

                        getParentName(
                            student
                        )
                    ]
                        .filter(Boolean)
                        .join(' ')
                        .toLowerCase();

                    return searchableText
                        .includes(
                            normalizedSearch
                        );
                });

        if(filteredStudents.length===0){
            const emptyMessage=
                document.createElement(
                    'p'
                );

            emptyMessage.className=
                'receipt-upload-student-empty';

            emptyMessage.textContent=
                'No matching students found.';

            studentList.appendChild(
                emptyMessage
            );

            return;
        }

        filteredStudents.forEach(student=>{
            const studentButton=
                createStudentButton(
                    student,
                    session,
                    actions
                );

            studentList.appendChild(
                studentButton
            );
        });
    }


    searchInput.addEventListener(
        'input',
        ()=>{
            renderStudents(
                searchInput.value
            );
        }
    );


    picker.appendChild(
        searchInput
    );

    picker.appendChild(
        studentList
    );


    const navigation=
        document.createElement(
            'div'
        );

    navigation.className=
        'receipt-upload-navigation';


    const backButton=
        document.createElement(
            'button'
        );

    backButton.type=
        'button';

    backButton.className=
        'receipt-upload-text-button';

    backButton.textContent=
        'Back to Receipt';

    backButton.addEventListener(
        'click',
        actions.showCapture
    );


    navigation.appendChild(
        backButton
    );


    container.appendChild(
        eyebrow
    );

    container.appendChild(
        title
    );

    container.appendChild(
        description
    );

    container.appendChild(
        picker
    );

    container.appendChild(
        navigation
    );


    workspace.appendChild(
        container
    );


    renderStudents();
}


function createStudentButton(
    student,
    session,
    actions
){
    const button=
        document.createElement(
            'button'
        );

    button.type=
        'button';

    button.className=
        'receipt-upload-student-button';

    if(
        session.selectedStudent?.id===
        student.id
    ){
        button.classList.add(
            'is-selected'
        );
    }


    const avatar=
        document.createElement(
            'span'
        );

    avatar.className=
        'receipt-upload-student-avatar';

    avatar.textContent=
        getStudentInitials(
            student
        );


    const details=
        document.createElement(
            'span'
        );

    details.className=
        'receipt-upload-student-details';


    const studentName=
        document.createElement(
            'strong'
        );

    studentName.className=
        'receipt-upload-student-name';

    studentName.textContent=
        getStudentName(
            student
        );


    const parentName=
        getParentName(
            student
        );


    details.appendChild(
        studentName
    );


    if(parentName){
        const parent=
            document.createElement(
                'span'
            );

        parent.className=
            'receipt-upload-parent-name';

        parent.textContent=
            `Parent: ${parentName}`;

        details.appendChild(
            parent
        );
    }


    button.appendChild(
        avatar
    );

    button.appendChild(
        details
    );


    button.addEventListener(
        'click',
        ()=>{
            actions.selectStudent(
                student
            );
        }
    );


    return button;
}


function getActiveStudents(
    students
){
    if(!Array.isArray(students)){
        return[];
    }

    return students.filter(student=>{
        return(
            student&&
            student.id&&
            student.is_active!==false
        );
    });
}


function getStudentName(
    student
){
    return(
        student?.preferred_name||
        student?.name||
        [
            student?.first_name,
            student?.last_name
        ]
            .filter(Boolean)
            .join(' ')||
        `Student ${student?.id||''}`
    );
}


function getParentName(
    student
){
    return(
        student?.parent_name||
        student?.parent_full_name||
        student?.parent?.full_name||
        [
            student?.parent?.first_name,
            student?.parent?.last_name
        ]
            .filter(Boolean)
            .join(' ')
    );
}


function getStudentInitials(
    student
){
    const name=
        getStudentName(
            student
        );

    const initials=
        name
            .split(' ')
            .filter(Boolean)
            .slice(
                0,
                2
            )
            .map(part=>{
                return part
                    .charAt(0)
                    .toUpperCase();
            })
            .join('');

    return initials||'•';
}
