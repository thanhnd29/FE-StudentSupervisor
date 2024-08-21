export enum PatrolScheduleStatus {
    ONGOING = 'ONGOING',
    FINISHED = 'FINISHED',
    INACTIVE = 'INACTIVE',
}

export interface PatrolSchedule {
    scheduleId: number;
    classId: number;
    supervisorId: number;
    supervisorName: string;
    className: string;
    from: string;
    to: string;
    userId: number;
    name: string;
    slot: number;
    time: {
        ticks: number;
    }
    status: string;
    year: number;
}
