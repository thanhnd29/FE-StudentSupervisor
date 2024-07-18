import { Colors } from '../utils/colors.helper';
import { EnumListItem } from './common';

export enum PatrolScheduleStatus {
    ONGOING = 'ONGOING',
    FINISHED = 'FINISHED',
}

export interface PatrolSchedule {
    scheduleId: number;
    classId: number;
    supervisorId: number;
    supervisorName: string;
    teacherId: number;
    teacherName: string;
    from: string;
    to: string;
}
