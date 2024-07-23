export enum ViolationConfigStatus {
    ACTIVE = 'ACTIVE',
    INACTIVE = 'INACTIVE',
}

export interface ViolationConfig {
    minusPoints: number;
    violationTypeId: number;
    description: string;
    status: string;
    violationConfigId: number;
}
