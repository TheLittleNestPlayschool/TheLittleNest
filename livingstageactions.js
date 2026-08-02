// livingstageactions.js

window.LivingStage = window.LivingStage || {};

window.LivingStage.Actions = {
    bind() {
        const actionElements =
            document.querySelectorAll(
                '[data-stage-action]'
            );

        actionElements.forEach((element) => {
            element.addEventListener(
                'click',
                this.handleClick
            );
        });
    },

    handleClick(event) {
        const element = event.currentTarget;

        const action =
            element.dataset.stageAction;

        const experienceId =
            element.dataset.experienceId || null;

        window.LivingStage.Actions.handle(
            action,
            experienceId
        );
    },

    async handle(action, experienceId = null) {
        switch (action) {
            case 'open-experience':
                this.openCurrentExperience();
                break;

            case 'select-experience':
                this.selectExperience(experienceId);
                break;

            case 'complete-experience':
                await this.completeExperience();
                break;

            case 'return-to-stage':
                this.returnToStage();
                break;

            case 'open-learning-path':
                await this.openLearningPath();
                break;

            case 'retry':
                window.location.reload();
                break;

            default:
                console.warn(
                    'Unknown Living Stage action:',
                    action
                );
        }
    },

    openCurrentExperience() {
        const experience =
            window.LivingStage.State.currentExperience;

        if (!experience) {
            return;
        }

        this.recordActivity(
            experience.id,
            'opened'
        );

        window.LivingStage.Animations
            .playSceneTransition(() => {
                window.LivingStage.Render
                    .experienceDetail(experience);
            });

        const typeCode =
            experience?.experience_type?.code;

        if (
            typeCode === 'badge_celebration' ||
            typeCode === 'birthday_celebration' ||
            typeCode === 'recognition_day'
        ) {
            window.LivingStage.Animations
                .playCelebration();
        }

        if (typeCode === 'memory_replay') {
            window.LivingStage.Animations
                .playMemoryReveal();
        }
    },

    selectExperience(experienceId) {
        const experience =
            window.LivingStage.State
                .getAvailableExperience(
                    experienceId
                );

        if (!experience) {
            console.warn(
                'Experience not found:',
                experienceId
            );
            return;
        }

        window.LivingStage.State
            .setCurrentExperience(experience);

        window.LivingStage.Animations
            .playSceneTransition(() => {
                window.LivingStage.Render
                    .experience(experience);
            });
    },

    async completeExperience() {
        const experience =
            window.LivingStage.State.currentExperience;

        if (experience?.id) {
            await this.recordActivity(
                experience.id,
                'completed'
            );
        }

        this.returnToStage();
    },

    returnToStage() {
        window.LivingStage.State
            .resetToOpeningExperience();

        const experience =
            window.LivingStage.State
                .openingExperience;

        if (!experience) {
            return;
        }

        window.LivingStage.Animations
            .playSceneTransition(() => {
                window.LivingStage.Render
                    .experience(experience);
            });
    },

    async openLearningPath() {
        try {
            await window.LivingStage.Utils
                .loadComponent(
                    'learning-path.html',
                    'main-viewport'
                );
        } catch (error) {
            console.error(
                'Unable to load Learning Path:',
                error
            );

            window.LivingStage.Render.error(
                'The Learning Journey could not be opened.'
            );
        }
    },

    async recordActivity(
        experienceId,
        activityCode
    ) {
        /*
         * The Experience Activity endpoint has not been
         * connected yet.
         *
         * Later this function will send:
         *
         * experience_id
         * activity_code
         *
         * The authenticated user will determine the parent,
         * student, and user relationships.
         */

        console.log(
            'Experience activity:',
            {
                experienceId,
                activityCode
            }
        );
    }
};

window.switchView = function switchView(viewFile) {
    return window.LivingStage.Utils.loadComponent(
        viewFile,
        'main-viewport'
    );
};
