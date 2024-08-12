import { ResponseList } from '../models/common';
import { Violation } from '../models/violation';
import http from './http';

const baseUrl = '/dashboards';

export const validNumber = (number: number | string): string | number => {
    if (typeof number === 'string' || number <= 0) {
        return "";
    }
    return number;
}

const validString = (string: number | string): string | number => {
    if (typeof string === 'number') {
        return "";
    }
    return string;
}

export const dashboardApi = {
    getByMonthAndWeek: async (schoolId: number, year: number, month: number, weekNumber: number) => {
        const { data } = await http.get<ResponseList<Violation>>(`${baseUrl}/violations-by-month-and-week`, {
            params: {
                schoolId: schoolId,
                year: year,
                month: month,
                weekNumber: validNumber(weekNumber)
            }
        });

        return data.data;
    },
    getByYearAndClassname: async (schoolId: number, year: number, className: string, month: number, weekNumber: number) => {
        const { data } = await http.get<ResponseList<Violation>>(`${baseUrl}/violations-by-year-and-classname`, {
            params: {
                schoolId: schoolId,
                year: year,
                className: validString(className),
                month: month,
                weekNumber: validNumber(weekNumber)
            }
        });

        return data.data;
    },
    getFrequentViolations: async (schoolId: number, year: number, month: number, weekNumber: number) => {
        const { data } = await http.get<ResponseList<Violation>>(`${baseUrl}/top-5-frequent-violations`, {
            params: {
                schoolId: schoolId,
                year: year,
                month: month,
                weekNumber: validNumber(weekNumber)
            }
        });

        return data.data;
    },
    getClassesMostViolation: async (schoolId: number, year: number, month: number, weekNumber: number) => {
        const { data } = await http.get<ResponseList<Violation>>(`${baseUrl}/classes-most-violations`, {
            params: {
                schoolId: schoolId,
                year: year,
                month: month,
                weekNumber: validNumber(weekNumber)
            }
        });

        return data.data;
    },
    getTopStudentsMostViolations: async (schoolId: number, year: number, month: number, weekNumber: number) => {
        const { data } = await http.get<ResponseList<Violation>>(`${baseUrl}/top-5-students-most-violations`, {
            params: {
                schoolId: schoolId,
                year: year,
                month: month,
                weekNumber: validNumber(weekNumber)
            }
        });

        return data.data;
    },
    getTopClassStudentsMostViolations: async (schoolId: number, year: number, month: number, weekNumber: number) => {
        const { data } = await http.get<ResponseList<Violation>>(`${baseUrl}/class-with-most-students-violations`, {
            params: {
                schoolId: schoolId,
                year: year,
                month: month,
                weekNumber: validNumber(weekNumber)
            }
        });

        return data.data;
    },
    getYear: async (schoolId: number, year: number) => {
        const { data } = await http.get<ResponseList<Violation>>(`${baseUrl}/count-violations-by-year`, {
            params: {
                schoolId: schoolId,
                year: year,
            }
        });

        return data.data;
    },
    getMonth: async (schoolId: number, year: number, month: number) => {
        const { data } = await http.get<ResponseList<Violation>>(`${baseUrl}/count-violations-by-year-month`, {
            params: {
                schoolId: schoolId,
                year: year,
                month: month
            }
        });

        return data.data;
    },
    getWeek: async (schoolId: number, year: number, month: number, weekNumber: number) => {
        const { data } = await http.get<ResponseList<Violation>>(`${baseUrl}/count-violations-by-year-month-week`, {
            params: {
                schoolId: schoolId,
                year: year,
                month: month,
                weekNumber: validNumber(weekNumber)
            }
        });

        return data.data;
    },
    getHistoryViolations: async (code: string) => {
        const { data } = await http.get<ResponseList<Violation>>(`${baseUrl}/students/${code}`);

        return data.data;
    },
};
