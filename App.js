/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, {useEffect, useState} from 'react';
import 'react-native-gesture-handler';
import {ToastAndroid} from 'react-native';
import {
  SafeAreaView,
  useColorScheme,
  StyleSheet,
  Alert,
  Linking,
} from 'react-native';
import store from './src/redux/store/store';
import storeage from './src/utils/AsyncStorage';
import {Provider} from 'react-redux';
import {Colors} from 'react-native/Libraries/NewAppScreen';
import SwipeButton from './src/components/SwipeButton';
import RootNavigator from './src/navigation/RootNavigator';
import * as types from './src/redux/slices/UserSlice';
import {getUserstore} from './src/redux/actions/UserAction';
import SplashScreen from 'react-native-splash-screen';
import Color from './src/utils/Colors';
import FlashMessage from 'react-native-flash-message';
import messaging from '@react-native-firebase/messaging';
import {createDeepLinkingHandler} from 'react-native-deep-link';
import API from './src/environment/Api';
import {GoogleSignin} from '@react-native-google-signin/google-signin';
import dynamicLinks from '@react-native-firebase/dynamic-links';

import {NetworkProvider} from 'react-native-offline';
import {ReduxNetworkProvider} from 'react-native-offline';

const App = () => {
  const isDarkMode = useColorScheme() === 'dark';
  const [toggleState, setToggleState] = useState(false);
  const handleToggle = value => setToggleState(value);
  // const backgroundStyle = {
  //   backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  // };

  const getToken = async () => {
    const token = await messaging().getToken();
    // Alert.alert(token);
    const smallIcon = 'ic_notification';
    storeage.storeValue('fcm_token', token);

    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (enabled) {
      messaging().sendMessage({
        to: token,
        notification: {
          smallIcon: smallIcon,
        },
      });
      // console.log('Authorization status:', authStatus);
    }
  };
  useEffect(() => {
    const linkingEvent = Linking.addEventListener('url', handleDeepLink);
    Linking.getInitialURL().then(url => {
      if (url) {
        handleDeepLink({url});
      }
    });
    return () => {
      linkingEvent.remove();
    };
    // Linking.addEventListener('url', handleDynamicLink);
    // const unsubscribe = dynamicLinks().onLink(handleDynamicLink);
    // When the component is unmounted, remove the listener
    // return () => unsubscribe();
  });
  const handleDeepLink = ({url}) => {
    // console.log(url.split('?')[0], 'linkoyp');
    if (url.split('?')[0] == 'thinkzoneotpless://otpless') {
      // console.log(url, 'url matched app');
      let phone = url.split('=')[1];
      //  console.log('phone----->', phone);
      const data = {
        loginType: 'whatsapp',
        whatsappId: phone,
      };
      console.log('data---->', data);
      store.dispatch(types.loadUserStartbyphone(data));
      //ToastAndroid.show('Authenticate Successfully !', ToastAndroid.SHORT);
    }
    // console.log(url, 'url app');

    // Api.post(`otpless_auth_new/${url.split('=')[1]}`).then(response => {
    //   console.log(response.data, 'otp response');
    // });
  };
  useEffect(() => {
    GoogleSignin.configure();
  }, []);
  const buildLink = async () => {
    const link = await dynamicLinks().buildLink({
      link: 'https://thinkzone.in/offer',
      // domainUriPrefix is created in your Firebase console
      domainUriPrefix: 'https://thinkzoneapp.page.link',
      // optional setup which updates Firebase analytics campaign
      // "banner". This also needs setting up before hand
      analytics: {
        campaign: 'banner',
      },
    });
    return link;
  };
  useEffect(() => {
    buildLink();
    // Linking.openURL(url);
    // Linking.addEventListener('url', responseUrl => {
    //   console.log(responseUrl);
    // });
    // createDeepLinkingHandler.route({'/': 'blogs', '/login': {}}).then(
    //   match => {
    //     //alert("match: " + JSON.stringify(match));
    //     console.log('match: ', JSON.stringify(match));
    //     const token = match.$args.token;

    //     // Redirect to Whatsapp
    //     API.post(`otpless_auth/${token}`).then(res => console.log(res, 'res'));
    //     // await this.api.otpless_auth(token).subscribe(
    //     //   res => {
    //     //     //alert("Res: " + JSON.stringify(res));
    //     //     console.log('Res: ' + JSON.stringify(res));
    //     //     //if (Object.keys(res).length) window.open(res.data.intent, "_system");
    //     //   },
    //     //   err => {
    //     //     //alert("Err: " + JSON.stringify(err));
    //     //   },
    //     // );
    //     /*
    //     // Run the navigation in the Angular zone
    //     const path = `/${match.$route}/${match.$args["slug"]}`;
    //     console.log("Deeplink path: ", JSON.stringify(path));
    //     this.zone.run(() => {
    //       this.router.navigateByUrl(path);
    //     });
    //     */
    //   },
    //   nomatch => {
    //     //alert("nomatch: " + JSON.stringify(nomatch));
    //     console.log("Deeplink that didn't match", JSON.stringify(nomatch));
    //   },
    // );

    getToken();

    // messaging().onMessage(remotoMessage => {
    //   Alert.alert(JSON.stringify(remotoMessage));
    //   console.log(remotoMessage, 'monalisa fcm3');
    // });
    // messaging().setBackgroundMessageHandler(async remoteMessage => {
    //   console.log('Message handled in the background!', remoteMessage);
    //   navigation.navigate(`${remoteMessage.data.navigateto}`);
    // });
    // store.dispatch(getUserstore());
    SplashScreen.hide();
    store.dispatch(types.getUserstorestart());
    // const user = storeage.getObject('@user_data');
    // console.log(user, 'user');
    // When the component is unmounted, remove the listener
    // return () => unsubscribe();
  }, []);

  return (
    <Provider store={store}>
      <ReduxNetworkProvider>
        <NetworkProvider>
          <RootNavigator />
        </NetworkProvider>
      </ReduxNetworkProvider>
      <FlashMessage position="top" />
    </Provider>
  );
};

const styles = StyleSheet.create({
  // safeview: {
  //   flex: 0,
  //   backgroundColor: Color.primary,
  //   // paddingTop: Platform.OS === 'android' ? 25 : 0,
  // },
});
export default App;
