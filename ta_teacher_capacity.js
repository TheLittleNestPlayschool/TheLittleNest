import {
    API_URLS
} from './ta_config.js';

import {
    apiRequest
} from './ta_api.js';

export async function buildTeacherCapacity(
    expectedStudents=[]
){

    const teacherResponse=
        await apiRequest(
            API_URLS.getAllTeachers
        );

    const teachers=
        Array.isArray(
            teacherResponse?.teachers
        )
            ? teacherResponse.teachers
            : [];

    const teacherCount=
        teachers.length;

    const studentCount=
        Array.isArray(
            expectedStudents
        )
            ? expectedStudents.length
            : 0;

    const teacherStudentRatio=
        calculateTeacherStudentRatio(
            teacherCount,
            studentCount
        );

    const teacherCapacityState=
        calculateTeacherCapacityState(
            teacherStudentRatio,
            teacherCount,
            studentCount
        );

    return{
        teachers,
        teacherCount,
        studentCount,
        teacherStudentRatio,
        teacherCapacityState
    };
}

function calculateTeacherStudentRatio(
    teacherCount,
    studentCount
){

    if(studentCount===0){
        return null;
    }

    if(teacherCount===0){
        return null;
    }

    return(
        teacherCount/
        studentCount
    );
}

function calculateTeacherCapacityState(
    ratio,
    teacherCount,
    studentCount
){

    if(
        teacherCount===0
    ){
        return 'unknown';
    }

    if(
        studentCount===0
    ){
        return 'very_slow';
    }

    if(
        ratio<=0.29
    ){
        return 'very_busy';
    }

    if(
        ratio<=0.39
    ){
        return 'busy';
    }

    if(
        ratio<=0.50
    ){
        return 'moderately_busy';
    }

    if(
        ratio<=1
    ){
        return 'slow';
    }

    return 'very_slow';
}
