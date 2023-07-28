import {StyleSheet, Text, View, Modal} from 'react-native';
import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import Color from '../utils/Colors';
import EditProfile from '../Pages/EditProfile';
import Profile from '../Pages/Profile';
import Entypo from 'react-native-vector-icons/Entypo';

const Stack = createStackNavigator();
const ProfileNavigation = ({navigation}) => {
  return (
    <Stack.Navigator
      screenOptions={
        {
          // headerStyle: {
          //   backgroundColor: Color.primary,
          // },
          // headerTintColor: Color.white,
          // headerTitleStyle: {
          //   fontWeight: 'bold',
          //   // letterSpacing: 2,
          //   fontSize: 20,
          // },
        }
      }>
      <Stack.Screen
        name="profile"
        component={Profile}
        options={{
          // title: 'Profile',
          headerShown: false,
          headerLeft: () => (
            <Entypo
              style={{marginLeft: 15}}
              name="menu"
              size={25}
              color={Color.white}
              onPress={() => {
                navigation.openDrawer();
              }}
            />
          ),
          // headerRight: () => (
          //   <Entypo
          //     name="bell"
          //     size={25}
          //     color={Color.black}
          //     onPress={() => {}}
          //   />
          // ),
        }}
      />
      <Stack.Screen
        name="editprofile"
        component={EditProfile}
        options={{
          title: 'Edit Profile',
          // headerShown: false,
          headerTitleStyle: {
            fontWeight: 'bold',
            // letterSpacing: 2,
          },
        }}
      />
    </Stack.Navigator>
  );
};

export default ProfileNavigation;

const styles = StyleSheet.create({});
