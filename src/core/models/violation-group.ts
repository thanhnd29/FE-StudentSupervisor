export interface ViolationGroup {
    violationGroupId: number;
    schoolId: number;
    schoolName: string;
    vioGroupCode: string | null;
    vioGroupName: string;
    description: string | null;
    status: string;
}

export enum ViolationGroupStatus {
    ACTIVE = 'ACTIVE',
    INACTIVE = 'INACTIVE',
}
