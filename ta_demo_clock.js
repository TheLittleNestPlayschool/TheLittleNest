const DEMO_TIME_STORAGE_KEY=
    'teacherAppDemoTime';

let demoClockElements=null;

export function initializeDemoClock(){
    if(demoClockElements){
        return;
    }

    injectDemoClockStyles();

    demoClockElements=
        createDemoClock();

    document.body.appendChild(
        demoClockElements.container
    );

    bindDemoClockEvents();

    updateDemoClockDisplay();
}

export function getDemoTime(){
    const savedTime=
        window.sessionStorage.getItem(
            DEMO_TIME_STORAGE_KEY
        );

    return isValidTime(savedTime)
        ?savedTime
        :null;
}

export function getEffectiveTime(
    realTime=''
){
    return(
        getDemoTime()||
        realTime
    );
}

export function isDemoTimeActive(){
    return Boolean(
        getDemoTime()
    );
}

function createDemoClock(){
    const container=
        document.createElement(
            'aside'
        );

    container.className=
        'teacher-demo-clock';

    container.innerHTML=`
        <button
            type="button"
            class="teacher-demo-clock-toggle"
            aria-expanded="false"
        >
            Demo Time
        </button>

        <section
            class="teacher-demo-clock-panel"
            hidden
        >
            <div class="teacher-demo-clock-header">
                <strong>Demo Time</strong>

                <button
                    type="button"
                    class="teacher-demo-clock-close"
                    aria-label="Close demo time"
                >
                    ×
                </button>
            </div>

            <p class="teacher-demo-clock-status">
                Using real time.
            </p>

            <label class="teacher-demo-clock-label">
                Enter a time

                <input
                    type="time"
                    class="teacher-demo-clock-input"
                    step="60"
                >
            </label>

            <div class="teacher-demo-clock-actions">
                <button
                    type="button"
                    class="teacher-demo-clock-apply"
                >
                    Use This Time
                </button>

                <button
                    type="button"
                    class="teacher-demo-clock-reset"
                >
                    Use Real Time
                </button>
            </div>
        </section>
    `;

    return{
        container,

        toggle:
            container.querySelector(
                '.teacher-demo-clock-toggle'
            ),

        panel:
            container.querySelector(
                '.teacher-demo-clock-panel'
            ),

        close:
            container.querySelector(
                '.teacher-demo-clock-close'
            ),

        status:
            container.querySelector(
                '.teacher-demo-clock-status'
            ),

        input:
            container.querySelector(
                '.teacher-demo-clock-input'
            ),

        apply:
            container.querySelector(
                '.teacher-demo-clock-apply'
            ),

        reset:
            container.querySelector(
                '.teacher-demo-clock-reset'
            )
    };
}

function bindDemoClockEvents(){
    const{
        toggle,
        panel,
        close,
        input,
        apply,
        reset
    }=demoClockElements;

    toggle.addEventListener(
        'click',
        ()=>{
            const isOpening=
                panel.hidden;

            panel.hidden=
                !isOpening;

            toggle.setAttribute(
                'aria-expanded',
                String(isOpening)
            );
        }
    );

    close.addEventListener(
        'click',
        ()=>{
            panel.hidden=
                true;

            toggle.setAttribute(
                'aria-expanded',
                'false'
            );
        }
    );

    apply.addEventListener(
        'click',
        ()=>{
            applyDemoTime(
                input.value
            );
        }
    );

    input.addEventListener(
        'keydown',
        event=>{
            if(event.key!=='Enter'){
                return;
            }

            event.preventDefault();

            applyDemoTime(
                input.value
            );
        }
    );

    reset.addEventListener(
        'click',
        resetDemoTime
    );
}

function applyDemoTime(time){
    if(!isValidTime(time)){
        demoClockElements.status.textContent=
            'Enter a valid time.';

        return;
    }

    window.sessionStorage.setItem(
        DEMO_TIME_STORAGE_KEY,
        time
    );

    updateDemoClockDisplay();

    window.location.reload();
}

function resetDemoTime(){
    window.sessionStorage.removeItem(
        DEMO_TIME_STORAGE_KEY
    );

    updateDemoClockDisplay();

    window.location.reload();
}

function updateDemoClockDisplay(){
    if(!demoClockElements){
        return;
    }

    const demoTime=
        getDemoTime();

    if(demoTime){
        demoClockElements.input.value=
            demoTime;

        demoClockElements.status.textContent=
            `Using demo time: ${demoTime}`;

        demoClockElements.container.classList.add(
            'is-active'
        );

        return;
    }

    demoClockElements.input.value=
        '';

    demoClockElements.status.textContent=
        'Using real time.';

    demoClockElements.container.classList.remove(
        'is-active'
    );
}

function isValidTime(time){
    return(
        typeof time==='string'&&
        /^([01]\d|2[0-3]):[0-5]\d$/
            .test(time)
    );
}

function injectDemoClockStyles(){
    if(
        document.getElementById(
            'teacherDemoClockStyles'
        )
    ){
        return;
    }

    const style=
        document.createElement(
            'style'
        );

    style.id=
        'teacherDemoClockStyles';

    style.textContent=`
        .teacher-demo-clock{
            position:fixed;
            right:10px;
            bottom:10px;
            z-index:9999;
            font-family:"Segoe UI",sans-serif;
        }

        .teacher-demo-clock-toggle{
            padding:8px 12px;
            border:1px solid rgba(255,255,255,.5);
            border-radius:10px;
            background:rgba(15,23,42,.86);
            color:#fff;
            font-size:.78rem;
            font-weight:800;
            cursor:pointer;
            box-shadow:0 8px 22px rgba(0,0,0,.18);
        }

        .teacher-demo-clock.is-active
        .teacher-demo-clock-toggle{
            background:#b45309;
        }

        .teacher-demo-clock-panel{
            position:absolute;
            right:0;
            bottom:44px;
            width:240px;
            padding:12px;
            border:1px solid rgba(255,255,255,.42);
            border-radius:14px;
            background:rgba(15,23,42,.94);
            color:#f8fafc;
            box-shadow:0 14px 36px rgba(0,0,0,.28);
            backdrop-filter:blur(12px);
        }

        .teacher-demo-clock-header{
            display:flex;
            align-items:center;
            justify-content:space-between;
            margin-bottom:8px;
        }

        .teacher-demo-clock-close{
            width:26px;
            height:26px;
            padding:0;
            border:0;
            border-radius:7px;
            background:rgba(255,255,255,.12);
            color:#fff;
            font-size:18px;
            cursor:pointer;
        }

        .teacher-demo-clock-status{
            margin:0 0 10px;
            color:#cbd5e1;
            font-size:.76rem;
        }

        .teacher-demo-clock-label{
            display:flex;
            flex-direction:column;
            gap:5px;
            font-size:.74rem;
            font-weight:700;
        }

        .teacher-demo-clock-input{
            width:100%;
            box-sizing:border-box;
            padding:8px;
            border:1px solid rgba(255,255,255,.25);
            border-radius:8px;
            background:rgba(255,255,255,.10);
            color:#fff;
            font:inherit;
        }

        .teacher-demo-clock-actions{
            display:flex;
            gap:7px;
            margin-top:10px;
        }

        .teacher-demo-clock-apply,
        .teacher-demo-clock-reset{
            flex:1;
            padding:8px;
            border:0;
            border-radius:8px;
            font-size:.7rem;
            font-weight:800;
            cursor:pointer;
        }

        .teacher-demo-clock-apply{
            background:#2563eb;
            color:#fff;
        }

        .teacher-demo-clock-reset{
            background:rgba(255,255,255,.14);
            color:#fff;
        }
    `;

    document.head.appendChild(
        style
    );
}
