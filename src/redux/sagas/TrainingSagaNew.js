import {put, delay, fork, call, takeEvery} from 'redux-saga/effects';
import * as types from '../slices/TrainingSliceNew';
import {
  getModuleAPI,
  getContentdetailsAPI,
  getUserTrainingDetailsApi,
  getpptModuleAPI,
  getpptContentdetailsAPI,
  getpptUserTrainingDetailsApi,
} from '../api/TrainingApiNew';

//get module data saga
//monthly
export function* getModuleSaga({payload}) {
  try {
    const res = yield call(getModuleAPI, payload.d_data);
    console.log('module res-->', payload.d_data);
    if (res.status === 200) {
      yield put(types.getModuleSuccess(res.data));
      console.log('module res2-->', res.data);
    } else {
      yield put(types.getModuleError(res.data));
    }
  } catch {
    yield put(types.getModuleError(res.data));
  }
}
export function* getModuleStart() {
  yield takeEvery(types.getModuleStart, getModuleSaga);
}
export function* getContentDetailsSaga({payload}) {
  console.log('payload data--->', payload.data);
  //
  try {
    const res = yield call(getContentdetailsAPI, payload.data);
    console.log('res error----->', res.data);
    if (res.status == 200) {
      yield put(types.getContentDetailsSuccess(res.data));
    } else {
      yield put(types.getContentDetailsError(res.data));
    }
  } catch (e) {
    //
    yield put(types.getContentDetailsError(e));
  }
}
export function* getContentDetails() {
  yield takeEvery(types.getContentDetailsstart, getContentDetailsSaga);
}

export function* getUserTrainingDetailsSaga({payload}) {
  try {
    const res = yield call(getUserTrainingDetailsApi, payload.data1);

    if (res.status == 200) {
      yield put(types.getUserTrainingDetailsSuccess(res.data));
    } else {
      yield put(types.getUserTrainingDetailsError(res.data));
    }
  } catch (e) {
    //
    yield put(types.getUserTrainingDetailsError(e));
  }
}
export function* getUserTrainingDetails() {
  yield takeEvery(
    types.getUserTrainingDetailsStart,
    getUserTrainingDetailsSaga,
  );
}

//ppt
export function* getpptModuleSaga({payload}) {
  //
  try {
    const res = yield call(getpptModuleAPI, payload.d_data);
    //
    if (res.status === 200) {
      yield put(types.getPPTModuleSuccess(res.data));
    } else {
      yield put(types.getPPTModuleError(res.data));
    }
  } catch {
    yield put(types.getPPTModuleError(res.data));
  }
}
export function* getpptModuleStart() {
  yield takeEvery(types.getPPTModuleStart, getpptModuleSaga);
}
export function* getpptContentDetailsSaga({payload}) {
  //
  try {
    const res = yield call(getpptContentdetailsAPI, payload.data1);
    console.log('res ppt--------->', res);
    //
    if (res.status == 200) {
      yield put(types.getPPTContentDetailsSuccess(res.data));
    } else {
      yield put(types.getPPTContentDetailsError(res.data));
    }
  } catch (e) {
    yield put(types.getPPTContentDetailsError(e));
  }
}
export function* getpptContentDetails() {
  yield takeEvery(types.getPPTContentDetailsstart, getpptContentDetailsSaga);
}

export function* getpptUserTrainingDetailsSaga({payload}) {
  try {
    const res = yield call(getpptUserTrainingDetailsApi, payload.data1);
    //
    if (res.status == 200) {
      yield put(types.getPPTUserTrainingDetailsSuccess(res.data));
    } else {
      yield put(types.getPPTUserTrainingDetailsError(res.data));
    }
  } catch (e) {
    //
    yield put(types.getPPTUserTrainingDetailsError(e));
  }
}
export function* getpptUserTrainingDetails() {
  yield takeEvery(
    types.getPPTUserTrainingDetailsStart,
    getpptUserTrainingDetailsSaga,
  );
}

export const TrainingSagaNew = [
  fork(getModuleStart),
  fork(getContentDetails),
  fork(getUserTrainingDetails),
  fork(getpptModuleStart),
  fork(getpptContentDetails),
  fork(getpptUserTrainingDetails),
];
