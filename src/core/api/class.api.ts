import { Class } from '../models/class';
import { BaseResponse, EnumListItem, ResponseList } from '../models/common';
import { getColorWithId } from '../utils/api.helper';
import http from './http';

export interface ICreateClassDto extends Omit<Class, 'classId'> { }

export interface IUpdateClassDto extends Class { }

const baseUrl = '/classes';

export const classApi = {
    create: async (dto: ICreateClassDto) => {
        const { data } = await http.post<Class>(`${baseUrl}`, dto);

        return data;
    },
    update: async (dto: IUpdateClassDto) => {
        const { data } = await http.put<Class>(`${baseUrl}`, dto);

        return data;
    },
    getAll: async () => {
        const { data } = await http.get<ResponseList<Class>>(`${baseUrl}`, {
            params: {
                sortOrder: 'desc',
            },
        });

        return data.data;
    },
    getBySchool: async (id: number) => {
        const { data } = await http.get<ResponseList<Class>>(`${baseUrl}/school/${id}`);

        return data.data;
    },
    getById: async (id: number) => {
        const { data } = await http.get<BaseResponse<Class>>(`${baseUrl}/${id}`);

        return data.data;
    },
    delete: async (id: number) => {
        await http.delete(`${baseUrl}/${id}`);
    },
    getEnumSelectOptions: async (search?: string) => {
        const classes = await classApi.getAll();

        const list: EnumListItem[] = classes
            .map((item) => ({
                id: item.classId,
                label: item.name,
                color: getColorWithId(item.classId),
                slug: item.name,
                name: item.name,
                value: item.classId,
            }))
            .sort((a, b) => a.label.localeCompare(b.label));

        if (search) {
            return list.filter((item) => item.label.toLowerCase().includes(search.toLowerCase()));
        }

        return list;
    },

    getEnumSelectOptions: async (search?: string) => {
        const classes = await classApi.getAll();

        const list: EnumListItem[] = classes
            .map((item) => ({
                id: item.classId,
                label: item.name,
                color: getColorWithId(item.classId),
                slug: item.name,
                name: item.name,
                value: item.classId,
            }))
            .sort((a, b) => a.label.localeCompare(b.label));

        if (search) {
            return list.filter((item) => item.label.toLowerCase().includes(search.toLowerCase()));
        }

        return list;
    },
};
