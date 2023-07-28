import {
  StyleSheet,
  Text,
  View,
  Linking,
  Dimensions,
  Animated,
  Image,
} from 'react-native';
import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createTabNavigator} from '@react-navigation/Tab';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';

import {Color, FontFamily, FontSize, Border} from '../GlobalStyle';

import OtherStackNavigation from './OtherStackNavigation';

import ProfileNavigation from './ProfileNavigation';
import Leaderboard from '../Pages/Leaderboard';
import Myachivement from '../Pages/Myachivement';
import * as window from '../utils/dimensions';
import {useRef} from 'react';
import 'react-native-gesture-handler';

const Tab = createBottomTabNavigator();
const DashboardNavigation = () => {
  // const Tab = createTabNavigator();
  const tabOffsetValue = useRef(new Animated.Value(5)).current;

  function getWidth() {
    let width = Dimensions.get('window').width;
    width = width - 60;
    return width / 5;
  }

  const resetToHome = navigation => {
    navigation.reset({
      index: 0,
      routes: [{name: 'Home'}],
    });
  };
  return (
    <NavigationContainer independent={true}>
      <Tab.Navigator
        initialRouteName="Home"
        tabBarOptions={{
          showLabel: false,
          // Floating Tab Bar...
          style: {
            backgroundColor: 'white',
            position: 'absolute',
            bottom: 40,
            marginHorizontal: 20,

            height: 60,
            borderRadius: 10,

            shadowColor: '#000',
            shadowOpacity: 0.06,
            shadowOffset: {
              width: 10,
              height: 10,
            },
            paddingHorizontal: 20,
          },
        }}>
        <Tab.Screen
          name="Home"
          component={OtherStackNavigation}
          options={{
            headerShown: false,

            title: 'Home',

            tabBarIcon: ({color, focused}) => (
              <View
                style={{
                  // centring Tab Button...
                  position: 'absolute',
                  top: 3,
                }}>
                <Image
                  source={require('../assets/Image/home.png')}
                  style={{width: 32, height: 32}}
                />
                <Text
                  style={{
                    fontSize: 10,
                    alignSelf: 'center',
                    textAlign: 'center',
                  }}>
                  Home
                </Text>
              </View>
            ),
          }}
          listeners={({navigation, route}) => ({
            // tabPress: () => resetToHome(navigation),
            // Onpress Update....
            tabPress: e => {
              // resetToHome(navigation);
              Animated.spring(tabOffsetValue, {
                toValue: 0,
                useNativeDriver: true,
              }).start();
            },
          })}
        />
        <Tab.Screen
          name="ପ୍ରୋଫାଇଲ୍"
          component={ProfileNavigation}
          options={{
            headerShown: false,

            headerStyle: {
              backgroundColor: Color.royalblue,
            },
            tabBarIcon: ({color, focused}) => (
              <View
                style={{
                  // centring Tab Button...
                  position: 'absolute',
                  top: 3,
                }}>
                <Image
                  source={require('../assets/Image/users.png')}
                  style={{width: 30, height: 30, alignSelf: 'center'}}
                />
                <Text
                  style={{
                    fontSize: 10,
                    alignSelf: 'center',
                    textAlign: 'center',
                  }}>
                  Profile
                </Text>
              </View>
            ),
          }}
          listeners={({navigation, route}) => ({
            // Onpress Update....
            tabPress: e => {
              Animated.spring(tabOffsetValue, {
                toValue: getWidth() * 1.5,
                useNativeDriver: true,
              }).start();
            },
          })}
        />
        <Tab.Screen
          name="ଲିଡ଼ର ର୍ବୋର୍ଡ଼"
          component={Leaderboard}
          options={{
            headerStyle: {
              backgroundColor: Color.royalblue,
            },
            headerTitleStyle: {
              color: Color.white,
              fontFamily: FontFamily.poppinsMedium,
            },
            tabBarIcon: ({color, focused}) => (
              <View
                style={{
                  // color: 'red',
                  // centring Tab Button...
                  position: 'absolute',
                  top: 3,
                }}>
                <Image
                  source={require('../assets/Image/ranking.png')}
                  style={{left: '30%', width: 32, height: 32}}
                />
                <Text
                  style={{
                    fontSize: 10,
                    alignSelf: 'center',
                    textAlign: 'center',
                  }}>
                  Leader board
                </Text>
              </View>
            ),
          }}
          listeners={({navigation, route}) => ({
            // Onpress Update....
            tabPress: e => {
              Animated.spring(tabOffsetValue, {
                toValue: getWidth() * 3.1,
                useNativeDriver: true,
              }).start();
            },
          })}
        />
        <Tab.Screen
          name="Rewards"
          component={Myachivement}
          options={{
            // headerShown: false,

            headerTitleStyle: {
              color: Color.white,
              fontFamily: FontFamily.poppinsMedium,
            },
            headerStyle: {
              backgroundColor: '#0060ca',
            },
            tabBarIcon: ({color, focused}) => (
              <View
                style={{
                  position: 'absolute',
                  top: 2,
                }}>
                <Image
                  source={require('../assets/Image/cup.png')}
                  style={{left: '10%', width: 32, height: 32}}
                />
                <Text
                  style={{
                    fontSize: 10,
                    alignSelf: 'center',
                    textAlign: 'center',
                  }}>
                  Reward
                </Text>
              </View>
            ),
          }}
          listeners={({navigation, route}) => ({
            // Onpress Update....
            tabPress: e => {
              Animated.spring(tabOffsetValue, {
                toValue: getWidth() * 4.4,
                useNativeDriver: true,
              }).start();
            },
          })}
        />
      </Tab.Navigator>
      <Animated.View
        style={{
          width: getWidth() - 5,
          height: 5,
          backgroundColor: Color.royalblue,
          position: 'absolute',
          bottom: 48,

          left: 20,
          borderRadius: 20,
          transform: [{translateX: tabOffsetValue}],
        }}></Animated.View>
    </NavigationContainer>
  );
};

export default DashboardNavigation;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
