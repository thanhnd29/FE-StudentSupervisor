export interface OrderType {
    orderId: number,
    schoolName: string,
    packageName: string,
    total: number,
    amountPaid: number,
    amountRemaining: number,
    date: string,
    status: string,
    totalRevenue: number
}

export enum OrderStatus {
    PAID = 'PAID',
    PENDING = 'PENDING',
    CANCELLED = 'CANCELLED'
}