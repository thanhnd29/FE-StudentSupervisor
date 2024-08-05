export interface Class {
    classId: number;
    schoolYearId: number;
    code: string;
    name: string;
    totalPoint: number;
    year: number;
    teacherName: string;
    grade: number;
    status: string;
    classGroupId: number;
    teacherID: number;
}

export enum ClassStatus {
    ACTIVE = 'ACTIVE',
    INACTIVE = 'INACTIVE',
}
