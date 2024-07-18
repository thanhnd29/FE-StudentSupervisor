export enum RegisterSchoolStatus {
    ACTIVE = 'ACTIVE',
    INACTIVE = 'INACTIVE',
}

export interface RegisterSchool {
    registeredId: number;
    schoolId: number;
    registeredDate: string;
    description: string;
    status: RegisterSchoolStatus;
}
