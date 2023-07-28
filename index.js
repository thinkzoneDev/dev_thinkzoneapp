/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import './src/utils/i18n';
import messaging from '@react-native-firebase/messaging';
import {useDispatch, useSelector} from 'react-redux';
import * as FcmSlice from './src/redux/slices/FcmSlice';
import store from './src/redux/store/store';

// import {useNavigation} from '@react-navigation/native';
// const navigation = useNavigation();
// const dispatch = useDispatch();
messaging().setBackgroundMessageHandler(async remoteMessage => {
  // navigation.navigate(`${remoteMessage.data.navigateto}`);
  // dispatch(FcmSlice.getfcmMessage({ remoteMessage }));
  store.dispatch(FcmSlice.getfcmMessage(remoteMessage));
  console.log('Message handled in the background! index', remoteMessage);
});

AppRegistry.registerComponent(appName, () => App);
