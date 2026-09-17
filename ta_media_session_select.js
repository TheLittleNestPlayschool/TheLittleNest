const MANILA_TIME_ZONE='Asia/Manila';

export function renderMediaSessionSelect(container,context){
const{sessions=[],actions}=context;
const section=document.createElement('section');
section.className='teacher-media-session-select';

/*   Heading*/
const heading=document.createElement('div');
heading.className='teacher-media-session-heading';
const title=document.createElement('strong');
title.textContent='Select Session';
const description=document.createElement('span');
description.textContent='Choose the class date and session these photos and videos belong to.';
heading.appendChild(title);
heading.appendChild(description);
section.appendChild(heading);

/*   Available sessions*/
const activeSessions=getAvailableSessions(sessions);
if(!activeSessions.length){
const empty=document.createElement('p');
empty.className='teacher-media-session-empty';
empty.textContent='No sessions are available.';
section.appendChild(empty);
container.appendChild(section);
return;
}

/*   Class date*/
const dateInput=document.createElement('input');
dateInput.type='date';
dateInput.className='teacher-media-session-select-input';
dateInput.value=getLocalDateValue();
dateInput.max=getLocalDateValue();
dateInput.setAttribute('aria-label','Class date');
section.appendChild(dateInput);

/*   Session dropdown*/
const select=document.createElement('select');
select.className='teacher-media-session-select-input';
let sessionsForDate=[];

function renderSessionOptions(){
sessionsForDate=getSessionsForDate(activeSessions,dateInput.value);
select.innerHTML='';
const placeholder=document.createElement('option');
placeholder.value='';
placeholder.disabled=true;
placeholder.selected=true;
placeholder.textContent=sessionsForDate.length?'Choose a session...':'No sessions scheduled for this date';
select.appendChild(placeholder);
sessionsForDate.forEach(session=>{
const option=document.createElement('option');
option.value=String(session.id);
option.textContent=getSessionLabel(session);
select.appendChild(option);
});
select.disabled=!sessionsForDate.length;
}

renderSessionOptions();
dateInput.addEventListener('change',renderSessionOptions);

/*   Selection*/
select.addEventListener('change',()=>{
const sessionId=Number(select.value);
const sessionDate=dateInput.value||'';
const selectedSession=sessionsForDate.find(session=>Number(session.id)===sessionId);
if(!selectedSession||!sessionDate){return;}
actions.selectSession({...selectedSession,session_date:sessionDate});
});

section.appendChild(select);
container.appendChild(section);
}

function getAvailableSessions(sessions){
if(!Array.isArray(sessions)){return[];}
return sessions.filter(session=>{
if(!session?.id){return false;}
if(isFalseValue(session.is_active)){return false;}
if(isFalseValue(session.display)){return false;}
return true;
});
}

function getSessionsForDate(sessions,dateValue){
const dayName=getDayName(dateValue);
if(!dayName){return[];}
return sessions.filter(session=>isScheduledForDay(session,dayName)).sort(compareSessionTimes);
}

function isScheduledForDay(session,dayName){
const scheduledDays=normalizeScheduledDays(session?.scheduled_days);
if(!scheduledDays.length){return false;}
const normalizedDay=normalizeDayName(dayName);
return scheduledDays.some(scheduledDay=>normalizeDayName(scheduledDay)===normalizedDay);
}

function normalizeScheduledDays(scheduledDays){
if(Array.isArray(scheduledDays)){return scheduledDays;}
if(typeof scheduledDays!=='string'){return[];}
const value=scheduledDays.trim();
if(!value){return[];}
try{
const parsedValue=JSON.parse(value);
if(Array.isArray(parsedValue)){return parsedValue;}
}catch(error){
// Use comma-separated fallback.
}
return value.split(',').map(dayName=>dayName.trim()).filter(Boolean);
}

function normalizeDayName(dayName){
const value=String(dayName||'').trim().toLowerCase();
const aliases={mon:'monday',monday:'monday',tue:'tuesday',tues:'tuesday',tuesday:'tuesday',wed:'wednesday',weds:'wednesday',wednesday:'wednesday',thu:'thursday',thur:'thursday',thurs:'thursday',thursday:'thursday',fri:'friday',friday:'friday',sat:'saturday',saturday:'saturday',sun:'sunday',sunday:'sunday'};
return aliases[value]||value;
}

function getSessionLabel(session){
const days=getScheduledDaysLabel(session);
const time=getSessionTime(session);
if(days&&time){return`${days} · ${time}`;}
return time||days||session?.name||`Session ${session?.id||''}`;
}

function getScheduledDaysLabel(session){
const labels={monday:'Mon',tuesday:'Tue',wednesday:'Wed',thursday:'Thu',friday:'Fri',saturday:'Sat',sunday:'Sun'};
return normalizeScheduledDays(session?.scheduled_days).map(dayName=>{
const normalized=normalizeDayName(dayName);
return labels[normalized]||String(dayName||'').trim();
}).filter(Boolean).join('/');
}

function getSessionTime(session){
const start=session?.start_time_slot||session?.start_time||session?.session_start||session?.time_start||'';
const end=session?.end_time_slot||session?.end_time||session?.session_end||session?.time_end||'';
if(start&&end){return`${start} - ${end}`;}
return start||end||'';
}

function compareSessionTimes(firstSession,secondSession){
const firstStart=String(firstSession?.start_time_slot||firstSession?.start_time||'');
const secondStart=String(secondSession?.start_time_slot||secondSession?.start_time||'');
return firstStart.localeCompare(secondStart);
}

function getDayName(dateValue){
if(!dateValue){return'';}
const date=new Date(`${dateValue}T12:00:00+08:00`);
if(Number.isNaN(date.getTime())){return'';}
return new Intl.DateTimeFormat('en-US',{timeZone:MANILA_TIME_ZONE,weekday:'long'}).format(date);
}

function isFalseValue(value){
return value===false||value===0||value==='0'||String(value||'').trim().toLowerCase()==='false';
}

function getLocalDateValue(){
const now=new Date();
const year=now.getFullYear();
const month=String(now.getMonth()+1).padStart(2,'0');
const day=String(now.getDate()).padStart(2,'0');
return`${year}-${month}-${day}`;
}
