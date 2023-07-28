import React from 'react';
import {StyleSheet, StatusBar, View, Text, Image} from 'react-native';
import Color from '../utils/Colors';
import * as window from '../utils/dimensions';
import {useDispatch, useSelector} from 'react-redux';

const AppHeader = ({backgroundColor, data, ...props}) => {
  const user = useSelector(state => state.userdata);
  console.log(user, 'userappheader');
  return (
    <View style={styles.AppHeader}>
      <Image
        source={require('../assets/Photos/tzicon.png')}
        style={styles.images}></Image>
      <Text style={styles.AppHeaderText}>ThinkZone</Text>
      {user.user && (
        <Image
          source={{
            uri: user.user[0].image,
          }}
          style={[styles.images, styles.images2]}></Image>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  AppHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignSelf: 'center',
    borderRadius: 25,
    backgroundColor: Color.light,
    height: window.WindowHeigth * 0.06,
    width: window.WindowWidth * 0.9,
    borderWidth: 1,
    borderColor: Color.black,
    margin: 10,
  },
  AppHeaderText: {
    alignSelf: 'center',
    color: Color.greyPrimary,
    marginLeft: window.WindowWidth * 0.16,
    marginRight: window.WindowWidth * 0.16,
    fontWeight: 'bold',
    letterSpacing: 2,
    fontSize: 20,
  },
  images: {
    height: window.WindowHeigth * 0.05,
    width: window.WindowHeigth * 0.05,
    borderRadius: 1000,
    margin: 1,
  },
  images2: {
    alignSelf: 'flex-end',
  },
});

export default AppHeader;
