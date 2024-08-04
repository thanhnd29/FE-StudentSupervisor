export interface Discipline {
    violationId: number;
    pennaltyId: number;
    studentCode: string;
    studentName: string;
    description: string;
    startDate: string;
    endDate: string;
    status: string;
    disciplineId: number;
    year: number;
}

export enum DisciplineStatus {
    PENDING = 'PENDING',
    EXECUTING = 'EXECUTING',
    COMPLAIN = 'COMPLAIN',
    FINALIZED = 'FINALIZED', 
    DONE = 'DONE',
    INACTIVE = 'INACTIVE',
}

