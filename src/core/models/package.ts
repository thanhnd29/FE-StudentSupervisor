export enum PackageStatus {
    INACTIVE = 'INACTIVE',
    ACTIVE = 'ACTIVE',
}

export interface Package {
    name: string;
    description: string;
    registeredDate: string;
    price: number;
    type: string;
    packageId: number;
    status: PackageStatus;
    totalStudents: number;
    totalViolations: number;
    packageTypeId: number;
}
