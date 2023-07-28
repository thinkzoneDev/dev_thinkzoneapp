import {StyleSheet, Text, View, Easing} from 'react-native';
import {
  CardStyleInterpolators,
  createStackNavigator,
} from '@react-navigation/stack';
import React from 'react';
import Login from '../Pages/Login';
import Landingpage from '../Pages/Landingpage';
import Landingpage1 from '../Pages/Landingpage1';
import FirstScreen from '../Pages/FirstScreen';
import OtpLogin from '../Pages/OtpLogin';
import MobileLogin from '../Pages/MobileLogin';
import Register from '../Pages/Register';

import Loding from '../Pages/Loading';
import EmailPage from '../Pages/EmailPage';
const Stack = createStackNavigator();

export default function AuthNavigator() {
  // const config = {
  //   animation: 'spring',
  //   config: {
  //     stiffness: 1000,
  //     damping: 50,
  //     mass: 3,
  //     overshootClamping: false,
  //     restDisplacementThreshold: 0.01,
  //     restSpeedThreshold: 0.01,
  //   },
  // };
  // const closeConfig = {
  //   animation: 'timing',
  //   config: {
  //     duration: 200,
  //     easing: Easing.linear,
  //   },
  // };
  // const user = useSelector(state => state.userdata.user);
  // const [timeout, setTimeout] = useState(false);

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        // gestureEnabled: true,
        // gestureDirection: 'horizontal',
        // transitionSpec: {
        //   open: config,
        //   close: closeConfig,
        // },
        // cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
      }}>
      <Stack.Screen name="loding" component={Loding} />
      <Stack.Screen name="firstScreen" component={FirstScreen} />

      <Stack.Screen name="landing" component={Landingpage} />
      <Stack.Screen name="landing1" component={Landingpage1} />

      <Stack.Screen name="login" component={Login} />
      <Stack.Screen name="MobileLogin" component={MobileLogin} />

      <Stack.Screen name="OtpLogin" component={OtpLogin} />
      <Stack.Screen name="Register" component={Register} />
      <Stack.Screen name="emailPage" component={EmailPage} />
    </Stack.Navigator>
  );
}

const styles = StyleSheet.create({});
