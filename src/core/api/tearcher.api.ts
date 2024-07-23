import { EnumListItem, ResponseList } from '../models/common';
import { Teacher, TeacherStatus } from '../models/teacher';
import { getColorWithId } from '../utils/api.helper';
import { Colors } from '../utils/colors.helper';
import http from './http';

export interface ICreateTeacherDto extends Omit<Teacher, 'teacherId' | 'schoolName' | 'roleId' | 'status'> { }

const baseUrl = '/teachers';

export const teacherApi = {
    create: async (dto: ICreateTeacherDto) => {
        const { data } = await http.post<Teacher>(baseUrl, dto);

        return data;
    },
    createSupervisors: async (dto: ICreateTeacherDto) => {
        const { data } = await http.post<Teacher>(`${baseUrl}/supervisors`, dto);

        return data;
    },
    getAll: async () => {
        const { data } = await http.get<ResponseList<Teacher>>(`${baseUrl}`, {
            params: {
                sortOrder: 'desc',
            },
        });

        return data.data ? data.data : [];
    },
    getBySchool: async (id: number) => {
        const { data } = await http.get<ResponseList<Teacher>>(`${baseUrl}/school/${id}`);

        return data.data;
    },
    getById: async (id: number) => {
        const { data } = await http.get<SchoolYear>(`${baseUrl}/${id}`);

        return data;
    },
    delete: async (id: number) => {
        await http.delete(`${baseUrl}/${id}`);
    },
    getEnumSelectOptions: async (search?: string) => {
        const teachers = await teacherApi.getAll();

        const list: EnumListItem[] = teachers.map((item) => ({
            id: item.teacherId,
            label: item.teacherName,
            color: getColorWithId(item.teacherId),
            slug: item.teacherName,
            name: item.teacherName,
            value: item.teacherId,
        }));

        if (search) {
            return list.filter((item) => item.label.toLowerCase().includes(search.toLowerCase()));
        }

        return list;
    },

    getEnumStatuses: async (search?: string) => {
        const list: EnumListItem[] = [
            {
                color: Colors.GREEN,
                id: TeacherStatus.ACTIVE,
                label: 'Active',
                name: 'Active',
                slug: TeacherStatus.ACTIVE,
                value: TeacherStatus.ACTIVE,
            },
            {
                color: Colors.RED,
                id: TeacherStatus.INACTIVE,
                label: 'Inactive',
                name: 'Inactive',
                slug: TeacherStatus.INACTIVE,
                value: TeacherStatus.INACTIVE,
            },
        ];

        return list;
    },
};

import { EnumListItem, ResponseList } from '../models/common';
import { Teacher, TeacherStatus } from '../models/teacher';
import { getColorWithId } from '../utils/api.helper';
import { Colors } from '../utils/colors.helper';
import http from './http';

export interface ICreateTeacherDto extends Omit<Teacher, 'teacherId' | 'schoolName' | 'roleId' | 'status'> { }

const baseUrl = '/teachers';

export const teacherApi = {
    create: async (dto: ICreateTeacherDto) => {
        const { data } = await http.post<Teacher>(baseUrl, dto);

        return data;
    },
    createSupervisors: async (dto: ICreateTeacherDto) => {
        const { data } = await http.post<Teacher>(`${baseUrl}/supervisors`, dto);

        return data;
    },
    getAll: async () => {
        const { data } = await http.get<ResponseList<Teacher>>(`${baseUrl}`, {
            params: {
                sortOrder: 'desc',
            },
        });

        return data.data ? data.data : [];
    },
    getBySchool: async (id: number) => {
        const { data } = await http.get<ResponseList<Teacher>>(`${baseUrl}/school/${id}`);

        return data.data;
    },
    getById: async (id: number) => {
        const { data } = await http.get<SchoolYear>(`${baseUrl}/${id}`);

        return data;
    },
    delete: async (id: number) => {
        await http.delete(`${baseUrl}/${id}`);
    },
    getEnumSelectOptions: async (search?: string) => {
        const teachers = await teacherApi.getAll();

        const list: EnumListItem[] = teachers.map((item) => ({
            id: item.teacherId,
            label: item.teacherName,
            color: getColorWithId(item.teacherId),
            slug: item.teacherName,
            name: item.teacherName,
            value: item.teacherId,
        }));

        if (search) {
            return list.filter((item) => item.label.toLowerCase().includes(search.toLowerCase()));
        }

        return list;
    },

    getEnumStatuses: async (search?: string) => {
        const list: EnumListItem[] = [
            {
                color: Colors.GREEN,
                id: TeacherStatus.ACTIVE,
                label: 'Active',
                name: 'Active',
                slug: TeacherStatus.ACTIVE,
                value: TeacherStatus.ACTIVE,
            },
            {
                color: Colors.RED,
                id: TeacherStatus.INACTIVE,
                label: 'Inactive',
                name: 'Inactive',
                slug: TeacherStatus.INACTIVE,
                value: TeacherStatus.INACTIVE,
            },
        ];

        return list;
    },
};

import { EnumListItem, ResponseList } from '../models/common';
import { Teacher, TeacherStatus } from '../models/teacher';
import { getColorWithId } from '../utils/api.helper';
import { Colors } from '../utils/colors.helper';
import http from './http';

export interface ICreateTeacherDto extends Omit<Teacher, 'teacherId' | 'schoolName' | 'roleId' | 'status'> { }

const baseUrl = '/teachers';

export const teacherApi = {
    create: async (dto: ICreateTeacherDto) => {
        const { data } = await http.post<Teacher>(baseUrl, dto);

        return data;
    },
    createSupervisors: async (dto: ICreateTeacherDto) => {
        const { data } = await http.post<Teacher>(`${baseUrl}/supervisors`, dto);

        return data;
    },
    getAll: async () => {
        const { data } = await http.get<ResponseList<Teacher>>(`${baseUrl}`, {
            params: {
                sortOrder: 'desc',
            },
        });

        return data.data ? data.data : [];
    },
    getBySchool: async (id: number) => {
        const { data } = await http.get<ResponseList<Teacher>>(`${baseUrl}/school/${id}`);

        return data.data;
    },
    getById: async (id: number) => {
        const { data } = await http.get<SchoolYear>(`${baseUrl}/${id}`);

        return data;
    },
    delete: async (id: number) => {
        await http.delete(`${baseUrl}/${id}`);
    },
    getEnumSelectOptions: async (search?: string) => {
        const teachers = await teacherApi.getAll();

        const list: EnumListItem[] = teachers.map((item) => ({
            id: item.teacherId,
            label: item.teacherName,
            color: getColorWithId(item.teacherId),
            slug: item.teacherName,
            name: item.teacherName,
            value: item.teacherId,
        }));

        if (search) {
            return list.filter((item) => item.label.toLowerCase().includes(search.toLowerCase()));
        }

        return list;
    },

    getEnumStatuses: async (search?: string) => {
        const list: EnumListItem[] = [
            {
                color: Colors.GREEN,
                id: TeacherStatus.ACTIVE,
                label: 'Active',
                name: 'Active',
                slug: TeacherStatus.ACTIVE,
                value: TeacherStatus.ACTIVE,
            },
            {
                color: Colors.RED,
                id: TeacherStatus.INACTIVE,
                label: 'Inactive',
                name: 'Inactive',
                slug: TeacherStatus.INACTIVE,
                value: TeacherStatus.INACTIVE,
            },
        ];

        return list;
    },
};

import { EnumListItem, ResponseList } from '../models/common';
import { Teacher, TeacherStatus } from '../models/teacher';
import { getColorWithId } from '../utils/api.helper';
import { Colors } from '../utils/colors.helper';
import http from './http';

export interface ICreateTeacherDto extends Omit<Teacher, 'teacherId' | 'schoolName' | 'roleId' | 'status'> { }

const baseUrl = '/teachers';

export const teacherApi = {
    create: async (dto: ICreateTeacherDto) => {
        const { data } = await http.post<Teacher>(baseUrl, dto);

        return data;
    },
    createSupervisors: async (dto: ICreateTeacherDto) => {
        const { data } = await http.post<Teacher>(`${baseUrl}/supervisors`, dto);

        return data;
    },
    getAll: async () => {
        const { data } = await http.get<ResponseList<Teacher>>(`${baseUrl}`, {
            params: {
                sortOrder: 'desc',
            },
        });

        return data.data ? data.data : [];
    },
    getBySchool: async (id: number) => {
        const { data } = await http.get<ResponseList<Teacher>>(`${baseUrl}/school/${id}`);

        return data.data;
    },
    getById: async (id: number) => {
        const { data } = await http.get<SchoolYear>(`${baseUrl}/${id}`);

        return data;
    },
    delete: async (id: number) => {
        await http.delete(`${baseUrl}/${id}`);
    },
    getEnumSelectOptions: async (search?: string) => {
        const teachers = await teacherApi.getAll();

        const list: EnumListItem[] = teachers.map((item) => ({
            id: item.teacherId,
            label: item.teacherName,
            color: getColorWithId(item.teacherId),
            slug: item.teacherName,
            name: item.teacherName,
            value: item.teacherId,
        }));

        if (search) {
            return list.filter((item) => item.label.toLowerCase().includes(search.toLowerCase()));
        }

        return list;
    },

    getEnumStatuses: async (search?: string) => {
        const list: EnumListItem[] = [
            {
                color: Colors.GREEN,
                id: TeacherStatus.ACTIVE,
                label: 'Active',
                name: 'Active',
                slug: TeacherStatus.ACTIVE,
                value: TeacherStatus.ACTIVE,
            },
            {
                color: Colors.RED,
                id: TeacherStatus.INACTIVE,
                label: 'Inactive',
                name: 'Inactive',
                slug: TeacherStatus.INACTIVE,
                value: TeacherStatus.INACTIVE,
            },
        ];

        return list;
    },
};

import { EnumListItem, ResponseList } from '../models/common';
import { Teacher, TeacherStatus } from '../models/teacher';
import { getColorWithId } from '../utils/api.helper';
import { Colors } from '../utils/colors.helper';
import http from './http';

export interface ICreateTeacherDto extends Omit<Teacher, 'teacherId' | 'schoolName' | 'roleId' | 'status'> { }

const baseUrl = '/teachers';

export const teacherApi = {
    create: async (dto: ICreateTeacherDto) => {
        const { data } = await http.post<Teacher>(baseUrl, dto);

        return data;
    },
    createSupervisors: async (dto: ICreateTeacherDto) => {
        const { data } = await http.post<Teacher>(`${baseUrl}/supervisors`, dto);

        return data;
    },
    getAll: async () => {
        const { data } = await http.get<ResponseList<Teacher>>(`${baseUrl}`, {
            params: {
                sortOrder: 'desc',
            },
        });

        return data.data ? data.data : [];
    },
    getBySchool: async (id: number) => {
        const { data } = await http.get<ResponseList<Teacher>>(`${baseUrl}/school/${id}`);

        return data.data;
    },
    getById: async (id: number) => {
        const { data } = await http.get<SchoolYear>(`${baseUrl}/${id}`);

        return data;
    },
    delete: async (id: number) => {
        await http.delete(`${baseUrl}/${id}`);
    },
    getEnumSelectOptions: async (search?: string) => {
        const teachers = await teacherApi.getAll();

        const list: EnumListItem[] = teachers.map((item) => ({
            id: item.teacherId,
            label: item.teacherName,
            color: getColorWithId(item.teacherId),
            slug: item.teacherName,
            name: item.teacherName,
            value: item.teacherId,
        }));

        if (search) {
            return list.filter((item) => item.label.toLowerCase().includes(search.toLowerCase()));
        }

        return list;
    },

    getEnumStatuses: async (search?: string) => {
        const list: EnumListItem[] = [
            {
                color: Colors.GREEN,
                id: TeacherStatus.ACTIVE,
                label: 'Active',
                name: 'Active',
                slug: TeacherStatus.ACTIVE,
                value: TeacherStatus.ACTIVE,
            },
            {
                color: Colors.RED,
                id: TeacherStatus.INACTIVE,
                label: 'Inactive',
                name: 'Inactive',
                slug: TeacherStatus.INACTIVE,
                value: TeacherStatus.INACTIVE,
            },
        ];

        return list;
    },
};

