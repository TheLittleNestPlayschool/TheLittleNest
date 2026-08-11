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
        welcome.innerHTML=
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
        return(
            '<span class="teacher-welcome-line">'+
            'Welcome.'+
            '</span>'+
            '<span class="teacher-name-line">'+
            'Teacher'+
            '</span>'
        );
    }

    return(
        '<span class="teacher-welcome-line">'+
        'Welcome.'+
        '</span>'+
        '<span class="teacher-name-line">'+
        `Teacher ${teacherName}`+
        '</span>'
    );
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
