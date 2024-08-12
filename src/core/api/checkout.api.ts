import http from './http';

const baseUrl = '/checkout';

export const checkoutApi = {
    create: async (packageId: number) => {
        const { data } = await http.post(`${baseUrl}`, {
            packageID: packageId
        });
        
        return data;
    },
}
