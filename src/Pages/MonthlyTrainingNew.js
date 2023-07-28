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
import HorizontalScrollViewNew from '../components/HorizontalScrollViewNew';
import AccordianComponent from '../components/AccordianComponent';
import * as TrainingSliceNew from '../redux/slices/TrainingSliceNew';
import ServerError from '../components/ServerError';
import {useFocusEffect} from '@react-navigation/native';
import Norecord from '../components/Norecord';
import AccordianComponentNew from '../components/AccordiianComponentNew';
const MonthlyTrainingNew = ({navigation}) => {
  const dispatch = useDispatch();
  let stTime = new Date().getTime();
  const appState = useRef(AppState.currentState);
  const [appStateVisible, setAppStateVisible] = useState(appState.current);
  const user = useSelector(state => state.userdata.user?.resData);
  // console.log('usermonthly---->', user);
  const moduleArr = useSelector(state => state.trainingdataNew.modules);
  // const [moduleArr, setModuleArr] = useState([]);
  // console.log('moduleArrhorizontal----->', moduleArr);
  const teacherdata = useSelector(state => state.userdata.user?.resData);

  const contentDetails = useSelector(
    state => state.trainingdataNew.contentDetails,
  );
  // console.log('check status---->', contentDetails);
  // const userContentDetails = useSelector(
  //   state => state.trainingdataNew.userTraingDetails,
  // );
  // console.log('userContentDetails---->', userContentDetails);
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

        API.post(`savetimespentrecord/`, data).then(response => {
          // console.log('time response------------>', response.data);
        });
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
      ).then(response => {
        // console.log('time response2------------>', response.data);
      });
    };
  }, []);

  // useEffect(() => {
  //   // const data1 = {
  //   //   userid: user[0].userid,
  //   //   usertype: user[0].usertype,
  //   //   moduleid: moduleArr[0]?.moduleid,
  //   //   language: language,
  //   // };
  //   // dispatch(TrainingSlice.getUserTrainingDetailsStart({data1}));
  //   // API.get(
  //   //   `tch_training_getmodulewisestatus/${user[0].usertype}/${user[0].userid}/${language}`,
  //   // ).then(
  //   //   response => {
  //   //     //
  //   //     // setModuleArr(response.data);
  //   //     getSubModule(response.data[0].moduleid);
  //   //     setIsloading(false);
  //   //   },
  //   //   err => {
  //   //
  //   //   },
  //   // );
  // }, []);

  //Sorting Modules for set in order
  //   const moduleSet = [...moduleArr].sort(
  //     (a, b) => a.moduleOrder - b.moduleOrder,
  //   );
  // console.log('data3 ----->', moduleSet);

  //Another way to sorting modules
  // const data2 = moduleArr.slice().sort((a, b) => a.moduleOrder - b.moduleOrder);
  // console.log('data2 ----->', data2);

  // useFocusEffect(
  //   React.useCallback(() => {
  //     const data = {
  //       userid: user[0].userid,
  //       usertype: user[0].usertype,
  //       trainingType: 'training',
  //       moduleid: moduleSet[0]?.moduleid,
  //       language: language,
  //     };
  //     // Do something when the screen is focused

  //     console.log('datamonthly--->', data);
  //     dispatch(TrainingSlice.getContentDetailsstart({data}));

  //     const d_data = {
  //       userid: user[0].userid,
  //       usertype: user[0].usertype,
  //       language: language,
  //     };
  //     dispatch(TrainingSlice.getModuleStart({d_data}));
  //   }, []),
  // );

  useEffect(() => {
    const d_data = {
      userid: user[0].userid,
      usertype: user[0].usertype,
      language: language,
    };
    dispatch(TrainingSliceNew.getModuleStart({d_data}));

    // API.get(
    //   `getAllModulesWithMarks/${user[0].userid}/${user[0].usertype}/training/${language}`,
    // ).then(response => {
    //   console.log('modu---->', response.data);
    //   setModuleArr(response.data);
    // });

    const data = {
      userid: user[0].userid,
      usertype: user[0].usertype,
      trainingType: 'training',
      moduleid: moduleArr[0]?.moduleid,
      language: language,
    };
    // Do something when the screen is focused

    // console.log('datamonthly--->', data);
    dispatch(TrainingSliceNew.getContentDetailsstart({data}));
  }, [moduleArr[0]?.moduleid]);

  // const getSubModule = moduleid => {
  //   //
  //   API.get(
  //     `getcontentdetails/${user[0].usertype}/${moduleid}/${language}`,
  //   ).then(
  //     response => {
  //       // setSubModule(response.data);
  //       //
  //       API.get(
  //         `getmoduledetails/${user[0].userid}/${user[0].usertype}/${moduleid}/${language}`,
  //       ).then(
  //         response1 => {
  //           //
  //           response.data.map((item, index) => {
  //             item.topicdetails.map((item1, index1) => {
  //               //
  //               response1.data.map((item2, index2) => {
  //                 if (item1.topicid === item2.topicid) {
  //                   // console.log(
  //                   //   item2.topicid,
  //                   //   item1.topicid,
  //                   //   item2.topic_percentage,
  //                   //   item2.totalmark,
  //                   //   item2.quiz_status,
  //                   //   item2.content_status,
  //                   //   item2.score,
  //                   //   'item1.topicid',
  //                   // );
  //                   item1.topic_percentage = item2.topic_percentage;
  //                   item1.totalmark = item2.totalmark;
  //                   item1.content_status = item2.content_status;
  //                   item1.quiz_status = item2.quiz_status;
  //                   item1.score = item2.score;
  //                 }
  //               });
  //             });
  //           });
  //           setSubModule(response.data);
  //           setuserSubModule(response1.data);
  //         },
  //         err => {
  //           setErr(true);
  //         },
  //       );
  //       // setSubModule(response.data);
  //     },
  //     err => {
  //       setErr(true);
  //     },
  //   );
  // };
  const getModuleId = moduleid => {
    // console.log('module clicked---->', moduleid);
    // getSubModule(moduleid.moduleid);
    const data = {
      userid: user[0].userid,
      usertype: user[0].usertype,
      trainingType: 'training',
      moduleid: moduleid.moduleid,
      language: language,
    };
    dispatch(TrainingSliceNew.getContentDetailsstart({data}));
    // const data1 = {
    //   userid: user[0].userid,
    //   usertype: user[0].usertype,
    //   moduleid: moduleid.moduleid,
    //   language: language,
    // };
    // dispatch(TrainingSlice.getUserTrainingDetailsStart({data1}));
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
        {/* <ServerError visible={err} message={'module id not found'} /> */}
        {isLoading ? (
          <View>
            <PgeSkeleton />
          </View>
        ) : (
          <>
            <HorizontalScrollViewNew
              moduleArr={moduleArr}
              callbackfun={getModuleId}
            />
            <AccordianComponentNew
              // userSubModule={userContentDetails}
              // subModules={contentDetails}
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

export default MonthlyTrainingNew;

const styles = StyleSheet.create({});
