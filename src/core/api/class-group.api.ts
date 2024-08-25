import { Class } from '../models/class';
import { ClassGroup, ClassGroupStatus } from '../models/class-group';
import { EnumListItem, ResponseList } from '../models/common';
import { getColorWithUuId } from '../utils/api.helper';
import { Colors } from '../utils/colors.helper';
import http from './http';

export interface ICreateClassGroupDto extends Pick<ClassGroup, 'teacherId' | 'schoolId' | "name"> { }

export interface IUpdateClassGroupDto extends Pick<ClassGroup, 'teacherId' | 'schoolId' | 'classGroupId' | 'name'> { }
export interface ISearchClassGroupDto extends Omit<ClassGroup, 'classGroupId'> {
    sortOrder: 'asc' | 'desc';
}

const baseUrl = '/class-groups';

export const classGroupApi = {
    create: async (dto: ICreateClassGroupDto) => {
        const { data } = await http.post<Class>(`${baseUrl}`, dto);

        return data;
    },
    update: async (dto: IUpdateClassGroupDto) => {
        const { data } = await http.put<Class>(`${baseUrl}`, dto);

        return data;
    },
    getAll: async () => {
        const { data } = await http.get<ResponseList<ClassGroup>>(`${baseUrl}`, {
            params: {
                sortOrder: 'desc',
            },
        });

        return data.data;
    },
    getBySchool: async (id: number) => {
        const { data } = await http.get<ResponseList<ClassGroup>>(`${baseUrl}/school/${id}`);

        return data.data;
    },
    getByUser: async (id: number) => {
        const { data } = await http.get<ResponseList<ClassGroup>>(`${baseUrl}/user/${id}`);

        return data.data;
    },
    getById: async (id: number) => {
        const { data } = await http.get<ClassGroup>(`${baseUrl}/${id}`);

        return data;
    },
    delete: async (id: number) => {
        const { data } = await http.delete(`${baseUrl}/${id}`);

        return data;
    },
    search: async (dto: ISearchClassGroupDto) => {
        const { data } = await http.get<ResponseList<ClassGroup>>(`${baseUrl}/search`, {
            params: dto,
        });

        return data.data;
    },
    getEnumStatus: async (search?: string) => {
        const list = [
            {
                value: ClassGroupStatus.ACTIVE,
                color: Colors.GREEN,
                id: ClassGroupStatus.ACTIVE,
                label: 'Đang hoạt động',
                name: 'Đang hoạt động',
                slug: ClassGroupStatus.ACTIVE,
            },
            {
                value: ClassGroupStatus.INACTIVE,
                color: Colors.RED,
                id: ClassGroupStatus.INACTIVE,
                label: 'Đã xóa',
                name: 'Đã xóa',
                slug: ClassGroupStatus.INACTIVE,
            },
        ] as EnumListItem[];

        if (search) {
            return list.filter((item) => item.name.toLowerCase().includes(search.toLowerCase()));
        }

        return list;
    },
    getEnumSelectOptions: async (search?: string, schoolId?: number) => {
        const classGroups = schoolId ? await classGroupApi.getBySchool(schoolId) : await classGroupApi.getAll();

        const list = [] as EnumListItem[];

        for (const classGroup of classGroups) {
            if (classGroup.status === ClassGroupStatus.INACTIVE) {
                continue;
            }

            list.push({
                value: classGroup.classGroupId,
                color: getColorWithUuId(classGroup.classGroupId.toString()),
                id: classGroup.classGroupId,
                label: classGroup.name,
                name: classGroup.name,
                slug: classGroup.name,
            });
        }

        if (search) {
            return list.filter((item) => item.name.toLowerCase().includes(search.toLowerCase()));
        }

        return list;
    },
};
