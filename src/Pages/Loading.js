import React, {useState} from 'react';
import {StyleSheet, View, ImageBackground} from 'react-native';

const Loding = ({navigation}) => {
  const [timeout, setTimeout] = useState('');

  const load = () => {
    setTimeout(() => {
      navigation.navigate('firstScreen');
    }, 2000);
  };
  return (
    <View style={styles.container}>
      <ImageBackground
        source={require('../assets/Image/note-loader.gif')}
        resizeMode="cover"
        onLoad={load}
        style={styles.image}></ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  image: {
    flex: 1,
    justifyContent: 'center',
  },
  text: {
    color: 'white',
    fontSize: 42,
    lineHeight: 84,
    fontWeight: 'bold',
    textAlign: 'center',
    backgroundColor: '#000000c0',
  },
});

export default Loding;
