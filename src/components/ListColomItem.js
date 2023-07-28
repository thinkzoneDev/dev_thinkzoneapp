import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import Colors from '../utils/Colors';

const ListColomItem = ({text}) => {
  return (
    <View style={styles.cards}>
      <Text style={styles.text}>{text}</Text>
    </View>
  );
};

export default ListColomItem;

const styles = StyleSheet.create({
  cards: {
    height: 100,
    width: 100,
    borderRadius: 5,
    alignSelf: 'center',
    backgroundColor: Colors.danger,
    margin: 20,
  },
});
