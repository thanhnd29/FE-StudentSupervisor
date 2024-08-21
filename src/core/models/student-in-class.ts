export interface StudentInClass {
    schoolId: number;
    studentCode: string;
    sex: boolean;
    birthday: string;
    address: string;
    phone: string;
    studentInClassId: number;
    classId: number;
    studentId: number;
    studentName: string;
    enrollDate: string;
    isSupervisor: boolean;
    status: StudentInClassStatus;
    startDate: string;
    endDate: string;
    numberOfViolation: number;
    year: number;
    grade: number;
}

export enum StudentInClassStatus {
    UNENROLLED = 'UNENROLLED',
    ENROLLED = 'ENROLLED',
}
