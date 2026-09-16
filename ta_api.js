import { APP_CONFIG } from './ta_config.js';

const TEACHER_SESSION_KEYS = [
    'authToken',
    'userId',
    'admin_type_id',
    'teacher_id',
    'parent_id',
    'franchise_id',
    'franchise_name'
];

let redirectingToLogin = false;

function clearTeacherSession() {
    TEACHER_SESSION_KEYS.forEach((key) => {
        localStorage.removeItem(key);
    });

    sessionStorage.clear();
}

function isAuthenticationFailure(response, data) {
    if (response.status === 401) {
        return true;
    }

    const message = String(
        data?.message ||
        data?.error ||
        ''
    ).toLowerCase();

    return (
        message.includes('token is expired') ||
        message.includes('token has expired') ||
        message.includes('invalid token') ||
        message.includes('unauthorized')
    );
}

function redirectToTeacherLogin() {
    if (redirectingToLogin) {
        return;
    }

    redirectingToLogin = true;
    clearTeacherSession();
    window.location.replace(APP_CONFIG.loginPage);
}

export async function apiRequest(url, options = {}) {
    const authToken = localStorage.getItem('authToken');

    if (!authToken) {
        redirectToTeacherLogin();
        throw new Error('Your session has expired. Please sign in again.');
    }

    const response = await fetch(url, {
        method: options.method || 'GET',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${authToken}`,
            ...(options.headers || {})
        },
        body: options.body
            ? JSON.stringify(options.body)
            : undefined
    });

    let data;

    try {
        data = await response.json();
    } catch {
        data = null;
    }

    if (!response.ok) {
        const message =
            data?.message ||
            data?.error ||
            `Request failed with status ${response.status}.`;

        if (isAuthenticationFailure(response, data)) {
            redirectToTeacherLogin();
            throw new Error('Your session has expired. Please sign in again.');
        }

        throw new Error(message);
    }

    return data;
}

export function requireTeacherLogin() {
    const authToken = localStorage.getItem('authToken');
    const teacherId = localStorage.getItem('teacher_id');

    if (!authToken || !teacherId) {
        redirectToTeacherLogin();
        return false;
    }

    return {
        authToken,
        teacherId
    };
}
