import { EnumListItem, ResponseList } from '../models/common';
import { getColorWithUuId } from '../utils/api.helper';
import http from './http';

export interface ICreateSchoolYearDto extends Pick<SchoolYear, 'schoolId' | 'year' | 'startDate' | 'endDate'> {}

export interface IUpdateSchoolYearDto extends Pick<SchoolYear, 'schoolId' | 'year' | 'startDate' | 'endDate'> {}

const baseUrl = '/school-years';

export const schoolYearApi = {
    create: async (dto: ICreateSchoolYearDto) => {
        const { data } = await http.post<SchoolYear>(`${baseUrl}`, dto);

        return data;
    },
    update: async (id: number, dto: IUpdateSchoolYearDto) => {
        const { data } = await http.put<SchoolYear>(`${baseUrl}/${id}`, dto);

        return data;
    },
    getAll: async () => {
        const { data } = await http.get<ResponseList<SchoolYear>>(`${baseUrl}`);

        return data.data;
    },
    getById: async (id: number) => {
        const { data } = await http.get<SchoolYear>(`${baseUrl}/${id}`);

        return data;
    },
    delete: async (id: number) => {
        await http.delete(`${baseUrl}/${id}`);
    },

    getEnumSelectOptions: async ({ highSchoolId, search, withSchoolName }: { search?: string; highSchoolId?: number; withSchoolName?: boolean }) => {
        let schoolYears = await schoolYearApi.getAll();

        if (highSchoolId) {
            schoolYears = schoolYears.filter((schoolYear) => schoolYear.schoolId === highSchoolId);
        }

        let list: EnumListItem[] = schoolYears.map((schoolYear) => ({
            value: schoolYear.schoolYearId,
            label: schoolYear.schoolName.toString(),
            color: getColorWithUuId(schoolYear.schoolYearId.toString()),
            id: schoolYear.schoolYearId.toString(),
            name: withSchoolName ? `${schoolYear.schoolName} - ${schoolYear.year}` : schoolYear.year.toString(),
            slug: schoolYear.schoolYearId.toString(),
        }));

        if (search) {
            return list.filter((item) => item.name.toLowerCase().includes(search.toLowerCase()));
        }

        return list;
    },
};
