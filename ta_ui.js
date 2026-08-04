let activeWorkspaceId='teacherPrimary';

export function setActiveWorkspace(
    workspaceId
){
    activeWorkspaceId=workspaceId;
}

export function getWorkspace(){
    return document.getElementById(
        activeWorkspaceId
    );
}

export function clearWorkspace(){
    const workspace=getWorkspace();

    if(workspace){
        workspace.innerHTML='';
    }
}

export function getTeacherStage(){
    return document.getElementById(
        'teacherStage'
    );
}

export function getTeacherPrimary(){
    return document.getElementById(
        'teacherPrimary'
    );
}

export function getTeacherActions(){
    return document.getElementById(
        'teacherActions'
    );
}

export function clearTeacherStage(){
    const primary=getTeacherPrimary();
    const actions=getTeacherActions();

    if(primary){
        primary.innerHTML='';
    }

    if(actions){
        actions.innerHTML='';
    }
}
