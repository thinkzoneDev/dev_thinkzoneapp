import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import PdfViewer from '../components/PdfViewer';

const BookView = ({route}) => {
  // console.log(route.params, 'route');
  const source = {
    uri: route.params.s3path,
    cache: true,
    cacheFileName: `${route.params.displayname}`,
  };
  // console.log('source-->', source);
  return <PdfViewer source={source} />;
  // (
  //   <View>
  //     <Text>helllo</Text>
  //   </View>
  // )
};

export default BookView;

const styles = StyleSheet.create({});
