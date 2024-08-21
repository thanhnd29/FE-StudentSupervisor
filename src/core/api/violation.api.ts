import { BaseResponse, EnumListItem, ResponseList } from '../models/common';
import { Violation, ViolationStatus } from '../models/violation';
import { getColorWithId } from '../utils/api.helper';
import { Colors } from '../utils/colors.helper';
import http from './http';

export interface ICreateViolationStudentDto {
    SchoolId: number;
    UserId: number;
    Year: number;
    ClassId: number;
    ViolationTypeId: number;
    StudentInClassId: number;
    ViolationName: string;
    Description: string;
    Date: string;
    Images: string[];
}

export interface ICreateViolationSupervisorDto {
    UserId: number,
    ClassId: number;
    ViolationTypeId: number;
    StudentInClassId: number;
    ViolationName: string;
    Description: string;
    Date: string;
    Images: string[];
}

export interface IUpdateViolationDto {
    UserId: number,
    ClassId: number;
    ViolationTypeId: number;
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
    updateSupervisor: async (id: number, dto: ICreateViolationSupervisorDto) => {
        const { data } = await http.put<Violation>(`${baseUrl}/supervisor`, dto, {
            params: {
                id: id
            },
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });

        return data;
    },
    approve: async (id: number) => {
        const { data } = await http.put(`${baseUrl}/${id}/approve`);

        return data;
    },
    reject: async (id: number) => {
        const { data } = await http.put(`${baseUrl}/${id}/reject`);

        return data;
    },
    complete: async (id: number) => {
        const { data } = await http.put(`${baseUrl}/${id}/complete`);

        return data;
    },
    getAll: async () => {
        const { data } = await http.get<ResponseList<Violation>>(`${baseUrl}`, {
            params: {
                sortOrder: 'desc',
            },
        });

        return data.data;
    },
    getBySchool: async (id: number) => {
        const { data } = await http.get<ResponseList<Violation>>(`${baseUrl}/school/${id}`);

        return data.data;
    },
    getByTeacher: async (id: number) => {
        const { data } = await http.get<ResponseList<Violation>>(`${baseUrl}/user/${id}/teachers`, {
            params: {
                sortOrder: 'desc',
            },
        });

        return data.data;
    },
    getBySupervisor: async (id: number) => {
        const { data } = await http.get<ResponseList<Violation>>(`${baseUrl}/supervisor/${id}`, {
            params: {
                sortOrder: 'desc',
            },
        });

        return data.data;
    },
    getByClass: async (id: number) => {
        const { data } = await http.get<ResponseList<Violation>>(`${baseUrl}/by-class/${id}`, {
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
    getByDisciplineId: async (id: number) => {
        const { data } = await http.get<BaseResponse<Violation>>(`${baseUrl}/discipline/${id}`);

        return data.data;
    },
    delete: async (id: number) => {
        const { data } = await http.delete(`${baseUrl}/${id}`);

        return data;
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
    getEnumStatuses: async (search?: string) => {
        const list: EnumListItem[] = [
            {
                color: Colors.GREEN,
                id: ViolationStatus.APPROVED,
                label: 'Đã duyệt',
                name: 'Đã duyệt',
                slug: ViolationStatus.APPROVED,
                value: ViolationStatus.APPROVED,
            },
            {
                color: Colors.RED,
                id: ViolationStatus.REJECTED,
                label: 'Từ chối',
                name: 'Từ chối',
                slug: ViolationStatus.REJECTED,
                value: ViolationStatus.REJECTED,
            },
            {
                color: Colors.PURPLE,
                id: ViolationStatus.INACTIVE,
                label: 'Đã xóa',
                name: 'Đã xóa',
                slug: ViolationStatus.INACTIVE,
                value: ViolationStatus.INACTIVE,
            },
            {
                color: Colors.PINK,
                id: ViolationStatus.PENDING,
                label: 'Chờ xử lý',
                name: 'Chờ xử lý',
                slug: ViolationStatus.PENDING,
                value: ViolationStatus.PENDING,
            },
            {
                color: Colors.ORANGE,
                id: ViolationStatus.DISCUSSING,
                label: 'Phản đối',
                name: 'Phản đối',
                slug: ViolationStatus.DISCUSSING,
                value: ViolationStatus.DISCUSSING,
            },
            {
                color: Colors.YELLOW,
                id: ViolationStatus.COMPLETED,
                label: 'Chấp nhận',
                name: 'Chấp nhận',
                slug: ViolationStatus.COMPLETED,
                value: ViolationStatus.COMPLETED,
            },
        ];

        return list;
    },
};
