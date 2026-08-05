import {
    renderAttendanceModule
} from './ta_attendance.js';

import {
    renderTeacherInformationModule
} from './ta_teacher_information.js';

import {
    renderObservationsModule
} from './ta_observations.js';

import {
    renderMomentsModule
} from './ta_moments.js';

import {
    renderStudentReflectionModule
} from './ta_student_reflection.js';

import {
    renderFamilyMessagesModule
} from './ta_family_messages.js';

import {
    renderSeeYouTomorrowModule
} from './ta_see_you_tomorrow.js';

import {
    renderHeadOfficeMessagesModule
} from './ta_head_office_messages.js';

const moduleRegistry={
    attendance:{
        id:'attendance',
        icon:'📋',
        title:"Today's Attendance",
        subtitle:'Record who attended today.',
        description:'Record who attended the session.',
        renderer:renderAttendanceModule,
        isAvailable:true
    },

    observations:{
        id:'observations',
        icon:'👀',
        title:'Observations',
        subtitle:'Capture meaningful learning moments.',
        description:'Capture meaningful student observations.',
        renderer:renderObservationsModule,
        isAvailable:true
    },

    media:{
        id:'media',
        icon:'📷',
        title:'Capture Moments in Media',
        subtitle:'Photos, videos, and artwork.',
        description:'Capture photos, videos, and artwork from today.',
        renderer:null,
        isAvailable:false
    },

    moments:{
        id:'moments',
        icon:'✨',
        title:'Moments',
        subtitle:'Save something special from today.',
        description:'Record something meaningful from the session.',
        renderer:renderMomentsModule,
        isAvailable:true
    },

    reflection:{
        id:'reflection',
        icon:'💭',
        title:'Student Reflection',
        subtitle:'Reflect on a student, session, or day.',
        description:'Add a teacher reflection.',
        renderer:renderStudentReflectionModule,
        isAvailable:true
    },

    messages:{
        id:'messages',
        icon:'💬',
        title:'Family Messages',
        subtitle:'Communicate with families.',
        description:'Send a message to one or more families.',
        renderer:renderFamilyMessagesModule,
        isAvailable:true
    },

    see_tomorrow:{
        id:'see_tomorrow',
        icon:'🌞',
        title:'See You Tomorrow!',
        subtitle:"Prepare tomorrow's class lists.",
        description:
            'Review tomorrow’s sessions and prepare class lists for families.',
        renderer:renderSeeYouTomorrowModule,
        isAvailable:true
    },

    head_office_messages:{
        id:'head_office_messages',
        icon:'🏫',
        title:'Head Office Messages',
        subtitle:'Send and receive messages from head office.',
        description:'Communicate directly with head office.',
        renderer:renderHeadOfficeMessagesModule,
        isAvailable:true
    },

    teacher_information:{
        id:'teacher_information',
        icon:'👩‍🏫',
        title:'Teacher Information',
        subtitle:'View teacher information.',
        description:'View the signed-in teacher information.',
        renderer:renderTeacherInformationModule,
        isAvailable:true
    }
};

export function getModule(moduleId){
    return moduleRegistry[moduleId]||null;
}

export function getAllModules(){
    return Object.values(
        moduleRegistry
    );
}

export function moduleExists(moduleId){
    return Boolean(
        moduleRegistry[moduleId]
    );
}

export function moduleCanRender(moduleId){
    const module=
        getModule(moduleId);

    return Boolean(
        module?.isAvailable&&
        typeof module.renderer==='function'
    );
}
