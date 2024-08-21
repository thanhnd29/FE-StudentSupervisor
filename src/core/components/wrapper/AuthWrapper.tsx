'use client';

import * as React from 'react';

import { useSelector } from 'react-redux';

import { NKConstant } from '@/core/NKConstant';
import { useNKPathname } from '@/core/routing/hooks/NKPathname';
import { useNKRouter } from '@/core/routing/hooks/NKRouter';
import { RootState, store } from '@/core/store';
import { userActions, UserState } from '@/core/store/user';

interface AuthWrapperProps {
    children: React.ReactNode;
}

const AuthWrapper: React.FC<AuthWrapperProps> = ({ children }) => {
    const { isAuth, isLogin, isStudentSupervisor } = useSelector<RootState, UserState>((state) => state.user);
    const router = useNKRouter();
    const pathName = useNKPathname();

    React.useEffect(() => {
        if (isAuth && pathName === NKConstant.AUTH_FAILED_FALLBACK_ROUTE) {
            router.push(NKConstant.AUTH_SUCCESS_FALLBACK_ROUTE);
        }

        if (isLogin && !isAuth) {
            router.push(NKConstant.AUTH_FAILED_FALLBACK_ROUTE);
        }

        if (!isLogin || !isAuth) {
            router.push(NKConstant.AUTH_FAILED_FALLBACK_ROUTE);
        }

        if(isLogin && isAuth && isStudentSupervisor){
            store.dispatch(userActions.resetState());
        }

    }, [isAuth, pathName, isLogin, isStudentSupervisor]);

    return <>{children}</>;
};

export default AuthWrapper;
