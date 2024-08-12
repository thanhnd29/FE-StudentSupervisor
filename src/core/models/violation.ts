export interface Violation {
    violationId: number;
    classId: number;
    violationTypeId: number;
    teacherId: number;
    code: string;
    violationName: string;
    description: string;
    scheduleName: string;
    date: string;
    createdAt: string;
    createdBy: string;
    updatedAt: string;
    updatedBy: string;
    imageUrls: string[];
    studentInClassId: number;
    studentName: string;
    studentCode: string;
    violationTypeName: string;
    violationGroupId: number;
    violationGroupName: string;
    status: string;
    year: string;
    students: {
        studentId: number;
        studentCode: string;
        fullName: string
    }[]
}

export enum ViolationStatus {
    PENDING = 'PENDING',
    APPROVED = 'APPROVED',
    REJECTED = 'REJECTED',
    INACTIVE = 'INACTIVE',
    DISCUSSING = 'DISCUSSING',
    COMPLETED = 'COMPLETED'
}
