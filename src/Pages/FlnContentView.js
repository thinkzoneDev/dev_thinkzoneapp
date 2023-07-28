import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import PdfViewer from '../components/PdfViewer';

const FlnContentView = ({route}) => {
  // console.log(route.params, 'route');
  const source = {uri: route.params.data.activitydocument, cache: true};
  return <PdfViewer source={source} />;
};

export default FlnContentView;

const styles = StyleSheet.create({});
