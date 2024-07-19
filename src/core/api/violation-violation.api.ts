import { BaseResponse, EnumListItem, ResponseList } from '../models/common';
import { ViolationConfig, ViolationConfigStatus } from '../models/violation-config';
import { getColorWithId } from '../utils/api.helper';
import { Colors } from '../utils/colors.helper';
import http from './http';

export interface ICreateViolationConfigDto extends Omit<ViolationConfig, 'violationConfigId' | 'status'> { }

export interface IUpdateViolationConfigDto extends Omit<ViolationConfig, 'violationConfigId' | 'status'> { }

const baseUrl = '/violation-configs';

export const violationConfigApi = {
    create: async (dto: ICreateViolationConfigDto) => {
        const { data } = await http.post<ViolationConfig>(`${baseUrl}`, {
            minusPoints: dto.evaluationId,
            ...dto
        });

        return data;
    },
    update: async (id: number, dto: IUpdateViolationConfigDto) => {
        const { data } = await http.put<ViolationConfig>(`${baseUrl}/${id}`, dto);

        return data;
    },
    getAll: async () => {
        const { data } = await http.get<ResponseList<ViolationConfig>>(`${baseUrl}`, {
            params: {
                sortOrder: 'desc',
            },
        });

        return data.data;
    },
    getBySchool: async (id: number) => {
        const { data } = await http.get<ResponseList<ViolationConfig>>(`${baseUrl}/school/${id}`);

        return data.data;
    },
    getById: async (id: number) => {
        const { data } = await http.get<BaseResponse<ViolationConfig>>(`${baseUrl}/${id}`);

        return data.data;
    },
    delete: async (id: number) => {
        await http.delete(`${baseUrl}/${id}`);
    },
    getEnumSelectOptions: async (search: string) => {
        const violationConfigs = await violationConfigApi.getAll();

        const list: EnumListItem[] = violationConfigs.map((item) => ({
            id: item.violationConfigId,
            label: item.violationConfigName,
            color: getColorWithId(item.violationConfigId),
            slug: item.violationConfigName,
            name: item.violationConfigName,
            value: item.violationConfigId,
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
                id: ViolationConfigStatus.ACTIVE,
                label: 'Active',
                name: 'Active',
                slug: ViolationConfigStatus.ACTIVE,
                value: ViolationConfigStatus.ACTIVE,
            },
            {
                color: Colors.RED,
                id: ViolationConfigStatus.INACTIVE,
                label: 'Inactive',
                name: 'Inactive',
                slug: ViolationConfigStatus.INACTIVE,
                value: ViolationConfigStatus.INACTIVE,
            },
        ];

        return list;
    },
};
