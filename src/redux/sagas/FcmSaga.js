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
import * as fcmtypes from '../slices/FcmSlice';
import {showMessage} from 'react-native-flash-message';
import Colors from '../../utils/Colors';
import {Alert} from 'react-native';
import storage from '../../utils/AsyncStorage';

// Get All Students by teacherId from API
export function* getFcmMessages({payload}) {
  console.log(payload, 'called fcm saga');
  const data = storage.storeObject('@fcm_message', payload);
  try {
    yield put(fcmtypes.getfcmMessageSuccess(payload));
  } catch (e) {
    yield put(fcmtypes.getfcmMessageError(e));
  }
}
export function* ongetFcmMessage() {
  yield takeEvery(fcmtypes.getfcmMessage, getFcmMessages);
}

// Get All Students by teacherId from API
export function* getFcmMessagesfromstore({}) {
  // console.log(payload, 'called fcm saga');
  const res = yield call(storage.getObject, '@fcm_message');
  try {
    yield put(fcmtypes.getfcmMessageSuccessstore(res));
  } catch (e) {
    yield put(fcmtypes.getfcmMessageErrorstore(e));
  }
}
export function* ongetFcmMessagestore() {
  yield takeEvery(fcmtypes.getfcmMessagestore, getFcmMessagesfromstore);
}

// Get All Students by teacherId from API
export function* clearFcmMessages({}) {
  //   console.log(payload, 'called fcm saga clear');
  const res = storage.removeValue('@fcm_message');
  console.log('fcm message--->', res);
  try {
    yield put(fcmtypes.clearfcmMessageSuccess());
  } catch (e) {
    yield put(fcmtypes.clearfcmMessageError(e));
  }
}
export function* onclearFcmMessage() {
  yield takeEvery(fcmtypes.clearfcmMessage, clearFcmMessages);
}

export const FcmSagas = [
  fork(ongetFcmMessage),
  fork(onclearFcmMessage),
  fork(ongetFcmMessagestore),
];
