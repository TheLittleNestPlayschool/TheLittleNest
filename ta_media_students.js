export function renderMediaStudents(container,context){
const{
students=[],
selectedStudentIds=[],
findStudentLabel='Find Student',
findStudentIcon='+',
actions
}=context;

const section=document.createElement('section');
section.className='teacher-media-students';

/*  Heading*/
const heading=document.createElement('div');
heading.className='teacher-media-students-heading';
const title=document.createElement('strong');
title.textContent='Students';
const count=document.createElement('span');
count.textContent=selectedStudentIds.length?`${selectedStudentIds.length} selected`:'Select students';
heading.appendChild(title);
heading.appendChild(count);
section.appendChild(heading);

/*  Student Options*/
const list=document.createElement('div');
list.className='teacher-media-student-list';
const activeStudents=getActiveStudents(students);
activeStudents.forEach(student=>{
list.appendChild(createStudentButton(student,selectedStudentIds,actions));
});

/*  Find / Return*/
if(typeof actions?.findStudent==='function'){
list.appendChild(createFindStudentButton(actions,findStudentLabel,findStudentIcon));
}

section.appendChild(list);
container.appendChild(section);
}

function createStudentButton(student,selectedStudentIds,actions){
const button=document.createElement('button');
button.type='button';
button.className='teacher-media-student-button';
const studentId=Number(student.id);
const isSelected=selectedStudentIds.some(selectedId=>Number(selectedId)===studentId);
if(isSelected)button.classList.add('is-selected');

const avatar=document.createElement('span');
avatar.className='teacher-media-student-avatar';
avatar.textContent=getStudentInitials(student);
const details=document.createElement('span');
details.className='teacher-media-student-details';
const name=document.createElement('strong');
name.textContent=getStudentName(student);
details.appendChild(name);
const mark=document.createElement('span');
mark.className='teacher-media-student-mark';
mark.textContent=isSelected?'✓':'';
button.appendChild(avatar);
button.appendChild(details);
button.appendChild(mark);
button.addEventListener('click',()=>actions.toggleStudent(student));
return button;
}

function createFindStudentButton(actions,label,iconText){
const button=document.createElement('button');
button.type='button';
button.className='teacher-media-student-button teacher-media-find-student';
const icon=document.createElement('span');
icon.className='teacher-media-student-avatar';
icon.textContent=iconText;
const details=document.createElement('span');
details.className='teacher-media-student-details';
const title=document.createElement('strong');
title.textContent=label;
details.appendChild(title);
button.appendChild(icon);
button.appendChild(details);
button.addEventListener('click',()=>actions.findStudent());
return button;
}

function getActiveStudents(students){
if(!Array.isArray(students))return[];
return students.filter(student=>student&&student.id&&student.is_active!==false);
}

function getStudentName(student){
const fullName=[student?.first_name,student?.last_name].filter(Boolean).join(' ').trim();
return fullName||student?.name||student?.preferred_name||`Student ${student?.id||''}`;
}

function getStudentInitials(student){
const initials=getStudentName(student).split(' ').filter(Boolean).slice(0,2).map(part=>part.charAt(0).toUpperCase()).join('');
return initials||'•';
}
