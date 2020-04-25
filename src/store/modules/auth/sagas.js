import { takeLatest, all, call, put, select } from 'redux-saga/effects';
import { AsyncStorage } from 'react-native';
import api from '~/services/api';

import { signInSuccess, getPermissionsSuccess } from './actions';

export function* signIn({ payload }) {
  try {
    const { email, password } = payload;

    const response = yield call(api.post, 'sessions', { email, password });

    yield call([AsyncStorage, 'setItem'], '@Omni:token', response.data.token);

    yield put(signInSuccess(response.data.token));
    // yield put(push('/'));
  } catch (err) {
    console.log('ERRO');
  }
}

export function* signOut() {
  yield call([AsyncStorage, 'clear']);

  // yield put(push('/signin'));
}

export function* getPermissions() {
  const team = yield select(state => state.teams.active);
  const signedIn = yield select(state => state.auth.signedIn);

  if (!signedIn || !team) {
    return;
  }

  const response = yield call(api.get, 'permissions');

  const { roles, permissions } = response.data;

  yield put(getPermissionsSuccess(roles, permissions));
}

export default all([
  takeLatest('@auth/SIGN_IN_REQUEST', signIn),
  takeLatest('@auth/SIGN_OUT', signOut),
]);
