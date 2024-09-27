import { ResponseList } from '../models/common';
import { Semester } from '../models/semester';
import http from './http';

export interface IUpdateStudentDto extends Pick<Semester, 'startDate' | 'endDate' | 'name'> { }

const baseUrl = '/semesters';

export const semesterApi = {
    update: async (id: number, dto: IUpdateStudentDto) => {
        const { data } = await http.put<Semester>(`${baseUrl}/${id}`, dto);

        return data;
    },
    getAll: async () => {
        const { data } = await http.get<ResponseList<Semester>>(`${baseUrl}`, {
            params: {
                sortOrder: 'asc',
            },
        });

        return data.data;
    },
    getBySchool: async (id: number) => {
        const { data } = await http.get<ResponseList<Semester>>(`${baseUrl}/school/${id}`);

        return data.data;
    },
};
