export enum EvaluationDetailStatus {
    INACTIVE = 'INACTIVE',
    ACTIVE = 'ACTIVE',
}

export interface EvaluationDetail {
    evaluationDetailId: number;
    classId: number;
    evaluationId: number;
    status: EvaluationDetailStatus;
}
