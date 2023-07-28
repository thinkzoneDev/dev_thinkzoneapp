import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  Image,
  ScrollView,
  PanResponder,
  AppState,
} from 'react-native';
import React, {useEffect, useState, useRef} from 'react';
import DropdownComponent from '../components/DropdownComponent';
import {useDispatch, useSelector} from 'react-redux';
import API from '../environment/Api';
import ListItem from '../components/ListItem';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {Color, FontFamily, FontSize, Border} from '../GlobalStyle';
import * as window from '../utils/dimensions';

import {showMessage} from 'react-native-flash-message';

import PgeSkeleton from '../skeletons/PgeSkeleton';
import Norecord from '../components/Norecord';
import * as FcmSlice from '../redux/slices/FcmSlice';
import Modals from '../components/Modals';

const Pgeactivity = ({navigation}) => {
  const appState = useRef(AppState.currentState);
  const teacherdata = useSelector(state => state.userdata.user?.resData);
  const [appStateVisible, setAppStateVisible] = useState(appState.current);
  let stTime = new Date().getTime();
  const [subject, setSubject] = useState('odia');
  const [sclass, setSclass] = useState(1);
  const [customModal, setCustomModal] = useState(true);
  const [program, setProgram] = useState('pge');
  const [language, setLanguage] = useState('od');
  const [content, setContent] = useState([]);
  const [isLoading, setIsloading] = useState(true);
  const user = useSelector(state => state.userdata.user?.resData);
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

      // console.log('month--->', month, year);
      // console.log(timeSpent, stTime, clTime, 'ppt timestemp,h');
      const data = {
        userid: user[0].userid,
        username: user[0].username,
        usertype: user[0].usertype,
        managerid: user[0].managerid,
        managername: user[0].managername,
        passcode: user[0].passcode,
        modulename: 'pgeactivity',
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
    API.get(
      `getpgeactivityskill/${language}/${program}/${subject.toLowerCase()}/${sclass}`,
    ).then(
      response => {
        setContent(response.data);
        setIsloading(false);
      },
      err => {
        //
      },
    );
  }, [sclass, subject]);
  const getClass = item => {
    //
    setSclass(item.id);
  };
  const getSubject = item => {
    //
    // setSubject(item.class);
    setSubject(item.class);
  };
  const getTopicDetails = item => {
    //
    navigation.navigate('Content', item);

    // API.get(
    //   `getmasterpgeactivitiydetailsnostage/${item.preferedlanguage}/${item.program}/${item.subject}/${item.class}/${item.skillsetid}`,
    // ).then(suc => {
    //
    //   navigation.navigate('Content', suc.data);
    //   err => {
    //     //
    //   };
    // });
  };
  //
  // const closeModal = () => {
  //
  //   // setCustomModal(false);
  //   // navigation.goBack();
  // };

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
    <View
      style={{flex: 1, backgroundColor: Color.ghostwhite}}
      {...panResponder.panHandlers}>
      <ScrollView>
        <View>
          {/* <DropdownComponent
            data={classArr}
            onChange={getClass}
            label={'class'}
          />
          <DropdownComponent
            data={subjectArr}
            onChange={getSubject}
            label={'class'}
          /> */}
          <DropdownComponent
            data={classArr}
            onChange={getClass}
            label={'class'}
            image={require('../assets/Image/book-square.png')}
          />
          <DropdownComponent
            data={subjectArr}
            onChange={getSubject}
            label={'class'}
            image={require('../assets/Image/driver.png')}
          />

          {isLoading ? (
            <View>
              <PgeSkeleton />
            </View>
          ) : (
            <>
              {content.length > 0 ? (
                <View
                  style={{
                    backgroundColor: Color.ghostwhite,
                    flexDirection: 'row',
                    width: window.WindowWidth * 1,

                    flexWrap: 'wrap',
                    justifyContent: 'space-evenly',
                    paddingBottom: 20,
                    // marginLeft: 2,
                    borderRadius: 5,
                  }}>
                  {content.map((item, index) => (
                    <TouchableOpacity
                      onPress={() => getTopicDetails(item)}
                      style={{
                        width: 110,
                        // height: 136,
                        paddingBottom: 5,
                        backgroundColor: 'white',
                        marginTop: 20,
                        // marginLeft: 10,
                      }}>
                      <Image
                        style={styles.tinyLogo}
                        source={require('../assets/Photos/bookc.png')}
                      />
                      <Text
                        style={{
                          // width: 100,

                          // height: 26,
                          fontFamily: FontFamily.balooBhaina2Medium,
                          fontSize: 13,
                          // marginTop: -15,
                          // paddingTop: 10,
                          left: '1%',
                          color: Color.black,
                          // justifyContent: 'space-evenly',
                          top: -10,
                          textAlign: 'center',
                        }}>
                        {item.skillsetname}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              ) : (
                // <FlatList
                //   // keyExtractor={message => message._id}
                //   background
                //   removeClippedSubviews={true}
                //   maxToRenderPerBatch={10}
                //   initialNumToRender={10}
                //   updateCellsBatchingPeriod={40}
                //   data={content}
                //   renderItem={({item, index}) => (
                //     <ListItem
                //       backgroundColor="#1C5C72"
                //       color="white"
                //       onPress={() => getTopicDetails(item)}
                //       image={require('../assets/Photos/bookc.png')}
                //       title={item.skillsetname}
                //       subTitle={item.class}
                //     />
                //   )}
                // />
                <Norecord />
                // <Modals
                //   visible={customModal}
                //   heading={'No Topic Available'}
                //   backgroundColor={'white'}
                //   onpressok={() => closeModal()}
                //   okstatus={true}
                // />
              )}
            </>
          )}
        </View>
      </ScrollView>
    </View>
  );
};

export default Pgeactivity;

const styles = StyleSheet.create({
  tinyLogo: {
    width: window.WindowWidth * 0.2,
    height: window.WindowHeigth * 0.2,
    // width: 60,
    // height: 60,
    marginLeft: 20,
    marginTop: -20,

    // marginLeft: -24,
    // marginRight: -50,
  },
});
const classArr = [
  {id: 1, class: 'ଶ୍ରେଣୀ-୧'},
  {id: 2, class: 'ଶ୍ରେଣୀ-୨'},
  {id: 3, class: 'ଶ୍ରେଣୀ-୩'},
  {id: 4, class: 'ଶ୍ରେଣୀ-୪'},
  {id: 5, class: 'ଶ୍ରେଣୀ-୫'},
];
const subjectArr = [
  {id: 1, class: 'Odia'},
  {id: 2, class: 'English'},
  {id: 3, class: 'Math'},
  {id: 4, class: 'EVS'},
];
