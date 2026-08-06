import{
    getTeacherStage
}from'./ta_ui.js';

const CENTER_DELAY_MS=60;

let centerTimer=null;

export function centerLivingModule(){
    cancelPendingCenter();

    centerTimer=window.setTimeout(
        ()=>{
            centerTimer=null;
            centerActiveCard();
        },
        CENTER_DELAY_MS
    );
}

export function cancelLivingStageMotion(){
    cancelPendingCenter();
}

function centerActiveCard(){
    const stage=getTeacherStage();

    if(!stage){
        return;
    }

    const activeCard=stage.querySelector(
        '.teacher-module-card.is-expanded'
    );

    if(!activeCard){
        return;
    }

    const targetScrollTop=
        getCenteredScrollPosition(
            stage,
            activeCard
        );

    stage.scrollTo({
        top:targetScrollTop,
        behavior:getScrollBehavior()
    });
}

function getCenteredScrollPosition(
    stage,
    activeCard
){
    const stageRect=
        stage.getBoundingClientRect();

    const cardRect=
        activeCard.getBoundingClientRect();

    const currentScrollTop=
        stage.scrollTop;

    const cardTopInsideStage=
        cardRect.top-
        stageRect.top+
        currentScrollTop;

    const availableStageHeight=
        stage.clientHeight;

    const centeredOffset=
        (
            availableStageHeight-
            activeCard.offsetHeight
        )/2;

    const desiredScrollTop=
        cardTopInsideStage-
        centeredOffset;

    const maximumScrollTop=
        Math.max(
            0,
            stage.scrollHeight-
            stage.clientHeight
        );

    return clamp(
        desiredScrollTop,
        0,
        maximumScrollTop
    );
}

function getScrollBehavior(){
    return prefersReducedMotion()
        ?'auto'
        :'smooth';
}

function prefersReducedMotion(){
    return window.matchMedia(
        '(prefers-reduced-motion: reduce)'
    ).matches;
}

function cancelPendingCenter(){
    if(centerTimer===null){
        return;
    }

    window.clearTimeout(
        centerTimer
    );

    centerTimer=null;
}

function clamp(
    value,
    minimum,
    maximum
){
    return Math.min(
        Math.max(
            value,
            minimum
        ),
        maximum
    );
}
