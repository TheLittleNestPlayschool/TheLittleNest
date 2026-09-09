import{API_URLS,APP_CONFIG}from'./ta_config.js';

/*   analytics configuration*/
const DB_NAME='tlnp_usage';
const DB_VERSION=1;
const STORE_NAME='sessions';
const SCHEMA_VERSION=1;
const IDLE_TIMEOUT_MS=60000;
const PERSIST_DELAY_MS=250;

let currentSession=null;
let activeStartedAt=null;
let isIdle=false;
let windowFocused=document.hasFocus();
let idleTimer=null;
let persistTimer=null;
let listenersBound=false;
let sessionFinalized=false;
let dbPromise=null;

/*   public analytics api*/
export async function startAnalyticsSession(){
    if(currentSession){return currentSession;}
    const now=Date.now();
    currentSession={
        session_uuid:createSessionUuid(),
        schema_version:SCHEMA_VERSION,
        started_at:now,
        ended_at:null,
        last_event_at:now,
        total_duration_ms:0,
        active_duration_ms:0,
        event_count:0,
        end_reason:null,
        is_complete:false,
        app_version:APP_CONFIG.appVersion||'',
        device_type:getDeviceType(),
        platform:getPlatform(),
        browser:getBrowser(),
        screen_width:window.screen?.width||0,
        screen_height:window.screen?.height||0,
        viewport_width:window.innerWidth||0,
        viewport_height:window.innerHeight||0,
        language:navigator.language||'',
        timezone:getTimezone(),
        online_at_start:navigator.onLine,
        session_context:{},
        events:[]
    };
    sessionFinalized=false;
    isIdle=false;
    windowFocused=document.hasFocus();
    bindAnalyticsListeners();
    if(canCountActiveTime()){startActivePeriod(now);}
    resetIdleTimer();
    addEvent('app_started');
    await persistCurrentSession();
    void retryPendingSessions(currentSession.session_uuid);
    return currentSession;
}

export function setAnalyticsContext(context={}){
    if(!currentSession||sessionFinalized){return;}
    currentSession.session_context={...currentSession.session_context,...context};
    schedulePersist();
}

export function trackAnalyticsEvent(type,details={}){
    if(!currentSession||sessionFinalized){return;}
    addEvent(type,details);
}

export function markAnalyticsReady(){addEvent('app_ready');}

export async function finishAnalyticsSession(reason='manual'){
    const payload=finalizeSession(reason,true);
    if(!payload){return false;}
    try{
        await uploadPayload(payload);
        await deleteSession(payload.session_uuid);
        return true;
    }catch(error){
        console.warn('Analytics upload failed. Session kept locally.',error);
        return false;
    }
}

/*   event capture*/
function bindAnalyticsListeners(){
    if(listenersBound){return;}
    listenersBound=true;
    document.addEventListener('click',handleClick,true);
    document.addEventListener('change',handleChange,true);
    document.addEventListener('pointerdown',markUserActivity,{capture:true,passive:true});
    document.addEventListener('keydown',markUserActivity,true);
    document.addEventListener('touchstart',markUserActivity,{capture:true,passive:true});
    document.addEventListener('scroll',markUserActivity,{capture:true,passive:true});
    document.addEventListener('visibilitychange',handleVisibilityChange);
    window.addEventListener('focus',handleWindowFocus);
    window.addEventListener('blur',handleWindowBlur);
    window.addEventListener('online',handleOnline);
    window.addEventListener('offline',handleOffline);
    window.addEventListener('error',handleJavascriptError);
    window.addEventListener('unhandledrejection',handleUnhandledRejection);
    window.addEventListener('pagehide',handlePageHide);
    window.addEventListener('pageshow',handlePageShow);
}

function handleClick(event){
    markUserActivity();
    const target=getMeaningfulTarget(event.target);
    if(!target){return;}
    addEvent('click',getTargetInfo(target));
}

function handleChange(event){
    markUserActivity();
    const target=event.target instanceof Element?event.target:null;
    if(!target){return;}
    const targetInfo=getTargetInfo(target);
    const data={...(targetInfo.data||{}),field_name:target.getAttribute('name')||target.id||null};
    if(target instanceof HTMLInputElement||target instanceof HTMLTextAreaElement){
        data.input_type=target instanceof HTMLInputElement?target.type:'textarea';
        if(target instanceof HTMLInputElement&&(target.type==='checkbox'||target.type==='radio')){
            data.checked=target.checked;
        }else{
            data.character_count=String(target.value||'').length;
        }
    }
    if(target instanceof HTMLSelectElement){data.selected_index=target.selectedIndex;}
    addEvent('input_change',{...targetInfo,data});
}

function getMeaningfulTarget(rawTarget){
    if(!(rawTarget instanceof Element)){return null;}
    return rawTarget.closest('button,a,input,select,textarea,label,[role="button"],[data-action],.teacher-module-header')||rawTarget;
}

function getTargetInfo(target){
    const moduleCard=target.closest?.('[data-module-id]')||null;
    const action=target.dataset?.action||target.getAttribute?.('name')||null;
    return{
        module:moduleCard?.dataset?.moduleId||null,
        action,
        target:target.tagName?target.tagName.toLowerCase():null,
        target_id:target.id||null,
        data:{
            class_name:target.classList?Array.from(target.classList).slice(0,8).join(' '):null,
            role:target.getAttribute?.('role')||null,
            aria_label:target.getAttribute?.('aria-label')||null,
            stage_position:moduleCard?.dataset?.stagePosition||null,
            stage_side:moduleCard?.dataset?.stageSide||null,
            stage_distance:moduleCard?.dataset?.stageDistance||null,
            student_id:target.dataset?.studentId||null,
            session_id:target.dataset?.sessionId||null
        }
    };
}

/*   activity timing*/
function markUserActivity(){
    if(!currentSession||sessionFinalized){return;}
    const now=Date.now();
    if(isIdle){
        isIdle=false;
        if(canCountActiveTime()){startActivePeriod(now);}
        addEvent('idle_ended');
    }
    resetIdleTimer();
}

function resetIdleTimer(){
    clearIdleTimer();
    if(!currentSession||sessionFinalized||document.visibilityState!=='visible'||!windowFocused){return;}
    idleTimer=window.setTimeout(()=>{
        if(!currentSession||sessionFinalized||isIdle||!canCountActiveTime()){return;}
        const now=Date.now();
        stopActivePeriod(now);
        isIdle=true;
        addEvent('idle_started');
        void persistCurrentSession();
    },IDLE_TIMEOUT_MS);
}

function clearIdleTimer(){
    if(idleTimer===null){return;}
    window.clearTimeout(idleTimer);
    idleTimer=null;
}

function canCountActiveTime(){return document.visibilityState==='visible'&&windowFocused&&!isIdle;}
function startActivePeriod(now=Date.now()){if(activeStartedAt!==null){return;}activeStartedAt=now;}
function stopActivePeriod(now=Date.now()){
    if(!currentSession||activeStartedAt===null){return;}
    currentSession.active_duration_ms+=Math.max(0,now-activeStartedAt);
    activeStartedAt=null;
}

/*   lifecycle*/
function handleVisibilityChange(){
    if(!currentSession||sessionFinalized){return;}
    const now=Date.now();
    if(document.visibilityState==='hidden'){
        stopActivePeriod(now);
        clearIdleTimer();
        addEvent('app_hidden');
        void persistCurrentSession();
        return;
    }
    isIdle=false;
    if(canCountActiveTime()){startActivePeriod(now);}
    resetIdleTimer();
    addEvent('app_visible');
}

function handleWindowFocus(){
    if(!currentSession||sessionFinalized){return;}
    windowFocused=true;
    isIdle=false;
    const now=Date.now();
    if(canCountActiveTime()){startActivePeriod(now);}
    resetIdleTimer();
    addEvent('window_focus');
}

function handleWindowBlur(){
    if(!currentSession||sessionFinalized){return;}
    windowFocused=false;
    stopActivePeriod(Date.now());
    clearIdleTimer();
    addEvent('window_blur');
    void persistCurrentSession();
}

function handleOnline(){addEvent('online');}
function handleOffline(){addEvent('offline');void persistCurrentSession();}
function handleJavascriptError(event){
    addEvent('javascript_error',{data:{message:event.message||'Unknown JavaScript error',source:event.filename||null,line:event.lineno||null,column:event.colno||null}});
    void persistCurrentSession();
}

function handleUnhandledRejection(event){
    const reason=event.reason instanceof Error?event.reason.message:String(event.reason||'Unhandled promise rejection');
    addEvent('unhandled_rejection',{data:{message:reason}});
    void persistCurrentSession();
}

function handlePageHide(event){
    if(!currentSession||sessionFinalized){return;}
    if(event.persisted){
        stopActivePeriod(Date.now());
        addEvent('app_bfcache_hidden');
        void persistCurrentSession();
        return;
    }
    const payload=finalizeSession('pagehide',true);
    if(payload){void uploadPayloadKeepalive(payload);}
}

function handlePageShow(event){
    if(!event.persisted||!currentSession||sessionFinalized){return;}
    windowFocused=document.hasFocus();
    isIdle=false;
    if(canCountActiveTime()){startActivePeriod(Date.now());}
    resetIdleTimer();
    addEvent('app_bfcache_restored');
}

/*   session events*/
function addEvent(type,details={}){
    if(!currentSession||sessionFinalized){return;}
    const now=Date.now();
    const event={seq:currentSession.events.length+1,type,at_ms:Math.max(0,now-currentSession.started_at),occurred_at:now};
    ['module','action','target','target_id','duration_ms','data'].forEach(field=>{
        if(details[field]!==undefined&&details[field]!==null){event[field]=details[field];}
    });
    currentSession.events.push(event);
    currentSession.last_event_at=now;
    currentSession.event_count=currentSession.events.length;
    schedulePersist();
}

function finalizeSession(reason,isComplete){
    if(!currentSession||sessionFinalized){return null;}
    const now=Date.now();
    stopActivePeriod(now);
    clearIdleTimer();
    addEvent('session_ended',{data:{reason}});
    currentSession.ended_at=now;
    currentSession.total_duration_ms=Math.max(0,now-currentSession.started_at);
    currentSession.end_reason=reason;
    currentSession.is_complete=isComplete;
    currentSession.event_count=currentSession.events.length;
    sessionFinalized=true;
    if(persistTimer!==null){window.clearTimeout(persistTimer);persistTimer=null;}
    const snapshot=buildStoredSnapshot();
    void putSession(snapshot);
    return buildUploadPayload(snapshot);
}

/*   local persistence*/
function schedulePersist(){
    if(!currentSession||sessionFinalized){return;}
    if(persistTimer!==null){window.clearTimeout(persistTimer);}
    persistTimer=window.setTimeout(()=>{persistTimer=null;void persistCurrentSession();},PERSIST_DELAY_MS);
}

async function persistCurrentSession(){
    if(!currentSession){return;}
    try{await putSession(buildStoredSnapshot());}
    catch(error){console.warn('Analytics local save failed:',error);}
}

function buildStoredSnapshot(){
    if(!currentSession){return null;}
    const now=Date.now();
    const activeDuration=currentSession.active_duration_ms+(activeStartedAt!==null?Math.max(0,now-activeStartedAt):0);
    return{
        ...currentSession,
        total_duration_ms:currentSession.ended_at?currentSession.total_duration_ms:Math.max(0,now-currentSession.started_at),
        active_duration_ms:activeDuration,
        event_count:currentSession.events.length,
        events:currentSession.events.map(event=>({...event})),
        session_context:{...currentSession.session_context}
    };
}

function openDatabase(){
    if(dbPromise){return dbPromise;}
    dbPromise=new Promise((resolve,reject)=>{
        const request=indexedDB.open(DB_NAME,DB_VERSION);
        request.onupgradeneeded=()=>{
            const db=request.result;
            if(!db.objectStoreNames.contains(STORE_NAME)){db.createObjectStore(STORE_NAME,{keyPath:'session_uuid'});}
        };
        request.onsuccess=()=>resolve(request.result);
        request.onerror=()=>reject(request.error);
    });
    return dbPromise;
}

async function putSession(session){
    if(!session){return;}
    const db=await openDatabase();
    return new Promise((resolve,reject)=>{
        const transaction=db.transaction(STORE_NAME,'readwrite');
        transaction.objectStore(STORE_NAME).put(session);
        transaction.oncomplete=resolve;
        transaction.onerror=()=>reject(transaction.error);
    });
}

async function getAllSessions(){
    const db=await openDatabase();
    return new Promise((resolve,reject)=>{
        const request=db.transaction(STORE_NAME,'readonly').objectStore(STORE_NAME).getAll();
        request.onsuccess=()=>resolve(Array.isArray(request.result)?request.result:[]);
        request.onerror=()=>reject(request.error);
    });
}

async function deleteSession(sessionUuid){
    const db=await openDatabase();
    return new Promise((resolve,reject)=>{
        const transaction=db.transaction(STORE_NAME,'readwrite');
        transaction.objectStore(STORE_NAME).delete(sessionUuid);
        transaction.oncomplete=resolve;
        transaction.onerror=()=>reject(transaction.error);
    });
}

/*   upload and retry*/
async function retryPendingSessions(currentUuid){
    let sessions=[];
    try{sessions=await getAllSessions();}
    catch(error){console.warn('Unable to read pending analytics sessions:',error);return;}
    for(const storedSession of sessions){
        if(storedSession.session_uuid===currentUuid){continue;}
        const session=recoverIncompleteSession(storedSession);
        try{
            await uploadPayload(buildUploadPayload(session));
            await deleteSession(session.session_uuid);
        }catch(error){console.warn('Pending analytics upload failed:',error);}
    }
}

function recoverIncompleteSession(session){
    if(session.ended_at){return session;}
    const recoveredEnd=session.last_event_at||session.started_at;
    return{
        ...session,
        ended_at:recoveredEnd,
        total_duration_ms:Math.max(0,recoveredEnd-session.started_at),
        end_reason:'recovered_unclean_exit',
        is_complete:false
    };
}

function buildUploadPayload(session){
    return{
        session_uuid:session.session_uuid,
        schema_version:session.schema_version,
        started_at_:session.started_at,
        ended_at__:session.ended_at,
        last_event_at:session.last_event_at,
        total_duration_ms:session.total_duration_ms,
        active_duration_ms:session.active_duration_ms,
        event_count:session.event_count,
        end_reason:session.end_reason,
        is_complete:session.is_complete,
        app_version:session.app_version,
        device_type:session.device_type,
        platform:session.platform,
        browser:session.browser,
        screen_width:session.screen_width,
        screen_height:session.screen_height,
        viewport_width:session.viewport_width,
        viewport_height:session.viewport_height,
        language:session.language,
        timezone:session.timezone,
        online_at_start:session.online_at_start,
        session_context:session.session_context,
        events:session.events
    };
}

async function uploadPayload(payload){
    const authToken=localStorage.getItem('authToken');
    if(!authToken){throw new Error('No Teacher App auth token available.');}
    const response=await fetch(API_URLS.usageSession,{
        method:'POST',
        headers:{'Accept':'application/json','Content-Type':'application/json','Authorization':`Bearer ${authToken}`},
        body:JSON.stringify(payload)
    });
    let data=null;
    try{data=await response.json();}catch{data=null;}
    if(!response.ok||data?.success!==true){
        throw new Error(data?.message||data?.error||`Usage upload failed with status ${response.status}.`);
    }
    return data;
}

async function uploadPayloadKeepalive(payload){
    const authToken=localStorage.getItem('authToken');
    if(!authToken){return;}
    try{
        const response=await fetch(API_URLS.usageSession,{
            method:'POST',
            keepalive:true,
            headers:{'Accept':'application/json','Content-Type':'application/json','Authorization':`Bearer ${authToken}`},
            body:JSON.stringify(payload)
        });
        if(!response.ok){return;}
        let data=null;
        try{data=await response.json();}catch{data=null;}
        if(data?.success===true){await deleteSession(payload.session_uuid);}
    }catch{/*   local copy remains for retry*/}
}

/*   device details*/
function createSessionUuid(){
    if(globalThis.crypto&&typeof globalThis.crypto.randomUUID==='function'){return globalThis.crypto.randomUUID();}
    return[Date.now().toString(36),Math.random().toString(36).slice(2),Math.random().toString(36).slice(2)].join('-');
}

function getDeviceType(){
    const userAgent=navigator.userAgent||'';
    if(/iPad|Tablet/i.test(userAgent)){return'tablet';}
    if(/Mobi|Android|iPhone/i.test(userAgent)){return'mobile';}
    return'desktop';
}

function getPlatform(){return navigator.userAgentData?.platform||navigator.platform||'';}
function getBrowser(){
    const userAgent=navigator.userAgent||'';
    if(/Edg\//.test(userAgent)){return'Edge';}
    if(/OPR\//.test(userAgent)){return'Opera';}
    if(/Chrome\//.test(userAgent)&&!/Edg\//.test(userAgent)){return'Chrome';}
    if(/Firefox\//.test(userAgent)){return'Firefox';}
    if(/Safari\//.test(userAgent)&&!/Chrome\//.test(userAgent)){return'Safari';}
    return'Unknown';
}

function getTimezone(){
    try{return Intl.DateTimeFormat().resolvedOptions().timeZone||APP_CONFIG.timeZone||'';}
    catch{return APP_CONFIG.timeZone||'';}
}
