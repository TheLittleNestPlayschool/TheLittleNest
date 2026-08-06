const activeAnimations=
    new Set();

export function cancelLivingStageMotion(){
    activeAnimations.forEach(
        animation=>{
            animation.cancel();
        }
    );

    activeAnimations.clear();
}

export function registerStageAnimation(
    animation
){
    if(!animation){
        return null;
    }

    activeAnimations.add(
        animation
    );

    animation.finished
        .catch(()=>{
            // Cancellation is expected.
        })
        .finally(()=>{
            activeAnimations.delete(
                animation
            );
        });

    return animation;
}

export function stageMotionIsReduced(){
    return window.matchMedia(
        '(prefers-reduced-motion: reduce)'
    ).matches;
}
