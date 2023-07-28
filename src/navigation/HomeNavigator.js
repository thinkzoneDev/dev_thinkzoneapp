import {StyleSheet, Text, View, SafeAreaView, Image} from 'react-native';
import React from 'react';
import Profile from '../Pages/Profile';
import {createDrawerNavigator} from '@react-navigation/drawer';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import Feather from 'react-native-vector-icons/Feather';
import Entypo from 'react-native-vector-icons/Entypo';
import IconFontAwesome from 'react-native-vector-icons/FontAwesome';
import {useSelector} from 'react-redux';
import RegisterNavigator from './RegisterNavigator';
import DashboardNavigation from './DashboardNavigation';
import Color from '../utils/Colors';
import StudentNavigation from './StudentNavigation';
import Fln from '../Pages/Fln';
import ProfileNavigation from './ProfileNavigation';
import MonthlyTraining from '../Pages/MonthlyTraining';
import StudentRegister from '../Pages/StudentRegister';

const Drawer = createDrawerNavigator();
const Tab = createBottomTabNavigator();

export default function HomeNavigator() {
  const user = useSelector(state => state.userdata.user);
  console.log(user.length, 'homenavigation');

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: Color.primary,
        showLabel: false,
        tabBarStyle: {
          height: 56,
          position: 'absolute',
          bottom: 10,
          left: 20,
          right: 20,
          evevation: 0,
          backgroundColor: Color.white,
          borderRadius: 5,
        },
      }}>
      {user.length > 0 ? (
        <>
          <Tab.Screen
            options={{
              tabBarIcon: ({size, color}) => (
                <MaterialIcons name="dashboard" size={24} color={color} />
              ),
            }}
            name="Home"
            component={DashboardNavigation}
          />
          <Tab.Screen
            options={{
              tabBarIcon: ({size, color}) => (
                <Ionicons name="ios-people-sharp" size={24} color={color} />
              ),
            }}
            name="FLN"
            component={Fln}
          />
          <Tab.Screen
            options={{
              tabBarIcon: ({size, color}) => (
                <View>
                  <FontAwesome5
                    name="chalkboard-teacher"
                    size={size}
                    color={color}
                  />
                </View>
              ),
            }}
            name="My Profile"
            component={ProfileNavigation}
          />
          <Tab.Screen
            options={{
              tabBarIcon: ({size, color}) => (
                <Feather name="activity" size={24} color={color} />
              ),
            }}
            name="Add Student"
            component={StudentRegister}
          />
          <Tab.Screen
            options={{
              tabBarIcon: ({size, color}) => (
                <Entypo name="yelp" size={24} color={color} />
              ),
            }}
            name="Training"
            component={MonthlyTraining}
          />
        </>
      ) : (
        <Tab.Screen
          // options={{
          //   tabBarIcon: ({size, color}) => (
          //     // <Ionicons name="people-outline" size={size} color={color} />
          //   ),
          // }}
          name="Register"
          component={RegisterNavigator}
          options={{
            // hide the bottom tab bar on Contact Screen
            tabBarStyle: {display: 'none'},
          }}
        />
      )}
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({});
