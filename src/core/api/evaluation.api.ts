import moment from 'moment';

import { BaseResponse, EnumListItem, ResponseList } from '../models/common';
import { Evaluation, EvaluationStatus } from '../models/evalution';
import { getColorWithId } from '../utils/api.helper';
import http from './http';
import { Colors } from '../utils/colors.helper';

export interface ICreateEvaluationDto extends Omit<Evaluation, 'evaluationId' | 'className' | 'status'> { }

export interface IUpdateEvaluationDto extends Omit<Evaluation, 'status'> { }

const baseUrl = '/evaluations';

export const evaluationApi = {
    create: async (dto: ICreateEvaluationDto) => {
        const { data } = await http.post<Evaluation>(`${baseUrl}`, dto);

        return data;
    },
    update: async (dto: IUpdateEvaluationDto) => {
        const { data } = await http.put<Evaluation>(`${baseUrl}`, dto);

        return data;
    },
    getAll: async () => {
        const { data } = await http.get<ResponseList<Evaluation>>(`${baseUrl}`, {
            params: {
                sortOrder: 'desc',
            },
        });

        return data.data;
    },
    getBySchool: async (id: number) => {
        const { data } = await http.get<ResponseList<Evaluation>>(`${baseUrl}/school/${id}`);

        return data.data;
    },
    getById: async (id: number) => {
        const { data } = await http.get<BaseResponse<Evaluation>>(`${baseUrl}/${id}`);

        return data.data;
    },
    // delete: async (id: number) => {
    //     await http.delete(`${baseUrl}/${id}`);
    // },
    getEnumSelectOptions: async (search?: string) => {
        const classes = await evaluationApi.getAll();

        const list: EnumListItem[] = classes.map((item) => {
            const label = `${moment(item.from).format('DD/MM/YYYY')} - ${moment(item.to).format('DD/MM/YYYY')}`;
            return {
                id: item.evaluationId,
                label,
                color: getColorWithId(item.evaluationId),
                slug: label,
                name: label,
                value: item.evaluationId,
            };
        });

        if (search) {
            return list.filter((item) => item.label.toLowerCase().includes(search.toLowerCase()));
        }

        return list;
    },
    getEnumStatuses: async (search?: string) => {
        const list: EnumListItem[] = [
            {
                color: Colors.GREEN,
                id: EvaluationStatus.ACTIVE,
                label: 'Active',
                name: 'Active',
                slug: EvaluationStatus.ACTIVE,
                value: EvaluationStatus.ACTIVE,
            },
            {
                color: Colors.RED,
                id: EvaluationStatus.INACTIVE,
                label: 'Inactive',
                name: 'Inactive',
                slug: EvaluationStatus.INACTIVE,
                value: EvaluationStatus.INACTIVE,
            },
        ];

        return list;
    },
};
