import { EnumListItem, ResponseList } from '../models/common';
import { Student } from '../models/student';
import { getColorWithId } from '../utils/api.helper';
import http from './http';

export interface ICreateStudentDto extends Student { }

export interface IUpdateStudentDto extends Student { }

const baseUrl = '/students';

export const studentApi = {
    create: async (dto: ICreateStudentDto) => {
        const { data } = await http.post<Student>(`${baseUrl}`, dto);

        return data;
    },
    update: async (id: number, dto: IUpdateStudentDto) => {
        const { data } = await http.put<Student>(`${baseUrl}/${id}`, dto);

        return data;
    },
    getAll: async () => {
        const { data } = await http.get<ResponseList<Student>>(`${baseUrl}`, {
            params: {
                sortOrder: 'asc',
            },
        });

        return data.data;
    },
    getBySchool: async (id: number) => {
        const { data } = await http.get<ResponseList<Student>>(`${baseUrl}/school/${id}`);

        return data.data;
    },
    getById: async (id: number) => {
        const { data } = await http.get<SchoolYear>(`${baseUrl}/${id}`);

        return data;
    },
    delete: async (id: number) => {
        await http.delete(`${baseUrl}/${id}`);
    },
    getEnumSelectOptions: async ({ schoolId, search }: { search?: string; schoolId?: number }) => {
        let students = await studentApi.getAll();

        if (schoolId) students = students.filter((item) => item.schoolId === schoolId);

        const list: EnumListItem[] = students.map((item) => ({
            id: item.studentId,
            label: item.name,
            color: getColorWithId(item.studentId),
            slug: item.name,
            name: item.name,
            value: item.studentId,
        }));

        if (search) {
            return list.filter((item) => item.label.toLowerCase().includes(search.toLowerCase()));
        }

        return list;
    },
};
