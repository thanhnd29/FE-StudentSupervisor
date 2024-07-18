import { BaseResponse, EnumListItem, ResponseList } from '../models/common';
import { ViolationGroup } from '../models/violation-group';
import { getColorWithId } from '../utils/api.helper';
import http from './http';

export interface ICreateViolationGroupDto extends Omit<ViolationGroup, 'violationGroupId'> {}

export interface IUpdateViolationGroupDto extends Omit<ViolationGroup, 'violationGroupId'> {}

const baseUrl = '/violation-groups';

export const violationGroupApi = {
    create: async (dto: ICreateViolationGroupDto) => {
        const { data } = await http.post<ViolationGroup>(`${baseUrl}`, dto);

        return data;
    },
    update: async (id: number, dto: IUpdateViolationGroupDto) => {
        const { data } = await http.put<ViolationGroup>(`${baseUrl}/${id}`, dto);

        return data;
    },
    getAll: async () => {
        const { data } = await http.get<ResponseList<ViolationGroup>>(`${baseUrl}`, {
            params: {
                sortOrder: 'desc',
            },
        });

        return data.data;
    },
    getById: async (id: number) => {
        const { data } = await http.get<BaseResponse<ViolationGroup>>(`${baseUrl}/${id}`);

        return data.data;
    },
    delete: async (id: number) => {
        await http.delete(`${baseUrl}/${id}`);
    },
    getEnumSelectOptions: async (search: string) => {
        const violationGroups = await violationGroupApi.getAll();

        const list: EnumListItem[] = violationGroups.map((item) => ({
            id: item.violationGroupId,
            label: item.vioGroupName,
            color: getColorWithId(item.violationGroupId),
            slug: item.vioGroupName,
            name: item.vioGroupName,
            value: item.violationGroupId,
        }));

        if (search) {
            {
                return list.filter((item) => item.name.toLowerCase().includes(search.toLowerCase()));
            }
        }

        return list;
    },
};
