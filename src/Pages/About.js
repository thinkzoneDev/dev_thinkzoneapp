import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Alert,
  Image,
  ScrollView,
} from 'react-native';
import React from 'react';

const Fln = ({navigation}) => {
  return (
    <View style={styles.container}>
      <ScrollView>
        <Image
          style={styles.tinyLogo}
          source={require('../assets/Photos/about_us.png')}
        />
      </ScrollView>
    </View>
  );
};

export default Fln;

const styles = StyleSheet.create({
  tinyLogo: {
    width: '100%',
    height: 815,
  },
});
