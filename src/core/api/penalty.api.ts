import { BaseResponse, EnumListItem, ResponseList } from '../models/common';
import { Penalty, PenaltyStatus } from '../models/penalty';
import { getColorWithId } from '../utils/api.helper';
import { Colors } from '../utils/colors.helper';
import http from './http';

export interface ICreatePenaltyDto extends Omit<Penalty, 'penaltyId' | 'status'> { }
export interface IUpdatePenaltyDto extends Omit<Penalty, 'status'> { }

const baseUrl = '/penalties';

export const penaltyApi = {
    create: async (dto: ICreatePenaltyDto) => {
        const { data } = await http.post<Penalty>(`${baseUrl}`, dto);

        return data;
    },

    update: async (dto: IUpdatePenaltyDto) => {
        const { data } = await http.put<Penalty>(`${baseUrl}`, dto);

        return data;
    },
    getAll: async () => {
        const { data } = await http.get<ResponseList<Penalty>>(`${baseUrl}`, {
            params: {
                sortOrder: 'desc',
            },
        });

        return data.data || [];
    },
    getBySchool: async (id: number) => {
        const { data } = await http.get<ResponseList<Penalty>>(`${baseUrl}/school/${id}`);

        return data.data || [];
    },
    getActive: async (id: number) => {
        const { data } = await http.get<ResponseList<Penalty>>(`${baseUrl}/school/${id}/active`);

        return data.data || [];
    },
    getById: async (id: number) => {
        const { data } = await http.get<BaseResponse<Penalty>>(`${baseUrl}/${id}`);

        return data.data;
    },
    delete: async (id: number) => {
        const { data } = await http.delete(`${baseUrl}/${id}`);

        return data;
    },
    getEnumSelectOptions: async (search?: string, id?: number) => {
        const penalties = id ?  await penaltyApi.getActive(id) : await penaltyApi.getAll();

        const list: EnumListItem[] = penalties.map((item) => ({
            id: item.penaltyId,
            label: item.name,
            color: getColorWithId(item.penaltyId),
            slug: item.name,
            name: item.name,
            value: item.penaltyId,
        }));

        if (search) {
            return list.filter((item) => item.name.toLowerCase().includes(search.toLowerCase()));
        }

        return list;
    },
    getEnumStatuses: async (search?: string) => {
        const list: EnumListItem[] = [
            {
                color: Colors.GREEN,
                id: PenaltyStatus.ACTIVE,
                label: 'Đang hoạt động',
                name: 'Đang hoạt động',
                slug: PenaltyStatus.ACTIVE,
                value: PenaltyStatus.ACTIVE,
            },
            {
                color: Colors.RED,
                id: PenaltyStatus.INACTIVE,
                label: 'Đã xóa',
                name: 'Đã xóa',
                slug: PenaltyStatus.INACTIVE,
                value: PenaltyStatus.INACTIVE,
            },
        ];

        return list;
    },
};
