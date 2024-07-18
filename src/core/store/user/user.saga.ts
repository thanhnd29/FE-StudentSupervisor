import _get from 'lodash/get';
import { decodeToken } from 'react-jwt';
import { call, put, select, takeLatest } from 'redux-saga/effects';

import { userApi } from '@/core/api/user.api';

import { UserState, userActions } from './index';

function* getCurrentUser(): any {
    try {
        const state = (yield select((item) => item.user)) as UserState;
        let phone = _get(decodeToken(state.token), 'sub') as unknown as string;
        const users = yield call(userApi.getAll);
        const admin = yield call(userApi.getAllAdmin);

        let user = admin.find((item: any) => item.phone === phone);
        if (!user) {
            user = users.find((item: any) => item.phone === phone);
        }

        yield put(userActions.setUser({ ...user }));
    } catch (error) {
        yield put(userActions.setLoginFailed());
    }
}

export default function* userSaga() {
    yield takeLatest(userActions.setToken, getCurrentUser);
}
