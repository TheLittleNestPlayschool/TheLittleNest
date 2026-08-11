
export function renderMediaSessionSelect(
    container,
    context
){
    const{
        sessions=[],
        selectedSession=null,
        actions
    }=context;


    const section=
        document.createElement(
            'section'
        );

    section.className=
        'teacher-media-session-select';


    //------------------------------------
    // Heading
    //------------------------------------

    const heading=
        document.createElement(
            'div'
        );

    heading.className=
        'teacher-media-session-heading';


    const title=
        document.createElement(
            'strong'
        );

    title.textContent=
        'Select Session';


    const description=
        document.createElement(
            'span'
        );

    description.textContent=
        'Choose the session these photos and videos belong to.';


    heading.appendChild(
        title
    );

    heading.appendChild(
        description
    );


    section.appendChild(
        heading
    );


    //------------------------------------
    // Session Options
    //------------------------------------

    const list=
        document.createElement(
            'div'
        );

    list.className=
        'teacher-media-session-list';


    const activeSessions=
        getAvailableSessions(
            sessions
        );


    if(!activeSessions.length){
        const empty=
            document.createElement(
                'p'
            );

        empty.className=
            'teacher-media-session-empty';

        empty.textContent=
            'No sessions are available.';

        list.appendChild(
            empty
        );

    }else{
        activeSessions.forEach(
            session=>{
                list.appendChild(
                    createSessionButton(
                        session,
                        selectedSession,
                        actions
                    )
                );
            }
        );
    }


    section.appendChild(
        list
    );


    container.appendChild(
        section
    );
}


function createSessionButton(
    session,
    selectedSession,
    actions
){
    const button=
        document.createElement(
            'button'
        );

    button.type=
        'button';

    button.className=
        'teacher-media-session-button';


    if(
        selectedSession?.id===
        session?.id
    ){
        button.classList.add(
            'is-selected'
        );
    }


    const time=
        document.createElement(
            'strong'
        );

    time.textContent=
        getSessionTime(
            session
        );


    const date=
        document.createElement(
            'span'
        );

    date.textContent=
        getSessionDate(
            session
        );


    button.appendChild(
        time
    );

    button.appendChild(
        date
    );


    button.addEventListener(
        'click',
        ()=>{
            actions.selectSession(
                session
            );
        }
    );


    return button;
}


function getAvailableSessions(
    sessions
){
    if(
        !Array.isArray(
            sessions
        )
    ){
        return[];
    }


    return sessions.filter(
        session=>{
            return(
                session&&
                session.id
            );
        }
    );
}


function getSessionTime(
    session
){
    const start=
        session?.start_time||
        session?.session_start||
        session?.time_start||
        '';

    const end=
        session?.end_time||
        session?.session_end||
        session?.time_end||
        '';


    if(
        start&&
        end
    ){
        return`${start} - ${end}`;
    }


    return(
        start||
        end||
        session?.name||
        `Session ${session?.id||''}`
    );
}


function getSessionDate(
    session
){
    return(
        session?.session_date||
        session?.date||
        ''
    );
}
