import { BaseResponse, EnumListItem, ResponseList } from '../models/common';
import { PackageType, PackageTypeStatus } from '../models/package-type';
import { getColorWithId } from '../utils/api.helper';
import { Colors } from '../utils/colors.helper';
import http from './http';

export interface ICreatePackageTypeDto extends Pick<PackageType, 'description' | 'name'> { }
export interface IUpdatePackageTypeDto extends Pick<PackageType, 'description' | 'name'> { }

const baseUrl = '/package-types';

export const packageTypeApi = {
    create: async (dto: ICreatePackageTypeDto) => {
        const { data } = await http.post<PackageType>(`${baseUrl}`, dto);

        return data;
    },

    update: async (id: number, dto: IUpdatePackageTypeDto) => {
        const { data } = await http.put<PackageType>(`${baseUrl}/${id}`, dto);

        return data;
    },
    getAll: async () => {
        const { data } = await http.get<ResponseList<PackageType>>(`${baseUrl}`, {
            params: {
                sortOrder: 'desc',
            },
        });

        return data.data || [];
    },
    getById: async (id: number) => {
        const { data } = await http.get<BaseResponse<PackageType>>(`${baseUrl}/${id}`);

        return data.data;
    },
    delete: async (id: number) => {
        const { data } = await http.delete(`${baseUrl}/${id}`);

        return data;
    },
    getEnumSelectOptions: async (search?: string) => {
        const packages = await packageTypeApi.getAll().then((data) => data.filter((item) => item.status === PackageTypeStatus.ACTIVE));

        const list: EnumListItem[] = packages.map((item) => ({
            id: item.packageTypeId,
            label: item.name,
            color: getColorWithId(item.packageTypeId),
            slug: item.name,
            name: item.name,
            value: item.packageTypeId,
        }));

        if (search) {
            return list.filter((item) => item.label.toLowerCase().includes(search.toLowerCase()));
        }

        return list;
    },
    getEnumStatuses: async (search?: string) => {
        return [
            {
                color: Colors.GREEN,
                id: PackageTypeStatus.ACTIVE,
                label: 'Active',
                name: 'Active',
                slug: 'active',
                value: PackageTypeStatus.ACTIVE,
            },
            {
                color: Colors.RED,
                id: PackageTypeStatus.INACTIVE,
                label: 'Inactive',
                name: 'Inactive',
                slug: 'inactive',
                value: PackageTypeStatus.INACTIVE,
            },
        ] as EnumListItem[];
    },
};
