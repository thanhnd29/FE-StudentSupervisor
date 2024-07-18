export enum ViolationConfigStatus {
    ACTIVE = 'ACTIVE',
    INACTIVE = 'INACTIVE',
}

export interface ViolationConfig {
    evaluationId: number;
    violationTypeId: number;
    violationConfigName: string;
    code: string;
    description: string;
    status: string;
    violationConfigId: number;
}
