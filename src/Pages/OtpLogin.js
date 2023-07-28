import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  View,
  Image,
  Text,
  ToastAndroid,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import Api from '../environment/Api';
import DashboardNavigation from '../navigation/DashboardNavigation';
import {Color, FontSize, FontFamily, Border} from '../GlobalStyle';
import * as window from '../utils/dimensions';
import moment from 'moment';

import {
  GoogleSignin,
  statusCodes,
} from '@react-native-google-signin/google-signin';
import API from '../environment/Api';
import {useDispatch, useSelector} from 'react-redux';

import * as types from '../redux/slices/UserSlice';

import axios from 'axios';
import {log} from 'console';

const OtpLogin = ({navigation, route}) => {
  const user = useSelector(state => state.userdata.user?.resData);
  console.log('otp user-------->', user);
  // console.log('otp user-------->', user);
  const usersNew = useSelector(state => state.userdata.newuser);
  console.log('otp user1-------->', usersNew);
  // console.log('otp user1-------->', usersNew);
  const mobile = route.params;
  // console.log('mobile----->', mobile);
  // console.log('data----->', data);
  // console.log(user, 'login page user');
  const [isLoading, setIsloading] = useState(false);
  const dispatch = useDispatch();
  const [toggleState, setToggleState] = useState(false);
  const [otps, setOtps] = useState('');
  const [resendCounter, setResendCounter] = useState(0);
  const [isResendDisabled, setIsResendDisabled] = useState(false);
  const [change, setChange] = useState([]);

  const [counter, setCounter] = React.useState(120);

  const Resend = () => {
    // setPhone(data);
    // console.log(phone, 'hari------>');
    var otp = Math.floor(1000 + Math.random() * 9000);

    var urls = `https://m1.sarv.com/api/v2.0/sms_campaign.php?token=19818771645efefd49187ff7.92128852&user_id=96192514&route=OT&template_id=11518&sender_id=THNKZN&language=EN&template=Dear+User%2C+Your+OTP+is+${otp}+for+your+login+to+ThinkZone+application+%26+valid+for+5+minutes.&contact_numbers=${mobile.data}`;

    axios.get(urls).then(response => {
      // console.log('res: ', response.data);
      if (response.data.code === 200) {
        setCounter(120);
        ToastAndroid.show('Otp Update success.', ToastAndroid.SHORT);
        // const body = {
        //   appModule: 'user',
        //   id: mobile.data,
        //   phoneNumber: mobile.data,
        //   otp: otp,
        // };
        // console.log('otpData', {
        //   appModule: 'user',
        //   id: mobile.data,
        //   phoneNumber: mobile.data,
        //   otp: otp,
        // });

        Api.post(`saveOtp`, {
          appModule: 'user',
          id: mobile.data,
          phoneNumber: mobile.data,
          otp: otp,
        }).then(response => {
          // console.log('res2------->', response.data);
          setChange(response.data);
        });
      } else {
        ToastAndroid.show(
          'Otp Update error. Please try again.',
          ToastAndroid.SHORT,
        );
      }
    });
    setResendCounter(prevCounter => prevCounter + 1);

    if (resendCounter == 2) {
      setIsResendDisabled(true);
    }
  };

  const verifiyOTP = data => {
    // console.log('data-------->', data);
    // if (data.length > 0) {
    // const body = {
    //   appModule: 'user',
    //   id: mobile.data,
    //   phoneNumber: mobile.data,
    //   otp: 7682,
    // };

    if (user?.length > 0) {
      Api.post(
        'verifyOtp',

        {
          appModule: 'user',
          id: mobile.data,
          phoneNumber: mobile.data,
          otp: otps,
        },
      ).then(response => {
        // console.log(response.data, 'response-------->');
        if (response.data.status == 'success') {
          ToastAndroid.show('OTP ସଫଳତାର ସହ ଯାଞ୍ଚ ହୋଇଛି ।', ToastAndroid.SHORT);
          console.log('response.data1---->', response.data);
          // navigation.navigate('Register');
          const data = {
            userid: user[0].userid,
            contactnumber: mobile.data,
          };
          // console.log('dataotp---->', data);
          dispatch(types.verifiedUserStartbyphone(data));
        } else {
          ToastAndroid.show('Please Enter Valid  Otp.', ToastAndroid.SHORT);
        }
      });
    } else if (Object.keys(usersNew).length > 0) {
      // console.log('dataotp---->', data);
      Api.post(
        'verifyOtp',

        {
          appModule: 'user',
          id: mobile.data,
          phoneNumber: mobile.data,
          otp: otps,
        },
      ).then(response => {
        console.log(response.data, 'response2-------->');
        if (response.data.status == 'success') {
          ToastAndroid.show('OTP ସଫଳତାର ସହ ଯାଞ୍ଚ ହୋଇଛି ।', ToastAndroid.SHORT);
          // navigation.navigate('Register');

          const data = {
            userid: usersNew.userid,
            contactnumber: mobile.data,
          };
          // console.log('dataotp---->', data);
          dispatch(types.verifiedUserStartbyphone(data));
        } else {
          ToastAndroid.show('Please Enter Valid  Otp.', ToastAndroid.SHORT);
        }
      });
    } else {
      Api.post(
        'verifyOtp',

        {
          appModule: 'user',
          id: mobile.data,
          phoneNumber: mobile.data,
          otp: otps,
        },
      ).then(response => {
        console.log(response.data, 'response3-------->');
        if (response.data.status == 'success') {
          ToastAndroid.show('OTP ସଫଳତାର ସହ ଯାଞ୍ଚ ହୋଇଛି ।', ToastAndroid.SHORT);
          // navigation.navigate('Register');
          const data = {
            loginType: 'otp',
            contactnumber: mobile.data,
          };
          // console.log('data---->', data);
          // dispatch(types.loadUserStartbyphone(data));
          API.post(`authenticateuser`, data).then(response => {
            console.log('response.data4-------------->', response.data);
            if (
              response.data.unique === false &&
              response.data.userExists === false
            ) {
              navigation.navigate('login');
              handleClearCachedToken();
              ToastAndroid.show(response.data.msg, ToastAndroid.SHORT);
            } else if (
              response.data.unique === true &&
              response.data.userExists === false
            ) {
              console.log('response.data5-------------->', response.data);
              const data = {
                loginType: 'otp',
                contactnumber: mobile.data,
              };
              // console.log('data---->', data);
              dispatch(types.loadUserStartbyphone(data));
            } else {
              console.log('exception---->', data);
              // navigation.navigate('login');
              const data = {
                loginType: 'otp',
                contactnumber: mobile.data,
              };
              // console.log('data---->', data);
              dispatch(types.loadUserStartbyphone(data));
            }
          });
        } else {
          ToastAndroid.show('Please Enter Valid  Otp.', ToastAndroid.SHORT);
        }
      });

      //check authenticate user
      //check emailverified true or false
      //if emailverified false create a page for google login and if true go the dashboard
      //
    }
  };

  const handleClearCachedToken = async () => {
    try {
      await GoogleSignin.signOut();
      setIsSignedIn(false);

      // Additional logic for opening the Google SDK or navigating to another page
      // ...
    } catch (error) {
      console.error('Error clearing cached access token:', error);
    }
  };

  React.useEffect(() => {
    // var date = moment().utcOffset('+05:30').format('hh:mm:ss');
    const timer =
      counter > 0 && setInterval(() => setCounter(counter - 1), 1000);
    return () => clearInterval(timer);
  }, [counter]);

  return (
    <View style={{justifyContent: 'space-evenly'}}>
      <TouchableOpacity
        style={{flexDirection: 'row'}}
        onPress={() => navigation.goBack()}
        //  navigation.goBack();
      >
        <Image
          style={{marginTop: 10, marginLeft: 20}}
          resizeMode="cover"
          source={require('../assets/Image/back.png')}
        />
        <Text
          style={[
            styles.title,
            {textAlign: 'center', top: 13, marginLeft: -20},
          ]}>
          OTP Verification
        </Text>
      </TouchableOpacity>

      <Image
        style={styles.connectedWorldBro11}
        resizeMode="cover"
        source={require('../assets/Image/Enter.png')}
      />
      <View
        style={{
          justifyContent: 'space-evenly',
          marginTop: 50,
          alignItems: 'flex-start',
        }}>
        <Text style={styles.subt}>
          4 digit OTP has been sent to your mobile number.
        </Text>
        <Text style={styles.title}>Enter OTP</Text>
      </View>
      <View style={{top: 50, marginLeft: 20}}>
        <TextInput
          style={styles.textInput}
          //   maxLength={maxLength}
          autoCapitalize="none"
          autoCorrect={false}
          placeholder="Enter OTP ...."
          keyboardType="numeric"
          name="otp"
          value={otps}
          onChangeText={value => setOtps(value)}
          maxLength={4}
        />

        <Text
          style={{
            fontSize: 10,
            color: '#000000',
            fontFamily: FontFamily.poppinsMedium,
            marginLeft: 10,
          }}>
          Didn’t receive the OTP?
          {''}
          {counter != 0 ? (
            <Text style={{color: 'red', fontWeight: '500', fontSize: 13}}>
              0{Math.floor(counter / 60)}:{Math.floor(counter % 60)}
            </Text>
          ) : (
            <>
              {isResendDisabled ? (
                <Text
                  onPress={Resend}
                  disabled={isResendDisabled}
                  style={{
                    fontSize: 10,
                    color: '#ED6400',
                    fontFamily: FontFamily.poppinsMedium,
                    alignSelf: 'center',
                    marginTop: 15,
                  }}>
                  Maximum attempts reached
                </Text>
              ) : (
                <Text
                  onPress={Resend}
                  disabled={isResendDisabled}
                  style={{
                    fontSize: 13,
                    color: '#ED6400',
                    fontFamily: FontFamily.poppinsMedium,
                    alignSelf: 'center',
                    marginTop: 15,
                  }}>
                  Resend OTP
                </Text>
              )}
            </>
          )}
        </Text>

        {/* {counter == 0 ? (
          <Text
            style={{
              fontSize: 13,
              color: Color.royalblue,
              fontFamily: FontFamily.poppinsMedium,
              alignSelf: 'center',
            }}>
            Resend OTP{' '}
          </Text>
        ) : null} */}
      </View>
      <TouchableOpacity onPress={verifiyOTP} style={styles.verify}>
        <Text style={styles.vt}>Verify</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  connectedWorldBro11: {
    top: 30,
    left: 20,
    // alignItems: 'center',
    width: window.WindowWidth * 0.9,
    height: window.WindowHeigth * 0.45,
    // position: 'absolute',
  },
  textInput: {
    height: 40,
    width: window.WindowWidth * 0.8,
    borderColor: 'black',
    borderWidth: 2,
    borderRadius: 10,
    paddingHorizontal: 10,
    backgroundColor: Color.ghostwhite,
    marginBottom: 20,
  },
  title: {
    left: '7%',
    fontFamily: FontFamily.poppinsMedium,
    fontSize: 16,
    color: '#000000',
    width: 350,
    top: 30,
  },
  vt: {
    width: '100%',

    justifyContent: 'center',

    textAlign: 'center',
    fontFamily: FontFamily.poppinsMedium,

    fontSize: 20,
    color: Color.primaryContrast,
    position: 'absolute',

    marginTop: -5,
  },
  subt: {
    left: '7%',
    top: 20,
    fontFamily: FontFamily.poppinsMedium,
    fontSize: 13,
    color: '#000000',
    width: 350,
  },
  verify: {
    margin: 8,
    paddingLeft: 10,
    paddingRight: 10,
    paddingTop: 5,
    paddingBottom: 5,
    height: 45,
    borderRadius: Border.br_xl,
    backgroundColor: Color.royalblue,
    width: 162,
    height: 45,

    justifyContent: 'center',
    alignItems: 'center',

    marginLeft: 99,
    marginTop: 80,
  },
});

export default OtpLogin;
