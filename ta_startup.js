import { API_URLS } from './ta_config.js';

import {
    apiRequest,
    requireTeacherLogin
} from './ta_api.js';

import {
    setContext,
    setTeacherState,
    setRelevantSession,
    setAttendance,
    setLocationStudents,
    getState
} from './ta_state.js';

import {
    renderAttendanceModule
} from './ta_attendance.js';

const teacherStatus =
    document.getElementById('teacherStatus');

export async function startTeacherApp() {

    if (!requireTeacherLogin()) {
        return;
    }

    try {

        teacherStatus.textContent =
            "Loading today's context...";

        //------------------------------------
        // Teacher Context
        //------------------------------------

        const context =
            await apiRequest(
                API_URLS.getContext
            );

        setContext(context);

        console.log(
            'ta_get_context:',
            context
        );

        //------------------------------------
        // Teacher State
        //------------------------------------

        const stateUrl =
            new URL(
                API_URLS.determineTeacherState
            );

        stateUrl.searchParams.set(
            'teacher',
            JSON.stringify(
                context.teacher || {}
            )
        );

        stateUrl.searchParams.set(
            'sessions',
            JSON.stringify(
                context.sessions || []
            )
        );

        stateUrl.searchParams.set(
            'today_day_name',
            context.today_day_name || ''
        );

        stateUrl.searchParams.set(
            'current_time',
            context.current_time || ''
        );

        const teacherState =
            await apiRequest(
                stateUrl.toString()
            );

        setTeacherState(
            teacherState
        );

        console.log(
            'ta_determine_teacher_state:',
            teacherState
        );

        //------------------------------------
        // Relevant Session
        //------------------------------------

        const relevantSession =
            getRelevantSession(
                teacherState
            );

        setRelevantSession(
            relevantSession
        );

        //------------------------------------
        // Session Attendance
        //------------------------------------

        if (relevantSession?.id) {

            teacherStatus.textContent =
                'Loading session attendance...';

            const attendanceUrl =
                new URL(
                    API_URLS.getSessionAttendance
                );

            attendanceUrl.searchParams.set(
                'session_id',
                String(
                    relevantSession.id
                )
            );

            attendanceUrl.searchParams.set(
                'session_date',
                getTodayDate()
            );

            const attendance =
                await apiRequest(
                    attendanceUrl.toString()
                );

            setAttendance(
                attendance
            );

            console.log(
                'ta_get_session_attendance:',
                attendance
            );
        }

        //------------------------------------
        // All Location Students
        //------------------------------------

        teacherStatus.textContent =
            'Loading location students...';

        const locationStudents =
            await apiRequest(
                API_URLS.getLocationStudents
            );

        setLocationStudents(
            locationStudents
        );

        console.log(
            'ta_get_location_students:',
            locationStudents
        );

        //------------------------------------
        // Startup Complete
        //------------------------------------

        teacherStatus.textContent =
            'Teacher session loaded.';

        console.log(
            'Teacher App State:',
            getState()
        );

        renderAttendanceModule();

    } catch (error) {

        console.error(
            'Teacher app startup failed:',
            error
        );

        teacherStatus.textContent =
            error instanceof Error
                ? error.message
                : 'Unable to load Teacher App.';
    }
}

function getRelevantSession(
    teacherState
) {

    switch (
        teacherState.teacher_state
    ) {

        case 'IN_SESSION':
            return (
                teacherState.current_session
            );

        case 'BEFORE_FIRST_SESSION':
            return (
                teacherState.next_session
            );

        case 'BETWEEN_SESSIONS':
            return (
                teacherState.next_session
            );

        case 'AFTER_LAST_SESSION':
            return (
                teacherState.previous_session
            );

        default:
            return (
                teacherState.current_session ||
                teacherState.previous_session ||
                teacherState.next_session ||
                null
            );
    }
}

function getTodayDate() {

    const parts =
        new Intl.DateTimeFormat(
            'en-CA',
            {
                timeZone:
                    'Asia/Manila',
                year:
                    'numeric',
                month:
                    '2-digit',
                day:
                    '2-digit'
            }
        ).formatToParts(
            new Date()
        );

    const values =
        Object.fromEntries(
            parts.map(
                (part) => [
                    part.type,
                    part.value
                ]
            )
        );

    return (
        `${values.year}-` +
        `${values.month}-` +
        `${values.day}`
    );
}
