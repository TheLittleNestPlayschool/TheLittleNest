export function renderMediaSessionSelect(
container,
context
){
const{
sessions=[],
actions
}=context;

const section=
document.createElement(
'section'
);

section.className=
'teacher-media-session-select';

/*  Heading */

const heading=
document.createElement(
'div'
);

heading.className=
'teacher-media-session-heading';

const title=
document.createElement(
'strong'
);

title.textContent=
'Select Session';

const description=
document.createElement(
'span'
);

description.textContent=
'Choose the class date and session these photos and videos belong to.';

heading.appendChild(
title
);

heading.appendChild(
description
);

section.appendChild(
heading
);

/*  Available Sessions */

const activeSessions=
getAvailableSessions(
sessions
);

if(!activeSessions.length){
const empty=
document.createElement(
'p'
);

empty.className=
'teacher-media-session-empty';
empty.textContent=
'No sessions are available.';

section.appendChild(
empty
);

container.appendChild(
section
);

return;
}

/*  Class Date */

const dateInput=
document.createElement(
'input'
);

dateInput.type='date';
dateInput.className=
'teacher-media-session-select-input';
dateInput.value=
getLocalDateValue();
dateInput.max=
getLocalDateValue();
dateInput.setAttribute(
'aria-label',
'Class date'
);

section.appendChild(
dateInput
);

/*  Session Dropdown */

const select=
document.createElement(
'select'
);

select.className=
'teacher-media-session-select-input';

const placeholder=
document.createElement(
'option'
);

placeholder.value='';
placeholder.textContent=
'Choose a session...';
placeholder.disabled=true;
placeholder.selected=true;

select.appendChild(
placeholder
);

activeSessions.forEach(
session=>{
const option=
document.createElement(
'option'
);

option.value=
String(
session.id
);

option.textContent=
getSessionLabel(
session
);

select.appendChild(
option
);
}
);

/*  Selection */

select.addEventListener(
'change',
()=>{
const sessionId=
Number(
select.value
);

const sessionDate=
dateInput.value||'';

const selectedSession=
activeSessions.find(
session=>{
return(
Number(
session.id
)===
sessionId
);
}
);

if(
!selectedSession||
!sessionDate
){
return;
}

actions.selectSession({
...selectedSession,
session_date:sessionDate
});
}
);

section.appendChild(
select
);

container.appendChild(
section
);
}

function getAvailableSessions(
sessions
){
if(!Array.isArray(sessions)){
return[];
}

return sessions.filter(
session=>{
return(
session&&
session.id
);
}
);
}

function getSessionLabel(
session
){
const date=
getSessionDate(
session
);

const time=
getSessionTime(
session
);

if(
date&&
time
){
return`${date} · ${time}`;
}

return(
time||
date||
session?.name||
`Session ${session?.id||''}`
);
}

function getSessionTime(
session
){
const start=
session?.start_time_slot||
session?.start_time||
session?.session_start||
session?.time_start||
'';

const end=
session?.end_time_slot||
session?.end_time||
session?.session_end||
session?.time_end||
'';

if(
start&&
end
){
return`${start} - ${end}`;
}

return(
start||
end||
''
);
}

function getSessionDate(
session
){
return(
session?.session_date||
session?.date||
''
);
}

function getLocalDateValue(){
const now=
new Date();

const year=
now.getFullYear();

const month=
String(
now.getMonth()+1
).padStart(
2,
'0'
);

const day=
String(
now.getDate()
).padStart(
2,
'0'
);

return`${year}-${month}-${day}`;
}
