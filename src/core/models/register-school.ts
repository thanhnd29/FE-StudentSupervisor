export enum RegisterSchoolStatus {
    ACTIVE = 'ACTIVE',
    INACTIVE = 'INACTIVE',
}

export interface RegisterSchool {
    registeredId: number;
    schoolId: number;
    schoolName: string;
    registeredDate: string;
    description: string;
    status: RegisterSchoolStatus;
    schoolCode: string;
    city: string;
    address: string;
    phone: string;
    webURL: string;
}
