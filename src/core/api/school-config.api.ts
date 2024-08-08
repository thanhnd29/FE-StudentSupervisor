import { BaseResponse, ResponseList } from '../models/common';
import { SchoolConfig } from '../models/school-config';
import http from './http';

export interface ICreateSchoolConfigDto extends Omit<SchoolConfig, 'configId'> {}
export interface IUpdateSchoolConfigDto extends SchoolConfig {}

const baseUrl = '/school-configs';

export const schoolConfigApi = {
    create: async (dto: ICreateSchoolConfigDto) => {
        const { data } = await http.post<SchoolConfig>(`${baseUrl}`, dto);

        return data;
    },

    },
    getAll: async () => {
        const { data } = await http.get<ResponseList<SchoolConfig>>(`${baseUrl}`, {
            params: {
                sortOrder: 'desc',
            },
        });

        return data.data || [];
    },
    getById: async (id: number) => {
        const { data } = await http.get<BaseResponse<SchoolConfig>>(`${baseUrl}/${id}`);

        return data.data;
    },

    getAll: async () => {
        const { data } = await http.get<ResponseList<SchoolConfig>>(`${baseUrl}`, {
            params: {
                sortOrder: 'desc',
            },
        });

        return data.data || [];
    },
    getById: async (id: number) => {
        const { data } = await http.get<BaseResponse<SchoolConfig>>(`${baseUrl}/${id}`);

        return data.data;
    },

    },
};
