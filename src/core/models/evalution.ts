export interface Evaluation {
    className: string;
    evaluationId: number;
    year: number;
    description: string;
    from: string;
    to: string;
    points: number;
    status: string;
}

export enum EvaluationStatus {
    ACTIVE = 'ACTIVE',
    INACTIVE = 'INACTIVE',
}