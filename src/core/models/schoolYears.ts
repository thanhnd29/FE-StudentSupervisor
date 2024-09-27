export interface SchoolYear {
    schoolYearId: number;
    year: number;
    startDate: string;
    endDate: string;
    schoolId: number;
    schoolName: string;
    status: SchoolYearStatus;
    semester1StartDate: string,
    semester1EndDate: string,
    semester2StartDate: string,
    semester2EndDate: string,
}

export enum SchoolYearStatus {
    ONGOING = 'ONGOING',
    FINISHED = 'FINISHED',
    INACTIVE = 'INACTIVE',
}

