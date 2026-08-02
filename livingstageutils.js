
// livingstageutils.js

window.LivingStage = window.LivingStage || {};

window.LivingStage.Utils = {
    async loadComponent(fileName, containerId) {
        const container = document.getElementById(containerId);

        if (!container) {
            throw new Error(`Container not found: ${containerId}`);
        }

        const response = await fetch(fileName, {
            cache: 'no-store'
        });

        if (!response.ok) {
            throw new Error(
                `Unable to load ${fileName}. Status: ${response.status}`
            );
        }

        container.innerHTML = await response.text();
    },

    async fetchJson(url, options = {}) {
        const response = await fetch(url, options);

        let data = null;

        try {
            data = await response.json();
        } catch {
            throw new Error('The server returned an invalid response.');
        }

        if (!response.ok) {
            const error = new Error(
                data?.error?.message ||
                data?.message ||
                `Request failed with status ${response.status}.`
            );

            error.status = response.status;
            error.code = data?.error?.code || null;

            throw error;
        }

        return data;
    },

    escapeHtml(value) {
        return String(value ?? '')
            .replaceAll('&', '&amp;')
            .replaceAll('<', '&lt;')
            .replaceAll('>', '&gt;')
            .replaceAll('"', '&quot;')
            .replaceAll("'", '&#039;');
    },

    getChildName(student) {
        return (
            student?.preferred_name?.trim() ||
            student?.name?.trim() ||
            'your little one'
        );
    },

    isImage(media) {
        const fileType = String(media?.file_type || '').toLowerCase();

        return (
            fileType.includes('image') ||
            fileType.includes('jpg') ||
            fileType.includes('jpeg') ||
            fileType.includes('png') ||
            fileType.includes('webp')
        );
    },

    isVideo(media) {
        const fileType = String(media?.file_type || '').toLowerCase();

        return fileType.includes('video');
    }
};
