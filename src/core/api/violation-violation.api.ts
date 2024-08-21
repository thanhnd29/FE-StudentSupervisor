import { BaseResponse, EnumListItem, ResponseList } from '../models/common';
import { ViolationConfig, ViolationConfigStatus } from '../models/violation-config';
import { getColorWithId } from '../utils/api.helper';
import { Colors } from '../utils/colors.helper';
import http from './http';

export interface ICreateViolationConfigDto extends Omit<ViolationConfig, 'violationConfigId' | 'status'> { }

export interface IUpdateViolationConfigDto extends Omit<ViolationConfig, 'violationConfigId' | 'status' | 'violationTypeId'> { }

const baseUrl = '/violation-configs';

export const violationConfigApi = {
    create: async (dto: ICreateViolationConfigDto) => {
        const { data } = await http.post<ViolationConfig>(`${baseUrl}`, {
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
        const { data } = await http.delete(`${baseUrl}/${id}`);

        return data;
    },
    getEnumSelectOptions: async (search: string) => {
        const violationConfigs = await violationConfigApi.getAll();

        const list: EnumListItem[] = violationConfigs.map((item) => ({
            id: item.violationConfigId,
            label: item.violationConfigId.toString(),
            color: getColorWithId(item.violationConfigId),
            slug: item.violationConfigId.toString(),
            name: item.violationConfigId.toString(),
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
                label: 'Đang hoạt động',
                name: 'Đang hoạt động',
                slug: ViolationConfigStatus.ACTIVE,
                value: ViolationConfigStatus.ACTIVE,
            },
            {
                color: Colors.RED,
                id: ViolationConfigStatus.INACTIVE,
                label: 'Đã xóa',
                name: 'Đã xóa',
                slug: ViolationConfigStatus.INACTIVE,
                value: ViolationConfigStatus.INACTIVE,
            },
        ];

        return list;
    },
};
