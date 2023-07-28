import {log} from 'react-native-reanimated';
import axios from 'axios';
import API from '../../environment/Api';

//Get User From API Whatsapplogin
export const loadUserApibyphone = async data =>
  // await API.post(`otpless_auth_new/${phone}`);
  await API.post(`authenticateuser`, data);

//Get User From API goggle login
export const loadUserApi = async data =>
  await API.get(`getuserbyuserid/${email}`);
// await API.post(`authenticateuser`, data);

//Get phonenumberverified users
export const phoneVerifiedUserApi = async data =>
  await API.post(`verifyUserCredentials`, data);

//Get User From API otp log in
export const otpUserApi = async data =>
  // await API.get(`getuserbyuserid/${email}`);
  await API.post(`authenticateuser`, data);

export const getUserApi = async email =>
  await API.get(`getuserbyuserid/${email}`);

// Get All District from StateID
export const getalldistrictapi = async () =>
  await API.get(`getdistrictsofstate/${20}`);

// Get All District from StateID
export const getallblockapi = async districtId =>
  await API.get(`getblocksofdistricts/${20}/${districtId}`);

// Passcode checke
export const passcodevalidate = async passcode =>
  await API.get(`checkpasscodevalidity/${passcode}`);

// Create New User(Fellow)
export const saveNewUser = async data => await API.post(`createnewuser`, data);

// Update a User Image in S3(Fellow)
export const updateImageinS3 = async fileName => {
  const config = {
    headers: {
      accept: 'application/json',
      'content-type': 'multipart/form-data',
    },
  };
  let body = new FormData();
  body.append('file', {
    name: fileName.path.split('/').pop(),
    uri: fileName.path,
    type: fileName.mime,
  });
  const imageName = new Date();
  body.append('Content-Type', 'image/png');

  const res = await API.post(
    `/s3api/uploadroot/${imageName}.jpg`,
    body,
    config,
  );
  return res;
};

//update a user(fellow)
export const updateuser = async data =>
  await API.put(`updateuser/${data.userid}`, data.userdata);

//Get rewards From API
export const rewardsUserApi = async userid =>
  await API.get(`getTotalCoins/${userid}`);

//Payment details
export const savePayment = async data =>
  await API.post(`savetchpaymentdetails`, data);

export const getPayment = async userid =>
  await API.get(`getstudentswithpaymentdetails/${userid}`);
