import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Alert,
  Image,
  ScrollView,
  Modal,
  ImageBackground,
} from 'react-native';
import * as window from '../utils/dimensions';

import React from 'react';

const ServerError = ({navigation, message}) => {
  return (
    <ScrollView>
      <View style={styles.container}>
        <ImageBackground
          style={styles.root}
          source={require('../assets/Photos/bg.jpg')}>
          <Text style={styles.username}>{message}</Text>
          <Image
            style={styles.tinyLogos}
            source={require('../assets/Photos/500.png')}></Image>
          {/* <Image
              style={styles.tinyLogo}
              source={require('../assets/Photos/servererror.gif')}
            /> */}
          <Text style={styles.score}>
            {' '}
            We are Working on fixing the problem,We will be back soon
          </Text>
        </ImageBackground>
      </View>
    </ScrollView>
  );
};

export default ServerError;

const styles = StyleSheet.create({
  root: {
    width: window.WindowWidth,
    height: window.WindowHeigth,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  score: {
    fontSize: 15,
    fontFamily: 'Poppins-Thin',
    color: '#01507B',
    marginBottom: 15,
    textAlign: 'center',
    fontWeight: '900',
    paddingLeft: 12,
    paddingRight: 12,
    marginTop: 50,
  },
  username: {
    fontSize: 13,
    fontFamily: 'Poppins-Thin',
    color: 'red',
    marginTop: -30,
    // marginBottom: 15,
    paddingBottom: 50,
    textAlign: 'center',
    fontWeight: '900',
  },
  tinyLogos: {
    width: window.WindowWidth * 0.9,
    height: window.WindowHeigth * 0.5,
    marginLeft: 22,

    // marginTop: -30,
  },
});
