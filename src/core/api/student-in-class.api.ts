import { BaseResponse, EnumListItem, ResponseList } from '../models/common';
import { StudentInClass, StudentInClassStatus } from '../models/student-in-class';
import { Colors } from '../utils/colors.helper';
import http from './http';

export interface ICreateStudentInClassDto extends Omit<StudentInClass, 'studentInClassId' | 'status' | 'studentName'> {}

export interface IUpdateStudentInClassDto extends Omit<StudentInClass, 'studentInClassId' | 'studentName'> {}

const baseUrl = '/student-in-classes';

export const studentInClassApi = {
    create: async (dto: ICreateStudentInClassDto) => {
        const { data } = await http.post<StudentInClass>(`${baseUrl}`, dto);

        return data;
    },
    update: async (dto: IUpdateStudentInClassDto) => {
        const { data } = await http.put<StudentInClass>(`${baseUrl}`, dto);

        return data;
    },
    getAll: async () => {
        const { data } = await http.get<ResponseList<StudentInClass>>(`${baseUrl}`, {
            params: {
                sortOrder: 'desc',
            },
        });

        return data.data;
    },
    getBySchool: async (id: number) => {
        const { data } = await http.get<ResponseList<StudentInClass>>(`${baseUrl}/school/${id}`);

        return data.data;
    },
    getById: async (id: number) => {
        const { data } = await http.get<BaseResponse<StudentInClass>>(`${baseUrl}/${id}`);

        return data.data;
    },
    delete: async (id: number) => {
        await http.delete(`${baseUrl}/${id}`);
    },
    getEnumSelectOptions: async ({ search, classId }: { search?: string; classId?: number }) => {
        let studentInClasses = await studentInClassApi.getAll();

        if (classId) {
            studentInClasses = studentInClasses.filter((item) => item.classId === Number(classId));
        }

        let list: EnumListItem[] = studentInClasses.map((item) => ({
            id: item.studentInClassId,
            label: item.studentName,
            color: Colors.GREEN,
            slug: item.studentName,
            name: item.studentName,
            value: item.studentInClassId,
        }));

        if (search) {
            return list.filter((item) => item.label.toLowerCase().includes(search.toLowerCase()));
        }

        return list;
    },
    getEnumStatuses: async (search?: string) => {
        return [
            {
                color: Colors.GREEN,
                id: StudentInClassStatus.ENROLLED,
                label: 'Enrolled',
                name: 'Enrolled',
                slug: 'Enrolled',
                value: StudentInClassStatus.ENROLLED,
            },
            {
                color: Colors.RED,
                id: StudentInClassStatus.UNENROLLED,
                label: 'Unenrolled',
                name: 'Unenrolled',
                slug: 'Unenrolled',
                value: StudentInClassStatus.UNENROLLED,
            },
        ] as EnumListItem[];
    },

    import { BaseResponse, EnumListItem, ResponseList } from '../models/common';
import { StudentInClass, StudentInClassStatus } from '../models/student-in-class';
import { Colors } from '../utils/colors.helper';
import http from './http';

export interface ICreateStudentInClassDto extends Omit<StudentInClass, 'studentInClassId' | 'status' | 'studentName'> {}

export interface IUpdateStudentInClassDto extends Omit<StudentInClass, 'studentInClassId' | 'studentName'> {}

const baseUrl = '/student-in-classes';

export const studentInClassApi = {
    create: async (dto: ICreateStudentInClassDto) => {
        const { data } = await http.post<StudentInClass>(`${baseUrl}`, dto);

        return data;
    },
    update: async (dto: IUpdateStudentInClassDto) => {
        const { data } = await http.put<StudentInClass>(`${baseUrl}`, dto);

        return data;
    },
    getAll: async () => {
        const { data } = await http.get<ResponseList<StudentInClass>>(`${baseUrl}`, {
            params: {
                sortOrder: 'desc',
            },
        });

        return data.data;
    },
    getBySchool: async (id: number) => {
        const { data } = await http.get<ResponseList<StudentInClass>>(`${baseUrl}/school/${id}`);

        return data.data;
    },
    getById: async (id: number) => {
        const { data } = await http.get<BaseResponse<StudentInClass>>(`${baseUrl}/${id}`);

        return data.data;
    },
    delete: async (id: number) => {
        await http.delete(`${baseUrl}/${id}`);
    },
    getEnumSelectOptions: async ({ search, classId }: { search?: string; classId?: number }) => {
        let studentInClasses = await studentInClassApi.getAll();

        if (classId) {
            studentInClasses = studentInClasses.filter((item) => item.classId === Number(classId));
        }

        let list: EnumListItem[] = studentInClasses.map((item) => ({
            id: item.studentInClassId,
            label: item.studentName,
            color: Colors.GREEN,
            slug: item.studentName,
            name: item.studentName,
            value: item.studentInClassId,
        }));

        if (search) {
            return list.filter((item) => item.label.toLowerCase().includes(search.toLowerCase()));
        }

        return list;
    },
    getEnumStatuses: async (search?: string) => {
        return [
            {
                color: Colors.GREEN,
                id: StudentInClassStatus.ENROLLED,
                label: 'Enrolled',
                name: 'Enrolled',
                slug: 'Enrolled',
                value: StudentInClassStatus.ENROLLED,
            },
            {
                color: Colors.RED,
                id: StudentInClassStatus.UNENROLLED,
                label: 'Unenrolled',
                name: 'Unenrolled',
                slug: 'Unenrolled',
                value: StudentInClassStatus.UNENROLLED,
            },
        ] as EnumListItem[];
    },
};

{
    color: Colors.RED,
    id: StudentInClassStatus.UNENROLLED,
    label: 'Unenrolled',
    name: 'Unenrolled',
    slug: 'Unenrolled',
    value: StudentInClassStatus.UNENROLLED,
},
] as EnumListItem[];
},
};

};
