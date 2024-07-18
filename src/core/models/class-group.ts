export enum ClassGroupStatus {
    ACTIVE = 'ACTIVE',
    INACTIVE = 'INACTIVE',
}

export interface ClassGroup {
    classGroupId: number;
    classGroupName: string;
    hall: string;
    status: ClassGroupStatus;
}
