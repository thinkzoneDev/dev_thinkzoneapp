import {StyleSheet, Text, View, Alert} from 'react-native';
import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import AuthNavigator from './AuthNavigator';
import HomeNavigator from './HomeNavigator';
import DashboardNavigation from '../navigation/DashboardNavigation';
import {useSelector} from 'react-redux';
import RegisterNavigator from './RegisterNavigator';
import {ToastAndroid} from 'react-native';
import Login from '../Pages/Login';
import MobileNavigator from './MobileNavigator';
import Register from '../Pages/Register';
import EmailNavigator from './EmailNavigator';
import MobileLogin from '../Pages/MobileLogin';

export default function RootNavigator({props, navigation}) {
  const user = useSelector(state => state.userdata.isAuthenticated);
  const users = useSelector(state => state.userdata.user);
  console.log('users---------->', users);
  const usersNew = useSelector(state => state.userdata.newuser);
  console.log('users2root---------->', usersNew);

  return (
    <NavigationContainer>
      {
        users?.resData?.length > 0 &&
        users?.userExists == true &&
        users?.resData[0]?.phoneNumberVerified === false ? (
          // <DashboardNavigation />
          <MobileNavigator />
        ) : users?.resData?.length > 0 &&
          users?.userExists == true &&
          users?.resData[0]?.emailidVerified === false ? (
          <EmailNavigator />
        ) : users?.resData?.length > 0 &&
          // users?.userExists == true &&
          users?.resData[0]?.emailidVerified === true ? (
          <DashboardNavigation />
        ) : users?.resData?.length > 0 &&
          // users?.userExists == true &&
          users?.resData[0]?.phoneNumberVerified === true ? (
          <DashboardNavigation />
        ) : usersNew?.userExists === false && usersNew?.unique === true ? (
          <RegisterNavigator />
        ) : // <Register />
        // Object.keys(usersNew).length > 0 ? (
        //   <MobileNavigator />
        // ) :

        // usersNew?.userExists == false && usersNew?.unique == false ? (
        //   <Login />
        // ) :
        usersNew?.status == 'accessDenied' ||
          users?.status == 'accessDenied' ? (
          // ToastAndroid.show(
          //   'You no longer have access to this account. !',
          //   ToastAndroid.SHORT,
          // ) &&
          <Login />
        ) : (
          <AuthNavigator />
        )

        // (

        //
        // )
      }
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({});
