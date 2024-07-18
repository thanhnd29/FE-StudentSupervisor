import { call, put, takeLatest } from 'redux-saga/effects';

import { apiActions } from '.';

function* getAllUserRole(): any {
    yield put(apiActions.setRoles([]));
}

export default function* apiSaga() {
    yield takeLatest(apiActions.getRoles, getAllUserRole);
}
