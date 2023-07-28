import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import Colors from '../utils/Colors';

const Separator = ({height, color, margin}) => {
  return (
    <View
      style={[
        styles.separator,
        {height, backgroundColor: color, margin: margin},
      ]}
    />
  );
};

export default Separator;

const styles = StyleSheet.create({
  separator: {
    width: '100%',
    height: 1,
  },
});
