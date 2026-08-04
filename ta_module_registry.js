import {
    renderAttendanceModule
} from './ta_attendance.js';

const moduleRegistry={
    attendance:{
        id:'attendance',
        icon:'📋',
        title:'Attendance',
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
        renderer:null,
        isAvailable:false
    },

    media:{
        id:'media',
        icon:'📷',
        title:'Upload Media',
        subtitle:'Photos, videos, and artwork.',
        description:'Upload photos, videos, and artwork.',
        renderer:null,
        isAvailable:false
    },

    moments:{
        id:'moments',
        icon:'✨',
        title:'Moments',
        subtitle:'Save something special from today.',
        description:'Record something meaningful from the session.',
        renderer:null,
        isAvailable:false
    },

    reflection:{
        id:'reflection',
        icon:'💭',
        title:'Reflection',
        subtitle:'Reflect on the session or the day.',
        description:'Add a teacher reflection about the session.',
        renderer:null,
        isAvailable:false
    },

    messages:{
        id:'messages',
        icon:'💬',
        title:'Messages',
        subtitle:'Communicate with families.',
        description:'Send a message to parents.',
        renderer:null,
        isAvailable:false
    }
};

export function getModule(moduleId){
    return moduleRegistry[moduleId]||null;
}

export function getAllModules(){
    return Object.values(moduleRegistry);
}

export function moduleExists(moduleId){
    return Boolean(
        moduleRegistry[moduleId]
    );
}

export function moduleCanRender(moduleId){
    const module=getModule(moduleId);

    return Boolean(
        module?.isAvailable&&
        typeof module.renderer==='function'
    );
}
