import { BaseResponse, EnumListItem, ResponseList } from '../models/common';
import { Discipline, DisciplineStatus } from '../models/discipline';
import { Colors } from '../utils/colors.helper';
import http from './http';

export interface ICreateDisciplineDto extends Omit<Discipline, 'disciplineId' | 'status'> { }
export interface IUpdateDisciplineDto extends Discipline { }

const baseUrl = '/disciplines';

export const disciplineApi = {
    create: async (dto: ICreateDisciplineDto) => {
        const { data } = await http.post<Discipline>(`${baseUrl}`, dto);

        return data;
    },

    update: async (dto: IUpdateDisciplineDto) => {
        const { data } = await http.put<Discipline>(`${baseUrl}`, dto);

        return data;
    },
    getAll: async () => {
        try {
            const { data } = await http.get<ResponseList<Discipline>>(`${baseUrl}`, {
                params: {
                    sortOrder: 'desc',
                },
            });

            return data.data || [];
        } catch (error) {
            return [];
        }
    },
    getBySchool: async (id: number) => {
        const { data } = await http.get<ResponseList<Discipline>>(`${baseUrl}/school/${id}`);

        return data.data || [];
    },
    getById: async (id: number) => {
        const { data } = await http.get<BaseResponse<Discipline>>(`${baseUrl}/${id}`);

        return data.data;
    },
    delete: async (id: number) => {
        await http.delete(`${baseUrl}/${id}`);
    },
    getEnumStatuses: async (search?: string) => {
        const list: EnumListItem[] = [
            {
                color: Colors.GREEN,
                id: DisciplineStatus.DONE,
                label: 'Done',
                name: 'Done',
                slug: DisciplineStatus.DONE,
                value: DisciplineStatus.DONE,
            },
            {
                color: Colors.RED,
                id: DisciplineStatus.EXECUTING,
                label: 'Executing',
                name: 'Executing',
                slug: DisciplineStatus.EXECUTING,
                value: DisciplineStatus.EXECUTING,
            },
            {
                color: Colors.PURPLE,
                id: DisciplineStatus.INACTIVE,
                label: 'Inactive',
                name: 'Inactive',
                slug: DisciplineStatus.INACTIVE,
                value: DisciplineStatus.INACTIVE,
            },
            {
                color: Colors.PINK,
                id: DisciplineStatus.PENDING,
                label: 'Pending',
                name: 'Pending',
                slug: DisciplineStatus.PENDING,
                value: DisciplineStatus.PENDING,
            },
        ];

        return list;
    },
};


import { BaseResponse, EnumListItem, ResponseList } from '../models/common';
import { Discipline, DisciplineStatus } from '../models/discipline';
import { Colors } from '../utils/colors.helper';
import http from './http';

export interface ICreateDisciplineDto extends Omit<Discipline, 'disciplineId' | 'status'> { }
export interface IUpdateDisciplineDto extends Discipline { }

const baseUrl = '/disciplines';

export const disciplineApi = {
    create: async (dto: ICreateDisciplineDto) => {
        const { data } = await http.post<Discipline>(`${baseUrl}`, dto);

        return data;
    },

    update: async (dto: IUpdateDisciplineDto) => {
        const { data } = await http.put<Discipline>(`${baseUrl}`, dto);

        return data;
    },
    getAll: async () => {
        try {
            const { data } = await http.get<ResponseList<Discipline>>(`${baseUrl}`, {
                params: {
                    sortOrder: 'desc',
                },
            });

            return data.data || [];
        } catch (error) {
            return [];
        }
    },
    getBySchool: async (id: number) => {
        const { data } = await http.get<ResponseList<Discipline>>(`${baseUrl}/school/${id}`);

        return data.data || [];
    },
    getById: async (id: number) => {
        const { data } = await http.get<BaseResponse<Discipline>>(`${baseUrl}/${id}`);

        return data.data;
    },
    delete: async (id: number) => {
        await http.delete(`${baseUrl}/${id}`);
    },
    getEnumStatuses: async (search?: string) => {
        const list: EnumListItem[] = [
            {
                color: Colors.GREEN,
                id: DisciplineStatus.DONE,
                label: 'Done',
                name: 'Done',
                slug: DisciplineStatus.DONE,
                value: DisciplineStatus.DONE,
            },
            {
                color: Colors.RED,
                id: DisciplineStatus.EXECUTING,
                label: 'Executing',
                name: 'Executing',
                slug: DisciplineStatus.EXECUTING,
                value: DisciplineStatus.EXECUTING,
            },
            {
                color: Colors.PURPLE,
                id: DisciplineStatus.INACTIVE,
                label: 'Inactive',
                name: 'Inactive',
                slug: DisciplineStatus.INACTIVE,
                value: DisciplineStatus.INACTIVE,
            },
            {
                color: Colors.PINK,
                id: DisciplineStatus.PENDING,
                label: 'Pending',
                name: 'Pending',
                slug: DisciplineStatus.PENDING,
                value: DisciplineStatus.PENDING,
            },
        ];

        return list;
    },
};
