import {createSlice} from '@reduxjs/toolkit';
// import {logOutSuccess} from '../../components/SideBar/SideBarSlice';

const initialState = {
  newuser: [],
  user: [],
  getUser: [],
  // newuser: {},
  // user: {},
  isLoading: false,
  isAuthenticated: false,
  message: null,
  error: null,
  district: [],
  block: [],
  rewards: [],
  payments: [],
  // pay: [],
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    //get user by whatsapp phone number
    loadUserStartbyphone(state, action) {
      state.isLoading = true;
    },
    loadUserSuccessbyphone(state, action) {
      state.isLoading = false;
      state.user = action.payload;
      state.isAuthenticated = true;
    },
    loadUserErrorbyphone(state, action) {
      state.isLoading = false;
      state.error = true;
    },

    //get verified user phone number
    verifiedUserStartbyphone(state, action) {
      state.isLoading = true;
    },
    verifiedUserSuccessbyphone(state, action) {
      state.isLoading = false;
      state.user = action.payload;
      state.isAuthenticated = true;
    },
    verifiedUserErrorbyphone(state, action) {
      state.isLoading = false;
      state.error = true;
    },

    //Authenticate Users From NewAPI google
    loadUserStart(state, action) {
      state.isLoading = true;
    },
    loadUserSuccess(state, action) {
      state.isLoading = false;
      state.user = action.payload;
      state.isAuthenticated = true;
    },
    loadUserError(state, action) {
      state.isLoading = false;
      state.error = true;
    },

    //Authenticate Users From NewAPI otp
    otpUserStart(state, action) {
      state.isLoading = true;
    },
    otpUserSuccess(state, action) {
      state.isLoading = false;
      state.user = action.payload;
      state.isAuthenticated = true;
    },
    otpUserError(state, action) {
      state.isLoading = false;
      state.error = true;
    },

    //If User is New to ThinkZone App
    newGoogleSignInUserstart(state, action) {
      state.isLoading = true;
    },
    newGoogleSignInUsersucces(state, action) {
      state.newuser = action.payload;
      state.isAuthenticated = true;
      state.isLoading = false;
      state.user = [];
    },
    newGoogleSignInUsererror(state, action) {
      state.error = action.payload.error;
    },

    //Get User from api
    getUserStart(state, action) {
      state.isLoading = true;
    },
    getUserSuccess(state, action) {
      state.isLoading = false;
      state.getUser = action.payload;
      state.isAuthenticated = true;
    },
    getUserError(state, action) {
      state.isLoading = false;
      state.error = true;
    },

    //Log Out User From App
    logOutUser(state, action) {
      state.isLoading = true;
    },
    logOutSuccess(state, action) {
      state.isAuthenticated = false;
      state.user = [];
      state.newuser = [];
    },
    logOutError(state, action) {
      state.error = action.payload;
    },
    //Get User From AsyncStorage
    getUserstorestart(state, action) {
      state.isLoading = true;
    },
    getUserstoresuccess(state, action) {
      state.isAuthenticated = true;
      state.isLoading = false;
      state.user = action.payload;
    },
    getUserstoreerror(state, action) {
      state.isLoading = false;
      // state.error = action.payload;
    },
    // Get All District from StateID
    getalldistrictstart(state, action) {
      state.isLoading = true;
    },
    getalldistrictsuccess(state, action) {
      state.district = action.payload;
      state.isLoading = false;
    },
    getalldistricterror(state, action) {
      state.isLoading = false;
    },
    // Get All Block from StateID & DistrictID
    getallblockstart(state, action) {
      state.isLoading = true;
    },
    getallblocksuccess(state, action) {
      state.block = action.payload;
      state.isLoading = false;
    },
    getallblockerror(state, action) {
      state.isLoading = false;
    },
    // Create New User(Fellow)
    createUserstart(state, action) {
      state.isLoading = true;
    },
    createUsersuccess(state, action) {
      state.isLoading = false;
      state.isAuthenticated = true;
      state.user = action.payload;
    },
    createUsererror(state, action) {
      state.isLoading = false;
    },

    // Update a user(Fellow)
    updateUserstart(state, action) {
      state.isLoading = true;
    },
    updateUsersuccess(state, action) {
      state.isLoading = false;
      state.user = action.payload;
    },
    updateUsererror(state, action) {
      state.isLoading = false;
    },

    // rewards a user(Fellow)
    rewardsUserstart(state, action) {
      state.isLoading = true;
    },
    rewardsUsersuccess(state, action) {
      state.isLoading = false;
      state.rewards = action.payload;
    },
    rewardsUsererror(state, action) {
      state.isLoading = false;
    },

    // Create Payment details(Fellow)
    paymentsUserstart(state, action) {
      state.isLoading = true;
    },
    paymentsUsersuccess(state, action) {
      state.isLoading = false;
      state.payments = action.payload;
    },
    paymentsUsererror(state, action) {
      state.isLoading = false;
    },
    //get payment
    getallpaymentsstart(state, action) {
      state.isLoading = true;
    },
    getallpaymentssuccess(state, action) {
      state.payments = action.payload;
      state.isLoading = false;
    },
    getallpaymentserror(state, action) {
      state.isLoading = false;
    },
  },
  //   extraReducers: builder => {
  //     builder.addCase(logOutSuccess, (state, action) => {
  //       state.user = [];
  //       state.isAuthenticated = false;
  //     });
  //   },
});

export const {
  rewardsUserstart,
  rewardsUsersuccess,
  rewardsUsererror,
  loadUserStartbyphone,
  loadUserSuccessbyphone,
  loadUserErrorbyphone,
  verifiedUserErrorbyphone,
  verifiedUserStartbyphone,
  verifiedUserSuccessbyphone,
  loadUserStart,
  loadUserSuccess,
  loadUserError,
  otpUserStart,
  otpUserSuccess,
  otpUserError,
  newGoogleSignInUserstart,
  newGoogleSignInUsersucces,
  newGoogleSignInUsererror,
  logOutUser,
  logOutSuccess,
  logOutError,
  getUserstorestart,
  getUserstoresuccess,
  getUserstoreerror,
  getalldistrictstart,
  getalldistrictsuccess,
  getalldistricterror,
  getallblockstart,
  getallblocksuccess,
  getallblockerror,
  createUserstart,
  createUsersuccess,
  createUsererror,
  updateUserstart,
  updateUsersuccess,
  updateUsererror,
  paymentsUserstart,
  paymentsUsersuccess,
  paymentsUsererror,
  getallpaymentsstart,
  getallpaymentssuccess,
  getallpaymentserror,
} = userSlice.actions;
export default userSlice.reducer;
