import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  Image,
  ScrollView,
} from 'react-native';
import ListItem from '../components/ListItem';
import React, {useEffect, useState} from 'react';
import API from '../environment/Api';
import PdfViewer from '../components/PdfViewer';
import {FontFamily, FontSize, Border, Color} from '../GlobalStyle';

const FlnContent = ({route, navigation}) => {
  const [fln, setFln] = useState([]);
  const {studentDetails} = route.params;
  //   console.log(studentDetails, 'studentDetails');

  useEffect(() => {
    API.get(
      `getflnactivitydocument/${studentDetails.program}/${studentDetails.class}`,
    ).then(
      response => {
        // setContent(response.data);
        setFln(response.data);

        // console.log(response.data, 'response');
        source = {uri: response.data[0].activitydocument, cache: true};
      },
      err => {
        console.log(err);
      },
    );
  }, []);

  return (
    <View>
      <FlatList
        // keyExtractor={message => message._id}
        background
        removeClippedSubviews={true}
        maxToRenderPerBatch={10}
        initialNumToRender={10}
        updateCellsBatchingPeriod={40}
        data={fln}
        renderItem={({item, index}) => (
          <ListItem
            backgroundColor="white"
            color="black"
            onPress={() => navigation.navigate('flncontentview', {data: item})}
            image={require('../assets/Photos/bookc.png')}
            title={item.displayname.split('.')[0]}
          />
        )}
      />
    </View>
  );
};

export default FlnContent;

const styles = StyleSheet.create({});
