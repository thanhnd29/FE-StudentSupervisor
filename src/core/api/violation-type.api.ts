import { BaseResponse, EnumListItem, ResponseList } from '../models/common';
import { ViolationType, ViolationTypeStatus } from '../models/violantion-type';
import { getColorWithId } from '../utils/api.helper';
import { Colors } from '../utils/colors.helper';
import http from './http';

export interface ICreateViolationTypeDto extends Pick<ViolationType, 'vioTypeName' | 'violationGroupId' | 'description'> { }

export interface IUpdateViolationTypeDto extends Pick<ViolationType, 'vioTypeName' | 'violationGroupId' | 'description'> { }

const baseUrl = '/violation-types';

export const violationTypeApi = {
    create: async (dto: ICreateViolationTypeDto) => {
        const { data } = await http.post<ViolationType>(`${baseUrl}`, dto);

        return data;
    },
    update: async (id: number, dto: IUpdateViolationTypeDto) => {
        const { data } = await http.put<ViolationType>(`${baseUrl}/${id}`, dto);

        return data;
    },
    getAll: async () => {
        const { data } = await http.get<ResponseList<ViolationType>>(`${baseUrl}`, {
            params: {
                sortOrder: 'desc',
            },
        });

        return data.data;
    },
    getBySchool: async (id: number) => {
        const { data } = await http.get<ResponseList<ViolationType>>(`${baseUrl}/school/${id}`);

        return data.data;
    },
    getById: async (id: number) => {
        const { data } = await http.get<BaseResponse<ViolationType>>(`${baseUrl}/${id}`);

        return data.data;
    },
    delete: async (id: number) => {
        const { data } = await http.delete(`${baseUrl}/${id}`);

        return data;
    },
    getEnumSelectOptions: async (id: number, search: string) => {
        const violationTypes = id ? await violationTypeApi.getBySchool(id) : await violationTypeApi.getAll();

        const list: EnumListItem[] = violationTypes.map((item) => ({
            id: item.violationTypeId,
            label: item.vioTypeName,
            color: getColorWithId(item.violationTypeId),
            slug: item.vioTypeName,
            name: item.vioTypeName,
            value: item.violationTypeId,
        }));

        if (search) {
            {
                return list.filter((item) => item.name.toLowerCase().includes(search.toLowerCase()));
            }
        }

        return list;
    },
    getEnumStatuses: async (search?: string) => {
        const list: EnumListItem[] = [
            {
                color: Colors.GREEN,
                id: ViolationTypeStatus.ACTIVE,
                label: 'Active',
                name: 'Active',
                slug: ViolationTypeStatus.ACTIVE,
                value: ViolationTypeStatus.ACTIVE,
            },
            {
                color: Colors.RED,
                id: ViolationTypeStatus.INACTIVE,
                label: 'Inactive',
                name: 'Inactive',
                slug: ViolationTypeStatus.INACTIVE,
                value: ViolationTypeStatus.INACTIVE,
            },
        ];

        return list;
    },
};
