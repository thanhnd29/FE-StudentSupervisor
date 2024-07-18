import { BaseResponse, ResponseList } from '../models/common';
import { Time } from '../models/time';
import http from './http';

const baseUrl = '/times';

export const timeApi = {
    getAll: async () => {
        const { data } = await http.get<ResponseList<Time>>(`${baseUrl}`, {
            params: {
                sortOrder: 'desc',
            },
        });

        return data.data ? data.data : [];
    },
    getById: async (id: number) => {
        const { data } = await http.get<BaseResponse<Time>>(`${baseUrl}/${id}`);

        return data;
    },
    delete: async (id: number) => {
        await http.delete(`${baseUrl}/${id}`);
    },
};
