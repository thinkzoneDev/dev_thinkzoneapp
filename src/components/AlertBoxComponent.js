import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import * as SIZES from '../utils/dimensions';

const AlertBoxComponent = ({title, subtitle, CancelButton, SuccessButton}) => {
  return (
    <View style={styles.alertBox}>
      <Text style={styles.alertBoxHeading}>{title}</Text>
      <Text style={styles.alertBoxSubheading}>{subtitle}</Text>
      <Button style={styles.alertBoxButtons}>{CancelButton}</Button>
      <Button style={styles.alertBoxButtons}>{SuccessButton}</Button>
    </View>
  );
};

export default AlertBoxComponent;

const styles = StyleSheet.create({
  alertBox: {
    height: SIZES.WindowHeigth * 0.3,
    width: SIZES.WindowWidth * 0.9,
  },
});
