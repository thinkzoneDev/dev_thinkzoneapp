import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  FlatList,
  Image,
  PanResponder,
  AppState,
} from 'react-native';
import React from 'react';
import {useEffect, useState, useRef} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import API from '../environment/Api';
import ListItem from '../components/ListItem';
import * as window from '../utils/dimensions';

import * as FcmSlice from '../redux/slices/FcmSlice';
// import Color from '../utils/Colors';

import {FontFamily, Color, FontSize, Border} from '../GlobalStyle';
import {ScrollView} from 'react-native-gesture-handler';

const Books = ({navigation}) => {
  const appState = useRef(AppState.currentState);
  const [appStateVisible, setAppStateVisible] = useState(appState.current);
  let stTime = new Date().getTime();
  const [appType, setAppType] = useState('teacherapp');
  const [books, setBooks] = useState([]);
  // console.log("books----->",books);
  const teacherdata = useSelector(state => state.userdata.user?.resData);
  const dispatch = useDispatch();
  // useEffect(() => {
  //   const stTime = new Date().getTime();
  //   return () => {
  //     const clTime = new Date().getTime();
  //     const timeSpent = (clTime - stTime) / 1000;
  //
  //   };
  // }, []);

  useEffect(() => {
    dispatch(FcmSlice.clearfcmMessage({}));

    const subscription = AppState.addEventListener('change', nextAppState => {
      if (nextAppState == 'background') {
        // subscription.remove();
        const clTime = new Date().getTime();
        const timeSpent = (clTime - stTime) / 1000;
        const duration = Math.floor(timeSpent);
        const year = new Date().getFullYear();
        const month = new Date().getMonth() + 1;
        const data = {
          userid: teacherdata[0].userid,
          username: teacherdata[0].username,
          usertype: teacherdata[0].usertype,
          managerid: teacherdata[0].managerid,
          passcode: teacherdata[0].passcode,
          modulename: 'fln',
          duration: duration,
          month: month,
          year: year,
        };

        API.post(`savetimespentrecord/`, data).then(response => {});
      } else {
        stTime = new Date().getTime();
      }
      appState.current = nextAppState;
      setAppStateVisible(appState.current);
    });

    return () => {
      subscription.remove();
      const clTime = new Date().getTime();
      const timeSpent = (clTime - stTime) / 1000;
      const duration = Math.floor(timeSpent);
      const year = new Date().getFullYear();
      const month = new Date().getMonth() + 1;

      //

      const data = {
        userid: teacherdata[0].userid,
        username: teacherdata[0].username,
        usertype: teacherdata[0].usertype,
        managerid: teacherdata[0].managerid,
        managername: teacherdata[0].managername,
        passcode: teacherdata[0].passcode,
        modulename: 'reading',
        duration: duration,
        month: month,
        year: year,
      };
      API.post(
        `savetimespentrecord/`,
        data,
        // ,
      ).then(response => {});
    };
  }, []);

  useEffect(() => {
    API.get(`getdistinctdirectorylistbyapptype/${appType}`).then(
      response => {
        //
        setBooks(response.data);
      },
      err => {
        //
      },
    );
  }, []);
  const getAllBooks = item => {
    //
    API.get(`getallfilelistinsidedirectorybyapptype/${appType}/${item}`).then(
      response => {
        //
        navigation.navigate('booklist', response.data);
      },
      err => {
        //
      },
    );
    [];
  };

  const timerId = useRef(false);
  const [timeForInactivityInSecond, setTimeForInactivityInSecond] =
    useState(600);
  useEffect(() => {
    resetInactivityTimeout();
  }, []);

  const panResponder = React.useRef(
    PanResponder.create({
      onStartShouldSetPanResponderCapture: () => {
        resetInactivityTimeout();
      },
    }),
  ).current;

  const resetInactivityTimeout = () => {
    clearTimeout(timerId.current);
    timerId.current = setTimeout(() => {
      // action after user has been detected idle
      //
      navigation.navigate('home');
    }, timeForInactivityInSecond * 1000);
  };

  return (
    <View style={{flex: 1}} {...panResponder.panHandlers}>
      <View>
        {/* <ScrollView horizontal={true}>
          {books.map((item, index) => (
            <View style={{flexDirection: 'row'}}>
              <TouchableOpacity
                onPress={() => {
                  getAllBooks(item);
                }}
                style={styles.list}>
                <View
                  style={{
                    backgroundColor: Color.royalblue,
                    width: window.WindowWidth * 0.6,
                    // height: window.WindowHeigth * 0.14,
                  }}>
                  <Text>{item}</Text>
                </View>
              </TouchableOpacity>
            </View>
          ))}
        </ScrollView> */}
        <FlatList
          removeClippedSubviews={true}
          maxToRenderPerBatch={10}
          initialNumToRender={10}
          updateCellsBatchingPeriod={40}
          data={books}
          renderItem={({item, index}) => (
            <TouchableOpacity
              onPress={() => {
                getAllBooks(item);
              }}
              style={styles.list}>
              <View>
                <Image
                  style={styles.tinyLogos}
                  source={require('../assets/Image/iconschoolbook.png')}
                />
              </View>
              <Text style={[styles.text, {flex: 1}]}>{item}</Text>
            </TouchableOpacity>
          )}
        />

        {/* <TouchableOpacity
        onPress={() => {
          handleSelection('camera');
        }}
        style={styles.modalButtonContainer}>
        <Feather name="camera" size={30} color={Color.primary} />
        <Text style={styles.modalButtonText}>Books</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => {
          handleSelection('camera');
        }}
        style={styles.modalButtonContainer}>
        <Feather name="camera" size={30} color={Color.primary} />
        <Text style={styles.modalButtonText}>Important Documents</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => {
          handleSelection('camera');
        }}
        style={styles.modalButtonContainer}>
        <Feather name="camera" size={30} color={Color.primary} />
        <Text style={styles.modalButtonText}>Resources</Text>
      </TouchableOpacity> */}
      </View>
    </View>
  );
};

export default Books;

const styles = StyleSheet.create({
  list: {
    backgroundColor: Color.white,
    paddingBottom: 12,
    marginBottom: 12,
    marginTop: 12,
    marginLeft: 12,
    marginRight: 12,
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'space-evenly',
  },
  text: {
    fontSize: 18,
    fontWeight: '600',
    paddingLeft: 12,
    paddingTop: 32,
    paddingBottom: 29,
    color: Color.greyGrey700,
  },
  tinyLogos: {
    width: 45,
    height: 45,
    marginLeft: 26,
    // backgroundColor: 'white',
    marginTop: 25,
    marginLeft: 12,
    borderRadius: 49,
  },
});
