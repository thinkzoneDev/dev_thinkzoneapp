import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  FlatList,
  PanResponder,
  AppState,
} from 'react-native';
import React, {useState, useEffect, useRef} from 'react';
import API from '../environment/Api';
import {useDispatch, useSelector} from 'react-redux';
import PgeSkeleton from '../skeletons/PgeSkeleton';
import HorizontalScrollView from '../components/HorizontalScrollView';
import AccordianComponent from '../components/AccordianComponent';
import * as TrainingSlice from '../redux/slices/TrainingSlice';
import ServerError from '../components/ServerError';
import Norecord from '../components/Norecord';
const MonthlyTraining = ({navigation}) => {
  const dispatch = useDispatch();
  let stTime = new Date().getTime();
  const appState = useRef(AppState.currentState);
  const [appStateVisible, setAppStateVisible] = useState(appState.current);
  const user = useSelector(state => state.userdata.user?.resData);
  const moduleArr = useSelector(state => state.trainingdata.modules);
  // console.log('moduleArrhorizontal----->', moduleArr);
  const teacherdata = useSelector(state => state.userdata.user?.resData);

  const contentDetails = useSelector(
    state => state.trainingdata.contentDetails,
  );
  const userContentDetails = useSelector(
    state => state.trainingdata.userTraingDetails,
  );
  //
  //
  //
  const [currentIndex, setCurrentIndex] = React.useState(null);
  const [isLoading, setIsloading] = useState(false);
  const [language, setLanguage] = useState('od');
  // const [moduleArr, setModuleArr] = useState([]);
  const [subModule, setSubModule] = useState([]);
  const [moduleid, setModuleid] = useState('');
  const [userSubModule, setuserSubModule] = useState([]);
  // getSubModule(moduleArr[0].moduleid);
  const [err, setErr] = useState(moduleArr.length > 0 ? true : false);
  const com_use_data = () => {
    contentDetails.map(item => {});
  };
  // useEffect(() => {
  //   const stTime = new Date().getTime();
  //   return () => {
  //     const clTime = new Date().getTime();
  //     const timeSpent = (clTime - stTime) / 1000;
  //
  //   };
  // }, []);

  useEffect(() => {
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
        userid: user[0].userid,
        username: user[0].username,
        usertype: user[0].usertype,
        managerid: user[0].managerid,
        managername: user[0].managername,
        passcode: user[0].passcode,
        modulename: 'training',
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
    const data = {
      usertype: user[0].usertype,
      moduleid: moduleArr[0]?.moduleid,
      language: language,
    };
    dispatch(TrainingSlice.getContentDetailsstart({data}));
    const data1 = {
      userid: user[0].userid,
      usertype: user[0].usertype,
      moduleid: moduleArr[0]?.moduleid,
      language: language,
    };
    dispatch(TrainingSlice.getUserTrainingDetailsStart({data1}));
    // API.get(
    //   `tch_training_getmodulewisestatus/${user[0].usertype}/${user[0].userid}/${language}`,
    // ).then(
    //   response => {
    //     //
    //     // setModuleArr(response.data);
    //     getSubModule(response.data[0].moduleid);
    //     setIsloading(false);
    //   },
    //   err => {
    //
    //   },
    // );
  }, []);
  const getSubModule = moduleid => {
    //
    API.get(
      `getcontentdetails/${user[0].usertype}/${moduleid}/${language}`,
    ).then(
      response => {
        // setSubModule(response.data);
        //
        API.get(
          `getmoduledetails/${user[0].userid}/${user[0].usertype}/${moduleid}/${language}`,
        ).then(
          response1 => {
            //
            response.data.map((item, index) => {
              item.topicdetails.map((item1, index1) => {
                //
                response1.data.map((item2, index2) => {
                  if (item1.topicid === item2.topicid) {
                    // console.log(
                    //   item2.topicid,
                    //   item1.topicid,
                    //   item2.topic_percentage,
                    //   item2.totalmark,
                    //   item2.quiz_status,
                    //   item2.content_status,
                    //   item2.score,
                    //   'item1.topicid',
                    // );
                    item1.topic_percentage = item2.topic_percentage;
                    item1.totalmark = item2.totalmark;
                    item1.content_status = item2.content_status;
                    item1.quiz_status = item2.quiz_status;
                    item1.score = item2.score;
                  }
                });
              });
            });
            setSubModule(response.data);
            setuserSubModule(response1.data);
          },
          err => {
            setErr(true);
          },
        );
        // setSubModule(response.data);
      },
      err => {
        setErr(true);
      },
    );
  };
  const getModuleId = moduleid => {
    // getSubModule(moduleid.moduleid);
    const data = {
      userid: user[0].userid,
      usertype: user[0].usertype,
      moduleid: moduleid.moduleid,
      language: language,
    };
    dispatch(TrainingSlice.getContentDetailsstart({data}));
    const data1 = {
      userid: user[0].userid,
      usertype: user[0].usertype,
      moduleid: moduleid.moduleid,
      language: language,
    };
    dispatch(TrainingSlice.getUserTrainingDetailsStart({data1}));
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
      navigation.navigate('home');
    }, timeForInactivityInSecond * 1000);
  };

  return (
    <View style={{flex: 1}} {...panResponder.panHandlers}>
      <View>
        {/* <ServerError visible={err} message={'module id not found'} /> */}
        {isLoading ? (
          <View>
            <PgeSkeleton />
          </View>
        ) : (
          <>
            <HorizontalScrollView
              moduleArr={moduleArr}
              callbackfun={getModuleId}
            />
            <AccordianComponent
              userSubModule={userContentDetails}
              subModules={contentDetails}
              navigation={navigation}
              training_type={'monthly'}
              onPress={() => navigation.navigate('contentdetails')}
            />
          </>
        )}
      </View>
    </View>
  );
};

export default MonthlyTraining;

const styles = StyleSheet.create({});
