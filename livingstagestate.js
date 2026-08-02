
// livingstagestate.js

window.LivingStage = window.LivingStage || {};

window.LivingStage.State = {
    data: null,
    selectedStudentId: null,
    openingExperience: null,
    currentExperience: null,
    initialized: false,
    loading: false,

    setLoading(isLoading) {
        this.loading = Boolean(isLoading);
    },

    setData(data) {
        this.data = data;

        this.selectedStudentId =
            data?.family?.selected_student_id ||
            data?.student?.id ||
            null;

        this.openingExperience =
            data?.opening_experience ||
            null;

        this.currentExperience =
            data?.opening_experience ||
            null;
    },

    setCurrentExperience(experience) {
        this.currentExperience = experience || null;
    },

    resetToOpeningExperience() {
        this.currentExperience = this.openingExperience;
    },

    markInitialized() {
        this.initialized = true;
    },

    getAvailableExperience(experienceId) {
        const experiences =
            this.data?.available_experiences || [];

        return experiences.find(
            (experience) =>
                Number(experience.id) === Number(experienceId)
        ) || null;
    }
};
