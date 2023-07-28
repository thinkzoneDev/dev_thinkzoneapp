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
import {showMessage} from 'react-native-flash-message';
import Colors from '../../utils/Colors';
import * as userscall from '../slices/UserCallSlice';
import {
  getCallRecordsbyid,
  getCallActivitiesApi,
  saveCallActivityApi,
} from '../api/UserCallApi';

export function* getCallRecords({payload}) {
  try {
    const res = yield call(getCallRecordsbyid);
    console.log(res.data, 'res');
    if (res.length == 0) {
      yield put(userscall.getCallrecordError());
    } else {
      yield put(userscall.getCallrecordSuccess(res.data));
    }
  } catch (e) {
    yield put(userscall.getCallrecordError());
  }
}
export function* ongetCallrecord() {
  yield takeEvery(userscall.getCallrecordStart, getCallRecords);
}

// export function* getCallActivities({payload}) {
//   try {
//     // const language = "od";
//     // const subject = "pge";
//     const res = yield call(getCallActivitiesApi);

//     if (res.data.length > 0) {
//       console.log('call response1-->', res.data);

//       yield put(userscall.getCallActivitySuccess(res.data));
//     } else {
//       console.log('length not found');
//     }
//   } catch (error) {
//     console.log('error');
//   }
// }

// export function* ongetCallActivities() {
//   yield takeEvery(userscall.getCallActivityStart, getCallActivities);
// }

export function* postCallActivities({payload}) {
  try {
    const res = yield call(saveCallActivityApi, payload);
    console.log('postres-->', res.data);
    if (res.status === 200) {
      // yield put(studentstypes.postAttendanceSuccess(res.data));
      showMessage({
        message: `Successfully Call Response Taken.`,
        //description: 'Successfully Call Response Taken..',
        type: 'success',
        backgroundColor: Colors.success,
      });
    }
  } catch (error) {
    console.log(error);
  }
}

export function* onPostCallActivities() {
  yield takeEvery(userscall.postCallActivityStart, postCallActivities);
}

export const UserCallSagas = [
  fork(ongetCallrecord),
  // fork(ongetCallActivities),
  fork(onPostCallActivities),
];
