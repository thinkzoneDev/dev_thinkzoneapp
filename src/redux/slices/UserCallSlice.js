import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  callrecords: [

  ],
  isLoding: false,
  error: null,
  message: null,
  
  //  callresponse:[],
};

export const UserCallSlice = createSlice({
  name: 'UserCallSlice',
  initialState,
  reducers: {
    getCallrecordStart(action, state) {
      state.isLoding = true;
    },
    getCallrecordSuccess(action, state) {
      // console.log(state, 'State');
      state.isLoding = false;
      callrecords = state.payload;
    },
    getCallrecordError(action, state) {
      state.isLoding = false;
    },

    // getCallActivityStart(action, state) {
    //   state.isLoding = true;
    // },
    // getCallActivitySuccess(state, action) {
    //   state.isLoding = false;
    //   state.callrecords = action.payload;
    // },
    postCallActivityStart(action, state) {
      state.isLoding = false;
    },
    postCallActivitySuccess(action,state){
      state.isLoding = true;
    }  
  },
});

export const {
  getCallrecordStart,
  getCallrecordSuccess,
  getCallrecordError,
  // getCallActivityStart,
  // getCallActivitySuccess,
  postCallActivityStart,
  postCallActivitySuccess,
} = UserCallSlice.actions;
export default UserCallSlice.reducer;
