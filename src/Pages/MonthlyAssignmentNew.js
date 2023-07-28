import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Alert,
  Image,
  ScrollView,
  Modal,
  ImageBackground,
  ActivityIndicator,
} from 'react-native';
import * as window from '../utils/dimensions';
import Color from '../utils/Colors';
import React, {useEffect, useMemo, useState} from 'react';
import Pressable from 'react-native/Libraries/Components/Pressable/Pressable';
import Norecord from '../components/Norecord';
import Login from './Login';
import {useDispatch, useSelector} from 'react-redux';
import API from '../environment/Api';
import Colors from '../utils/Colors';
import Assignment from '../components/Assignment ';
import Modals from '../components/Modals';
import * as TrainingSliceNew from '../redux/slices/TrainingSliceNew';
import AssignmentNew from '../components/AssignmentNew';

const MonthlyAssignmentNew = ({navigation, route}) => {
  const dispatch = useDispatch();
  const data = route.params.data;
  // console.log('data--->', data);
  const user = useSelector(state => state.userdata.user?.resData);
  const [isloading, setIsloading] = useState(false);
  const [dataloading, setdataloading] = useState(false);
  const [language, setLanguage] = useState('od');
  const [modal, setModal] = useState(false);
  const [modals, setModals] = useState(false);
  const [modalss, setModalss] = useState(false);
  const [modalsss, setModalsss] = useState(false);

  const [assignment_status, setAssignment_status] = useState(
    route.params.data_type == 'assignment' ? true : false,
  );
  const [assignment_question, set_assignment_question] = useState('');
  // console.log('contentData assignment_question--->', assignment_question);
  const [contentData, setContentData] = useState([]);
  // console.log('contentData--->', contentData);
  const [customModal, setCustomModal] = useState(true);
  const {
    moduleid,
    modulename,
    submoduleid,
    submodulename,
    submoduleOrder,
    moduleOrder,
  } = route.params.data;
  const {topicname, topicid, contentStatus, quizStatus, topicOrder} =
    route.params.whole_data;
  // console.log(
  //   'assignment_question--->',
  //   // moduleid,
  //   // modulename,
  //   // submoduleid,
  //   // submodulename,
  //   // topicname,
  //   // topicid,
  //   contentStatus,
  //   quizStatus,
  //   assignment_status,
  //   assignment_question,
  //   // route.params.data_type,
  //   // route.params.whole_data,
  // );

  // useEffect(() => {
  //   API.get(
  //     `getalltrainingcontents/${user[0].usertype}/${data.moduleid}/${data.submoduleid}/${data.topicid}/od`,
  //     // `getalltrainingcontents/fellow/1667470853338/${topic.submoduleid}/${topic.topicid}/od`,
  //   ).then(res1 => {
  //     console.log(res1.data, 'trans assign');
  //     const dataass = res1.data;
  //     setContentData(dataass);
  //     // navigation.navigate('contentdetails', {
  //     //   data: res1.data,
  //     //   data_type: c_type,
  //     // });
  //     //
  //     if (dataass == undefined || dataass.length == 0) {
  //       API.get(
  //         `gettchtrainingdetails/${user[0].usertype}/${user[0].userid}/${data.moduleid}/${data.submoduleid}/${data.topicid}`,
  //       ).then(res => {
  //         console.log(res, 'master assign');
  //         const data1 = res.data;
  //         set_assignment_question(data1[0].assignmentQuestion);
  //         setIsloading(false);
  //         navigation.navigate('contentdetails', {
  //           data: res.data,
  //           data_type: c_type,
  //         });
  //       });
  //     } else {
  //       set_assignment_question(dataass[0].assignmentQuestion);
  //       setIsloading(false);
  //     }
  //   });
  // }, []);

  //New Api For Assignment starts

  useEffect(() => {
    setIsloading(true);
    API.get(
      // `gettchtrainingdetails/${user[0].usertype}/geetareddy9040@gmail.com/1678707087741/1679462523886/1679462560425`,
      //`gettchtrainingdetails/${user[0].usertype}/${user[0].userid}/${data.moduleid}/${data.submoduleid}/${data.topicid}`,
      //----------new api------------------//
      `getContentQuizAssignment/${user[0].userid}/training/${route.params.data_type}/od/${moduleid}/${submoduleid}/${topicid}`,
      // `getContentQuizAssignment/monalisamoharana99@gmail.com/training/content/od/1682768555649/1682768566362/1682768576842`,
      //----------new api------------------//
    )
      .then(res1 => {
        const datas = res1.data;
        if (datas == undefined || datas.length == 0) {
          API.get(
            `getalltrainingcontents/${user[0].usertype}/${submoduleid}/${submoduleid}/${topicid}/${language}`,
          ).then(res => {
            const data1 = res.data;
            // console.log(data1, 'data1');
            setIsloading(false);
            setContentData(res.data.data);
          });
        } else {
          setIsloading(false);
          // setSubModulesData(data);
          // console.log(datas, 'datas');
          // console.log(datas[0].content[0].contentQuestion, 'datascheck');

          setContentData(res1.data.data);
          set_assignment_question(res1.data.data[0].assignmentQuestion);
        }
      })
      .catch(err => {});
  }, []);
  //New Api for Assignment ends

  const updateAssignment = answerAssignment => {
    setdataloading(true);
    // navigation.navigate('monthlytraining');
    // const body = {
    //   assignmentQuestion: assignment_question,
    //   assignmentAnswer: answerAssignment, //s3Link
    //   assignmentStatus: true,
    // };
    // console.log(body, user[0].userid, data.moduleid, data.topicid, 'body');
    // API.post(
    //   `saveTchAssignment/${user[0].userid}/${data.moduleid}/${data.topicid}`,
    //   body,
    // ).then(res => {
    //   console.log(res.data, 'res.data');
    //   const data1 = {
    //     userid: user[0].userid,
    //     usertype: user[0].usertype,
    //     moduleid: data.moduleid,
    //     language: language,
    //     passcode: user[0].passcode,
    //     managerid: user[0].managerid,
    //     managername: user[0].managername,
    //   };
    //   dispatch(TrainingSlice.getUserTrainingDetailsStart({data1}));
    //   const d_data = {
    //     userid: user[0].userid,
    //     usertype: user[0].usertype,
    //     language: language,
    //   };
    //   dispatch(TrainingSlice.getModuleStart({d_data}));
    //   setdataloading(false);
    //   navigation.goBack();
    // });

    const body = {
      username: user[0].username,
      usertype: user[0].usertype,
      managerid: user[0].managerid,
      managername: user[0].managername,
      passcode: user[0].passcode,
      language: 'od',
      modulename: modulename,
      moduleOrder: moduleOrder,
      submodulename: submodulename,
      submoduleOrder: submoduleOrder,
      topicname: topicname,
      topicOrder: topicOrder,
      trainingType: 'training',
      saveType: 'assignment',
      moduleid: moduleid,
      submoduleid: submoduleid,
      topicid: topicid,
      userid: user[0].userid,
      // contentData: contentData[0].contentData,
      // quizData: contentData[0].quizData,
      assignmentQuestion: contentData[0].assignmentQuestion,
      assignmentAnswer: answerAssignment,
      timeTaken: 12,
      // assignmentStatus: 'complete',
      topicPercentage: 100,
    };
    // console.log('assignmentdata check--->', body);
    API.post(`saveTransContentQuizAssignment/`, body).then(
      response => {
        // console.log('assignment response-------->', response.data);
        if (response.data.status == 'success') {
          const data = {
            userid: user[0].userid,
            usertype: user[0].usertype,
            trainingType: 'training',
            moduleid: moduleid,
            language: language,
          };
          // Do something when the screen is focused

          // console.log('datamonthly--->', data);
          dispatch(TrainingSliceNew.getContentDetailsstart({data}));
        }
        // if (response.data.status == 'success') {
        //   const d_data = {
        //     userid: user[0].userid,
        //     usertype: user[0].usertype,
        //     trainingType: 'training',
        //     moduleid: moduleid,
        //     language: language,
        //   };
        //   // console.log('data content--->', d_data);
        //   dispatch(TrainingSlice.getContentDetailsstart({d_data}));
        // }
        // navigation.goBack();

        // console.log('save response quiz------->', response.data);
      },
      err => {
        //
      },
    );
  };

  const closeModal = () => {
    setCustomModal(false);
    navigation.goBack();
  };
  return (
    <>
      {/* {dataloading && (
          <ActivityIndicator size="small" color={Colors.primary} style={{}} />
        )} */}
      {isloading ? (
        <ActivityIndicator
          size="large"
          color={Colors.primary}
          style={{justifyContent: 'center', alignSelf: 'center'}}
        />
      ) : (
        <>
          {/* {contentData[0]?.content_status != true ? (
              <Modals
                visible={customModal}
                heading={'Please Complete the content.'}
                backgroundColor={Colors.white}
                onpressok={closeModal}
                okstatus={true}
              />
            ) : ( */}
          <View
            style={{
              backgroundColor: '#0060ca',
              height: 66,
              width: window.WindowWidth * 1.1,
              marginTop: -16,
              marginLeft: -1,
            }}>
            <Text
              style={{
                color: 'white',
                fontSize: 20,
                marginTop: 15,
                textAlign: 'center',
              }}>
              {topicname}
            </Text>
          </View>
          {/* <View style={styles.container}>
              {assignment_question ? (
                <Assignment
                  question={assignment_question}
                  uploadFile={updateAssignment}
                  navigation={navigation}
                />
              ) : (
                <Norecord />
              )}
            </View> */}
          {(assignment_status === true &&
            // contentDetails[0].topicData[0].contentStatus ==
            contentStatus == 'incomplete' &&
            quizStatus == 'incomplete' &&
            contentStatus == 'complete') ||
            (quizStatus == 'incomplete' && (
              <Modals
                visible={customModal}
                heading={'Please Complete the content or quiz.'}
                backgroundColor={Colors.white}
                onpressok={closeModal}
                okstatus={true}
              />
            ))}

          {assignment_status === true &&
            contentStatus == 'complete' &&
            quizStatus == 'complete' && (
              <>
                <View style={styles.container}>
                  {assignment_question ? (
                    <AssignmentNew
                      question={assignment_question}
                      uploadFile={updateAssignment}
                      navigation={navigation}
                    />
                  ) : (
                    <Norecord />
                  )}
                </View>
              </>
            )}

          {/* )} */}
        </>
      )}
    </>
  );
};

export default MonthlyAssignmentNew;

const styles = StyleSheet.create({
  tinyLogo: {
    width: '100%',
    height: 815,
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    // marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  p: {
    fontFamily: 'Arial, Helvetica, sans-serif',
    letterSpacing: 1,
    fontWeight: '700',
    textAlign: 'center',

    fontSize: 10,

    color: 'black',

    marginBottom: 10,
  },
  bu: {
    marginTop: 190,
    width: '100%',
    backgroundColor: '#2196f3',
    padding: 20,
    borderRadius: 5,
  },
  root: {
    width: window.WindowWidth,
    height: window.WindowHeigth,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
