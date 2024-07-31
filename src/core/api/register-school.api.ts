import { BaseResponse, EnumListItem, ResponseList } from '../models/common';
import { RegisterSchool, RegisterSchoolStatus } from '../models/register-school';
import { Colors } from '../utils/colors.helper';
import http from './http';

export interface ICreateRegisterSchoolDto extends Omit<RegisterSchool, 'registeredId' | 'status' | 'schoolId'> { }
export interface IUpdateRegisterSchoolDto extends Omit<RegisterSchool, 'schoolId'> { }

const baseUrl = '/registered-schools';

export const registerSchoolApi = {
    create: async (dto: ICreateRegisterSchoolDto) => {
        const { data } = await http.post<RegisterSchool>(`${baseUrl}`, dto);

        return data;
    },

    update: async (dto: IUpdateRegisterSchoolDto) => {
        console.log(dto);
        
        const { data } = await http.put<RegisterSchool>(`${baseUrl}`, dto);

        console.log(data);
        
        return data;
    },
    getAll: async () => {
        const { data } = await http.get<ResponseList<RegisterSchool>>(`${baseUrl}`, {
            params: {
                sortOrder: 'desc',
            },
        });

        return data.data || [];
    },
    getBySchool: async (id: number) => {
        const { data } = await http.get<ResponseList<RegisterSchool>>(`${baseUrl}/school/${id}`);

        return data.data || [];
    },
    getById: async (id: number) => {
        const { data } = await http.get<BaseResponse<RegisterSchool>>(`${baseUrl}/${id}`);

        return data.data;
    },
    delete: async (id: number) => {
        await http.delete(`${baseUrl}/${id}`);
    },
    getEnumStatus: async () => {
        return [
            {
                value: RegisterSchoolStatus.ACTIVE,
                color: Colors.GREEN,
                label: 'Active',
                id: RegisterSchoolStatus.ACTIVE,
                name: 'Active',
                slug: RegisterSchoolStatus.ACTIVE,
            },
            {
                value: RegisterSchoolStatus.INACTIVE,
                color: Colors.RED,
                label: 'Inactive',
                id: RegisterSchoolStatus.INACTIVE,
                name: 'Inactive',
                slug: RegisterSchoolStatus.INACTIVE,
            },

            {
                value: RegisterSchoolStatus.INACTIVE,
                color: Colors.RED,
                label: 'Inactive',
                id: RegisterSchoolStatus.INACTIVE,
                name: 'Inactive',
                slug: RegisterSchoolStatus.INACTIVE,
            },
        ] as EnumListItem[];
    },
};
