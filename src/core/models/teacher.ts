import { SystemRole } from './user';

export enum TeacherStatus {
    ACTIVE = 'ACTIVE',
    INACTIVE = 'INACTIVE',
}

export interface Teacher {
    schoolAdminId: SystemRole;
    schoolId: number;
    code: string;
    teacherName: string;
    phone: string;
    password: string;
    sex: boolean;
    address: string;
    teacherId: number;
    schoolName: string;
    roleId: number;
    status: string;
}
