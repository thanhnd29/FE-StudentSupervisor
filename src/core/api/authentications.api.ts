import { User } from '../models/user';
import http from './http';

export interface ILoginUserDto extends Pick<User, 'phone' | 'password'> {}

const baseUrl = '/auths';

export const authenticationApi = {
    login: async (user: ILoginUserDto) => {
        const { data } = await http.post<User>(`${baseUrl}/login`, user);

        return data;
    },
};
