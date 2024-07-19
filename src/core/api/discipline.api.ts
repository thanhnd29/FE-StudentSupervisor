import { BaseResponse, ResponseList } from '../models/common';
import { Discipline } from '../models/discipline';
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
};
