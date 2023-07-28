import {
  take,
  takeEvery,
  takeLatest,
  put,
  all,
  delay,
  fork,
  call,
} from 'redux-saga/effects';
import {UserSagas} from '../sagas/UserSaga';
import {UserCallSagas} from '../sagas/UserCallSaga';
import {StudentSagas} from '../sagas/StudentSaga';
import {TrainingSaga} from '../sagas/TrainingSaga';
import {TrainingSagaNew} from '../sagas/TrainingSagaNew';
import {FcmSagas} from '../sagas/FcmSaga';

export default function* RootSaga() {
  yield all([
    ...UserSagas,
    ...UserCallSagas,
    ...StudentSagas,
    ...TrainingSaga,
    ...FcmSagas,
    ...TrainingSagaNew,
  ]);
}
