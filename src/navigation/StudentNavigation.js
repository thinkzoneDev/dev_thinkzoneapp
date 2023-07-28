import {StyleSheet, Text, View, Modal} from 'react-native';
import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import Color from '../utils/Colors';
import StudentList from '../Pages/StudentList';
import StudentAttendance from '../Pages/StudentAttendance';
import CallList from '../Pages/CallList';
import StudentRegister from '../Pages/StudentRegister';
import CustomModal from '../components/CustomModal';

const Stack = createStackNavigator();
const StudentNavigation = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: Color.primary,
        },
        headerTintColor: Color.white,
        headerTitleStyle: {
          fontWeight: 'bold',
          letterSpacing: 2,
          fontSize: 25,
        },
      }}>
      <Stack.Screen
        name="home"
        component={CustomModal}
        options={{
          title: 'Student Module',
          //   headerLeft: () => (
          //     <Entypo
          //       name="menu"
          //       size={35}
          //       color={Color.white}
          //       onPress={() => {
          //         navigation.openDrawer();
          //       }}
          //     />
          //   ),
          //   headerRight: () => (
          //     <Entypo
          //       name="bell"
          //       size={25}
          //       color={Color.black}
          //       onPress={() => {}}
          //     />
          //   ),
        }}
      />
      <Stack.Screen
        name="studentlist"
        component={StudentList}
        options={{
          title: 'Student Details',
          headerTitleStyle: {
            fontWeight: 'bold',
            letterSpacing: 2,
          },
        }}
      />
      <Stack.Screen
        name="studentregister"
        component={StudentRegister}
        options={{title: 'Student Register'}}
      />
      <Stack.Screen
        name="studentAttendance"
        component={StudentAttendance}
        options={{title: 'Student Attendance'}}
      />
      <Stack.Screen
        name="calllist"
        component={CallList}
        options={{title: 'Call List', headerShown: false}}
      />
    </Stack.Navigator>
  );
};

export default StudentNavigation;

const styles = StyleSheet.create({});
