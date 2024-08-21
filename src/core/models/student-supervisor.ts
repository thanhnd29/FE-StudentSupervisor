export interface StudentSupervisor {
    studentSupervisorId: number;
    studentInClassId: number;
    schoolId: number;
    code: string;
    description: string;
    supervisorName: string;
    phone: string;
    password: string;
    address: string;
    roleId: number;
    status: string;
    classId: number;
}

export enum StudentSupervisorStatus {
    ACTIVE = 'ACTIVE',
    INACTIVE = 'INACTIVE',
}