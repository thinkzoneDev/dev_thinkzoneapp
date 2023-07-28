import {StyleSheet, Text, View, Easing} from 'react-native';
import {
  CardStyleInterpolators,
  createStackNavigator,
} from '@react-navigation/stack';
import React from 'react';
import {useSelector} from 'react-redux';
import OtpLogin from '../Pages/OtpLogin';
import MobileLogin from '../Pages/MobileLogin';
import Login from '../Pages/Login';
import Register from '../Pages/Register';

const Stack = createStackNavigator();

export default function MobileNavigator() {
  const users = useSelector(state => state.userdata.user?.resData);
  console.log('usersmobile1---------->', users);
  const usersNew = useSelector(state => state.userdata.newuser);
  console.log('usersmobile---------->', usersNew, Object.keys(usersNew).length);
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
      <Stack.Screen name="MobileLogin" component={MobileLogin} />
      <Stack.Screen name="OtpLogin" component={OtpLogin} />
      <Stack.Screen name="loginpage" component={Login} />

      {/* <Stack.Screen name="register" component={Register} /> */}
      {/* <Stack.Screen name="login" component={Login} /> */}
    </Stack.Navigator>
  );
}

const styles = StyleSheet.create({});
