// livingstageload.js

window.LivingStage = window.LivingStage || {};

window.LivingStage.Config = {
    processStudentAttendanceApiUrl:
        'https://x8ki-letl-twmt.n7.xano.io/api:4fS4yUb-/process-student-attendance',

    livingStageApiUrl:
        'https://x8ki-letl-twmt.n7.xano.io/api:4fS4yUb-/living-stage'
};

window.addEventListener(
    'DOMContentLoaded',
    initializeLivingStage
);

async function initializeLivingStage() {
    window.LivingStage.State.setLoading(true);

    window.LivingStage.Render.loading(
        'Preparing The Little Nest...'
    );

    const authToken =
        localStorage.getItem('authToken');

    if (!authToken) {
        window.location.replace('login.html');
        return;
    }

    try {
        await loadSharedComponents();

        await processStudentAttendance(authToken);

        const stageData =
            await loadLivingStageData(authToken);

        validateLivingStageResponse(stageData);

        window.LivingStage.Render.stage(stageData);

        window.LivingStage.State
            .markInitialized();

    } catch (error) {
        console.error(
            'Unable to initialize the Living Stage:',
            error
        );

        if (
            error.status === 401 ||
            error.code === 'UNAUTHORIZED'
        ) {
            clearAuthentication();

            window.location.replace('login.html');
            return;
        }

        window.LivingStage.Render.error(
            error.message ||
            'We could not prepare The Little Nest right now.'
        );
    } finally {
        window.LivingStage.State
            .setLoading(false);
    }
}

async function loadSharedComponents() {
    await Promise.all([
        window.LivingStage.Utils.loadComponent(
            'header.html',
            'header-container'
        ),

        window.LivingStage.Utils.loadComponent(
            'bottom-nav.html',
            'bottom-nav-container'
        )
    ]);
}

async function processStudentAttendance(authToken) {
    const apiUrl =
        window.LivingStage.Config
            .processStudentAttendanceApiUrl;

    if (!apiUrl) {
        throw new Error(
            'The student attendance processing API URL is missing.'
        );
    }

    return window.LivingStage.Utils.fetchJson(
        apiUrl,
        {
            method: 'POST',

            headers: {
                Accept: 'application/json',
                Authorization: `Bearer ${authToken}`
            }
        }
    );
}

async function loadLivingStageData(authToken) {
    const apiUrl =
        window.LivingStage.Config
            .livingStageApiUrl;

    if (
        !apiUrl ||
        apiUrl.includes(
            'PASTE_YOUR_LIVING_STAGE_API_URL_HERE'
        )
    ) {
        return createTemporaryStageData();
    }

    return window.LivingStage.Utils.fetchJson(
        apiUrl,
        {
            method: 'GET',

            headers: {
                Accept: 'application/json',
                Authorization: `Bearer ${authToken}`
            }
        }
    );
}

function validateLivingStageResponse(data) {
    if (!data || typeof data !== 'object') {
        throw new Error(
            'The Living Stage response was empty.'
        );
    }

    if (data.success === false) {
        throw new Error(
            data?.error?.message ||
            'The Living Stage could not be prepared.'
        );
    }

    if (!data.opening_experience) {
        throw new Error(
            'No opening experience was returned.'
        );
    }
}

function clearAuthentication() {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userId');
    localStorage.removeItem('parent_id');
    localStorage.removeItem('franchise_id');
    localStorage.removeItem('franchise_name');
}

function createTemporaryStageData() {
    return {
        success: true,

        generated_at: Date.now(),

        family: {
            parent: {
                id:
                    localStorage.getItem(
                        'parent_id'
                    ) || null,

                user_id:
                    localStorage.getItem(
                        'userId'
                    ) || null,

                first_name: ''
            },

            children: [],

            selected_student_id: null
        },

        student: {
            id: null,
            name: '',
            preferred_name: ''
        },

        franchise: {
            id:
                localStorage.getItem(
                    'franchise_id'
                ) || null,

            name:
                localStorage.getItem(
                    'franchise_name'
                ) || ''
        },

        schedule: {
            today: {
                state: 'schedule_unknown'
            }
        },

        class_context: null,

        opening_experience: {
            id: null,

            experience_type: {
                id: null,
                code: 'welcome',
                name: 'Welcome Back'
            },

            title:
                'The Little Nest is ready.',

            subtitle:
                'Welcome back.',

            story_text:
                'Whenever you are ready, let us continue your child’s story together.',

            priority: 0,

            is_featured: true,
            is_replayable: false,
            is_shareable: false,
            is_memory_candidate: false,

            hero_media: null,

            composition: {}
        },

        available_experiences: [],

        navigation: {
            learning_path_available: true,
            memory_nest_available: false,
            gallery_available: false,
            story_reel_available: false,
            messages_available: false,
            settings_available: true
        }
    };
}
