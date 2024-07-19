import { Colors } from '../utils/colors.helper';
import { EnumListItem } from './common';

export enum UserStatus {
    ACTIVE = 'ACTIVE',
    INACTIVE = 'INACTIVE',
}

export interface User {
    userId: number;
    schoolAdminId: number;
    roleId: number;
    roleName: number;
    code: string;
    name: string;
    phone: string;
    password: string;
    address: string;
    adminId: number;
    userName: string;
    schoolId: number;
    schoolName: string;
    status: string;
}

export enum SystemRole {
    ADMIN = 1,
    SCHOOL_ADMIN = 2,
    PRINCIPAL = 3,
    SUPERVISOR = 4,
    TEACHER = 5,
    STUDENT_SUPERVISOR = 6,
}

export const RoleList: EnumListItem[] = [
    {
        value: SystemRole.SCHOOL_ADMIN,
        label: 'School Admin',
        color: Colors.BLUE,
        id: SystemRole.SCHOOL_ADMIN,
        name: 'School Admin',
        slug: 'school-admin',
    },
    {
        value: SystemRole.ADMIN,
        label: 'Admin',
        color: Colors.GREEN,
        id: SystemRole.ADMIN,
        name: 'Admin',
        slug: 'Admin',
    },
    {
        value: SystemRole.STUDENT_SUPERVISOR,
        label: 'Student Supervisor',
        color: Colors.ORANGE,
        id: SystemRole.STUDENT_SUPERVISOR,
        name: 'Student Supervisor',
        slug: 'student-supervisor',
    },
    {
        value: SystemRole.PRINCIPAL,
        label: 'Principal',
        color: Colors.RED,
        id: SystemRole.PRINCIPAL,
        name: 'Principal',
        slug: 'principal',
    },
    {
        value: SystemRole.TEACHER,
        label: 'Teacher',
        color: Colors.PURPLE,
        id: SystemRole.TEACHER,
        name: 'Teacher',
        slug: 'teacher',
    },
    {
        value: SystemRole.SUPERVISOR,
        label: 'Supervisor',
        color: Colors.BLACK,
        id: SystemRole.SUPERVISOR,
        name: 'Supervisor',
        slug: 'supervisor',
    },
];
