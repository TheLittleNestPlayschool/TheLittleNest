import {
    renderAttendanceModule
} from './ta_attendance.js';

const moduleRegistry={
    attendance:{
        id:'attendance',
        title:'Attendance',
        description:'Record who attended the session.',
        renderer:renderAttendanceModule,
        isAvailable:true
    },

    observations:{
        id:'observations',
        title:'Observations',
        description:'Capture meaningful student observations.',
        renderer:null,
        isAvailable:false
    },

    media:{
        id:'media',
        title:'Upload Media',
        description:'Upload photos, videos, and artwork.',
        renderer:null,
        isAvailable:false
    },

    moments:{
        id:'moments',
        title:'Moments',
        description:'Record something meaningful from the session.',
        renderer:null,
        isAvailable:false
    },

    reflection:{
        id:'reflection',
        title:'Reflection',
        description:'Add a teacher reflection about the session.',
        renderer:null,
        isAvailable:false
    },

    messages:{
        id:'messages',
        title:'Messages',
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
    return Boolean(moduleRegistry[moduleId]);
}

export function moduleCanRender(moduleId){
    const module=getModule(moduleId);

    return Boolean(
        module?.isAvailable&&
        typeof module.renderer==='function'
    );
}
