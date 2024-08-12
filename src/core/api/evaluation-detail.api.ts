import { BaseResponse, EnumListItem, ResponseList } from '../models/common';
import { EvaluationDetail, EvaluationDetailStatus } from '../models/evaluation-detail';
import { Colors } from '../utils/colors.helper';
import http from './http';

export interface ICreateEvaluationDetailDto extends Omit<EvaluationDetail, 'evaluationDetailId' | 'status'> {}

export interface IUpdateEvaluationDetailDto extends EvaluationDetail {}

const baseUrl = '/evaluation-details';

export const evaluationDetailApi = {
    create: async (dto: ICreateEvaluationDetailDto) => {
        const { data } = await http.post<EvaluationDetail>(`${baseUrl}`, dto);

        return data;
    },
    update: async (dto: IUpdateEvaluationDetailDto) => {
        const { data } = await http.put<EvaluationDetail>(`${baseUrl}`, dto);

        return data;
    },
    getAll: async () => {
        const { data } = await http.get<ResponseList<EvaluationDetail>>(`${baseUrl}`, {
            params: {
                sortOrder: 'desc',
            },
        });

        return data.data;
    },
    getBySchool: async (id: number) => {
        const { data } = await http.get<ResponseList<EvaluationDetail>>(`${baseUrl}/school/${id}`);

        return data.data;
    },
    getById: async (id: number) => {
        const { data } = await http.get<BaseResponse<EvaluationDetail>>(`${baseUrl}/${id}`);

        return data.data;
    },
    delete: async (id: number) => {
        const { data } = await http.delete(`${baseUrl}/${id}`);

        return data;
    },
    getEnumStatuses: async (search?: string) => {
        return [
            {
                color: Colors.GREEN,
                id: EvaluationDetailStatus.ACTIVE,
                label: 'Active',
                name: 'Active',
                slug: 'active',
                value: EvaluationDetailStatus.ACTIVE,
            },
            {
                color: Colors.RED,
                id: EvaluationDetailStatus.INACTIVE,
                label: 'Inactive',
                name: 'Inactive',
                slug: 'inactive',
                value: EvaluationDetailStatus.INACTIVE,
            },
        ] as EnumListItem[];
    },
};
