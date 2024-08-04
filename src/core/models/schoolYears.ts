export interface SchoolYear {
    schoolYearId: number;
    year: number;
    startDate: string;
    endDate: string;
    schoolId: number;
    schoolName: string;
    status: SchoolYearStatus;
}

export enum SchoolYearStatus {
    ONGOING = 'ONGOING',
    FINISHED = 'FINISHED',
    INACTIVE = 'INACTIVE',
}

