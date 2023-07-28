import { ToastAndroid } from "react-native";
import {
  take,
  takeEvery,
  takeLatest,
  put,
  all,
  delay,
  fork,
  call,
} from "redux-saga/effects";
import { showMessage } from "react-native-flash-message";
import Colors from "../../utils/Colors";
// import {
//   loadUserSuccess,
//   loadUserError,
//   getUserstorestart,
//   getUserstoresuccess,
// } from '../actions/UserAction';
// import * as types from '../actionstype/UserActiontype';
import {
  loadUserApi,
  getalldistrictapi,
  getallblockapi,
  saveNewUser,
  updateImageinS3,
  updateuser,
  loadUserApibyphone,
  rewardsUserApi,
  savePayment,
  getPayment,
  getUserApi,
  phoneVerifiedUserApi,
} from "../api/UserApi";
import storage from "../../utils/AsyncStorage";
import {
  loadUserStart,
  loadUserSuccess,
  loadUserError,
  newGoogleSignInUserstart,
  newGoogleSignInUsersucces,
  newGoogleSignInUsererror,
  getUserstorestart,
  getUserstoresuccess,
  getUserstoreerror,
  logOutUser,
  paymentsUserstart,
  getallpaymentsstart,
} from "../slices/UserSlice";
import * as types from "../slices/UserSlice";
import { log } from "console";

//Get User From AsyncStorage
export function* getUserfromasyncStore() {
  try {
    const res = yield call(storage.getObject, "@user_data");
    if (res) {
      yield delay(500);
      yield put(types.getUserstoresuccess(res));
    }
  } catch (err) {
    yield put(types.getUserstoreerror(err));
  }
}
export function* ongetUser() {
  yield takeEvery(types.getUserstorestart, getUserfromasyncStore);
}

// Authenticate User by phone number(whatsapp)/google/otp
export function* onLoadUserStartbyPhoneAsync({ payload }) {
  try {
    const res = yield call(loadUserApibyphone, payload);
    // console.log('whatsapp res----->', res.data, payload);
    //
    if (res.data.userExists == true) {
      // console.log('whatsapp res2----->', res.data);
      const data = storage.storeObject("@user_data", res.data);
      yield delay(500);
      yield put(types.loadUserSuccess(res.data));
      ToastAndroid.show("Authenticate Successfully !", ToastAndroid.SHORT);
    } else {
      let data = { ...res.data, ...payload };
      // console.log('data7---->', data);
      yield put(types.newGoogleSignInUsersucces(data));
      if (data.userExists == false && data.unique == false) {
        ToastAndroid.show(data.msg, ToastAndroid.SHORT);
        // yield put(types.loadUserSuccess(payload));
        // yield call(loadUserApibyphone, payload);
      }
    }
  } catch (err) {
    yield put(types.loadUserError(err));
  }
}
export function* onLoadUserbyphone() {
  yield takeEvery(types.loadUserStartbyphone, onLoadUserStartbyPhoneAsync);
}

//Verify users phone number

export function* onVerifyUserStartbyPhone({ payload }) {
  try {
    const res = yield call(phoneVerifiedUserApi, payload);
    console.log("verified res----->", res.data, payload);
    yield delay(500);
    yield put(types.verifiedUserSuccessbyphone(res.data));
  } catch (err) {
    yield put(types.verifiedUserErrorbyphone(err));
  }
}
export function* onVerifyUserbyphone() {
  yield takeEvery(types.verifiedUserStartbyphone, onVerifyUserStartbyPhone);
}

//Get User From API
export function* onLoadUserStartAsync({ payload }) {
  try {
    const res = yield call(loadUserApi, payload.email);
    if (res.data.length > 0) {
      const data = storage.storeObject("@user_data", res.data);

      yield delay(500);
      yield put(types.loadUserSuccess(res.data));
      ToastAndroid.show("Login Successfully !", ToastAndroid.SHORT);
    } else {
      yield put(types.newGoogleSignInUsersucces(payload.email));
    }
  } catch (err) {
    yield put(types.loadUserError(err));
  }
}
export function* onLoadUser() {
  yield takeEvery(types.loadUserStart, onLoadUserStartAsync);
}

//Log Out User From App
export function* onLogOutUser({ payload }) {
  try {
    yield delay(500);
    const data = storage.clearStorage();
    // console.log('logout storage-------->', data, storage);
    yield put(types.logOutSuccess());
    ToastAndroid.show("LogOut Successfully !", ToastAndroid.SHORT);
  } catch (err) {
    yield put(types.logOutError());
  }
}
export function* onLogOut() {
  yield takeEvery(types.logOutUser, onLogOutUser);
}

// Get All District from StateID
export function* onStateChanges({ payload }) {
  try {
    const res = yield call(getalldistrictapi);

    if (res.status == 200) {
      yield put(types.getalldistrictsuccess(res.data));
    }
  } catch (err) {
    yield put(types.getalldistricterror(err));
  }
}
export function* onStateChange() {
  yield takeEvery(types.getalldistrictstart, onStateChanges);
}

// Get All Block from District&State
export function* onDistrictChanges({ payload }) {
  try {
    const res = yield call(getallblockapi, payload);

    if (res.status == 200) {
      yield put(types.getallblocksuccess(res.data));
    }
  } catch (err) {
    yield put(types.getallblockerror());
  }
}
export function* onDistrictChange() {
  yield takeEvery(types.getallblockstart, onDistrictChanges);
}

// Create New User(Fellow)
export function* onCreateNewUser({ payload }) {
  try {
    // const res = yield call(saveNewUser, payload);

    // if (res.status == 200) {
    //   yield put(types.createUsersuccess(res.data));
    // }
    // console.log(payload, 'without image------>');
    if (Object.keys(payload.image).length === 0) {
      // dispatch(updateUserDetails(doc_id, userDetails));

      const data = { userdata: payload.user, userid: payload.userid };
      const updatedUserdata = yield call(saveNewUser, payload.user);
      // console.log(updatedUserdata.data, 'without imgae2');
      if (updatedUserdata.status === 200) {
        // console.log('updatedUserdata.data---------->', updatedUserdata.status);
        // const email = payload.user.userid;
        // console.log('updatedUserdata.data2---------->', payload);
        // console.log('updatedUserdata.data3---------->', updatedUserdata);
        const data = storage.storeObject("@user_data", updatedUserdata.data);
        console.log("storage data ---->", data);
        yield delay(500);
        yield put(types.createUsersuccess(updatedUserdata.data));

        // const data = {
        //   loginType: payload.user.loginType,
        //   userid: payload.userid,
        //   emailid: payload.userid,
        // };
        // console.log('google----->', data);
        // const data2 = {
        //   loginType: payload.user.loginType,
        //   whatsappId: '',
        // };
        // console.log('whatsapp----->', data2);
        // const data3 = {
        //   loginType: payload.user.loginType,
        //   contactnumber: '',
        // };
        // console.log('otp----->', data3);
        // const res = yield call(
        //   loadUserApi,
        //   payload.user.loginType == 'google'
        //     ? data
        //     : payload.user.loginType == 'whatsapp'
        //     ? data2
        //     : payload.user.loginType == 'otp'
        //     ? data3
        //     : null,
        // );
        // const res = yield call(getUserApi, email);
        // console.log('after ---->', res.data);
        // if (res.data.length > 0) {
        // if (res.data.userExists == true) {
        //   const data = storage.storeObject('@user_data', res.data);
        //   // console.log('after2 ---->', data);
        //   yield delay(500);
        //   yield put(types.createUsersuccess(res.data));
        // } else if (res.data.userExists == false && res.data.unique == false) {
        //   ToastAndroid.show('Not a Unique User !', ToastAndroid.SHORT);
        // }
      } else {
        // yield put(types.updateUsererror(error))
      }
    } else {
      const res = yield call(updateImageinS3, payload.image);

      if (res.status === 200) {
        const newDetails = { ...payload.user, image: res.data.s3path };
        const data = { userdata: newDetails, userid: payload.userid };
        // dispatch(updateUserDetails(payload.userid, newDetails));

        const updatedUserdata = yield call(saveNewUser, newDetails);

        if (updatedUserdata.status === 200) {
          // const email = payload.user.userid;

          const data = storage.storeObject(
            "@user_data",
            updatedUserdata.data.data
          );
          console.log("save data----->", data);
          yield delay(500);
          yield put(types.createUsersuccess(updatedUserdata.data.data));

          // console.log('after3---------->', payload);
          // const res = yield call(getUserApi, email);
          // const data = {
          //   loginType: payload.user.loginType,
          //   userid: payload.userid,
          //   emailid: payload.userid,
          // };
          // const res = yield call(loadUserApi, data);

          // // if (res.data.length > 0) {
          // if (res.data.userExists == true) {
          //   console.log('after4---------->', payload, res.data);
          //   const data = storage.storeObject('@user_data', res.data);
          //   yield delay(500);
          //   yield put(types.createUsersuccess(res.data));
          // }
        } else {
          // yield put(types.updateUsererror(error))
        }
      } else {
      }
    }
  } catch (err) {
    yield put(types.createUsererror());
  }
}
export function* onNewUser() {
  yield takeEvery(types.createUserstart, onCreateNewUser);
}

// Update user(fellow)
export function* onUpdateFellow({ payload }) {
  try {
    if (Object.keys(payload.image).length === 0) {
      // dispatch(updateUserDetails(doc_id, userDetails));

      const data = { userdata: payload.user, userid: payload.userid };
      const updatedUserdata = yield call(updateuser, data);

      if (updatedUserdata.data.status == "success") {
        console.log(
          "updatedUserdata.data.status---->",
          updatedUserdata.data.status
        );
        const email = payload.user.userid;
        const res = yield call(loadUserApi, email);
        console.log("ures---->", res.data);
        if (res.data.length > 0) {
          const data = storage.storeObject("@user_data", res.data);
          yield delay(500);
          yield put(types.updateUsersuccess(res.data));
        }
      } else {
        // yield put(types.updateUsererror(error))
      }
    } else {
      const res = yield call(updateImageinS3, payload.image);

      if (res.status === 200) {
        const newDetails = { ...payload.user, image: res.data.s3path };
        const data = { userdata: newDetails, userid: payload.userid };
        // dispatch(updateUserDetails(payload.userid, newDetails));

        const updatedUserdata = yield call(updateuser, data);

        if (updatedUserdata.status === 200) {
          const email = payload.user.userid;
          const res = yield call(loadUserApi, email);
          if (res.data.length > 0) {
            const data = storage.storeObject("@user_data", res.data);
            yield delay(500);
            yield put(types.updateUsersuccess(res.data));
          }
        } else {
          // yield put(types.updateUsererror(error))
        }
      } else {
      }
    }
  } catch (err) {}
}
export function* onUpdateUser() {
  yield takeEvery(types.updateUserstart, onUpdateFellow);
}

//Get Student Attendance report
export function* getRewards({ payload }) {
  try {
    const res = yield call(rewardsUserApi, payload);

    if (res.status === 200) {
      yield put(types.rewardsUsersuccess(res.data));
    }
  } catch (e) {
    yield put(types.rewardsUsererror(e.message));
  }
}
export function* ongetUsersRewards() {
  yield takeEvery(types.rewardsUserstart, getRewards);
}

//get all payments
export function* getPayments({ payload }) {
  try {
    const res = yield call(getPayment, payload);
    // console.log(res.data, 'monalisa---->');
    // console.log(res.status, 'monalisa2---->');
    if (res.status === 200) {
      yield put(types.getallpaymentssuccess(res.data.data));
    }
  } catch (e) {
    // console.log(e, 'monalisa error---->');
    // yield put(types.rewardsUsererror(e.message));
  }
}
export function* ongetPayments() {
  yield takeEvery(types.getallpaymentsstart, getPayments);
}

//Save Payment Saga
export function* postPaymentActivities({ payload }) {
  try {
    const res = yield call(savePayment, payload);
    // console.log('postrespayment-->', res.data);
    // if (res.data.status === 'success') {
    //   yield put(types.paymentsUsersuccess(res.data));
    // }

    if (res.data.status === "success") {
      // console.log('get status data---->', res.data, payload);
      yield call(getPayment, payload.userid);
      // yield put(types.getallpaymentssuccess(payload.userid));
      showMessage({
        message: `Successfully Paid.`,
        //description: 'Successfully Call Response Taken..',
        type: "success",
        backgroundColor: Colors.success,
      });
    }
  } catch (error) {
    // console.log(error);
  }
}
export function* onPostPaymentActivities() {
  yield takeEvery(types.paymentsUserstart, postPaymentActivities);
}

export const UserSagas = [
  fork(onLoadUserbyphone),
  fork(onLoadUser),
  fork(ongetUser),
  fork(onLogOut),
  fork(onStateChange),
  fork(onDistrictChange),
  fork(onNewUser),
  fork(onUpdateUser),
  fork(ongetUsersRewards),
  fork(onPostPaymentActivities),
  fork(ongetPayments),
  fork(onVerifyUserbyphone),
];
