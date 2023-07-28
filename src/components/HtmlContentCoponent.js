import {StyleSheet, Text, View, useWindowDimensions} from 'react-native';
import React from 'react';
import RenderHtml from 'react-native-render-html';
import {WebView} from 'react-native-webview';
import HTMLView from 'react-native-htmlview';

const HtmlContentCoponent = ({sourceData}) => {
  // console.log(sourceData, 'sourceData');
  // console.log(source, 'source');
  const {width} = useWindowDimensions();

  const source = {
    html: `${sourceData}`,
    // html: `<div class=\"se-component \" contenteditable=\"false\"><h1>hiii</h1><figure><audio controls=\"true\" origin-size=\",\" src=\"https://nf1f8200-a.akamaihd.net/downloads/ringtones/files/mp3/tumse-mohabbat-hai-slowed-reverb-hindi-song-59437.mp3\" data-index=\"0\" data-file-name=\"tumse-mohabbat-hai-slowed-reverb-hindi-song-59437.mp3\" data-file-size=\"0\" class=\"active\" style=\"\"></audio></figure></div>`,
    // html: `<div>Hiiiiiii</div>`,
  };
  // const htmlContent = `<div class=\"se-component \" contenteditable=\"false\"><h1>hiii</h1><figure><audio controls=\"true\" origin-size=\",\" src=\"https://nf1f8200-a.akamaihd.net/downloads/ringtones/files/mp3/tumse-mohabbat-hai-slowed-reverb-hindi-song-59437.mp3\" data-index=\"0\" data-file-name=\"tumse-mohabbat-hai-slowed-reverb-hindi-song-59437.mp3\" data-file-size=\"0\" class=\"active\" style=\"\"></audio></figure></div>`;
  // console.log(source);
  return (
    <View style={{backgroundColor: 'white', marginTop: -50}}>
      <RenderHtml
        // contentWidth={width * 0.9}
        source={source}
        tagsStyles={tagsStyles}
      />
    </View>
    // <View style={{flex: 1, flexDirection: 'row'}}>
    //   <WebView style={{flex: 1}} source={source} />
    //   {/* <HTMLView value={htmlContent} stylesheet={styles} /> */}
    // </View>
  );
};

export default HtmlContentCoponent;

const styles = StyleSheet.create({});
const tagsStyles = {
  // h1: {
  //   color: 'black',
  //   alignSelf: 'center',
  // },
  // p: {fontSize: 20, width: '90%', alignSelf: 'center'},
  // a: {
  //   color: 'green',
  // },
};
