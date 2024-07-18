import { BaseResponse, ResponseList } from '../models/common';
import { YearPackage } from '../models/year-package';
import http from './http';

export interface ICreateYearPackageDto extends Pick<YearPackage, 'numberOfStudent' | 'packageId' | 'schoolYearId'> {}
export interface IUpdateYearPackageDto extends Pick<YearPackage, 'numberOfStudent' | 'packageId' | 'schoolYearId'> {}

const baseUrl = '/year-packages';

export const yearPackageApi = {
    create: async (dto: ICreateYearPackageDto) => {
        const { data } = await http.post<YearPackage>(`${baseUrl}`, dto);

        return data;
    },

    update: async (id: number, dto: IUpdateYearPackageDto) => {
        const { data } = await http.put<YearPackage>(`${baseUrl}/${id}`, dto);

        return data;
    },

    approve: async (id: number) => {
        await http.put(`${baseUrl}/${id}/approve`);
    },

    reject: async (id: number) => {
        await http.put(`${baseUrl}/${id}/reject`);
    },

    getAll: async () => {
        const { data } = await http.get<ResponseList<YearPackage>>(`${baseUrl}`, {
            params: {
                sortOrder: 'desc',
            },
        });

        return data.data || [];
    },
    getById: async (id: number) => {
        const { data } = await http.get<BaseResponse<YearPackage>>(`${baseUrl}/${id}`);

        return data.data;
    },
    delete: async (id: number) => {
        await http.delete(`${baseUrl}/${id}`);
    },
};
