import React, {useState, useEffect} from 'react';
import {ToastAndroid} from 'react-native';
import {
  StyleSheet,
  View,
  Image,
  Text,
  Pressable,
  TouchableOpacity,
  SafeAreaView,
  ActivityIndicator,
  Linking,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {Color, FontSize, FontFamily, Border} from '../GlobalStyle';
import * as window from '../utils/dimensions';
import SwipeButton from '../components/SwipeButton';
import MockUI from '../components/MockUI';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {
  GoogleSignin,
  statusCodes,
} from '@react-native-google-signin/google-signin';
import API from '../environment/Api';
import {useDispatch, useSelector} from 'react-redux';
import Colors from '../utils/Colors';
import * as types from '../redux/slices/UserSlice';

import Carousel from 'react-native-snap-carousel';
import CarouselImage from '../components/CarouselImage';
import AppTextInput from '../components/TextInput';
import Api from '../environment/Api';

const EmailPage = ({navigation}) => {
  const user = useSelector(state => state.userdata.user?.resData);
  // console.log(user, 'email page----------------->');
  const [isLoading, setIsloading] = useState(false);
  const dispatch = useDispatch();
  const [toggleState, setToggleState] = useState(false);
  useEffect(() => {
    GoogleSignin.configure();
  }, []);
  const handleToggle = async value => {
    setToggleState(value);
    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      checkemailavailability(userInfo.user.email);
      // this.setState({userInfo});
    } catch (error) {
      // console.log('err--->', error);
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        // user cancelled the login flow
        // console.log('SIGN_IN_CANCELLED');
      } else if (error.code === statusCodes.IN_PROGRESS) {
        // operation (e.g. sign in) is in progress already
        // console.log('IN_PROGRESS');
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        // play services not available or outdated
        // console.log('PLAY_SERVICES_NOT_AVAILABLE');
      } else {
        // some other error happened
        // console.log('error 4', error);
      }
    }
  };
  const _renderItem = ({item, index}) => {
    return <CarouselImage data={item} />;
  };
  const checkemailavailability = async email => {
    setIsloading(true);
    const body = {
      emailid: email,
    };
    Api.post(`checkCredentialAvailability`, body).then(response => {
      if (response.data.status === 'success' && response.data.unique === true) {
        const data = {
          userid: user[0].userid,
          emailid: email,
        };
        // console.log('dataemail---->', data);
        dispatch(types.verifiedUserStartbyphone(data));
      }
    });
  };

  return (
    <View style={styles.login}>
      <View style={styles.loginChild} />
      <View style={{bottom: 5}}>
        <Text
          style={{
            fontSize: 15,
            color: 'white',
            fontFamily: FontFamily.poppinsMedium,
          }}>
          Verify Your Email ID
        </Text>
        <TouchableOpacity
          onPress={handleToggle}
          style={{
            top: 15,
            margin: 8,
            paddingLeft: 20,
            paddingRight: 20,
            paddingTop: 5,
            paddingBottom: 5,
            height: 45,
            width: window.WindowWidth * 0.75,
            justifyContent: isLoading ? 'center' : 'flex-start',
            alignItems: 'center',
            marginTop: 420,
            backgroundColor: 'white',
            flexDirection: 'row',
            // justifyContent: 'space-between',
            marginRight: 10,
            marginLeft: 50,
            borderRadius: 22,
          }}>
          {isLoading ? (
            <ActivityIndicator size="small" color={Colors.primary} style={{}} />
          ) : (
            <>
              <Image
                source={require('../assets/Photos/googles.png')}
                style={{
                  width: 24,
                  height: 24,
                  // marginTop: -1,

                  // justifyContent: 'center',
                  marginRight: 15,
                }}
              />
              <Text
                style={{
                  width: '100%',

                  textAlign: 'left',

                  fontSize: 13,
                  width: 250,
                  fontWeight: '500',
                  color: '#333333',
                  fontFamily: FontFamily.poppinsMedium,
                }}>
                Verify With Email Id
              </Text>
            </>
          )}
        </TouchableOpacity>
      </View>

      <Image
        style={[styles.kindergartenStudentPana1, styles.groupChildPosition]}
        resizeMode="cover"
        source={require('../assets/Image/kindergarten-studentpana-1.png')}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  groupChildPosition: {
    left: 0,
    position: 'absolute',
  },

  loginChild: {
    top: 370,
    // marginTop: 420,
    left: -25,
    borderRadius: 72,
    backgroundColor: Color.royalblue,
    width: window.WindowWidth * 1.2,
    // height: 470,
    // alignSelf: 'center',
    height: window.WindowHeigth * 0.8,
    transform: [
      {
        rotate: '-10deg',
      },
    ],
    position: 'absolute',
  },

  byContinuingYou: {
    fontSize: 13,
    color: Color.primaryContrast,
    textAlign: 'center',
    marginTop: 30,
    width: 315,
    alignSelf: 'center',
    fontFamily: FontFamily.poppinsMedium,
    fontWeight: '500',
    position: 'absolute',

    bottom: 5,
  },

  kindergartenStudentPana1: {
    top: 5,
    // width: 490,
    width: window.WindowWidth * 1.21,

    marginLeft: -25,
    height: window.WindowWidth * 0.9,
  },
  login: {
    flex: 1,
    height: 800,
    overflow: 'hidden',
    width: '100%',
    backgroundColor: Color.primaryContrast,
  },
  google: {},
  whatsapp: {
    top: 15,
    margin: 8,
    paddingLeft: 20,
    paddingRight: 20,
    paddingTop: 5,
    paddingBottom: 5,
    height: 45,
    width: window.WindowWidth * 0.75,
    // justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    flexDirection: 'row',
    // justifyContent: 'space-between',
    marginRight: 10,
    marginLeft: 50,
    borderRadius: 22,
    marginTop: 20,
  },
  mobilrno: {
    margin: 8,
    top: 15,
    paddingLeft: 20,
    paddingRight: 20,
    paddingTop: 5,
    paddingBottom: 5,
    height: 45,
    width: window.WindowWidth * 0.75,
    // justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    flexDirection: 'row',
    // justifyContent: 'space-between',
    marginRight: 10,
    marginLeft: 50,
    borderRadius: 22,
    marginTop: 20,
    // position: 'absolute',
  },
});

export default EmailPage;
