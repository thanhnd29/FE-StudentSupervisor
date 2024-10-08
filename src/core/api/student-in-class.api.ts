import { BaseResponse, EnumListItem, ResponseList } from '../models/common';
import { StudentInClass, StudentInClassStatus } from '../models/student-in-class';
import { Colors } from '../utils/colors.helper';
import http from './http';

export interface ICreateStudentInClassDto extends Omit<StudentInClass, 'studentInClassId' | 'status' | 'studentId' | 'numberOfViolation' | 'year' | 'grade'> { }

export interface IUpdateStudentInClassDto extends Omit<StudentInClass, 'status' | 'schoolId' | 'numberOfViolation' | 'year' | 'grade'> { }

export interface IChangeClassDto extends Pick<StudentInClass, 'studentInClassId' | 'classId'> { }

const baseUrl = '/student-in-classes';

export const studentInClassApi = {
    create: async (dto: ICreateStudentInClassDto) => {
        const { data } = await http.post<StudentInClass>(`${baseUrl}`, {
            ...dto,
            name: dto.studentName,
            code: dto.studentCode
        });

        return data;
    },
    import: async (file: File | any) => {
        const { data } = await http.post<StudentInClass>(`${baseUrl}/import-students`, file, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });

        return data;
    },
    update: async (dto: IUpdateStudentInClassDto) => {
        const { data } = await http.put<StudentInClass>(`${baseUrl}`, {
            ...dto,
            name: dto.studentName,
            code: dto.studentCode
        });

        return data;
    },
    changeClass: async (dto: IChangeClassDto) => {
        const { data } = await http.post<StudentInClass>(`${baseUrl}/change-class?studentInClassId=${dto.studentInClassId}&newClassId=${dto.classId}`);

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
        const { data } = await http.delete(`${baseUrl}/${id}`);

        return data;
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
                label: 'Đang học',
                name: 'Đang học',
                slug: 'Enrolled',
                value: StudentInClassStatus.ENROLLED,
            },
            {
                color: Colors.RED,
                id: StudentInClassStatus.UNENROLLED,
                label: 'Đã nghỉ học',
                name: 'Đã nghỉ học',
                slug: 'Unenrolled',
                value: StudentInClassStatus.UNENROLLED,
            },
        ] as EnumListItem[];
    },
};
