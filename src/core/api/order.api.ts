import { BaseResponse, EnumListItem, ResponseList } from '../models/common';
import { OrderStatus, OrderType } from '../models/order';
import { getColorWithId } from '../utils/api.helper';
import { Colors } from '../utils/colors.helper';
import http from './http';

const baseUrl = '/orders';

export const orderApi = {
    getAll: async () => {
        const { data } = await http.get<ResponseList<OrderType>>(`${baseUrl}`, {
            params: {
                sortOrder: 'desc',
            },
        });

        return data.data || [];
    },
    getBySchool: async () => {
        const { data } = await http.get<ResponseList<OrderType>>(`${baseUrl}/school-admin`, {
            params: {
                sortOrder: 'desc',
            },
        });

        return data.data || [];
    },
    getByAdmin: async () => {
        const { data } = await http.get<ResponseList<OrderType>>(`${baseUrl}/admin`, {
            params: {
                sortOrder: 'desc',
            },
        });

        return data.data || [];
    },
    getById: async (id: number) => {
        const { data } = await http.get<BaseResponse<OrderType>>(`${baseUrl}/${id}`);

        return data.data;
    },
    getEnumSelectOptions: async (search?: string, schoolId?: string) => {
        const packages = schoolId ? await orderApi.getBySchool() : await orderApi.getByAdmin()

        const list: EnumListItem[] = packages.map((item) => ({
            id: item.orderId,
            label: item.packageName,
            color: getColorWithId(item.orderId),
            slug: item.packageName,
            name: item.packageName,
            value: item.orderId,
        }));

        if (search) {
            return list.filter((item) => item.label.toLowerCase().includes(search.toLowerCase()));
        }

        return list;
    },
    getEnumStatuses: async (search?: string) => {
        return [
            {
                color: Colors.GREEN,
                id: OrderStatus.PAID,
                label: 'Đã thanh toán',
                name: 'Đã thanh toán',
                slug: 'paid',
                value: OrderStatus.PAID,
            },
            {
                color: Colors.RED,
                id: OrderStatus.CANCELLED,
                label: 'Đã hủy',
                name: 'Đã hủy',
                slug: 'cancelled',
                value: OrderStatus.CANCELLED,
            },
            {
                color: Colors.BLUE,
                id: OrderStatus.PENDING,
                label: 'Chờ xử lý',
                name: 'Chờ xử lý',
                slug: 'pending',
                value: OrderStatus.PENDING,
            },
        ] as EnumListItem[];
    },
};
