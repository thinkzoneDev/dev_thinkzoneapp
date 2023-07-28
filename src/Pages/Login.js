// import React, {useState, useEffect} from 'react';
// import {
//   SafeAreaView,
//   StyleSheet,
//   View,
//   Image,
//   Text,
//   ImageBackground,
//   StatusBar,
//   Linking,
//   TouchableOpacity,
//   ActivityIndicator,
// } from 'react-native';
// import SwipeButton from '../components/SwipeButton';
// import MockUI from '../components/MockUI';
// import {GestureHandlerRootView} from 'react-native-gesture-handler';
// import {
//   GoogleSignin,
//   statusCodes,
// } from '@react-native-google-signin/google-signin';
// import API from '../environment/Api';
// import {useDispatch, useSelector} from 'react-redux';
// import Colors from '../utils/Colors';
// import * as types from '../redux/slices/UserSlice';
// import * as window from '../utils/dimensions';
// // import {loadUserStart} from './LoginSlice';
// // import TouchableOpacity from 'react-native/Libraries/Components/TouchableOpacity/TouchableOpacity';
// import Carousel from 'react-native-snap-carousel';
// import CarouselImage from '../components/CarouselImage';
// // import {otplessWaId} from '../utils/otpless';
// const image = [
//   {
//     no: 1,
//     image: require('../assets/Photos/page1.png'),
//   },

//   {
//     no: 1,
//     image: require('../assets/Photos/page2.png'),
//     // url: 'http://factorymattresstexas.com/specials/beautyrest-lumbar-support',
//   },
//   {
//     no: 1,
//     // image: {
//     //   uri: 'https://wearemarketers.net/wp-content/uploads/2019/05/foto-pixabay.jpg',
//     // },
//     image: require('../assets/Photos/page3.png'),
//   },
// ];
// const Login = ({navigation}) => {
//   const user = useSelector(state => state.userdata.user);
//   console.log(user, 'login page user');
//   const [isLoading, setIsloading] = useState(false);
//   const dispatch = useDispatch();
//   const [toggleState, setToggleState] = useState(false);
//   useEffect(() => {
//     GoogleSignin.configure();
//   }, []);
//   const handleToggle = async value => {
//     setToggleState(value);
//     try {
//       await GoogleSignin.hasPlayServices();
//       const userInfo = await GoogleSignin.signIn();
//       checkemailavailability(userInfo.user.email);
//       // this.setState({userInfo});
//     } catch (error) {
//       if (error.code === statusCodes.SIGN_IN_CANCELLED) {
//         // user cancelled the login flow
//         // console.log('SIGN_IN_CANCELLED');
//       } else if (error.code === statusCodes.IN_PROGRESS) {
//         // operation (e.g. sign in) is in progress already
//         // console.log('IN_PROGRESS');
//       } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
//         // play services not available or outdated
//         // console.log('PLAY_SERVICES_NOT_AVAILABLE');
//       } else {
//         // some other error happened
//         console.log('error 4', error);
//       }
//     }
//   };
//   const _renderItem = ({item, index}) => {
//     return <CarouselImage data={item} />;
//   };
//   const checkemailavailability = async email => {
//     setIsloading(true);
//     // console.log('checkemailavailability');
//     dispatch(types.loadUserStart({email}));
//   };

//   const wp_login = () => {
//     Linking.openURL(
//       `https://thinkzone.authlink.me?redirectUri=thinkzoneotpless://otpless`,
//     );
//     // const waId = otplessWaId();
//     // Once you signup/sign a user, you can redirect the user to your signup/signin flow.
//     // window.open('https://thinkzone.com/home.html', '_self');
//     // API.post(`otpless_redirect`).then(res => {
//     //   console.log(res.data, 'res');
//     //   if (Object.keys(res.data).length) {
//     //     // window.open(res.data.data.intent, '_system');
//     //     Linking.openURL(res.data.data.intent);
//     //     console.log(res.data.data.intent, 'OTPlesslink--->');
//     //   }
//     //   err => {
//     //     alert('Something wnt wrong. Response: ' + JSON.stringify(err));
//     //   };
//     // });
//   };

//   return (
//     <SafeAreaView>
//       <StatusBar backgroundColor={Colors.primary} barStyle="white-content" />
//       {/* <Carousel
//         // ref={c => {
//         //   this._carousel = c;
//         // }}

//         data={image}
//         renderItem={_renderItem}
//         sliderWidth={window.WindowWidth}
//         itemWidth={355}
//       /> */}
//       <ImageBackground
//         source={require('../assets/Photos/login1.gif')}
//         style={styles.root}>
//         <View
//           style={styles.bottom}
//           // style={[
//           //   styles.root,
//           //   {backgroundColor: toggleState ? '#222' : '#ebedee'},
//           // ]}
//         >
//           {/* <MockUI /> */}
//           {/* <GestureHandlerRootView style={{marginTop: 20}}>
//             <SwipeButton onToggle={handleToggle} />
//           </GestureHandlerRootView> */}
//           {/* <View>
//             <TouchableOpacity>
//               <Image
//                 source={require('../assets/Photos/sign.png')}
//                 style={{
//                   width: 350,
//                   height: 45,
//                   marginTop: 552,
//                   justifyContent: 'center',
//                   marginLeft: 20,
//                 }}
//               />
//             </TouchableOpacity>
//           </View> */}

//           <TouchableOpacity
//             onPress={handleToggle}
//             style={{
//               margin: 8,
//               paddingLeft: 20,
//               paddingRight: 20,
//               paddingTop: 5,
//               paddingBottom: 5,
//               height: 45,
//               width: window.WindowWidth * 0.9,
//               justifyContent: isLoading ? 'center' : 'flex-start',
//               alignItems: 'center',
//               marginTop: 450,
//               backgroundColor: 'white',
//               flexDirection: 'row',
//               // justifyContent: 'space-between',
//               marginRight: 10,
//               marginLeft: 10,
//               borderRadius: 5,
//             }}>
//             {isLoading ? (
//               <ActivityIndicator
//                 size="small"
//                 color={Colors.primary}
//                 style={{}}
//               />
//             ) : (
//               <>
//                 <Image
//                   source={require('../assets/Photos/googles.png')}
//                   style={{
//                     width: 24,
//                     height: 24,
//                     // marginTop: -1,

//                     // justifyContent: 'center',
//                     marginRight: 15,
//                   }}
//                 />
//                 <Text
//                   style={{
//                     width: '100%',
//                     // marginTop: -12,
//                     // justifyContent: 'center',
//                     letterSpacing: 1,
//                     alignSelf: 'center',
//                     // marginLeft: 50,
//                     fontSize: 16,
//                     fontWeight: 'bold',
//                     color: 'rgb(37, 37, 37)',
//                     fontFamily: ' Arial, Helvetica, sans-serif',
//                   }}>
//                   Continue With Google
//                 </Text>
//               </>
//             )}
//           </TouchableOpacity>

//           <TouchableOpacity
//             style={{
//               margin: 8,
//               paddingLeft: 20,
//               paddingRight: 20,
//               paddingTop: 5,
//               paddingBottom: 5,
//               height: 45,
//               width: window.WindowWidth * 0.9,
//               // justifyContent: 'center',
//               alignItems: 'center',
//               backgroundColor: 'white',
//               flexDirection: 'row',
//               // justifyContent: 'space-between',
//               marginRight: 10,
//               marginLeft: 10,
//               borderRadius: 5,
//             }}
//             id="whatsapp-login"
//             onPress={wp_login}>
//             <Image
//               source={require('../assets/Photos/w.png')}
//               style={{
//                 width: 35,
//                 height: 35,
//                 marginTop: -1,
//                 marginLeft: -5,
//               }}
//             />
//             <Text
//               style={{
//                 width: '100%',
//                 // marginTop: -12,
//                 // justifyContent: 'center',
//                 letterSpacing: 1,
//                 alignSelf: 'center',
//                 marginLeft: 10,
//                 fontSize: 16,
//                 fontWeight: 'bold',
//                 color: 'rgb(37, 37, 37)',
//                 fontFamily: ' Arial, Helvetica, sans-serif',
//               }}>
//               Continue With WhatsApp
//             </Text>
//           </TouchableOpacity>

//           <View style={{justifyContent: 'center', alignItems: 'center'}}>
//             <Text
//               onPress={() =>
//                 Linking.openURL(
//                   'https://sites.google.com/view/thinkzoneapp/home',
//                 )
//               }
//               style={{
//                 fontSize: 9,
//                 fontFamily: 'serif',
//                 fontWeight: 'bold',
//                 color: '#60ff05',
//                 textAlign: 'center',
//                 marginTop: 30,
//                 // borderWidth: 1,
//                 // borderRadius: 40,

//                 // height: 30,
//                 // width: 180,
//                 // backgroundColor: 'black',
//                 borderColor: 'white',
//               }}>
//               <Text style={{color: 'white'}}>
//                 By Continuing,You Agree To Our{' '}
//               </Text>
//               Terms & Conditions Privacy Pollicy
//             </Text>
//           </View>
//         </View>
//       </ImageBackground>
//     </SafeAreaView>
//   );
// };

// const styles = StyleSheet.create({
//   root: {
//     width: window.WindowWidth,
//     height: window.WindowHeigth,
//     display: 'flex',
//     flexDirection: 'column',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   bottom: {
//     // paddingBottom:
//   },
// });

// export default Login;
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

const Login = ({navigation}) => {
  const user = useSelector(state => state.userdata.user?.resData);
  // console.log(user, 'login page----------------->');
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
    // const data = {
    //   loginType: 'google',
    //   userid: email,
    //   emailid: email,
    // };

    // // console.log('checkemailavailability---->', data);
    // dispatch(types.loadUserStart(data));

    const data = {
      loginType: 'google',
      userid: email,
      emailid: email,
    };
    // console.log('data---->', data);
    dispatch(types.loadUserStartbyphone(data));
    // ToastAndroid.show('Authenticate Successfully !', ToastAndroid.SHORT);
  };

  const wp_login = () => {
    Linking.openURL(
      `https://thinkzone.authlink.me?redirectUri=thinkzoneotpless://otpless`,
    );
    // const waId = otplessWaId();
    // Once you signup/sign a user, you can redirect the user to your signup/signin flow.
    // window.open('https://thinkzone.com/home.html', '_self');
    // API.post(`otpless_redirect`).then(res => {
    //   console.log(res.data, 'res');
    //   if (Object.keys(res.data).length) {
    //     // window.open(res.data.data.intent, '_system');
    //     Linking.openURL(res.data.data.intent);
    //     console.log(res.data.data.intent, 'OTPlesslink--->');
    //   }
    //   err => {
    //     alert('Something wnt wrong. Response: ' + JSON.stringify(err));
    //   };
    // });
  };

  const [phone, setPhone] = useState('');
  const handlePhone = (itemValue, itemIndex) => {
    setPhone(itemValue);
    if (itemValue.length === 10) {
      const data = {
        loginType: 'otp',
        contactnumber: itemValue,
      };
      // console.log('data---->', data);
      dispatch(types.loadUserStartbyphone(data));
      navigation.navigate('OtpLogin');
    }
  };

  return (
    <View style={styles.login}>
      <View style={styles.loginChild} />
      <View style={{bottom: 5}}>
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
                Continue With Google
              </Text>
            </>
          )}
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.whatsapp}
          id="whatsapp-login"
          onPress={wp_login}>
          <Image
            source={require('../assets/Photos/w.png')}
            style={{
              width: 35,
              height: 35,
              marginTop: -1,
              marginLeft: -7,
            }}
          />
          <Text
            style={{
              width: '100%',
              // marginTop: -12,
              // justifyContent: 'center',
              // letterSpacing: 1,
              textAlign: 'left',
              left: 7,
              // marginLeft: 50,
              fontSize: 13,
              width: 250,
              fontWeight: '500',
              color: '#333333',
              fontFamily: FontFamily.poppinsMedium,
            }}>
            Continue With WhatsApp
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.mobilrno}
          // id="whatsapp-login"
          onPress={() => navigation?.navigate('MobileLogin')}
          // onPress={() =>
          //   navigation?.reset({
          //     index: 0,
          //     routes: [{name: 'MobileLogin'}],
          //   })
          // }
        >
          <Image
            source={require('../assets/Image/pngwing.png')}
            style={{
              marginTop: -1,
              marginLeft: -7,
              width: 26,
              height: 26,
            }}
          />
          <Text
            style={{
              width: '100%',
              // marginTop: -12,
              // justifyContent: 'center',
              // letterSpacing: 1,
              textAlign: 'left',
              left: 7,
              // marginLeft: 50,
              fontSize: 13,
              width: 250,
              fontWeight: '500',
              color: '#333333',
              fontFamily: FontFamily.poppinsMedium,
            }}>
            Continue With Mobile No.
          </Text>
        </TouchableOpacity>
        {/* 
        <AppTextInput
          autoCapitalize="none"
          autoCorrect={false}
          iconFirst="phone"
          maxLength={10}
          keyboardType="number-pad"
          name="name"
          placeholder="Phone Number"
          placeholderTextColor="black"
          value={phone}
          onChangeText={(itemValue, itemIndex) =>
            handlePhone(itemValue, itemIndex)
          }
        /> */}
      </View>
      <TouchableOpacity
        style={styles.byContinuingYou}
        onPress={() =>
          Linking.openURL('https://sites.google.com/view/thinkzoneapp/home')
        }>
        <Text
          style={{
            fontSize: 13,
            color: Color.primaryContrast,
            textAlign: 'center',
            marginTop: 30,
            width: 315,
            alignSelf: 'center',
            fontFamily: FontFamily.poppinsMedium,
            fontWeight: '500',
          }}>
          By continuing, You Agree to Our Terms and Conditions Privacy Policy
        </Text>
      </TouchableOpacity>
      {/* <Pressable
        style={[
          styles.rectangleParent,
          styles.groupChildLayout,
          styles.rectanglePosition,
        ]}
        onPress={() => navigation.navigate('UserRegister')}>
        <View
          style={[
            styles.groupChild,
            styles.groupChildPosition,
            styles.groupChildLayout,
          ]}
        />
        <Text style={[styles.signInWith, styles.signTypo]}>
          Sign in with Google
        </Text>
      </Pressable> */}
      {/* 
      <View style={[styles.rectangleGroup, styles.rectanglePosition]}>
        <View
          style={[
            styles.groupChild,
            styles.groupChildPosition,
            styles.groupChildLayout,
          ]}
        />
        <Text style={[styles.signInWith1, styles.signTypo]}>
          Sign in with WhatsApp
        </Text>
      </View> */}
      {/* <Image
        style={styles.kisspngGoogleLogo5b02bbe210Icon}
        resizeMode="cover"
        source={require('../assets/Image/kisspnggooglelogo5b02bbe210fa26-1.png')}
      /> */}
      {/* <Image
        style={styles.pngtreewhatsappIconWhatsapp}
        resizeMode="cover"
        source={require('../assets/Image/pngtreewhatsapp-icon-whatsapp-logo-free-5990837-1.png')}
      /> */}
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

export default Login;
