export enum ViolationTypeStatus {
    ACTIVE = 'ACTIVE',
    INACTIVE = 'INACTIVE',
}

export interface ViolationType {
    violationTypeId: number;
    vioTypeName: string;
    violationGroupId: number;
    vioGroupName: string;
    status: string;
    description: string | null;
}
