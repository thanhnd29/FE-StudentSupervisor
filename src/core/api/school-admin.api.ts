// import { BaseResponse, EnumListItem, ResponseList } from '../models/common';
// import { SchoolAdmin } from '../models/school-admin';
// import { getColorWithId } from '../utils/api.helper';
// import http from './http';

// const baseUrl = '/school-admins';

// export const schoolAdminApi = {
//     getAll: async () => {
//         const { data } = await http.get<ResponseList<SchoolAdmin>>(`${baseUrl}`, {
//             params: {
//                 sortOrder: 'desc',
//             },
//         });

//         return data.data || [];
//     },
//     getById: async (id: number) => {
//         const { data } = await http.get<BaseResponse<SchoolAdmin>>(`${baseUrl}/${id}`);

//         return data.data;
//     },

//     getBuyUserId: async (userId: number) => {
//         const { data } = await http.get<BaseResponse<SchoolAdmin>>(`${baseUrl}/users/${userId}`);

//         return data.data;
//     },
//     getEnumSelectOptions: async (search?: string) => {
//         const schoolAdmins = await schoolAdminApi.getAll();

//         const list: EnumListItem[] = schoolAdmins.map((item) => {
//             const label = `${item.adminName} - ${item.schoolName}`;
//             return {
//                 id: item.schoolAdminId,
//                 label,
//                 color: getColorWithId(item.schoolAdminId),
//                 slug: label,
//                 name: label,
//                 value: item.schoolAdminId,
//             };
//         });

//         const list: EnumListItem[] = schoolAdmins.map((item) => {
//             const label = `${item.adminName} - ${item.schoolName}`;
//             return {
//                 id: item.schoolAdminId,
//                 label,
//                 color: getColorWithId(item.schoolAdminId),
//                 slug: label,
//                 name: label,
//                 value: item.schoolAdminId,
//             };
//         });


//         if (search) {
//             return list.filter((item) => item.label.toLowerCase().includes(search.toLowerCase()));
//         }

//         return list;
//     },
// };

import { BaseResponse, EnumListItem, ResponseList } from '../models/common';
import { SchoolAdmin } from '../models/school-admin';
import { getColorWithId } from '../utils/api.helper';
import http from './http';

const baseUrl = '/school-admins';

export const schoolAdminApi = {
    getAll: async () => {
        const { data } = await http.get<ResponseList<SchoolAdmin>>(`${baseUrl}`, {
            params: {
                sortOrder: 'desc',
            },
        });

        return data.data || [];
    },
    getById: async (id: number) => {
        const { data } = await http.get<BaseResponse<SchoolAdmin>>(`${baseUrl}/${id}`);

        return data.data;
    },

    getBuyUserId: async (userId: number) => {
        const { data } = await http.get<BaseResponse<SchoolAdmin>>(`${baseUrl}/users/${userId}`);

        return data.data;
    },
    getEnumSelectOptions: async (search?: string) => {
        const schoolAdmins = await schoolAdminApi.getAll();

        const list: EnumListItem[] = schoolAdmins.map((item) => {
            const label = `${item.adminName} - ${item.schoolName}`;
            return {
                id: item.schoolAdminId,
                label,
                color: getColorWithId(item.schoolAdminId),
                slug: label,
                name: label,
                value: item.schoolAdminId,
            };
        });

        const list: EnumListItem[] = schoolAdmins.map((item) => {
            const label = `${item.adminName} - ${item.schoolName}`;
            return {
                id: item.schoolAdminId,
                label,
                color: getColorWithId(item.schoolAdminId),
                slug: label,
                name: label,
                value: item.schoolAdminId,
            };
        });


        if (search) {
            return list.filter((item) => item.label.toLowerCase().includes(search.toLowerCase()));
        }

        return list;
    },
};
