
// livingstagerender.js

window.LivingStage = window.LivingStage || {};

window.LivingStage.Render = {
    loading(message = 'Preparing The Little Nest...') {
        const viewport = document.getElementById(
            'main-viewport'
        );

        if (!viewport) {
            return;
        }

        const safeMessage =
            window.LivingStage.Utils.escapeHtml(message);

        viewport.innerHTML = `
            <div class="living-stage-status">
                <div>
                    <div
                        class="living-stage-loader"
                        aria-hidden="true"
                    ></div>

                    <p>${safeMessage}</p>
                </div>
            </div>
        `;
    },

    stage(data) {
        window.LivingStage.State.setData(data);

        const openingExperience =
            data?.opening_experience;

        if (!openingExperience) {
            this.error(
                'No opening experience was returned.'
            );
            return;
        }

        this.experience(openingExperience);

        window.LivingStage.Animations.playOpeningScene();
    },

    experience(experience) {
        const viewport = document.getElementById(
            'main-viewport'
        );

        if (!viewport) {
            return;
        }

        window.LivingStage.State.setCurrentExperience(
            experience
        );

        const data =
            window.LivingStage.State.data || {};

        const student = data.student || {};

        const childName =
            window.LivingStage.Utils.getChildName(student);

        const typeCode =
            experience?.experience_type?.code ||
            'welcome';

        const title =
            experience?.title ||
            `Welcome back to ${childName}'s story.`;

        const subtitle =
            experience?.subtitle || '';

        const storyText =
            experience?.story_text ||
            experience?.composition?.opening?.message ||
            '';

        const heroMedia =
            experience?.hero_media || null;

        const availableExperiences =
            data.available_experiences || [];

        viewport.innerHTML = `
            <section
                class="living-stage"
                data-experience-type="${
                    window.LivingStage.Utils.escapeHtml(
                        typeCode
                    )
                }"
            >
                <div class="living-stage-scene">
                    ${this.experienceLabel(experience)}

                    <h1 class="living-stage-title">
                        ${
                            window.LivingStage.Utils.escapeHtml(
                                title
                            )
                        }
                    </h1>

                    ${
                        subtitle
                            ? `
                                <p class="living-stage-subtitle">
                                    ${
                                        window.LivingStage.Utils.escapeHtml(
                                            subtitle
                                        )
                                    }
                                </p>
                            `
                            : ''
                    }

                    ${this.heroMedia(heroMedia)}

                    ${
                        storyText
                            ? `
                                <p class="living-stage-message">
                                    ${
                                        window.LivingStage.Utils.escapeHtml(
                                            storyText
                                        )
                                    }
                                </p>
                            `
                            : ''
                    }

                    ${this.primaryActions(experience)}

                    ${this.availableExperiences(
                        availableExperiences,
                        experience?.id
                    )}
                </div>
            </section>
        `;

        window.LivingStage.Actions.bind();
    },

    experienceLabel(experience) {
        const label =
            experience?.experience_type?.name ||
            'The Living Stage';

        return `
            <p class="living-stage-eyebrow">
                ${
                    window.LivingStage.Utils.escapeHtml(
                        label
                    )
                }
            </p>
        `;
    },

    heroMedia(media) {
        if (!media?.file_url) {
            return '';
        }

        const safeUrl =
            window.LivingStage.Utils.escapeHtml(
                media.file_url
            );

        if (window.LivingStage.Utils.isVideo(media)) {
            return `
                <div class="living-stage-hero-media">
                    <video
                        src="${safeUrl}"
                        controls
                        playsinline
                        preload="metadata"
                    ></video>
                </div>
            `;
        }

        if (window.LivingStage.Utils.isImage(media)) {
            return `
                <div class="living-stage-hero-media">
                    <img
                        src="${safeUrl}"
                        alt=""
                    >
                </div>
            `;
        }

        return '';
    },

    primaryActions(experience) {
        const experienceId =
            experience?.id ?? '';

        const typeCode =
            experience?.experience_type?.code ||
            'welcome';

        const mainLabel =
            this.getPrimaryActionLabel(typeCode);

        const buttons = [];

        if (typeCode !== 'welcome') {
            buttons.push(`
                <button
                    type="button"
                    class="
                        living-stage-button
                        living-stage-button-primary
                    "
                    data-stage-action="open-experience"
                    data-experience-id="${
                        window.LivingStage.Utils.escapeHtml(
                            experienceId
                        )
                    }"
                >
                    ${
                        window.LivingStage.Utils.escapeHtml(
                            mainLabel
                        )
                    }
                </button>
            `);
        }

        buttons.push(`
            <button
                type="button"
                class="
                    living-stage-button
                    living-stage-button-secondary
                "
                data-stage-action="open-learning-path"
            >
                Explore the learning journey
            </button>
        `);

        return `
            <div class="living-stage-actions">
                ${buttons.join('')}
            </div>
        `;
    },

    getPrimaryActionLabel(typeCode) {
        const labels = {
            badge_celebration:
                'Begin the celebration',

            todays_chapter:
                "Open today's chapter",

            story_reel:
                'Watch Story Reel',

            memory_replay:
                'Relive the memory',

            next_adventure:
                'See what is next',

            birthday_celebration:
                'Begin the celebration',

            recognition_day:
                'Begin the celebration',

            class_later:
                'See today’s adventure'
        };

        return labels[typeCode] || 'Open experience';
    },

    availableExperiences(
        experiences,
        currentExperienceId
    ) {
        const otherExperiences = experiences.filter(
            (experience) =>
                Number(experience.id) !==
                Number(currentExperienceId)
        );

        if (!otherExperiences.length) {
            return '';
        }

        const items = otherExperiences.map(
            (experience) => {
                const typeName =
                    experience?.experience_type?.name ||
                    'Experience';

                const title =
                    experience?.title ||
                    typeName;

                return `
                    <button
                        type="button"
                        class="living-stage-experience-link"
                        data-stage-action="select-experience"
                        data-experience-id="${
                            window.LivingStage.Utils.escapeHtml(
                                experience.id
                            )
                        }"
                    >
                        <span>
                            ${
                                window.LivingStage.Utils.escapeHtml(
                                    typeName
                                )
                            }
                        </span>

                        <strong>
                            ${
                                window.LivingStage.Utils.escapeHtml(
                                    title
                                )
                            }
                        </strong>
                    </button>
                `;
            }
        ).join('');

        return `
            <div class="living-stage-more">
                <h2>More from your Little Nest</h2>
                ${items}
            </div>
        `;
    },

    experienceDetail(experience) {
        const viewport = document.getElementById(
            'main-viewport'
        );

        if (!viewport) {
            return;
        }

        const title =
            experience?.title ||
            'The Living Stage';

        const subtitle =
            experience?.subtitle || '';

        const storyText =
            experience?.story_text ||
            experience?.composition?.opening?.message ||
            '';

        const conversationStarter =
            experience?.composition
                ?.conversation_starter ||
            '';

        viewport.innerHTML = `
            <section class="living-stage">
                <div class="living-stage-scene">
                    ${this.experienceLabel(experience)}

                    <h1 class="living-stage-title">
                        ${
                            window.LivingStage.Utils.escapeHtml(
                                title
                            )
                        }
                    </h1>

                    ${
                        subtitle
                            ? `
                                <p class="living-stage-subtitle">
                                    ${
                                        window.LivingStage.Utils.escapeHtml(
                                            subtitle
                                        )
                                    }
                                </p>
                            `
                            : ''
                    }

                    ${this.heroMedia(
                        experience?.hero_media
                    )}

                    ${
                        storyText
                            ? `
                                <p class="living-stage-message">
                                    ${
                                        window.LivingStage.Utils.escapeHtml(
                                            storyText
                                        )
                                    }
                                </p>
                            `
                            : ''
                    }

                    ${
                        conversationStarter
                            ? `
                                <div class="living-stage-conversation">
                                    <h2>Talk about it together</h2>

                                    <p>
                                        ${
                                            window.LivingStage.Utils.escapeHtml(
                                                conversationStarter
                                            )
                                        }
                                    </p>
                                </div>
                            `
                            : ''
                    }

                    <div class="living-stage-actions">
                        <button
                            type="button"
                            class="
                                living-stage-button
                                living-stage-button-primary
                            "
                            data-stage-action="complete-experience"
                        >
                            Continue
                        </button>

                        <button
                            type="button"
                            class="
                                living-stage-button
                                living-stage-button-secondary
                            "
                            data-stage-action="return-to-stage"
                        >
                            Return to the stage
                        </button>
                    </div>
                </div>
            </section>
        `;

        window.LivingStage.Actions.bind();
    },

    error(message) {
        const viewport = document.getElementById(
            'main-viewport'
        );

        if (!viewport) {
            return;
        }

        viewport.innerHTML = `
            <div
                class="living-stage-status"
                role="alert"
            >
                <div>
                    <h1>Something went wrong.</h1>

                    <p>
                        ${
                            window.LivingStage.Utils.escapeHtml(
                                message
                            )
                        }
                    </p>

                    <button
                        type="button"
                        class="
                            living-stage-button
                            living-stage-button-primary
                        "
                        data-stage-action="retry"
                    >
                        Try again
                    </button>
                </div>
            </div>
        `;

        window.LivingStage.Actions.bind();
    }
};
