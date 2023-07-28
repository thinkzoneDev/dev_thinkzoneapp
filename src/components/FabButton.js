import {
  TouchableOpacity,
  StyleSheet,
  Text,
  Pressable,
  Image,
} from 'react-native';
import React from 'react';
import Icon from 'react-native-vector-icons/FontAwesome';
import * as window from '../utils/dimensions';

import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
// import Color from '../utils/Colors';
import {Color, FontFamily, FontSize, Border} from '../GlobalStyle';

const FabButton = ({onPress, title, image, IconComponent, IconComponent1}) => {
  return (
    <Pressable style={styles.container} onPress={onPress}>
      {IconComponent}
      {IconComponent1}
      {/* {image && (
        // <Image
        //   style={[styles.image, {marginTop: -25, width: 50}]}
        //   source={image}
        // />
        <Icon color={'#3e3e3e'} name="share-2" style={styles.title} size={25} />
      )} */}
      <Text style={styles.share}>
        Share{' '}
        <Icon color={'white'} name="share" style={styles.title} size={15} />
      </Text>
    </Pressable>
  );
};

export default FabButton;

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
    position: 'absolute',
    // bottom: 70,
    right: 5,
    // backgroundColor: '#99BFEA',
    backgroundColor: Color.royalblue,
    paddingHorizontal: 20,
    // paddingVertical: 10,
    // paddingTop: 50,
    // paddingBottom: 10,
    width: window.WindowWidth * 0.4,
    height: 40,
    // marginTop: 48,
  },

  title: {
    // fontSize: 18,
    // color: '#fff',
    // fontWeight: 'bold',
    // marginTop: -10,
  },
  share: {
    // marginTop: -10,
    // color: '#3e3e3e',
    // color: 'white',
    // fontSize: 9,
    // textAlign: 'center',
    fontSize: 15,
    fontWeight: '700',
    color: Color.white,
    fontFamily: FontFamily.poppinsMedium,
  },
});
