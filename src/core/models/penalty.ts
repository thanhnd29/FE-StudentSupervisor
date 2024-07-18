export enum PenaltyStatus {
    ACTIVE = 'ACTIVE',
    INACTIVE = 'INACTIVE',
}

export interface Penalty {
    penaltyId: number;
    schoolId: number;
    code: string;
    name: string;
    description: string;
    status: string;
}
