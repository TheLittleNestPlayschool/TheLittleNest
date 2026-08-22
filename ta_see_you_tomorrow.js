import{
    getWorkspace,
    clearWorkspace
}from'./ta_ui.js';

const SEE_YOU_TOMORROW_API=
    'https://x8ki-letl-twmt.n7.xano.io/api:EpDLPKN0/ta_see_you_tomorrow';

/*==================================================
  See You Tomorrow Module
==================================================*/

export async function renderSeeYouTomorrowModule(
    state
){
    clearWorkspace();

    const workspace=
        getWorkspace();

    if(!workspace){
        return;
    }

    const container=
        document.createElement(
            'section'
        );

    container.className=
        'teacher-see-you-tomorrow';

    const loadingMessage=
        createMessage(
            'Loading tomorrow\'s students...'
        );

    container.appendChild(
        loadingMessage
    );

    workspace.appendChild(
        container
    );

    try{
        const data=
            await loadSeeYouTomorrowData(
                state
            );

        const tomorrowSchedule=
            Array.isArray(
                data?.tomorrowSchedule
            )
                ?data.tomorrowSchedule
                :[];

        loadingMessage.remove();

        if(!tomorrowSchedule.length){
            renderNoSessions(
                container
            );

            updateSeeYouTomorrowLiveStatus(
                0,
                0
            );

            return;
        }

        renderTomorrowSchedule(
            container,
            tomorrowSchedule
        );

        const studentCount=
            getStudentCount(
                tomorrowSchedule
            );

        updateSeeYouTomorrowLiveStatus(
            studentCount,
            tomorrowSchedule.length
        );

    }catch(error){
        console.error(
            'See You Tomorrow failed:',
            error
        );

        loadingMessage.textContent=
            'Unable to load tomorrow\'s students.';

        updateSeeYouTomorrowErrorStatus();
    }
}

/*==================================================
  Load See You Tomorrow Data
==================================================*/

async function loadSeeYouTomorrowData(
    state
){
    const response=
        await fetch(
            SEE_YOU_TOMORROW_API,
            {
                method:
                    'GET',

                headers:
                    buildRequestHeaders(
                        state
                    )
            }
        );

    const responseData=
        await readResponseData(
            response
        );

    if(!response.ok){
        throw new Error(
            getApiErrorMessage(
                responseData
            )
        );
    }

    return{
        tomorrowSchedule:
            Array.isArray(
                responseData
                    ?.tomorrow_schedule
            )
                ?responseData
                    .tomorrow_schedule
                :[]
    };
}

/*==================================================
  Schedule
==================================================*/

function renderTomorrowSchedule(
    container,
    tomorrowSchedule
){
    const headingRow=
        document.createElement(
            'div'
        );

    headingRow.className=
        'teacher-see-you-tomorrow-heading-row';

    const heading=
        document.createElement(
            'div'
        );

    heading.className=
        'teacher-see-you-tomorrow-heading';

    heading.textContent=
        'Tomorrow\'s Students';

    const copyButton=
        createCopyButton(
            tomorrowSchedule
        );

    headingRow.appendChild(
        heading
    );

    headingRow.appendChild(
        copyButton
    );

    container.appendChild(
        headingRow
    );

    tomorrowSchedule.forEach(
        session=>{
            const sessionCard=
                createSessionCard(
                    session
                );

            container.appendChild(
                sessionCard
            );
        }
    );
}

/*==================================================
  Copy Tomorrow List
==================================================*/

function createCopyButton(
    tomorrowSchedule
){
    const button=
        document.createElement(
            'button'
        );

    button.type=
        'button';

    button.className=
        'teacher-see-you-tomorrow-copy-button';

    button.textContent=
        '📋 Copy List';

    button.addEventListener(
        'click',
        async()=>{
            const copyText=
                buildTomorrowCopyText(
                    tomorrowSchedule
                );

            try{
                await navigator.clipboard.writeText(
                    copyText
                );

                button.textContent=
                    '✓ Copied';

                window.setTimeout(
                    ()=>{
                        button.textContent=
                            '📋 Copy List';
                    },
                    1800
                );

            }catch(error){
                console.error(
                    'Unable to copy tomorrow list:',
                    error
                );

                button.textContent=
                    'Copy Failed';

                window.setTimeout(
                    ()=>{
                        button.textContent=
                            '📋 Copy List';
                    },
                    1800
                );
            }
        }
    );

    return button;
}

function buildTomorrowCopyText(
    tomorrowSchedule
){
    const lines=[
        'See You Tomorrow! 🌟',
        ''
    ];

    tomorrowSchedule.forEach(
        (
            session,
            index
        )=>{
            lines.push(
                formatSessionTime(
                    session?.start_time,
                    session?.end_time
                )
            );

            const students=
                Array.isArray(
                    session?.students
                )
                    ?session.students
                    :[];

            students.forEach(
                student=>{
                    lines.push(
                        `• ${student?.name||'Student'}`
                    );
                }
            );

            if(
                index<
                tomorrowSchedule.length-1
            ){
                lines.push(
                    ''
                );
            }
        }
    );

    return lines.join(
        '\n'
    );
}

/*==================================================
  Session Card
==================================================*/

function createSessionCard(
    session
){
    const card=
        document.createElement(
            'section'
        );

    card.className=
        'teacher-see-you-tomorrow-session';

    const header=
        document.createElement(
            'div'
        );

    header.className=
        'teacher-see-you-tomorrow-session-header';

    const time=
        document.createElement(
            'div'
        );

    time.className=
        'teacher-see-you-tomorrow-session-time';

    time.textContent=
        formatSessionTime(
            session?.start_time,
            session?.end_time
        );

    const count=
        document.createElement(
            'div'
        );

    count.className=
        'teacher-see-you-tomorrow-session-count';

    const students=
        Array.isArray(
            session?.students
        )
            ?session.students
            :[];

    count.textContent=
        formatStudentCount(
            students.length
        );

    header.appendChild(
        time
    );

    header.appendChild(
        count
    );

    card.appendChild(
        header
    );

    if(!students.length){
        const empty=
            createMessage(
                'No students scheduled for this session.'
            );

        card.appendChild(
            empty
        );

        return card;
    }

    const studentList=
        document.createElement(
            'div'
        );

    studentList.className=
        'teacher-see-you-tomorrow-students';

    students.forEach(
        student=>{
            const studentRow=
                createStudentRow(
                    student
                );

            studentList.appendChild(
                studentRow
            );
        }
    );

    card.appendChild(
        studentList
    );

    return card;
}

/*==================================================
  Student Row
==================================================*/

function createStudentRow(
    student
){
    const row=
        document.createElement(
            'div'
        );

    row.className=
        'teacher-see-you-tomorrow-student';

    row.dataset.studentId=
        student?.id||
        '';

    const icon=
        document.createElement(
            'span'
        );

    icon.className=
        'teacher-see-you-tomorrow-student-icon';

    icon.textContent=
        '👧';

    const name=
        document.createElement(
            'span'
        );

    name.className=
        'teacher-see-you-tomorrow-student-name';

    name.textContent=
        student?.name||
        'Student';

    row.appendChild(
        icon
    );

    row.appendChild(
        name
    );

    return row;
}

/*==================================================
  Empty State
==================================================*/

function renderNoSessions(
    container
){
    const message=
        createMessage(
            'No students are scheduled for tomorrow.'
        );

    container.appendChild(
        message
    );
}

/*==================================================
  Message
==================================================*/

function createMessage(
    text
){
    const message=
        document.createElement(
            'p'
        );

    message.className=
        'teacher-see-you-tomorrow-message';

    message.textContent=
        text;

    return message;
}

/*==================================================
  Counts
==================================================*/

function getStudentCount(
    tomorrowSchedule
){
    return tomorrowSchedule.reduce(
        (
            total,
            session
        )=>{
            const students=
                Array.isArray(
                    session?.students
                )
                    ?session.students
                    :[];

            return(
                total+
                students.length
            );
        },
        0
    );
}

function formatStudentCount(
    count
){
    if(count===1){
        return '1 student';
    }

    return `${count} students`;
}

/*==================================================
  Time
==================================================*/

function formatSessionTime(
    startTime,
    endTime
){
    const start=
        formatTime(
            startTime
        );

    const end=
        formatTime(
            endTime
        );

    if(
        !start||
        !end
    ){
        return 'Session';
    }

    return `${start} – ${end}`;
}

function formatTime(
    value
){
    if(
        typeof value!=='string'||
        !value.includes(
            ':'
        )
    ){
        return '';
    }

    const[
        hourValue,
        minuteValue
    ]=
        value.split(
            ':'
        );

    const hour=
        Number(
            hourValue
        );

    if(
        !Number.isFinite(
            hour
        )
    ){
        return value;
    }

    const period=
        hour>=12
            ?'PM'
            :'AM';

    const displayHour=
        hour%12||
        12;

    return(
        `${displayHour}:${minuteValue} ${period}`
    );
}

/*==================================================
  Request Headers
==================================================*/

function buildRequestHeaders(
    state
){
    const headers={
        Accept:
            'application/json'
    };

    const authToken=
        getAuthToken(
            state
        );

    if(authToken){
        headers.Authorization=
            `Bearer ${authToken}`;
    }

    return headers;
}

function getAuthToken(
    state
){
    return(
        state?.authToken||
        state?.auth_token||
        state?.context?.authToken||
        state?.context?.auth_token||
        window.localStorage.getItem(
            'authToken'
        )||
        window.localStorage.getItem(
            'auth_token'
        )||
        ''
    );
}

/*==================================================
  Response Helpers
==================================================*/

async function readResponseData(
    response
){
    const responseText=
        await response.text();

    if(!responseText){
        return null;
    }

    try{
        return JSON.parse(
            responseText
        );

    }catch(error){
        return{
            message:
                responseText
        };
    }
}

function getApiErrorMessage(
    responseData
){
    return(
        responseData?.message||
        responseData?.error||
        'Unable to load tomorrow\'s students.'
    );
}

/*==================================================
  Live Status
==================================================*/

function updateSeeYouTomorrowLiveStatus(
    studentCount,
    sessionCount
){
    const card=
        document.querySelector(
            '.teacher-module-card[data-module-id="see_tomorrow"]'
        );

    const subtitle=
        card?.querySelector(
            '.teacher-module-subtitle'
        );

    if(!subtitle){
        return;
    }

    if(!sessionCount){
        subtitle.textContent=
            'No students scheduled tomorrow.';

        return;
    }

    if(studentCount===1){
        subtitle.textContent=
            '1 student scheduled tomorrow.';

        return;
    }

    subtitle.textContent=
        `${studentCount} students scheduled tomorrow.`;
}

function updateSeeYouTomorrowErrorStatus(){
    const card=
        document.querySelector(
            '.teacher-module-card[data-module-id="see_tomorrow"]'
        );

    const subtitle=
        card?.querySelector(
            '.teacher-module-subtitle'
        );

    if(!subtitle){
        return;
    }

    subtitle.textContent=
        'Unable to load tomorrow\'s schedule.';
}
