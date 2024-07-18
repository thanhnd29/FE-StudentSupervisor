import { BaseResponse, EnumListItem, ResponseList } from '../models/common';
import { StudentSupervisor } from '../models/student-supervisor';
import { getColorWithId } from '../utils/api.helper';
import http from './http';

export interface ICreateStudentSupervisorDto
    extends Pick<StudentSupervisor, 'address' | 'supervisorCode' | 'description' | 'userCode' | 'supervisorName' | 'phone' | 'password'> {
    schoolAdminId: number;
}

export interface IUpdateStudentSupervisorDto
    extends Pick<StudentSupervisor, 'address' | 'supervisorCode' | 'description' | 'userCode' | 'supervisorName' | 'phone' | 'password'> {
    schoolAdminId: number;
}

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
    getById: async (id: number) => {
        const { data } = await http.get<BaseResponse<StudentSupervisor>>(`${baseUrl}/${id}`);

        return data.data;
    },
    delete: async (id: number) => {
        await http.delete(`${baseUrl}/${id}`);
    },
    getEnumSelectOptions: async (search?: string) => {
        const studentSupervisors = await studentSupervisorApi.getAll();

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
};
