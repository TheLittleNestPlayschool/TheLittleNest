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
        saying.innerHTML=
            buildTeacherQuote(
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


function buildTeacherQuote(
context
){
    const quote=
        context?.teacher_quotes||
        null;

    const emojis=
        Array.isArray(
            context?.emojis
        )
            ?context.emojis
            :[];

    const line1=
        quote?.quote_line_1||
        "You're making";

    const line2=
        quote?.quote_line_2||
        'a difference';

    const emoji1=
        emojis?.[0]?.emoji||
        '✨';

    const emoji2=
        emojis?.[1]?.emoji||
        '🌟';

    return(
        '<div class="teacher-quote-layout">'+

            '<div class="teacher-quote-mark">'+
                '“'+
            '</div>'+

            '<div class="teacher-quote-content">'+

                '<div class="teacher-quote-copy">'+

                    '<div class="teacher-quote-line">'+
                        escapeHtml(
                            line1
                        )+
                    '</div>'+

                    '<div class="teacher-quote-line">'+
                        escapeHtml(
                            line2
                        )+
                    '</div>'+

                '</div>'+

                '<div class="teacher-quote-emojis">'+

                    '<span class="teacher-quote-emoji">'+
                        escapeHtml(
                            emoji1
                        )+
                    '</span>'+

                    '<span class="teacher-quote-emoji">'+
                        escapeHtml(
                            emoji2
                        )+
                    '</span>'+

                '</div>'+

            '</div>'+

        '</div>'
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


function escapeHtml(
value
){
    return String(
        value??''
    )
        .replaceAll(
            '&',
            '&amp;'
        )
        .replaceAll(
            '<',
            '&lt;'
        )
        .replaceAll(
            '>',
            '&gt;'
        )
        .replaceAll(
            '"',
            '&quot;'
        )
        .replaceAll(
            "'",
            '&#039;'
        );
}
