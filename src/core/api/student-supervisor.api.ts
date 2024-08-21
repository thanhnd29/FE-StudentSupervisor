import { BaseResponse, EnumListItem, ResponseList } from '../models/common';
import { StudentSupervisor, StudentSupervisorStatus } from '../models/student-supervisor';
import { getColorWithId } from '../utils/api.helper';
import { Colors } from '../utils/colors.helper';
import http from './http';

export interface ICreateStudentSupervisorDto
    extends Pick<StudentSupervisor, 'address' | 'code' | 'description' | 'supervisorName' | 'phone' | 'password' | 'studentInClassId' | 'schoolId'> { }

export interface IUpdateStudentSupervisorDto
    extends Pick<StudentSupervisor, 'address' | 'code' | 'description' | 'supervisorName' | 'phone' | 'password' | 'studentInClassId' | 'schoolId'> { }

const baseUrl = '/student-supervisors';

export const studentSupervisorApi = {
    create: async (dto: ICreateStudentSupervisorDto) => {
        const { data } = await http.post<StudentSupervisor>(`${baseUrl}/create-account`, dto);        

        return data;
    },
    update: async (id: number, dto: IUpdateStudentSupervisorDto) => {
        const { data } = await http.put<StudentSupervisor>(`${baseUrl}/${id}`, dto);

        return data;
    },
    getAll: async () => {
        const { data } = await http.get<ResponseList<StudentSupervisor>>(`${baseUrl}`, {
            params: {
                sortOrder: 'desc',
            },
        });

        return data.data;
    },
    getBySchool: async (id: number) => {
        const { data } = await http.get<ResponseList<StudentSupervisor>>(`${baseUrl}/school/${id}`);

        return data.data;
    },
    getActive: async (id: number) => {
        const { data } = await http.get<ResponseList<StudentSupervisor>>(`${baseUrl}/active-stu-supervisors/${id}`);

        return data.data;
    },
    getById: async (id: number) => {
        const { data } = await http.get<BaseResponse<StudentSupervisor>>(`${baseUrl}/${id}`);

        return data.data;
    },
    delete: async (id: number) => {
        const { data } = await http.delete(`${baseUrl}/${id}`);

        return data;
    },
    getEnumSelectOptions: async (search?: string, schoolId?: number) => {
        const studentSupervisors = schoolId ? await studentSupervisorApi.getActive(schoolId) : await studentSupervisorApi.getAll();

        const list: EnumListItem[] = studentSupervisors.map((item) => ({
            id: item.studentSupervisorId,
            label: item.supervisorName,
            color: getColorWithId(item.studentSupervisorId),
            slug: item.supervisorName,
            name: item.supervisorName,
            value: item.studentSupervisorId,
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
                id: StudentSupervisorStatus.ACTIVE,
                label: 'Đang hoạt động',
                name: 'Đang hoạt động',
                slug: StudentSupervisorStatus.ACTIVE,
                value: StudentSupervisorStatus.ACTIVE,
            },
            {
                color: Colors.RED,
                id: StudentSupervisorStatus.INACTIVE,
                label: 'Đã xóa',
                name: 'Đã xóa',
                slug: StudentSupervisorStatus.INACTIVE,
                value: StudentSupervisorStatus.INACTIVE,
            },
        ];

        return list;
    },
};
