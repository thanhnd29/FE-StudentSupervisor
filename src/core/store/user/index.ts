import { PayloadAction, createSlice } from '@reduxjs/toolkit';

import { SystemRole, User } from '../../models/user';

export interface UserState {
    isAuth: boolean;
    isLogin: boolean;
    token: string;
    userId: number;
    schoolAdminId: number;
    roleId: number;
    roleName: number;
    code: string;
    name: string;
    phone: string;
    password: string;
    address: string;
    isAdmin: boolean;
    isSchoolAdmin: boolean;
    isPrincipal: boolean;
    isSupervisor: boolean;
    isTeacher: boolean;
    isStudentSupervisor: boolean;
}

const initialState: UserState = {
    token: '',
    isAuth: false,
    isLogin: false,
    userId: 0,
    schoolAdminId: 0,
    roleId: 0,
    roleName: 0,
    code: '',
    name: '',
    phone: '',
    password: '',
    address: '',
    isAdmin: false,
    isSchoolAdmin: false,
    isPrincipal: false,
    isSupervisor: false,
    isTeacher: false,
    isStudentSupervisor: false,
};

const reducer = createSlice({
    name: 'user',
    initialState,
    reducers: {
        resetState: () => ({ ...initialState }),
        setToken: (state, action) => {
            const newState = { ...state };
            newState.token = action.payload;

            return newState;
        },
        setUser: (state, action: PayloadAction<User>) => {
            const newState = { ...state };
            console.log(action.payload);
            newState.isAuth = true;
            newState.isLogin = true;

            newState.userId = action.payload?.userId || action.payload?.adminId;
            newState.schoolAdminId = action.payload?.schoolAdminId;
            newState.roleId = action.payload?.roleId;
            newState.roleName = action.payload?.roleName;
            newState.code = action.payload?.code;
            newState.name = action.payload?.name || action.payload?.userName;

            newState.phone = action.payload?.phone;
            newState.password = action.payload?.password;
            newState.address = action.payload?.address;
            newState.isAdmin = action.payload.roleId === SystemRole.ADMIN;
            newState.isSchoolAdmin = action.payload.roleId === SystemRole.SCHOOL_ADMIN;
            newState.isPrincipal = action.payload.roleId === SystemRole.PRINCIPAL;
            newState.isSupervisor = action.payload.roleId === SystemRole.SUPERVISOR;
            newState.isTeacher = action.payload.roleId === SystemRole.TEACHER;
            newState.isStudentSupervisor = action.payload.roleId === SystemRole.STUDENT_SUPERVISOR;

            return newState;
        },

        setLoginFailed: (state) => {
            const newState = { ...state };
            newState.isAuth = false;
            newState.isLogin = true;
            return newState;
        },
    },
});

export const userActions = {
    ...reducer.actions,
};
export const userReducer = reducer.reducer;
