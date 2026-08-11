export function renderTeacherHeader(
    context
){
    const welcome=
        document.getElementById(
            'teacherWelcome'
        );

    const saying=
        document.getElementById(
            'teacherSaying'
        );

    if(welcome){
        welcome.textContent=
            buildTeacherWelcome(
                context?.teacher
            );
    }

    if(saying){
        saying.textContent=
            getTeacherSaying(
                context
            );
    }
}


function buildTeacherWelcome(
    teacher
){
    const teacherName=
        getTeacherDisplayName(
            teacher
        );

    if(!teacherName){
        return'Welcome, Teacher';
    }

    return`Welcome, Teacher ${teacherName}`;
}


function getTeacherDisplayName(
    teacher
){
    return(
        teacher?.preferred_name||
        teacher?.first_name||
        teacher?.name||
        ''
    );
}


function getTeacherSaying(
    context
){
    return(
        context?.teacher_saying||
        context?.saying||
        "You're making a difference."
    );
}
