export interface Discipline {
    violationId: number;
    pennaltyId: number;
    code: string;
    name: string;
    description: string;
    startDate: string;
    endDate: string;
    status: string;
    disciplineId: number;
}

export enum DisciplineStatus {
    PENDING = 'PENDING',
    EXECUTING = 'EXECUTING',
    DONE = 'DONE',
    INACTIVE = 'INACTIVE',
}

