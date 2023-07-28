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
import * as studentstypes from '../slices/StudentSlice';
import {
  loadSudentsApi,
  createStudentApi,
  getAttendanceReportApi,
  getAttendanceListApi,
  postAttendanceListApi,
  deleteStudentApi,
  updateStudentApi,
  getStudentListforAttendanceApi,
} from '../api/StudentApi';
import {showMessage} from 'react-native-flash-message';
import Colors from '../../utils/Colors';
import {Alert} from 'react-native';

// Get All Students by teacherId from API
export function* getAllStudents({payload}) {
  // console.log(payload, 'called');
  try {
    const res = yield call(loadSudentsApi, payload);
    console.log(res, 'res student list');
    if (res.data.length >= 0) {
      yield put(studentstypes.getStudentSuccess(res.data));
    }
  } catch (e) {
    yield put(studentstypes.getStudentError(e));
  }
}
export function* ongetStudent() {
  yield takeEvery(studentstypes.getStudentStart, getAllStudents);
}

// Create Student
export function* createStudent({payload}) {
  // console.log(payload, 'studentslice');
  try {
    const res = yield call(createStudentApi, payload);
    if (res.status === 200) {
      showMessage({
        message: `Successfully Registerd`,
        // description: 'Successfully student registered.',
        type: 'success',
        backgroundColor: Colors.success,
      });
      yield put(studentstypes.createStudentSuccess(res.data));
    }
  } catch (e) {
    yield put(studentstypes.createStudentError(e.message));
  }
}
export function* oncreateStudent() {
  yield takeEvery(studentstypes.createStudentStart, createStudent);
}

//Get Student Attendance report
export function* getAttendanceReport({payload}) {
  try {
    const res = yield call(getAttendanceReportApi, payload);
    // console.log(res.data, 'getAttendanceReportStart');
    if (res.status === 200) {
      yield put(studentstypes.getAttendanceReportSuccess(res.data));
    }
  } catch (e) {
    yield put(studentstypes.getAttendanceReportError(e.message));
  }
}
export function* ongetAttendanceReport() {
  yield takeEvery(studentstypes.getAttendanceReportStart, getAttendanceReport);
}

//Get Student AttendanceList by teacherId and selected date
export function* getAttendanceList({payload}) {
  try {
    // console.log(payload, 'payload');
    const res = yield call(getAttendanceListApi, payload);
    // console.log(res.data, 200);
    if (res.status === 200) {
      yield put(studentstypes.getAttendanceListSuccess(res.data));
    }
  } catch (e) {
    yield put(studentstypes.getAttendanceListError(e.message));
  }
}
export function* ongetAttendanceList() {
  yield takeEvery(studentstypes.getAttendanceListStart, getAttendanceList);
}

//Delete Student
export function* deleteStudentdata({payload}) {
  try {
    const res = yield call(deleteStudentApi, payload);
    // console.log(res, 200);
    if (res.status === 200) {
      console.log(res.data, 'message Called');

      showMessage({
        message: `Successfully Deleted Student.`,
        // description: 'Successfully student deleted.',
        type: 'success',
        backgroundColor: Colors.danger,
      });
      yield put(studentstypes.deleteStudentSuccess(res.data));
      yield takeEvery(studentstypes.getStudentStart, getAllStudents);
    }
  } catch (e) {
    yield put(studentstypes.deleteStudentError(e.message));
  }
}
export function* ondeleteStudent() {
  yield takeEvery(studentstypes.deleteStudentStart, deleteStudentdata);
}
// export function* deleteStudentdata({payload}) {
//   try {
//      console.log(payload, 'payload');
//     const res = yield call(deleteStudentApi, payload);
//     // console.log(res.data, 200);
//     if (res.status === 200) {
//       yield put(studentstypes.deleteStudentSuccess(res.data));
//       yield takeEvery(studentstypes.getStudentStart, getAllStudents);
//     }
//   } catch (e) {
//     yield put(studentstypes.deleteStudentError(e.message));
//   }
// }
// export function* ondeleteStudent() {
//   yield takeEvery(studentstypes.deleteStudentStart, deleteStudentdata);
// }

//Update Student
export function* updateStudentdata({payload}) {
  // console.log(payload.studentUpdateDetails.userid, 'payload');
  try {
    const res = yield call(updateStudentApi, payload);
    // console.log(res.data, 200);
    if (res.status === 200) {
      showMessage({
        message: `Successfully Update Student.`,
        // description: 'Successfully student update.',
        type: 'success',
        backgroundColor: Colors.success,
      });
      try {
        const res = yield call(
          loadSudentsApi,
          payload.studentUpdateDetails.userid,
        );

        if (res.data.length > 0) {
          // yield put(studentstypes.getStudentSuccess(res.data));
          yield put(studentstypes.updateStudentSuccess(res.data));
        }
      } catch (e) {
        // yield put(studentstypes.getStudentError(e));
        yield put(studentstypes.updateStudentError(e.message));
      }
      // yield put(studentstypes.updateStudentSuccess(res.data));
      // yield takeEvery(studentstypes.getStudentStart, getAllStudents);
    }
  } catch (e) {
    yield put(studentstypes.updateStudentError(e.message));
  }
}
export function* onupdateStudent() {
  yield takeEvery(studentstypes.updateStudentStart, updateStudentdata);
}

//Post Student AttendanceList by teacherId and selected date
export function* postAttendanceList({payload}) {
  try {
    const res = yield call(postAttendanceListApi, payload);
    // console.log(res.data, 200);
    if (res.status === 200) {
      showMessage({
        message: `Successfully Attendance Taken.`,
        // description: 'Successfully Attendance Taken..',
        type: 'success',
        backgroundColor: Colors.success,
      });
      // yield put(studentstypes.postAttendanceSuccess(res.data));
    }
  } catch (e) {
    yield put(studentstypes.postAttendanceError(e.message));
    // console.log(e.message);
  }
}
export function* onpostAttendance() {
  yield takeEvery(studentstypes.postAttendanceStart, postAttendanceList);
}

//Get Student List for Attendance
export function* getStudentListforAttendance({payload}) {
  try {
    const res = yield call(getStudentListforAttendanceApi, payload);
    // console.log(res.data, 'getStudentListforAttendance');
    // console.log("res-->",res)
    if (res.status === 200) {
      yield put(studentstypes.getStudentListforAttendanceSuccess(res.data));
    }
  } catch (e) {
    yield put(studentstypes.getStudentListforAttendanceError(e.message));
    // console.log(e.message);
  }
}
export function* ongetStudentListforAttendance() {
  yield takeEvery(
    studentstypes.getStudentListforAttendanceStart,
    getStudentListforAttendance,
  );
}

export const StudentSagas = [
  fork(ongetStudent),
  fork(oncreateStudent),
  fork(ongetAttendanceReport),
  fork(ongetAttendanceList),
  fork(ondeleteStudent),
  fork(onupdateStudent),
  fork(onpostAttendance),
  fork(ongetStudentListforAttendance),
];
