import { EnumListItem, ResponseList } from '../models/common';
import { SchoolYear, SchoolYearStatus } from '../models/schoolYears';
import { getColorWithUuId } from '../utils/api.helper';
import { Colors } from '../utils/colors.helper';
import http from './http';

export interface ICreateSchoolYearDto extends Pick<SchoolYear, 'schoolId' | 'year' | 'startDate' | 'endDate'> { }

export interface IUpdateSchoolYearDto extends Pick<SchoolYear, 'schoolId' | 'year' | 'startDate' | 'endDate'> { }

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
    getBySchool: async (id: number) => {
        const { data } = await http.get<ResponseList<SchoolYear>>(`${baseUrl}/school/${id}`);

        return data.data;
    },
    getById: async (id: number) => {
        const { data } = await http.get<SchoolYear>(`${baseUrl}/${id}`);

        return data;
    },
    delete: async (id: number) => {
        const { data } = await http.delete(`${baseUrl}/${id}`);

        return data;
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
    getEnumStatuses: async (search?: string) => {
        return [
            {
                color: Colors.GREEN,
                id: SchoolYearStatus.ONGOING,
                label: 'Ongoing',
                name: 'Ongoing',
                slug: 'Ongoing',
                value: SchoolYearStatus.ONGOING,
            },
            {
                color: Colors.RED,
                id: SchoolYearStatus.INACTIVE,
                label: 'Inactive',
                name: 'Inactive',
                slug: 'Inactive',
                value: SchoolYearStatus.INACTIVE,
            },
            {
                color: Colors.BLUE,
                id: SchoolYearStatus.FINISHED,
                label: 'Finished',
                name: 'Finished',
                slug: 'Finished',
                value: SchoolYearStatus.FINISHED,
            },
        ] as EnumListItem[];
    },
};
