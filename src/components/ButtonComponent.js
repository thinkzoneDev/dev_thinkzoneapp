import {StyleSheet, Text, View, Button} from 'react-native';
import React from 'react';
import Color from '../utils/Colors';

const ButtonComponent = ({buttonName, buttonPressed}) => {
  return (
    <View>
      <Button onPress={buttonPressed} title={buttonName} />
    </View>
  );
};

export default ButtonComponent;

const styles = StyleSheet.create({});
