import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  modules: [],
  contentDetails: [],
  subModules: [],
  userTraingDetails: [],
  pptmodules: [],
  pptcontentDetails: [],
  pptuserdetails: [],
  isLoading: false,
  error: null,
};
export const TrainingSlice = createSlice({
  name: 'TrainingSlice',
  initialState,
  reducers: {
    //Monthly Teacher training
    getModuleStart(state, action) {
      state.isLoading = true;
    },
    getModuleSuccess(state, action) {
      state.isLoading = false;
      state.modules = action.payload;
    },
    getModuleError(state, action) {
      state.isLoading = false;
    },
    getContentDetailsstart(state, action) {
      state.isLoading = true;
    },
    getContentDetailsSuccess(state, action) {
      state.isLoading = false;
      state.contentDetails = action.payload;
    },
    getContentDetailsError(state, action) {
      state.isLoading = false;
    },
    getUserTrainingDetailsStart(state, action) {
      state.isLoading = true;
    },
    getUserTrainingDetailsSuccess(state, action) {
      state.isLoading = false;
      state.userTraingDetails = action.payload;
    },
    getUserTrainingDetailsError(state, action) {
      state.isLoading = false;
    },

    //ppt
    getPPTModuleStart(state, action) {
      state.isLoading = true;
    },
    getPPTModuleSuccess(state, action) {
      state.isLoading = false;
      state.pptmodules = action.payload;
    },
    getPPTModuleError(state, action) {
      state.isLoading = false;
    },
    getPPTContentDetailsstart(state, action) {
      state.isLoading = true;
    },
    getPPTContentDetailsSuccess(state, action) {
      state.isLoading = false;
      state.pptcontentDetails = action.payload;
    },
    getPPTContentDetailsError(state, action) {
      state.isLoading = false;
    },
    getPPTUserTrainingDetailsStart(state, action) {
      state.isLoading = true;
    },
    getPPTUserTrainingDetailsSuccess(state, action) {
      state.isLoading = false;
      state.pptuserdetails = action.payload;
    },
    getPPTUserTrainingDetailsError(state, action) {
      state.isLoading = false;
    },
  },
});

export const {
  //monthly
  getModuleStart,
  getModuleSuccess,
  getModuleError,
  getContentDetailsstart,
  getContentDetailsSuccess,
  getContentDetailsError,
  getUserTrainingDetailsStart,
  getUserTrainingDetailsSuccess,
  getUserTrainingDetailsError,
  //ppt
  getPPTModuleStart,
  getPPTModuleSuccess,
  getPPTModuleError,
  getPPTContentDetailsstart,
  getPPTContentDetailsSuccess,
  getPPTContentDetailsError,
  getPPTUserTrainingDetailsStart,
  getPPTUserTrainingDetailsSuccess,
  getPPTUserTrainingDetailsError,
} = TrainingSlice.actions;
export default TrainingSlice.reducer;
