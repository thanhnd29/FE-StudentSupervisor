import { BaseResponse, EnumListItem, ResponseList } from '../models/common';
import { PatrolSchedule, PatrolScheduleStatus } from '../models/patrol-schedule';
import { Colors } from '../utils/colors.helper';
import http from './http';

export interface ICreatePatrolScheduleDto extends Pick<PatrolSchedule, 'classId' | 'userId' | 'name' | 'slot' | 'time' | 'supervisorId' | 'from' | 'to'> { }
export interface IUpdatePatrolScheduleDto extends Pick<PatrolSchedule, 'classId' | 'supervisorId' | 'from' | 'to' | 'scheduleId' | 'userId' | 'name' | 'slot' | 'time' | 'status'> { }

const baseUrl = '/patrol-schedules';

export const patrolScheduleApi = {
    create: async (dto: ICreatePatrolScheduleDto) => {
        const { data } = await http.post<PatrolSchedule>(`${baseUrl}`, {
            ...dto,
            time: dto.time.ticks
        });

        console.log(data);

        return data;
    },

    update: async (dto: IUpdatePatrolScheduleDto) => {
        const { data } = await http.put<PatrolSchedule>(`${baseUrl}`, {
            ...dto,
            time: dto.time.ticks
        });

        return data;
    },
    getAll: async () => {
        const { data } = await http.get<ResponseList<PatrolSchedule>>(`${baseUrl}`, {
            params: {
                sortOrder: 'desc',
            },
        });

        return data.data || [];
    },
    getBySchool: async (id: number) => {
        const { data } = await http.get<ResponseList<PatrolSchedule>>(`${baseUrl}/school/${id}`);

        return data.data || [];
    },
    getByUser: async (id: number) => {
        const { data } = await http.get<ResponseList<PatrolSchedule>>(`${baseUrl}/supervisor/${id}/schedule`);

        return data.data || [];
    },
    getById: async (id: number) => {
        const { data } = await http.get<BaseResponse<PatrolSchedule>>(`${baseUrl}/${id}`);

        return data.data;
    },
    delete: async (id: number) => {
        const { data } = await http.delete(`${baseUrl}/${id}`);

        return data;
    },
    getEnumStatuses: async (search?: string) => {
        return [
            {
                color: Colors.YELLOW,
                id: PatrolScheduleStatus.ONGOING,
                label: 'Đang diễn ra',
                name: 'Đang diễn ra',
                slug: 'ongoing',
                value: PatrolScheduleStatus.ONGOING,
            },
            {
                color: Colors.GREEN,
                id: PatrolScheduleStatus.FINISHED,
                label: 'Đã kết thúc',
                name: 'Đã kết thúc',
                slug: 'finished',
                value: PatrolScheduleStatus.FINISHED,
            },
            {
                color: Colors.RED,
                id: PatrolScheduleStatus.INACTIVE,
                label: 'Đã xóa',
                name: 'Đã xóa',
                slug: 'inactive',
                value: PatrolScheduleStatus.INACTIVE,
            },
        ] as EnumListItem[];
    },
};
