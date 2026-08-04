import { APP_CONFIG } from './config.js';

const authToken = localStorage.getItem('authToken');

export async function apiRequest(url, options = {}) {
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

        throw new Error(message);
    }

    return data;
}

export function requireTeacherLogin() {
    const authToken = localStorage.getItem('authToken');
    const teacherId = localStorage.getItem('teacher_id');

    if (!authToken || !teacherId) {
        window.location.replace(APP_CONFIG.loginPage);
        return false;
    }

    return {
        authToken,
        teacherId
    };
}
