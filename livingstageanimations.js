// livingstageanimations.js

window.LivingStage = window.LivingStage || {};

window.LivingStage.Animations = {
    playOpeningScene() {
        const scene = document.querySelector(
            '.living-stage-scene'
        );

        if (!scene) {
            return;
        }

        scene.classList.remove('living-stage-scene-enter');

        requestAnimationFrame(() => {
            scene.classList.add('living-stage-scene-enter');
        });
    },

    playSceneTransition(callback) {
        const viewport = document.getElementById(
            'main-viewport'
        );

        if (!viewport) {
            callback?.();
            return;
        }

        viewport.classList.add('living-stage-transition-out');

        window.setTimeout(() => {
            callback?.();

            viewport.classList.remove(
                'living-stage-transition-out'
            );

            viewport.classList.add(
                'living-stage-transition-in'
            );

            window.setTimeout(() => {
                viewport.classList.remove(
                    'living-stage-transition-in'
                );
            }, 300);
        }, 200);
    },

    playCelebration() {
        /*
         * Badge animation, Pico entrance, confetti, character
         * reactions, and sound can be added here later.
         */
    },

    playMemoryReveal() {
        /*
         * Memory Nest reveal animation will be added here later.
         */
    }
};
