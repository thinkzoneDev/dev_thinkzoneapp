import {
  StyleSheet,
  Text,
  View,
  FlatList,
  Linking,
  Image,
  TouchableOpacity,
  Alert,
  ScrollView,
  RefreshControl,
  ActivityIndicator,
  Pressable,
} from 'react-native';
import React, {useEffect, useState, useCallback} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {useFocusEffect} from '@react-navigation/native';
import {Color, FontFamily, FontSize, Border} from '../GlobalStyle';
import Api from '../environment/Api';

import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
const Header = ({route, navigation}) => {
  const userdatas = useSelector(state => state.userdata.user?.resData);

  const [userdata, setUserdata] = useState(userdatas);
  useFocusEffect(
    React.useCallback(() => {
      // Do something when the screen is focused
      Api.get(`getuserbyuserid/${userdatas[0].userid}`).then(response => {
        // console.log(response.data, 'profileresponse------>');
        setUserdata(response.data);
      });
      // const email = userdatas[0].userid;
      // dispatch(types.loadUserStart(email));
    }, []),
  );
  return (
    <View style={styles.studentRegister}>
      <View style={[styles.studentRegisterChild, styles.rectangleViewBg]} />

      {userdata[0].image === '' || !userdata[0].image ? (
        <TouchableOpacity
          onPress={() =>
            navigation.navigate('profile', {
              type: 'Profile',
            })
          }>
          <Image
            // style={{
            //   width: window.WindowWidth * 0.22,
            //   height: window.WindowHeigth * 0.121,
            //   marginTop: 30,
            //   left: '15%',
            // }}
            style={styles.image}
            source={require('../assets/Photos/userss.png')}
          />
        </TouchableOpacity>
      ) : (
        <TouchableOpacity
          onPress={() =>
            navigation.navigate('profile', {
              type: 'Profile',
            })
          }>
          <Image style={styles.image} source={{uri: userdata[0].image}} />
        </TouchableOpacity>
      )}

      <Text style={[styles.helloRam]}>
        Hello, {userdata[0].firstname}{''}{' '}
        <MaterialCommunityIcons
          name="hand-wave"
          size={17}
          color={'#FDDA02'}
          style={{
            marginLeft: 285,
            marginTop: -30,
            // paddingBottom: 40,
          }}
        />
      </Text>

      {/* <Text style={styles.completeYourNext}>Complete your next step .</Text> */}
    </View>
  );
};

export default Header;

const styles = StyleSheet.create({
  rectangleViewBg: {
    backgroundColor: Color.royalblue,
    position: 'absolute',
  },
  text: {
    textAlign: 'right',
    color: Color.dimgray_100,
    fontFamily: FontFamily.poppinsRegular,
    fontSize: 12,
    marginTop: -7.43,
    height: 15,
    top: '50%',
    left: '0%',
    position: 'absolute',
    width: '100%',
  },
  studentRegisterChild: {
    height: '16%',
    width: '107.22%',
    top: '0.25%',
    right: '-4.44%',
    bottom: '83.75%',
    left: '-2.78%',
  },
  text1: {
    color: Color.primaryContrast,
    textAlign: 'right',
    fontFamily: FontFamily.poppinsRegular,
    fontSize: 12,
    marginTop: -7.43,
    height: 15,
    top: '50%',
    left: '0%',
    position: 'absolute',
    width: '100%',
  },
  helloRam: {
    // marginTop: -20,
    // height: '2.38%',
    width: '70.89%',
    fontSize: FontSize.size_lg,
    fontWeight: '900',
    fontFamily: FontFamily.poppinsSemibold,
    textAlign: 'left',
    left: '28.39%',
    top: '6%',
    color: Color.primaryContrast,
    position: 'absolute',
    textTransform: 'capitalize',
  },
  completeYourNext: {
    // height: '5.25%',
    width: '48.06%',
    top: '9.13%',
    fontFamily: FontFamily.poppinsMedium,
    fontWeight: '500',
    fontSize: FontSize.size_smi,
    textAlign: 'left',
    left: '28.39%',
    color: Color.primaryContrast,
    position: 'absolute',
  },
  icons8SoSo481: {
    height: '2.13%',
    width: '5.28%',
    top: '6.63%',
    right: '37.78%',
    bottom: '91.25%',
    left: '56.94%',
  },
  iconnotificationnotification: {
    // height: '4.38%',
    // width: '9.72%',
    top: '6.38%',
    // bottom: '75.25%',
    left: '81.11%',
    right: '9.17%',
    // maxHeight: '100%',
    // maxWidth: '100%',
    position: 'absolute',
    // overflow: 'hidden',
  },
  studentRegisterInner: {
    // height: '46.5%',
    width: '91.39%',
    // top: '18.13%',
    right: '4.17%',
    bottom: '35.38%',
    left: '4.44%',
    // borderRadius: Border.br_7xs,
  },
  rectangleView: {
    height: '4.88%',
    width: '31.39%',
    top: '58.13%',
    right: '34.17%',
    bottom: '37%',
    left: '34.44%',
    // borderRadius: Border.br_xl,
  },

  groupChild: {
    // height: '74.51%',
    // bottom: '25.49%',
    // borderRadius: Border.br_7xs,
    backgroundColor: Color.aliceblue_100,
    left: '0%',
    right: '0%',
    top: '0%',
  },
  iconessentialtrushSquare: {
    width: '8.33%',
    // top: '20%',
    // bottom: '76.25%',
    left: '81.94%',
    right: '9.72%',
    height: '3.75%',
    maxHeight: '100%',
    maxWidth: '100%',
    // position: 'absolute',
    // overflow: 'hidden',
  },
  groupChild2: {
    height: '99.24%',
    width: '99.94%',
    top: '99.24%',
    right: '-99.94%',
    // bottom: '-98.48%',
    left: '100%',
    // borderBottomRightRadius: Border.br_7xs,
    // borderBottomLeftRadius: Border.br_7xs,
    shadowColor: 'rgba(0, 0, 0, 0.25)',
    shadowOffset: {
      width: 4,
      height: 0,
    },
    shadowRadius: 3,
    elevation: 3,
    shadowOpacity: 1,
    transform: [
      {
        rotate: '179.88deg',
      },
    ],
  },
  studentRegister: {
    flex: 1,
    height: 800,

    // overflow: 'hidden',
    width: '100%',
    backgroundColor: Color.aliceblue_100,
  },
  button: {
    backgroundColor: 'red',
  },
  image: {
    height: 90,
    width: 90,
    borderRadius: 75,
    // alignSelf: 'left',
    marginTop: 20,
    left: '2.4%',
  },
});
