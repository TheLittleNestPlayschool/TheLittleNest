const DEBUG_ENABLED=true;

const startupStartedAt=
    performance.now();

let overlay=null;
let list=null;
let total=null;

const stepRecords=
    new Map();

export const startupDebug={
    begin,
    start,
    finish,
    fail,
    note,
    complete
};

function begin(){
    if(!DEBUG_ENABLED){
        return;
    }

    createOverlay();

    note(
        'Teacher App startup began.'
    );
}

function start(
    stepId,
    label
){
    if(!DEBUG_ENABLED){
        return;
    }

    createOverlay();

    const record={
        id:stepId,
        label,
        startedAt:performance.now(),
        element:createStepElement(
            label,
            'running'
        )
    };

    stepRecords.set(
        stepId,
        record
    );

    list.appendChild(
        record.element
    );

    updateTotal();
}

function finish(
    stepId,
    detail=''
){
    if(!DEBUG_ENABLED){
        return;
    }

    const record=
        stepRecords.get(
            stepId
        );

    if(!record){
        return;
    }

    const duration=
        performance.now()-
        record.startedAt;

    updateStepElement(
        record.element,
        record.label,
        'complete',
        duration,
        detail
    );

    updateTotal();
}

function fail(
    stepId,
    error
){
    if(!DEBUG_ENABLED){
        return;
    }

    const record=
        stepRecords.get(
            stepId
        );

    if(!record){
        note(
            getErrorMessage(error),
            'error'
        );

        return;
    }

    const duration=
        performance.now()-
        record.startedAt;

    updateStepElement(
        record.element,
        record.label,
        'error',
        duration,
        getErrorMessage(error)
    );

    updateTotal();
}

function note(
    message,
    type='note'
){
    if(!DEBUG_ENABLED){
        return;
    }

    createOverlay();

    const item=document.createElement(
        'div'
    );

    item.className=
        `startup-debug-note is-${type}`;

    item.textContent=message;

    list.appendChild(
        item
    );
}

function complete(){
    if(!DEBUG_ENABLED){
        return;
    }

    const duration=
        performance.now()-
        startupStartedAt;

    updateTotal(
        duration,
        true
    );

    overlay.classList.add(
        'is-complete'
    );
}

function createOverlay(){
    if(
        overlay||
        !DEBUG_ENABLED
    ){
        return;
    }

    injectStyles();

    overlay=document.createElement(
        'aside'
    );

    overlay.className=
        'startup-debug-overlay';

    overlay.innerHTML=`
        <div class="startup-debug-header">
            <strong>Teacher App Startup</strong>

            <button
                type="button"
                class="startup-debug-close"
                aria-label="Close startup diagnostics"
            >
                ×
            </button>
        </div>

        <div class="startup-debug-list"></div>

        <div class="startup-debug-total">
            Total: 0 ms
        </div>
    `;

    list=overlay.querySelector(
        '.startup-debug-list'
    );

    total=overlay.querySelector(
        '.startup-debug-total'
    );

    overlay
        .querySelector(
            '.startup-debug-close'
        )
        .addEventListener(
            'click',
            ()=>{
                overlay.remove();
                overlay=null;
                list=null;
                total=null;
            }
        );

    document.body.appendChild(
        overlay
    );
}

function createStepElement(
    label,
    state
){
    const item=document.createElement(
        'div'
    );

    updateStepElement(
        item,
        label,
        state,
        null,
        ''
    );

    return item;
}

function updateStepElement(
    element,
    label,
    state,
    duration,
    detail
){
    element.className=
        `startup-debug-step is-${state}`;

    const symbol=
        state==='complete'
            ?'✓'
            :state==='error'
                ?'!'
                :'…';

    const durationText=
        typeof duration==='number'
            ?formatDuration(
                duration
            )
            :'running';

    element.innerHTML=`
        <span class="startup-debug-symbol">
            ${symbol}
        </span>

        <span class="startup-debug-label">
            ${escapeHtml(label)}
        </span>

        <span class="startup-debug-duration">
            ${durationText}
        </span>

        ${
            detail
                ?`
                    <span class="startup-debug-detail">
                        ${escapeHtml(detail)}
                    </span>
                `
                :''
        }
    `;
}

function updateTotal(
    duration=
        performance.now()-
        startupStartedAt,
    isComplete=false
){
    if(!total){
        return;
    }

    total.textContent=
        `${isComplete?'Complete':'Total'}: `+
        formatDuration(duration);
}

function formatDuration(
    milliseconds
){
    if(milliseconds<1000){
        return(
            `${Math.round(milliseconds)} ms`
        );
    }

    return(
        `${(
            milliseconds/1000
        ).toFixed(2)} s`
    );
}

function getErrorMessage(error){
    return error instanceof Error
        ?error.message
        :String(error);
}

function escapeHtml(value){
    return String(value)
        .replaceAll('&','&amp;')
        .replaceAll('<','&lt;')
        .replaceAll('>','&gt;')
        .replaceAll('"','&quot;')
        .replaceAll("'",'&#039;');
}

function injectStyles(){
    if(
        document.getElementById(
            'startupDebugStyles'
        )
    ){
        return;
    }

    const style=document.createElement(
        'style'
    );

    style.id='startupDebugStyles';

    style.textContent=`
        .startup-debug-overlay{
            position:fixed;
            top:8px;
            left:8px;
            width:min(360px,calc(100vw - 16px));
            max-height:calc(100vh - 16px);
            padding:10px;
            overflow:auto;
            z-index:99999;
            border:1px solid rgba(255,255,255,.45);
            border-radius:12px;
            background:rgba(15,23,42,.92);
            box-shadow:0 12px 36px rgba(0,0,0,.28);
            color:#f8fafc;
            font:12px/1.35 "Segoe UI",sans-serif;
            backdrop-filter:blur(10px);
        }

        .startup-debug-header{
            display:flex;
            align-items:center;
            justify-content:space-between;
            gap:8px;
            margin-bottom:8px;
        }

        .startup-debug-close{
            width:25px;
            height:25px;
            padding:0;
            border:0;
            border-radius:7px;
            background:rgba(255,255,255,.14);
            color:#fff;
            font-size:18px;
            cursor:pointer;
        }

        .startup-debug-list{
            display:flex;
            flex-direction:column;
            gap:5px;
        }

        .startup-debug-step{
            display:grid;
            grid-template-columns:16px 1fr auto;
            gap:6px;
            padding:5px 6px;
            border-radius:7px;
            background:rgba(255,255,255,.06);
        }

        .startup-debug-step.is-complete{
            background:rgba(16,185,129,.15);
        }

        .startup-debug-step.is-error{
            background:rgba(239,68,68,.20);
        }

        .startup-debug-symbol{
            font-weight:900;
        }

        .startup-debug-duration{
            white-space:nowrap;
            color:#cbd5e1;
        }

        .startup-debug-detail{
            grid-column:2 / 4;
            color:#fca5a5;
            overflow-wrap:anywhere;
        }

        .startup-debug-note{
            padding:4px 6px;
            color:#cbd5e1;
        }

        .startup-debug-note.is-error{
            color:#fca5a5;
        }

        .startup-debug-total{
            margin-top:8px;
            padding-top:7px;
            border-top:1px solid rgba(255,255,255,.18);
            font-weight:800;
        }

        .startup-debug-overlay.is-complete
        .startup-debug-total{
            color:#6ee7b7;
        }
    `;

    document.head.appendChild(
        style
    );
}
