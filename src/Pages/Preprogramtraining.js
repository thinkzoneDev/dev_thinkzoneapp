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
import HorizontalScrollView from '../components/HorizontalScrollView';
import AccordianComponent from '../components/AccordianComponent';
import PgeSkeleton from '../skeletons/PgeSkeleton';
import AccoedC from '../components/AccoedC';
import * as TrainingSlice from '../redux/slices/TrainingSlice';
import Norecord from '../components/Norecord';
import * as FcmSlice from '../redux/slices/FcmSlice';

const Preprogramtraining = ({navigation}) => {
  const dispatch = useDispatch();
  const appState = useRef(AppState.currentState);
  const [appStateVisible, setAppStateVisible] = useState(appState.current);
  let stTime = new Date().getTime();
  const user = useSelector(state => state.userdata.user?.resData);
  const moduleArr = useSelector(state => state.trainingdata.pptmodules);
  // console.log('moduleArr------->', moduleArr, moduleArr.length);
  const contentDetails = useSelector(
    state => state.trainingdata.contentDetails,
  );
  const userContentDetails = useSelector(
    state => state.trainingdata.userTraingDetails,
  );
  const teacherdata = useSelector(state => state.userdata.user?.resData);
  const [currentIndex, setCurrentIndex] = React.useState(null);

  const [language, setLanguage] = useState('od');
  const [trainingType, setTrainingtype] = useState('ppt');
  // const [moduleArr, setModuleArr] = useState([]);
  const [subModule, setSubModule] = useState([]);
  const [userSubModule, setUserSubModule] = useState([]);
  const [moduleid, setModuleid] = useState('');
  const [isLoading, setIsloading] = useState(true);
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

      // console.log('month--->', month, year);
      //console.log(timeSpent, stTime, clTime, 'ppt timestemp,h', duration);

      const data = {
        userid: user[0].userid,
        username: user[0].username,
        usertype: user[0].usertype,
        managerid: user[0].managerid,
        managername: user[0].managername,
        passcode: user[0].passcode,
        modulename: 'ppt',
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
    const d_data = {
      usertype: user[0].usertype,
      moduleid: moduleArr[0]?.moduleid,
      language: language,
    };
    dispatch(TrainingSlice.getPPTContentDetailsstart({d_data}));
    const data1 = {
      userid: user[0].userid,
      usertype: user[0].usertype,
      moduleid: moduleArr[0]?.moduleid,
      language: language,
    };
    dispatch(TrainingSlice.getPPTUserTrainingDetailsStart({data1}));
    API.get(`ppt_trans_getmodulewisestatus/${user[0].userid}/${language}`).then(
      response => {
        setModuleArr(response.data);
        getSubModule(response.data[0].moduleid);
        setIsloading(false);
      },
      err => {},
    );
  }, []);
  const getSubModule = moduleid => {
    //
    API.get(`ppt_getcontentdetails/${moduleid}/${language}`).then(
      response => {
        //
        // setSubModule(response.data);
        //
        API.get(
          `ppt_trans_getmoduledetails/${user[0].userid}/${moduleid}/${language}/`,
        ).then(
          response1 => {
            // setUserSubModule(response1.data);
            //
            response.data.map((item, index) => {
              item.topicdetails.map((item1, index1) => {
                //
                response1.data.map((item2, index2) => {
                  if (item1.topicid === item2.topicid) {
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
            setUserSubModule(response1.data);
            // setModuleArr(response.data);
            // getSubModule(response.data[0].moduleid);
          },
          err => {},
        );
      },
      err => {},
    );
  };
  const getModuleId = moduleid => {
    // getSubModule(moduleid.moduleid);
    const d_data = {
      userid: user[0].userid,
      usertype: user[0].usertype,
      moduleid: moduleid.moduleid,
      language: language,
    };
    dispatch(TrainingSlice.getPPTContentDetailsstart({d_data}));
    const data1 = {
      userid: user[0].userid,
      usertype: user[0].usertype,
      moduleid: moduleid.moduleid,
      language: language,
    };
    dispatch(TrainingSlice.getPPTUserTrainingDetailsStart({data1}));
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
      <ScrollView>
        <View>
          <HorizontalScrollView
            moduleArr={moduleArr}
            callbackfun={getModuleId}
          />
          <AccoedC
            userDetails={userContentDetails}
            subModules={contentDetails}
            navigation={navigation}
            training_type={'ppt'}
            // onPress={() => navigation.navigate('contentdetails')}
          />
        </View>
      </ScrollView>
    </View>
  );
};

export default Preprogramtraining;

const styles = StyleSheet.create({});
