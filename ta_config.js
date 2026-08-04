const API_BASE_URL =
    'https://x8ki-letl-twmt.n7.xano.io/api:EpDLPKN0';

const API_URLS = {
    getContext: `${API_BASE_URL}/ta_get_context`,
    determineTeacherState:
        `${API_BASE_URL}/ta_determine_teacher_state`,
    getSessionAttendance:
        `${API_BASE_URL}/ta_get_session_attendance`
};

const APP_CONFIG = {
    loginPage: 'ta_loginteacher.html',
    timeZone: 'Asia/Manila'
};

export {
    API_BASE_URL,
    API_URLS,
    APP_CONFIG
};
