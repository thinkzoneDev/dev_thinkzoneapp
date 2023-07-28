import {StyleSheet, Text, View, Image} from 'react-native';
import React from 'react';
import Color from '../utils/Colors';
import {text} from 'd3';

const ModuleComponent = ({imageUrl, textdata}) => {
  return (
    <View
      style={{
        height: 130,
        width: 130,
        // marginLeft: 20,
        marginLeft: 1,
        borderWidth: 0.05,
        borderColor: Color.black,
      }}>
      <View
        style={{
          flex: 2.5,
          // borderWidth: 1,
          borderRadius: 5,
          borderColor: Color.primary,
          // backgroundColor: Color.white,
        }}>
        <Image
          source={imageUrl}
          style={{
            flex: 1,
            width: '90%',
            height: '100%',
            margin: 5,
            resizeMode: 'cover',
            shadowColor: Color.black,
          }}
        />
      </View>
      <View style={{flex: 0.5, alignSelf: 'center'}}>
        <Text style={{color: Color.black, fontSize: 19, fontWeight: 'bold'}}>
          {textdata}
        </Text>
      </View>
    </View>
  );
};

export default ModuleComponent;

const styles = StyleSheet.create({});
