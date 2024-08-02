import { BaseResponse, EnumListItem, ResponseList } from '../models/common';
import { ViolationGroup, ViolationGroupStatus } from '../models/violation-group';
import { getColorWithId } from '../utils/api.helper';
import { Colors } from '../utils/colors.helper';
import http from './http';

export interface ICreateViolationGroupDto extends Omit<ViolationGroup, 'violationGroupId' | 'schoolName' | 'status'> { }

export interface IUpdateViolationGroupDto extends Omit<ViolationGroup, 'violationGroupId' | 'schoolName' | 'status'> { }

const baseUrl = '/violation-groups';

export const violationGroupApi = {
    create: async (dto: ICreateViolationGroupDto) => {
        const { data } = await http.post<ViolationGroup>(`${baseUrl}`, dto);

        console.log(data);


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
    getBySchool: async (id: number) => {
        const { data } = await http.get<ResponseList<ViolationGroup>>(`${baseUrl}/school/${id}`);

        return data.data;
    },
    getById: async (id: number) => {
        const { data } = await http.get<BaseResponse<ViolationGroup>>(`${baseUrl}/${id}`);

        return data.data;
    },
    delete: async (id: number) => {
        await http.delete(`${baseUrl}/${id}`);
    },
    getEnumSelectOptions: async (id: number, search: string) => {
        const violationGroups = id ? await violationGroupApi.getBySchool(id) : await violationGroupApi.getAll();

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
    getEnumStatuses: async (search?: string) => {
        const list: EnumListItem[] = [
            {
                color: Colors.GREEN,
                id: ViolationGroupStatus.ACTIVE,
                label: 'Active',
                name: 'Active',
                slug: ViolationGroupStatus.ACTIVE,
                value: ViolationGroupStatus.ACTIVE,
            },
            {
                color: Colors.RED,
                id: ViolationGroupStatus.INACTIVE,
                label: 'Inactive',
                name: 'Inactive',
                slug: ViolationGroupStatus.INACTIVE,
                value: ViolationGroupStatus.INACTIVE,
            },
        ];

        return list;
    },

    import { BaseResponse, EnumListItem, ResponseList } from '../models/common';
import { ViolationGroup, ViolationGroupStatus } from '../models/violation-group';
import { getColorWithId } from '../utils/api.helper';
import { Colors } from '../utils/colors.helper';
import http from './http';

export interface ICreateViolationGroupDto extends Omit<ViolationGroup, 'violationGroupId' | 'schoolName' | 'status'> { }

export interface IUpdateViolationGroupDto extends Omit<ViolationGroup, 'violationGroupId' | 'schoolName' | 'status'> { }

const baseUrl = '/violation-groups';

export const violationGroupApi = {
    create: async (dto: ICreateViolationGroupDto) => {
        const { data } = await http.post<ViolationGroup>(`${baseUrl}`, dto);

        console.log(data);


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
    getBySchool: async (id: number) => {
        const { data } = await http.get<ResponseList<ViolationGroup>>(`${baseUrl}/school/${id}`);

        return data.data;
    },
    getById: async (id: number) => {
        const { data } = await http.get<BaseResponse<ViolationGroup>>(`${baseUrl}/${id}`);

        return data.data;
    },
    delete: async (id: number) => {
        await http.delete(`${baseUrl}/${id}`);
    },
    getEnumSelectOptions: async (id: number, search: string) => {
        const violationGroups = id ? await violationGroupApi.getBySchool(id) : await violationGroupApi.getAll();

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
                id: ViolationGroupStatus.ACTIVE,
                label: 'Active',
                name: 'Active',
                slug: ViolationGroupStatus.ACTIVE,
                value: ViolationGroupStatus.ACTIVE,
            },
            {
                color: Colors.RED,
                id: ViolationGroupStatus.INACTIVE,
                label: 'Inactive',
                name: 'Inactive',
                slug: ViolationGroupStatus.INACTIVE,
                value: ViolationGroupStatus.INACTIVE,
            },
        ];

        return list;
    },
};

};
