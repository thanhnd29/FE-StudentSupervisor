export interface StudentInClass {
    studentInClassId: number;
    classId: number;
    studentId: number;
    studentName: string;
    enrollDate: string;
    isSupervisor: boolean;
    status: StudentInClassStatus;
}

export enum StudentInClassStatus {
    UNENROLLED = 'UNENROLLED',
    ENROLLED = 'ENROLLED',
}
