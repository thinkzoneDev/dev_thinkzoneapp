import React from 'react';
import Color from '../utils/Colors';
import {
  Alert,
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  DropDown,
  TouchableHighlight,
} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';

const ProgressbarIndicator = ({labels, onPress, button, backgroundColor}) => {
  return (
    <ScrollView>
      {/* <TouchableHighlight underlayColor={Color.lightSky} onPress={onPress}>
      <View style={{marginBottom: 12}} >
        <View style={styles.line} ></View>
        <View style={[styles.label,{backgroundColor:backgroundColor}]} >{button}</View>
        <View style={[styles.text, {marginBottom: 12}]}>
          <Text style={{fontSize: 12}} >{labels}</Text>
        </View>
      </View>
      </TouchableHighlight> */}
      <View>
        <Text style={{fontSize: 12}}>{labels}</Text>
      </View>
    </ScrollView>
  );
};

export default ProgressbarIndicator;
const styles = StyleSheet.create({
  label: {
    // backgroundColor: 'green',
    width: 28,
    height: 28,
    marginLeft: 14,
    borderRadius: 19,
  },
  text: {
    marginLeft: 12,
  },
  line: {
    backgroundColor: 'white',
    height: 5,
    margin: 'auto',
    top: 18,
    zIndex: -2,
  },
});
