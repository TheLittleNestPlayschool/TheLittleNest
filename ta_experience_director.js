import {
    setActiveWorkspace,
    clearTeacherStage
} from './ta_ui.js';

import {
    renderAttendanceModule
} from './ta_attendance.js';

export function startTeacherExperience(){
    clearTeacherStage();

    setActiveWorkspace(
        'teacherPrimary'
    );

    renderAttendanceModule();
}
