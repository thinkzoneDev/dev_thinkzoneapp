import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  fcmMessage: [],
  isLoading: false,
  error: [],
};

export const FcmSlice = createSlice({
  name: 'FcmSlice',
  initialState,
  reducers: {
    // Get All Students by teacherId from API
    getfcmMessage(state, action) {
      state.isLoading = true;
    },
    getfcmMessageSuccess(state, action) {
      console.log(action, 'fcm acton');
      state.isLoading = false;
      state.fcmMessage = action.payload;
    },
    getfcmMessageError(state, action) {
      state.isLoading = false;
      state.error = action.payload;
    },

    getfcmMessagestore(state, action) {
      state.isLoading = true;
    },
    getfcmMessageSuccessstore(state, action) {
      console.log(action, 'fcm acton');
      state.isLoading = false;
      state.fcmMessage = action.payload;
    },
    getfcmMessageErrorstore(state, action) {
      state.isLoading = false;
      state.error = action.payload;
    },

    clearfcmMessage(state, action) {
      state.isLoading = true;
    },
    clearfcmMessageSuccess(state, action) {
      console.log(action, 'fcm acton clear');
      state.isLoading = false;
      state.fcmMessage = [];
    },
    clearfcmMessageError(state, action) {
      state.isLoading = false;
      state.error = action.payload;
    },
  },
});

export const {
  getfcmMessage,
  getfcmMessageSuccess,
  getfcmMessageError,
  clearfcmMessage,
  clearfcmMessageSuccess,
  clearfcmMessageError,
  getfcmMessagestore,
  getfcmMessageSuccessstore,
  getfcmMessageErrorstore,
} = FcmSlice.actions;
export default FcmSlice.reducer;
