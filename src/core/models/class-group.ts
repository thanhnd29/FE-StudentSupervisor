export enum ClassGroupStatus {
    ACTIVE = 'ACTIVE',
    INACTIVE = 'INACTIVE',
}

export interface ClassGroup {
    schoolId: number;
    classGroupId: number;
    classGroupName: string;
    grade: number;
    teacherId: number;
    status: ClassGroupStatus;
}
