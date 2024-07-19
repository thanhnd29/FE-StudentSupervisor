export interface Violation {
    violationId: number;
    classId: number;
    violationTypeId: number;
    teacherId: number;
    code: string;
    violationName: string;
    description: string;
    date: string;
    createdAt: string;
    createdBy: null;
    updatedAt: string;
    updatedBy: null;
    imageUrls: string[];
    studentInClassId: number;
    studentName: string;
    violationTypeName: string;
    violationGroupId: number;
    violationGroupName: string;
    status: string;
}

export enum ViolationStatus {
    PENDING = 'PENDING',
    APPROVED = 'APPROVED',
    REJECTED = 'REJECTED',
    INACTIVE = 'INACTIVE',
}
