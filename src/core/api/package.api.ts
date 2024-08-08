import { BaseResponse, EnumListItem, ResponseList } from '../models/common';
import { Package, PackageStatus } from '../models/package';
import { getColorWithId } from '../utils/api.helper';
import { Colors } from '../utils/colors.helper';
import http from './http';

export interface ICreatePackageDto extends Pick<Package, 'description' | 'name' | 'price' | 'packageTypeId'> {}
export interface IUpdatePackageDto extends Pick<Package, 'description' | 'name' | 'price' | 'packageTypeId'> {}

const baseUrl = '/packages';

export const packageApi = {
    create: async (dto: ICreatePackageDto) => {
        const { data } = await http.post<Package>(`${baseUrl}`, dto);

        return data;
    },
    update: async (id: number, dto: IUpdatePackageDto) => {
        const { data } = await http.put<Package>(`${baseUrl}/${id}`, dto);

        return data;
    },
    getAll: async () => {
        const { data } = await http.get<ResponseList<Package>>(`${baseUrl}`, {
            params: {
                sortOrder: 'desc',
            },
        });

        return data.data || [];
    },
    getById: async (id: number) => {
        const { data } = await http.get<BaseResponse<Package>>(`${baseUrl}/${id}`);

        return data.data;
    },
    delete: async (id: number) => {
        const { data } = await http.delete(`${baseUrl}/${id}`);

        return data;
    },
    getEnumSelectOptions: async (search?: string) => {
        const packages = await packageApi.getAll().then((data) => data.filter((item) => item.status === PackageStatus.ACTIVE));

        const list: EnumListItem[] = packages.map((item) => ({
            id: item.packageId,
            label: item.name,
            color: getColorWithId(item.packageId),
            slug: item.name,
            name: item.name,
            value: item.packageId,
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
                id: PackageStatus.ACTIVE,
                label: 'Active',
                name: 'Active',
                slug: 'active',
                value: PackageStatus.ACTIVE,
            },
            {
                color: Colors.RED,
                id: PackageStatus.INACTIVE,
                label: 'Inactive',
                name: 'Inactive',
                slug: 'inactive',
                value: PackageStatus.INACTIVE,
            },
        ] as EnumListItem[];
    },
};
