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
import EmailPage from '../Pages/EmailPage';

const Stack = createStackNavigator();

export default function EmailNavigator() {
  const users = useSelector(state => state.userdata.user?.resData);
  console.log('usersmobile1---------->', users);
  const usersNew = useSelector(state => state.userdata.newuser);
  console.log('usersmobile---------->', usersNew, Object.keys(usersNew).length);

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        // headerTitleAlign: 'center',
      }}>
      <Stack.Screen
        name="email"
        component={EmailPage}
        options={{
          title: 'Welcome',
          headerTintColor: '#000',
          headerTitleStyle: {
            fontWeight: '600',
            letterSpacing: 0.7,
          },
        }}
      />
    </Stack.Navigator>
  );
}

const styles = StyleSheet.create({});
