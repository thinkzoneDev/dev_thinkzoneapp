import {
  StyleSheet,
  Text,
  View,
  Image,
  Linking,
  Pressable,
  TouchableOpacity,
} from 'react-native';
import React from 'react';
import Home from '../Pages/Home';
import Profile from '../Pages/Profile';
import {
  DrawerContentScrollView,
  DrawerItemList,
  DrawerItem,
} from '@react-navigation/drawer';

import Entypo from 'react-native-vector-icons/Entypo';
import ImageBackground from 'react-native/Libraries/Image/ImageBackground';
import IconEntypo from 'react-native-vector-icons/Entypo';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {GoogleSignin} from '@react-native-google-signin/google-signin';
import storage from '../utils/AsyncStorage';
import {useDispatch, useSelector} from 'react-redux';
import * as types from '../redux/slices/UserSlice';
import * as window from '../utils/dimensions';
import Colors from '../utils/Colors';
import Color from '../utils/Colors';

import Separator from './Separator';
import {useEffect} from 'react';

const SideBar = props => {
  const dispatch = useDispatch();
  const user = useSelector(state => state.userdata.user?.resData);
  // const user = [];
  // user.push(userdata);
  // console.log('userdata---->', userdata);
  console.log(user, 'user');
  const logOut = async () => {
    // console.log('clicked');
    try {
      await GoogleSignin.hasPlayServices();
      // await  GoogleSignin.signOut();
      GoogleSignin.signOut()
        .then(res => {
          // console.log(res);
        })
        .catch(err => {
          // console.log(err, 'err');
        });
      dispatch(types.logOutUser());
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <View style={{flex: 1}}>
      <DrawerContentScrollView {...props}>
        {/* <ImageBackground
          source={require('../assets/Photos/profile-screen-bg.png')}
          style={{padding: 20}}> */}
        <View style={styles.sidebarHeader}>
          {/* {user.length > 0 ? ( */}
          {/* {user.image === !"/assets/img/default-user-profile-image.png" ? (
            <Image
              source={{
                uri: user.image,
              }}
              // source={require('../assets/Photos/user.png')}
              style={{
                height: 50,
                width: 50,
                borderRadius: 25,
                margin: 15,
                alignSelf: 'center',
              }}
            />
          ) : (
            <Image
              source={require('../assets/Photos/user.png')}
              style={{
                height: 50,
                width: 50,
                borderRadius: 25,
                margin: 15,
                alignSelf: 'center',
              }}
            />
          )} */}

          {user[0]?.image === '' || !user[0]?.image ? (
            <View>
              <Image
                style={styles.image}
                source={require('../assets/Photos/userss.png')}
              />
            </View>
          ) : (
            <View>
              <Image style={styles.image} source={{uri: user.image}} />
            </View>
          )}

          {user.length > 0 ? (
            <View
              style={{
                marginTop: 15,
                justifyContent: 'flex-start',
                marginLeft: 10,
              }}>
              <Text
                style={{
                  fontWeight: 'bold',
                  color: Colors.primary,
                  fontSize: 16,
                  textTransform: 'capitalize',
                  justifyContent: 'center',
                }}>
                {user[0]?.username}
              </Text>
              <Text
                style={{
                  alignSelf: 'center',
                  fontWeight: 'bold',
                  fontSize: 10,
                  justifyContent: 'center',
                  textAlign: 'left',
                }}>
                {user[0]?.userid}
              </Text>
            </View>
          ) : (
            <></>
          )}
        </View>
        <Separator height={0.5} color={Colors.greyPrimary} />
        {/* </ImageBackground> */}
        <View style={{margin: 10, marginTop: 20}}>
          <DrawerItemList {...props}></DrawerItemList>
          <TouchableOpacity
            onPress={() =>
              Linking.openURL(
                'https://play.google.com/store/apps/details?id=com.nrusingh.teacher_thinkzone1',
              )
            }
            style={{flexDirection: 'row'}}>
            {/* <Image
                source={require('../assets/Photos/logo1.png')}
                style={styles.logo}
              /> */}
            <MaterialIcons
              style={{marginLeft: 17, marginTop: 20}}
              name="system-update"
              size={24}
              color={'gray'}
              onPress={() =>
                Linking.openURL(
                  'https://play.google.com/store/apps/details?id=com.nrusingh.teacher_thinkzone1',
                )
              }
            />
            <Text
              style={{
                marginLeft: 30,
                marginTop: 20,
                fontWeight: '500',
                color: 'gray',
              }}>
              ଅପଡେଟ୍ କରନ୍ତୁ
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() =>
              Linking.openURL('https://sites.google.com/view/thinkzoneapp/home')
            }
            style={{flexDirection: 'row'}}>
            {/* <Image
                source={require('../assets/Photos/logo1.png')}
                style={styles.logo}
              /> */}
            <Entypo
              style={{marginLeft: 17, marginTop: 40}}
              name="news"
              size={24}
              color={'gray'}
              onPress={() =>
                Linking.openURL(
                  'https://sites.google.com/view/thinkzoneapp/home',
                )
              }
            />
            <Text
              style={{
                marginLeft: 30,
                marginTop: 40,
                fontWeight: '500',
                color: 'gray',
              }}>
              Privacy Policy
            </Text>
          </TouchableOpacity>

          {/* <DrawerItem
            label="Privacy Policy"
            options={{
              // headerShown: false,
              headerTitleStyle: {
                color: Colors.white,
              },
              headerStyle: {
                backgroundColor: Colors.primary,
              },
              drawerIcon: ({color}) => (
                <Entypo name="user" size={23} color={'black'} />
              ),
            }}
          /> */}
        </View>
      </DrawerContentScrollView>
      <Separator height={0.7} color={Colors.greyPrimary} />
      <View style={styles.containerlogout}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginTop: 10,
            marginBottom: 20,
          }}>
          <View style={{flexDirection: 'row'}}>
            <FontAwesome
              onPress={() => {
                Linking.openURL(
                  'https://api.whatsapp.com/send?phone=919178198947',
                );
              }}
              name="whatsapp"
              color={Colors.success}
              size={20}
              style={{margin: 2}}
            />
            <Text
              style={{color: 'black', fontWeight: '900', fontSize: 12}}
              onPress={() => {
                Linking.openURL(
                  'https://api.whatsapp.com/send?phone=919178198947',
                );
              }}>
              WhatsApp
            </Text>
          </View>
          <View style={{flexDirection: 'row'}}>
            <MaterialIcons
              name="connect-without-contact"
              color={Colors.success}
              size={20}
              style={{margin: 2}}
            />
            <Text
              style={{color: 'black', fontWeight: '900', fontSize: 12}}
              onPress={() => {
                Linking.openURL('tel:09178198947');
              }}>
              Contact Us
            </Text>
          </View>
        </View>
        {/* <View
          style={{
            // borderWidth: 2,
            borderRadius: 5,
            alignSelf: 'center',
            // borderColor: Colors.danger,
            flexDirection: 'row',
            backgroundColor: '#ffc7bb',
            padding: 5,
            elevation: 5,
            paddingLeft: 19,
            paddingRight: 19,
          }}>
          <Text
            style={{color: 'red', fontWeight: '900', fontSize: 13}}
            onPress={logOut}>
            ଲଗ୍ ଆଉଟ୍
          </Text>
          <IconEntypo
            name="log-out"
            color="red"
            size={13}
            style={{margin: 5}}
          />
        </View> */}

        <View style={{flexDirection: 'row'}}>
          <TouchableOpacity
            style={{
              // borderWidth: 2,
              borderRadius: 5,
              alignSelf: 'center',
              // borderColor: Colors.danger,
              flexDirection: 'row',
              backgroundColor: '#ffc7bb',
              padding: 5,
              elevation: 5,
              paddingLeft: 19,
              paddingRight: 19,
              marginLeft: 59,
            }}
            onPress={logOut}>
            <Text style={{color: 'red', fontWeight: '900', fontSize: 15}}>
              {' '}
              ଲଗ୍ ଆଉଟ୍
            </Text>
            <IconEntypo
              name="log-out"
              color="red"
              size={13}
              style={{margin: 5}}
            />
          </TouchableOpacity>
        </View>
        <View style={{marginTop: 12, marginLeft: 39}}>
          <Text style={{color: 'black', fontWeight: 'bold'}}>
            {' '}
            App Version : 1.8.6
          </Text>
        </View>
      </View>
    </View>
  );
};

export default SideBar;

const styles = StyleSheet.create({
  containerlogout: {
    // flexDirection: 'row',
    justifyContent: 'center',
    padding: 20,
    marginBottom: 20,
    // marginBottom: window.WindowHeigth * 0.2,
    // borderWidth: 2,
    // borderColor: Colors.danger,
  },
  sidebarHeader: {
    flexDirection: 'row',
    marginTop: 10,
    marginBottom: 15,
  },
  image: {
    height: 65,
    width: 65,
    borderRadius: 75,
    alignSelf: 'center',
    marginTop: 5,
    marginLeft: 10,
  },
});
