import { BaseResponse, EnumListItem, ResponseList } from '../models/common';
import { Discipline, DisciplineStatus } from '../models/discipline';
import { Colors } from '../utils/colors.helper';
import http from './http';

export interface ICreateDisciplineDto extends Omit<Discipline, 'disciplineId' | 'status' | 'year'> { }
export interface IUpdateDisciplineDto extends Pick<Discipline, 'startDate' | 'endDate' | 'pennaltyId'> { }

const baseUrl = '/disciplines';

export const disciplineApi = {
    create: async (dto: ICreateDisciplineDto) => {
        const { data } = await http.post<Discipline>(`${baseUrl}`, dto);

        return data;
    },
    update: async (id: string, dto: IUpdateDisciplineDto) => {
        console.log(dto);

        const { data } = await http.put<Discipline>(`${baseUrl}?id=${id}`, dto);

        console.log(data);

        return data;
    },
    executing: async (id: number) => {
        const { data } = await http.put(`${baseUrl}/${id}/executing`);

        return data;
    },
    done: async (id: number) => {
        const { data } = await http.put(`${baseUrl}/${id}/done`);

        return data;
    },
    complain: async (id: number) => {
        const { data } = await http.put(`${baseUrl}/${id}/complain`);

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
    getByTeacher: async (id: number) => {
        const { data } = await http.get<ResponseList<Discipline>>(`${baseUrl}/user/${id}`, {
            params: {
                sortOrder: 'desc',
            },
        });

        return data.data || [];
    },
    getBySupervisor: async (id: number) => {
        const { data } = await http.get<ResponseList<Discipline>>(`${baseUrl}/supervisor/${id}`, {
            params: {
                sortOrder: 'desc',
            },
        });

        return data.data || [];
    },
    getById: async (id: number) => {
        const { data } = await http.get<BaseResponse<Discipline>>(`${baseUrl}/${id}`);

        return data.data;
    },
    delete: async (id: number) => {
        const { data } = await http.delete(`${baseUrl}/${id}`);

        return data;
    },
    getEnumStatuses: async (search?: string) => {
        const list: EnumListItem[] = [
            {
                color: Colors.GREEN,
                id: DisciplineStatus.DONE,
                label: 'Đã hoàn thành',
                name: 'Đã hoàn thành',
                slug: DisciplineStatus.DONE,
                value: DisciplineStatus.DONE,
            },
            {
                color: Colors.RED,
                id: DisciplineStatus.EXECUTING,
                label: 'Đang diễn ra',
                name: 'Đang diễn ra',
                slug: DisciplineStatus.EXECUTING,
                value: DisciplineStatus.EXECUTING,
            },
            {
                color: Colors.PURPLE,
                id: DisciplineStatus.INACTIVE,
                label: 'Đã xóa',
                name: 'Đã xóa',
                slug: DisciplineStatus.INACTIVE,
                value: DisciplineStatus.INACTIVE,
            },
            {
                color: Colors.PINK,
                id: DisciplineStatus.PENDING,
                label: 'Chờ xử lý',
                name: 'Chờ xử lý',
                slug: DisciplineStatus.PENDING,
                value: DisciplineStatus.PENDING,
            },
            {
                color: Colors.ORANGE,
                id: DisciplineStatus.COMPLAIN,
                label: 'Đang khiếu nại',
                name: 'Đang khiếu nại',
                slug: DisciplineStatus.COMPLAIN,
                value: DisciplineStatus.COMPLAIN,
            },
            {
                color: Colors.YELLOW,
                id: DisciplineStatus.FINALIZED,
                label: 'Đã thống nhất',
                name: 'Đã thống nhất',
                slug: DisciplineStatus.FINALIZED,
                value: DisciplineStatus.FINALIZED,
            },
        ];

        return list;
    },
};
