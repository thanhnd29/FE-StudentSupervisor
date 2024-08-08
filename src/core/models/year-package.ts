export interface YearPackage {
    schoolYearId: number;
    packageId: number;
    numberOfStudent: number;
    code: string;
    schoolName: string;
    packageName: string;
    year: number;
    status: string;
}

export enum YearPackageStatus {
    VALID = 'VALID',
    EXPIRED = 'EXPIRED'
}
