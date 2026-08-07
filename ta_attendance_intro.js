import{
    getAttendanceDisplayDate,
    getAttendanceTimeRange
}from'./ta_attendance_context.js';

export function renderAttendanceIntro(
    workspace,
    context
){
    const{
        state,
        students,
        session,
        taskContext,
        actions
    }=context;

    const container=
        document.createElement(
            'section'
        );

    container.className=
        'attendance-experience attendance-introduction';

    const eyebrow=
        document.createElement(
            'p'
        );

    eyebrow.className=
        'attendance-eyebrow';

    eyebrow.textContent=
        getEyebrowText(
            state,
            taskContext
        );

    const title=
        document.createElement(
            'h3'
        );

    title.className=
        'attendance-experience-title';

    title.textContent=
        getTitleText(
            taskContext
        );

    const description=
        document.createElement(
            'p'
        );

    description.className=
        'attendance-experience-description';

    description.textContent=
        getStudentCountMessage(
            students.length,
            taskContext
        );

    const beginButton=
        document.createElement(
            'button'
        );

    beginButton.type=
        'button';

    beginButton.className=
        'attendance-primary-button';

    beginButton.textContent=
        hasSelections(
            session
        )
            ?'Continue Attendance'
            :'Begin Attendance';

    if(students.length===0){
        const emptyMessage=
            document.createElement(
                'p'
            );

        emptyMessage.className=
            'attendance-empty-message';

        emptyMessage.textContent=
            'No students are currently listed for this session.';

        beginButton.textContent=
            'Find a Student';

        beginButton.addEventListener(
            'click',
            actions.addStudent
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
            emptyMessage
        );

        container.appendChild(
            beginButton
        );

        workspace.appendChild(
            container
        );

        return;
    }

    beginButton.addEventListener(
        'click',
        actions.begin
    );

    const reviewButton=
        document.createElement(
            'button'
        );

    reviewButton.type=
        'button';

    reviewButton.className=
        'attendance-text-button';

    reviewButton.textContent=
        'Review Everyone';

    reviewButton.addEventListener(
        'click',
        actions.showReview
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
        beginButton
    );

    container.appendChild(
        reviewButton
    );

    workspace.appendChild(
        container
    );
}

function getEyebrowText(
    state,
    taskContext
){
    if(taskContext?.isOverdue){
        return'Overdue Attendance';
    }

    return(
        state.relevantSession?.name||
        'Today’s Session'
    );
}

function getTitleText(
    taskContext
){
    if(!taskContext?.isOverdue){
        return'Let’s finish today’s session.';
    }

    const displayDate=
        getAttendanceDisplayDate(
            taskContext
        );

    const timeRange=
        getAttendanceTimeRange(
            taskContext
        );

    if(
        displayDate&&
        timeRange
    ){
        return(
            `Let’s complete the `+
            `${displayDate} `+
            `(${timeRange}) attendance.`
        );
    }

    if(displayDate){
        return(
            `Let’s complete the `+
            `${displayDate} attendance.`
        );
    }

    return'Let’s complete this overdue attendance.';
}

function hasSelections(session){
    return(
        Object.keys(
            session.selections||
            {}
        ).length>0
    );
}

function getStudentCountMessage(
    studentCount,
    taskContext
){
    const ending=
        taskContext?.isOverdue
            ?'for this session.'
            :'today.';

    if(studentCount===1){
        return(
            `One little learner was expected `+
            `${ending}`
        );
    }

    return(
        `${studentCount} little learners were expected `+
        `${ending}`
    );
}
