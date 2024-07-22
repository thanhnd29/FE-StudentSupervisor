// import { Class } from '../models/class';
// import { BaseResponse, EnumListItem, ResponseList } from '../models/common';
// import { getColorWithId } from '../utils/api.helper';
// import http from './http';

// export interface ICreateClassDto extends Omit<Class, 'classId'> { }

// export interface IUpdateClassDto extends Class { }

// const baseUrl = '/classes';

// export const classApi = {
//     create: async (dto: ICreateClassDto) => {
//         const { data } = await http.post<Class>(`${baseUrl}`, dto);

//         return data;
//     },
//     update: async (dto: IUpdateClassDto) => {
//         const { data } = await http.put<Class>(`${baseUrl}`, dto);

//         return data;
//     },
//     getAll: async () => {
//         const { data } = await http.get<ResponseList<Class>>(`${baseUrl}`, {
//             params: {
//                 sortOrder: 'desc',
//             },
//         });

//         return data.data;
//     },
//     getBySchool: async (id: number) => {
//         const { data } = await http.get<ResponseList<Class>>(`${baseUrl}/school/${id}`);

//         return data.data;
//     },
//     getById: async (id: number) => {
//         const { data } = await http.get<BaseResponse<Class>>(`${baseUrl}/${id}`);

//         return data.data;
//     },
//     delete: async (id: number) => {
//         await http.delete(`${baseUrl}/${id}`);
//     },
//     getEnumSelectOptions: async (search?: string) => {
//         const classes = await classApi.getAll();

//         const list: EnumListItem[] = classes
//             .map((item) => ({
//                 id: item.classId,
//                 label: item.name,
//                 color: getColorWithId(item.classId),
//                 slug: item.name,
//                 name: item.name,
//                 value: item.classId,
//             }))
//             .sort((a, b) => a.label.localeCompare(b.label));

//         if (search) {
//             return list.filter((item) => item.label.toLowerCase().includes(search.toLowerCase()));
//         }

//         return list;
//     },
// };


import { Class } from '../models/class';
import { ClassGroup, ClassGroupStatus } from '../models/class-group';
import { EnumListItem, ResponseList } from '../models/common';
import { getColorWithUuId } from '../utils/api.helper';
import { Colors } from '../utils/colors.helper';
import http from './http';

export interface ICreateClassGroupDto extends Omit<ClassGroup, 'classGroupId'> {}

export interface IUpdateClassGroupDto extends ClassGroup {}
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
    getById: async (id: number) => {
        const { data } = await http.get<ClassGroup>(`${baseUrl}/${id}`);

        return data;
    },
    delete: async (id: number) => {
        await http.delete(`${baseUrl}/${id}`);
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
                label: 'Active',
                name: 'Active',
                slug: ClassGroupStatus.ACTIVE,
            },
            {
                value: ClassGroupStatus.INACTIVE,
                color: Colors.RED,
                id: ClassGroupStatus.INACTIVE,
                label: 'Inactive',
                name: 'Inactive',
                slug: ClassGroupStatus.INACTIVE,
            },
        ] as EnumListItem[];

        if (search) {
            return list.filter((item) => item.name.toLowerCase().includes(search.toLowerCase()));
        }

        return list;
    },

    getEnumSelectOptions: async (search?: string) => {
        const classGroups = await classGroupApi.getAll();

        const list = [] as EnumListItem[];

        for (const classGroup of classGroups) {
            if (classGroup.status === ClassGroupStatus.INACTIVE) {
                continue;
            }

            list.push({
                value: classGroup.classGroupId,
                color: getColorWithUuId(classGroup.classGroupId.toString()),
                id: classGroup.classGroupId,
                label: classGroup.classGroupName,
                name: classGroup.classGroupName,
                slug: classGroup.classGroupName,
            });
        }

        if (search) {
            return list.filter((item) => item.name.toLowerCase().includes(search.toLowerCase()));
        }

        return list;
    },
};
