export function getWorkspace() {
    return document.getElementById(
        'teacherWorkspace'
    );
}

export function clearWorkspace() {
    const workspace = getWorkspace();

    if (workspace) {
        workspace.innerHTML = '';
    }
}
