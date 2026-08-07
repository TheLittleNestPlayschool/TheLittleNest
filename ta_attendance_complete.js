import{
    getAttendanceDisplayDate,
    getAttendanceTimeRange
}from'./ta_attendance_context.js';

export function renderAttendanceComplete(
    workspace,
    context
){
    const{
        taskContext
    }=context;

    const container=
        document.createElement(
            'section'
        );

    container.className=
        'attendance-experience attendance-complete';

    const mark=
        document.createElement(
            'div'
        );

    mark.className=
        'attendance-complete-mark';

    mark.textContent=
        '✓';

    const title=
        document.createElement(
            'h3'
        );

    title.className=
        'attendance-experience-title';

    title.textContent=
        'Attendance recorded.';

    const summary=
        document.createElement(
            'p'
        );

    summary.className=
        'attendance-complete-summary';

    summary.textContent=
        getCompletionSummary(
            taskContext
        );

    const thankYou=
        document.createElement(
            'p'
        );

    thankYou.className=
        'attendance-experience-description';

    thankYou.textContent=
        'Thank you!';

    container.appendChild(
        mark
    );

    container.appendChild(
        title
    );

    container.appendChild(
        summary
    );

    container.appendChild(
        thankYou
    );

    workspace.appendChild(
        container
    );
}

function getCompletionSummary(
    taskContext
){
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
            `${displayDate} · `+
            `${timeRange}`
        );
    }

    if(displayDate){
        return displayDate;
    }

    if(timeRange){
        return timeRange;
    }

    return'Attendance has been saved.';
}
