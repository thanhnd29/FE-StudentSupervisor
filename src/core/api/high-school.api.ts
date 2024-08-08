import { BaseResponse, EnumListItem, ResponseList } from '../models/common';
import { HighSchool, HighSchoolStatus } from '../models/highSchools';
import { Colors } from '../utils/colors.helper';
import http from './http';

export interface ICreateHighSchoolDto extends Pick<HighSchool, 'code' | 'name' | 'address' | 'phone' | 'imageUrl' | 'webUrl'> { }

export interface IUpdateHighSchoolDto extends Pick<HighSchool, 'code' | 'name' | 'address' | 'phone' | 'imageUrl' | 'webUrl'> { }

const baseUrl = '/highschools';

export const highSchoolApi = {
    create: async (dto: ICreateHighSchoolDto) => {
        const { data } = await http.post<HighSchool>(`${baseUrl}`, dto);

        return data;
    },
    update: async (id: number, dto: IUpdateHighSchoolDto) => {
        const { data } = await http.put<HighSchool>(`${baseUrl}/${id}`, dto);

        return data;
    },
    getAll: async () => {
        const { data } = await http.get<ResponseList<HighSchool>>(`${baseUrl}`, {
            params: {
                sortOrder: 'desc',
            },
        });

        return data.data;
    },
    getById: async (id: number) => {
        const { data } = await http.get<BaseResponse<HighSchool>>(`${baseUrl}/${id}`);

        return data.data;
    },
    delete: async (id: number) => {
        const { data } = await http.delete(`${baseUrl}/${id}`);

        return data;
    },
    getEnumStatus: async () => {
        return [
            {
                value: HighSchoolStatus.ACTIVE,
                color: Colors.GREEN,
                label: 'Active',
                id: HighSchoolStatus.ACTIVE,
                name: 'Active',
                slug: HighSchoolStatus.ACTIVE,
            },
            {
                value: HighSchoolStatus.INACTIVE,
                color: Colors.RED,
                label: 'Inactive',
                id: HighSchoolStatus.INACTIVE,
                name: 'Inactive',
                slug: HighSchoolStatus.INACTIVE,
            },
        ] as EnumListItem[];
    },

    getEnumSelectOptions: async (search?: string) => {
        const highSchools = await highSchoolApi.getAll();

        const list: EnumListItem[] = [];

        for (const highSchool of highSchools) {
            if (highSchool.status === HighSchoolStatus.INACTIVE) continue;

            list.push({
                value: highSchool.schoolId,
                label: highSchool.name.toString(),
                color: Colors.GREEN,
                id: highSchool.schoolId.toString(),
                name: highSchool.name.toString(),
                slug: highSchool.schoolId.toString(),
            });
        }

        if (search) {
            return list.filter((item) => item.name.toLowerCase().includes(search.toLowerCase()));
        }

        return list;
    },
};
