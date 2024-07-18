export enum PackageTypeStatus {
    INACTIVE = 'INACTIVE',
    ACTIVE = 'ACTIVE',
}

export interface PackageType {
    packageTypeId: number;
    name: string;
    description: string;
    status: PackageTypeStatus;
}
