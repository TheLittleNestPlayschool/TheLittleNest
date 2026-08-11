
export function renderMediaStudents(
    container,
    context
){
    const{
        students=[],
        selectedStudentIds=[],
        actions
    }=context;


    const section=
        document.createElement(
            'section'
        );

    section.className=
        'teacher-media-students';


    //------------------------------------
    // Heading
    //------------------------------------

    const heading=
        document.createElement(
            'div'
        );

    heading.className=
        'teacher-media-students-heading';


    const title=
        document.createElement(
            'strong'
        );

    title.textContent=
        'Students';


    const count=
        document.createElement(
            'span'
        );

    count.textContent=
        selectedStudentIds.length
            ?`${selectedStudentIds.length} selected`
            :'Select students';


    heading.appendChild(
        title
    );

    heading.appendChild(
        count
    );


    section.appendChild(
        heading
    );


    //------------------------------------
    // Student Options
    //------------------------------------

    const list=
        document.createElement(
            'div'
        );

    list.className=
        'teacher-media-student-list';


    const activeStudents=
        getActiveStudents(
            students
        );


    activeStudents.forEach(
        student=>{
            list.appendChild(
                createStudentButton(
                    student,
                    selectedStudentIds,
                    actions
                )
            );
        }
    );


    //------------------------------------
    // Find Student
    //------------------------------------

    list.appendChild(
        createFindStudentButton(
            actions
        )
    );


    section.appendChild(
        list
    );


    container.appendChild(
        section
    );
}


function createStudentButton(
    student,
    selectedStudentIds,
    actions
){
    const button=
        document.createElement(
            'button'
        );

    button.type=
        'button';

    button.className=
        'teacher-media-student-button';


    const studentId=
        Number(
            student.id
        );


    const isSelected=
        selectedStudentIds.some(
            selectedId=>{
                return(
                    Number(
                        selectedId
                    )===
                    studentId
                );
            }
        );


    if(isSelected){
        button.classList.add(
            'is-selected'
        );
    }


    //------------------------------------
    // Avatar
    //------------------------------------

    const avatar=
        document.createElement(
            'span'
        );

    avatar.className=
        'teacher-media-student-avatar';

    avatar.textContent=
        getStudentInitials(
            student
        );


    //------------------------------------
    // Name
    //------------------------------------

    const details=
        document.createElement(
            'span'
        );

    details.className=
        'teacher-media-student-details';


    const name=
        document.createElement(
            'strong'
        );

    name.textContent=
        getStudentName(
            student
        );


    details.appendChild(
        name
    );


    //------------------------------------
    // Selected Mark
    //------------------------------------

    const mark=
        document.createElement(
            'span'
        );

    mark.className=
        'teacher-media-student-mark';

    mark.textContent=
        isSelected
            ?'✓'
            :'';


    //------------------------------------
    // Assemble
    //------------------------------------

    button.appendChild(
        avatar
    );

    button.appendChild(
        details
    );

    button.appendChild(
        mark
    );


    button.addEventListener(
        'click',
        ()=>{
            actions.toggleStudent(
                student
            );
        }
    );


    return button;
}


function createFindStudentButton(
    actions
){
    const button=
        document.createElement(
            'button'
        );

    button.type=
        'button';

    button.className=
        'teacher-media-student-button teacher-media-find-student';


    const icon=
        document.createElement(
            'span'
        );

    icon.className=
        'teacher-media-student-avatar';

    icon.textContent=
        '+';


    const details=
        document.createElement(
            'span'
        );

    details.className=
        'teacher-media-student-details';


    const title=
        document.createElement(
            'strong'
        );

    title.textContent=
        'Find Student';


    details.appendChild(
        title
    );


    button.appendChild(
        icon
    );

    button.appendChild(
        details
    );


    button.addEventListener(
        'click',
        ()=>{
            actions.findStudent();
        }
    );


    return button;
}


function getActiveStudents(
    students
){
    if(
        !Array.isArray(
            students
        )
    ){
        return[];
    }


    return students.filter(
        student=>{
            return(
                student&&
                student.id&&
                student.is_active!==false
            );
        }
    );
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
            .map(
                part=>{
                    return part
                        .charAt(0)
                        .toUpperCase();
                }
            )
            .join('');


    return initials||'•';
}
