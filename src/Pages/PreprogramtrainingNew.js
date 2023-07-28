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
import HorizontalScrollViewNew from '../components/HorizontalScrollViewNew';
import AccordianComponent from '../components/AccordianComponent';
import {useFocusEffect} from '@react-navigation/native';
import PgeSkeleton from '../skeletons/PgeSkeleton';
import AccoedC from '../components/AccoedC';
import * as TrainingSliceNew from '../redux/slices/TrainingSliceNew';
import Norecord from '../components/Norecord';
import * as FcmSlice from '../redux/slices/FcmSlice';
import AccoedCnew from '../components/AccoedCnew';

const PreprogramtrainingNew = ({navigation}) => {
  const dispatch = useDispatch();
  const appState = useRef(AppState.currentState);
  const [appStateVisible, setAppStateVisible] = useState(appState.current);
  let stTime = new Date().getTime();
  const user = useSelector(state => state.userdata.user?.resData);
  const moduleArr = useSelector(state => state.trainingdataNew.pptmodules);
  // console.log('moduleArrnew------->', moduleArr, moduleArr.length);
  const contentDetails = useSelector(
    state => state.trainingdataNew.contentDetails,
  );
  const userContentDetails = useSelector(
    state => state.trainingdataNew.userTraingDetails,
  );
  const teacherdata = useSelector(state => state.userdata.user?.resData);
  const [currentIndex, setCurrentIndex] = React.useState(null);

  const [language, setLanguage] = useState('od');
  const [trainingType, setTrainingtype] = useState('ppt');
  // const [moduleArr, setModuleArr] = useState([]);

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

  //Sorting Modules for set in order
  //   const moduleSet = [...moduleArr].sort(
  //     (a, b) => a.moduleOrder - b.moduleOrder,
  //   );
  // console.log('data3 ----->', moduleSet);

  // useFocusEffect(
  //   React.useCallback(() => {
  //     const data1 = {
  //       userid: user[0].userid,
  //       usertype: user[0].usertype,
  //       trainingType: 'ppt',
  //       moduleid: moduleSet[0]?.moduleid,
  //       language: language,
  //     };
  //     // console.log('get module----->', data1);
  //     dispatch(TrainingSlice.getPPTContentDetailsstart({data1}));

  //     const d_data = {
  //       usertype: user[0].usertype,
  //       moduleid: moduleSet[0]?.moduleid,
  //       language: language,
  //     };
  //     // dispatch(TrainingSlice.getPPTContentDetailsstart({d_data}));
  //     dispatch(TrainingSlice.getPPTModuleStart({d_data}));
  //   }, []),
  // );

  useEffect(() => {
    const data1 = {
      userid: user[0].userid,
      usertype: user[0].usertype,
      trainingType: 'ppt',
      moduleid: moduleArr[0]?.moduleid,
      language: language,
    };
    // console.log('get module----->', data1);
    dispatch(TrainingSliceNew.getPPTContentDetailsstart({data1}));

    const d_data = {
      userid: user[0].userid,
      usertype: user[0].usertype,
      language: language,
    };
    // dispatch(TrainingSlice.getPPTContentDetailsstart({d_data}));
    dispatch(TrainingSliceNew.getPPTModuleStart({d_data}));
  }, [moduleArr[0]?.moduleid]);

  const getModuleId = moduleid => {
    // getSubModule(moduleid.moduleid);
    // console.log('moduleid----->', moduleid);
    const data1 = {
      userid: user[0].userid,
      usertype: user[0].usertype,
      moduleid: moduleid.moduleid,
      language: language,
    };
    dispatch(TrainingSliceNew.getPPTContentDetailsstart({data1}));
    // const data1 = {
    //   userid: user[0].userid,
    //   usertype: user[0].usertype,
    //   moduleid: moduleid.moduleid,
    //   language: language,
    // };
    // dispatch(TrainingSlice.getPPTUserTrainingDetailsStart({data1}));
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
          <HorizontalScrollViewNew
            moduleArr={moduleArr}
            callbackfun={getModuleId}
          />
          <AccoedCnew
            // userDetails={userContentDetails}
            // subModules={contentDetails}
            navigation={navigation}
            training_type={'ppt'}
            // onPress={() => navigation.navigate('contentdetails')}
          />
        </View>
      </ScrollView>
    </View>
  );
};

export default PreprogramtrainingNew;

const styles = StyleSheet.create({});
