import { BaseResponse, EnumListItem, ResponseList } from '../models/common';
import { Violation } from '../models/violation';
import { getColorWithId } from '../utils/api.helper';
import http from './http';

export interface ICreateViolationStudentDto {
    ClassId: number;
    ViolationTypeId: number;
    TeacherId: number;
    ViolationName: string;
    Description: string;
    Date: string;
    StudentInClassId: number;
    Images: string[];
}

export interface ICreateViolationSupervisorDto {
    ClassId: number;
    ViolationTypeId: number;
    TeacherId: number;
    StudentInClassId: number;
    ViolationName: string;
    Description: string;
    Date: string;
    Images: string[];
}

export interface IUpdateViolationDto {
    ClassId: number;
    ViolationTypeId: number;
    TeacherId: number;
    StudentInClassId: number;
    ViolationName: string;
    Description: string;
    Date: string;
    Images: string[];
}

const baseUrl = '/violations';

export const violationsApi = {
    createForStudent: async (dto: ICreateViolationStudentDto) => {
        const formData = new FormData();

        Object.entries(dto).forEach(([key, value]) => {
            formData.append(key, value);
        });

        const { data } = await http.post<Violation>(`${baseUrl}/student`, dto, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });

        return data;
    },

    createForSupervisor: async (dto: ICreateViolationStudentDto) => {
        const formData = new FormData();

        Object.entries(dto).forEach(([key, value]) => {
            formData.append(key, value);
        });

        const { data } = await http.post<Violation>(`${baseUrl}/supervisor`, dto, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });

        return data;
    },

    update: async (id: number, dto: IUpdateViolationDto) => {
        const { data } = await http.put<Violation>(`${baseUrl}/${id}`, dto);

        return data;
    },

    approve: async (id: number) => {
        await http.put(`${baseUrl}/${id}/approve`);
    },

    reject: async (id: number) => {
        await http.put(`${baseUrl}/${id}/reject`);
    },

    getAll: async () => {
        const { data } = await http.get<ResponseList<Violation>>(`${baseUrl}`, {
            params: {
                sortOrder: 'desc',
            },
        });

        return data.data;
    },
    getById: async (id: number) => {
        const { data } = await http.get<BaseResponse<Violation>>(`${baseUrl}/${id}`);

        return data.data;
    },
    delete: async (id: number) => {
        await http.delete(`${baseUrl}/${id}`);
    },
    getEnumSelectOptions: async (search?: string) => {
        const violations = await violationsApi.getAll();

        const list: EnumListItem[] = violations.map((violation) => ({
            value: violation.violationId,
            label: violation.violationName,
            color: getColorWithId(violation.violationId),
            id: violation.violationId.toString(),
            name: violation.violationName,
            slug: violation.violationName,
        }));

        if (search) {
            return list.filter((item) => item.name.toLowerCase().includes(search.toLowerCase()));
        }

        return list;
    },
};
