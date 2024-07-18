export interface HighSchool {
    schoolId: number;
    code: string;
    name: string;
    address: string;
    phone: string;
    imageUrl: string;
    webUrl: string;
    status: string;
}

export enum HighSchoolStatus {
    ACTIVE = 'ACTIVE',
    INACTIVE = 'INACTIVE',
}
