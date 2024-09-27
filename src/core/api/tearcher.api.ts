import { BaseResponse, EnumListItem, ResponseList } from '../models/common';
import { SchoolYear } from '../models/schoolYears';
import { Teacher, TeacherStatus } from '../models/teacher';
import { getColorWithId } from '../utils/api.helper';
import { Colors } from '../utils/colors.helper';
import http from './http';

export interface ICreateTeacherDto extends Omit<Teacher, 'teacherId' | 'schoolName' | 'roleId' | 'status'> { }

const baseUrl = '/teachers';

export const teacherApi = {
    create: async (dto: ICreateTeacherDto) => {
        const { data } = await http.post<BaseResponse<Teacher>>(baseUrl, dto);

        console.log(data.data);


        return data.data;
    },
    import: async (file: File | any) => {
        const { data } = await http.post<Teacher>(`${baseUrl}/import-teachers`, file, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });

        return data;
    },
    createSupervisors: async (dto: ICreateTeacherDto) => {
        const { data } = await http.post<BaseResponse<Teacher>>(`${baseUrl}/supervisors`, dto);

        return data.data;
    },
    getAll: async () => {
        const { data } = await http.get<ResponseList<Teacher>>(`${baseUrl}`, {
            params: {
                sortOrder: 'desc',
            },
        });

        return data.data ? data.data : [];
    },
    getBySchool: async (id: number) => {
        const { data } = await http.get<ResponseList<Teacher>>(`${baseUrl}/school/${id}`);

        return data.data;
    },
    getTeacherBySchool: async (id: number) => {
        const { data } = await http.get<ResponseList<Teacher>>(`${baseUrl}/role/teacher/${id}`);

        return data.data;
    },
    getSupervisorBySchool: async (id: number) => {
        const { data } = await http.get<ResponseList<Teacher>>(`${baseUrl}/role/supervisor/${id}`);

        return data.data;
    },
    getTeacherByYear: async (id: number) => {
        const { data } = await http.get<ResponseList<Teacher>>(`${baseUrl}/without-class/school/${id}/year/${(new Date().getFullYear()).toString()}`);

        return data.data;
    },
    getById: async (id: number) => {
        const { data } = await http.get<SchoolYear>(`${baseUrl}/${id}`);

        return data;
    },
    delete: async (id: number) => {
        const { data } = await http.delete(`${baseUrl}/${id}`);

        return data;
    },
    getEnumSelectOptions: async ({ search, schoolId, supervisorId, teacherByYear }: { search?: string, schoolId?: number, supervisorId?: number, teacherByYear?: number }) => {
        const teachers = schoolId ? await teacherApi.getTeacherBySchool(schoolId) : supervisorId ? await teacherApi.getSupervisorBySchool(supervisorId) : teacherByYear ? await teacherApi.getTeacherByYear(teacherByYear) : await teacherApi.getAll();

        const list: EnumListItem[] = teachers.map((item) => ({
            id: item.teacherId,
            label: item.teacherName,
            color: getColorWithId(item.teacherId),
            slug: item.teacherName,
            name: item.teacherName,
            value: item.teacherId,
        }));

        if (search) {
            return list.filter((item) => item.label.toLowerCase().includes(search.toLowerCase()));
        }

        return list;
    },
    getEnumStatuses: async (search?: string) => {
        const list: EnumListItem[] = [
            {
                color: Colors.GREEN,
                id: TeacherStatus.ACTIVE,
                label: 'Đang hoạt động',
                name: 'Đang hoạt động',
                slug: TeacherStatus.ACTIVE,
                value: TeacherStatus.ACTIVE,
            },
            {
                color: Colors.RED,
                id: TeacherStatus.INACTIVE,
                label: 'Đã xóa',
                name: 'Đã xóa',
                slug: TeacherStatus.INACTIVE,
                value: TeacherStatus.INACTIVE,
            },
        ];

        return list;
    },
};
