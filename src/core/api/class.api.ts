import { Class, ClassStatus } from '../models/class';
import { BaseResponse, EnumListItem, ResponseList } from '../models/common';
import { getColorWithId } from '../utils/api.helper';
import { Colors } from '../utils/colors.helper';
import http from './http';

export interface ICreateClassDto extends Omit<Class, 'classId' | 'year' | 'status' | 'totalPoint' | 'teacherName'> { }

export interface IUpdateClassDto extends Omit<Class, 'year' | 'status' | 'grade' | 'teacherName'> { }

const baseUrl = '/classes';

export const classApi = {
    create: async (dto: ICreateClassDto) => {
        const { data } = await http.post<Class>(`${baseUrl}`, dto);

        return data;
    },
    update: async (dto: IUpdateClassDto) => {
        const { data } = await http.put<Class>(`${baseUrl}`, dto);

        return data;
    },
    getAll: async () => {
        const { data } = await http.get<ResponseList<Class>>(`${baseUrl}`, {
            params: {
                sortOrder: 'desc',
            },
        });

        console.log(data);
        
        return data.data;
    },

    create: async (dto: ICreateClassDto) => {
        const { data } = await http.post<Class>(`${baseUrl}`, dto);

        return data;
    },
    update: async (dto: IUpdateClassDto) => {
        const { data } = await http.put<Class>(`${baseUrl}`, dto);

        return data;
    },
    getAll: async () => {
        const { data } = await http.get<ResponseList<Class>>(`${baseUrl}`, {
            params: {
                sortOrder: 'desc',
            },
    getBySchool: async (id: number) => {
        const { data } = await http.get<ResponseList<Class>>(`${baseUrl}/school/${id}`);

        return data.data;
    },
    getByClass: async (id: number) => {
        const { data } = await http.get<ResponseList<Class>>(`${baseUrl}/classes/${id}`);
        console.log(data);

        return data.data;
    },
    getById: async (id: number) => {
        const { data } = await http.get<BaseResponse<Class>>(`${baseUrl}/${id}`);

        return data.data;
    },
    delete: async (id: number) => {
        const { data } = await http.delete(`${baseUrl}/${id}`);

        return data;
    },
    getEnumSelectOptions: async ({ search, highSchoolId, year }: { search?: string, highSchoolId?: number, year?: number }) => {
        let classes = highSchoolId ? await classApi.getBySchool(highSchoolId) : await classApi.getAll();

        if (year) {
            classes = classes.filter((classYear) => classYear.schoolYearId == year)
        }

        let list: EnumListItem[] = classes
            .map((item) => ({
                id: item.classId,
                label: item.name,
                color: getColorWithId(item.classId),
                slug: item.name,
                name: item.name,
                value: item.classId,
            }))
            .sort((a, b) => a.label.localeCompare(b.label));

        if (search) {
            return list.filter((item) => item.label.toLowerCase().includes(search.toLowerCase()));
        }

        return list;
    },
    getEnumStatuses: async (search?: string) => {
        const list: EnumListItem[] = [
            {
                color: Colors.GREEN,
                id: ClassStatus.ACTIVE,
                label: 'Active',
                name: 'Active',
                slug: ClassStatus.ACTIVE,
                value: ClassStatus.ACTIVE,
            },
            {
                color: Colors.RED,
                id: ClassStatus.INACTIVE,
                label: 'Inactive',
                name: 'Inactive',
                slug: ClassStatus.INACTIVE,
                value: ClassStatus.INACTIVE,
            },
        ];

        return list;
    },
};
