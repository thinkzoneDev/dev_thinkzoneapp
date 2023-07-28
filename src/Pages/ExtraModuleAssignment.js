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

const ExtraModuleAssignment = ({navigation, route}) => {
  const dispatch = useDispatch();
  const data = route.params.data;
  // console.log('data assignment--->', data);
  const user = useSelector(state => state.userdata.user?.resData);
  const [isloading, setIsLoading] = useState(false);
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

  const [customModal, setCustomModal] = useState(true);

  const {topicName, topicId, duration, topicOrder} = route.params.data;
  // console.log('data--->', topicId);
  //New Api For Assignment starts

  useEffect(() => {
    setIsLoading(true);
    API.get(
      `getTchExtraModulesAssignment/${user[0].userid}/${user[0].usertype}/${topicId}`,
    ).then(res => {
      setIsLoading(false);

      set_assignment_question(res.data.resData.assignmentQuestion);
    });
  }, []);
  //New Api for Assignment ends

  const updateAssignment = answerAssignment => {
    setdataloading(true);

    // const body = {
    //   username: user[0].username,
    //   usertype: user[0].usertype,
    //   managerid: user[0].managerid,
    //   managername: user[0].managername,
    //   passcode: user[0].passcode,
    //   language: 'od',
    //   modulename: modulename,
    //   moduleOrder: moduleOrder,
    //   submodulename: submodulename,
    //   submoduleOrder: submoduleOrder,
    //   topicname: topicname,
    //   topicOrder: topicOrder,
    //   trainingType: 'training',
    //   saveType: 'assignment',
    //   moduleid: moduleid,
    //   submoduleid: submoduleid,
    //   topicid: topicid,
    //   userid: user[0].userid,
    //   // contentData: contentData[0].contentData,
    //   // quizData: contentData[0].quizData,
    //   assignmentQuestion: contentData[0].assignmentQuestion,
    //   assignmentAnswer: answerAssignment,
    //   timeTaken: 12,
    //   // assignmentStatus: 'complete',
    //   topicPercentage: 100,
    // };

    const body = {
      userid: user[0].userid,
      topicId,
      assignmentAnswer: answerAssignment,
      assignmentStatus: 'complete',
      completionStatus: 'complete',
    };

    // console.log('assignmentdata check--->', body);
    // API.post(`saveTransTchExtraModulesAssignment`, body).then(
    //   response => {
    //     console.log('assignment response-------->', response.data);
    //     if (response.data.status == 'success') {
    //     }
    //   },
    //   err => {
    //     //
    //   },
    // );
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
              {topicName}
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
          {/* {(assignment_status === true
           &&
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
            ))} */}

          {assignment_status === true && (
            // contentStatus == 'complete' &&
            // quizStatus == 'complete' &&
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

export default ExtraModuleAssignment;

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
