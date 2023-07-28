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
import * as TrainingSlice from '../redux/slices/TrainingSlice';

const MonthlyAssignment = ({navigation, route}) => {
  const dispatch = useDispatch();
  const data = route.params.data;
  // console.log('data--->', data, route.params.data_type);
  const user = useSelector(state => state.userdata.user?.resData);
  const [isloading, setIsloading] = useState(true);
  const [dataloading, setdataloading] = useState(false);
  const [language, setLanguage] = useState('od');
  const [modal, setModal] = useState(false);
  const [modals, setModals] = useState(false);
  const [modalss, setModalss] = useState(false);
  const [modalsss, setModalsss] = useState(false);
  const [assignment_question, set_assignment_question] = useState('');
  const [contentData, setContentData] = useState([]);
  // console.log('contentData----->', contentData);
  const [customModal, setCustomModal] = useState(true);

  // console.log('assignment_question--->', assignment_question);
  useEffect(() => {
    API.get(
      `getalltrainingcontents/${user[0].usertype}/${data.moduleid}/${data.submoduleid}/${data.topicid}/od`,
      // `getalltrainingcontents/fellow/1667470853338/${topic.submoduleid}/${topic.topicid}/od`,
    ).then(res1 => {
      // console.log(res1.data, 'trans assign');
      const dataass = res1.data;
      setContentData(dataass);
      // navigation.navigate('contentdetails', {
      //   data: res1.data,
      //   data_type: c_type,
      // });
      //
      if (dataass == undefined || dataass.length == 0) {
        API.get(
          `gettchtrainingdetails/${user[0].usertype}/${user[0].userid}/${data.moduleid}/${data.submoduleid}/${data.topicid}`,
        ).then(res => {
          // console.log(res, 'master assign');
          const data1 = res.data;
          set_assignment_question(data1[0].assignmentQuestion);
          setIsloading(false);
          navigation?.navigate('contentdetails', {
            data: res.data,
            data_type: c_type,
          });
        });
      } else {
        set_assignment_question(dataass[0].assignmentQuestion);
        setIsloading(false);
      }
    });
  }, []);
  const updateAssignment = answerAssignment => {
    setdataloading(true);
    const body = {
      assignmentQuestion: assignment_question,
      assignmentAnswer: answerAssignment, //s3Link
      assignmentStatus: true,
      topic_percentage: '100%',
    };

    const data1 = {
      trainingtype: 'training',
      userid: user[0].userid,
      usertype: user[0].usertype,
      username: user[0].username,
      managerid: user[0].managerid,
      managername: user[0].managername,
      passcode: user[0].passcode,
      preferedlanguage: language,
      moduleid: contentData[0].moduleid,
      modulename: contentData[0].modulename,
      submoduleid: contentData[0].submoduleid,
      submodulename: contentData[0].submodulename,
      topicid: contentData[0].topicid,
      topicname: contentData[0].topicname,
      securedmark: 'secured_mark',
      totalmark: 'total_mark',
      iscomplete: true,
    };

    // console.log(body, user[0].userid, data.moduleid, data.topicid, 'body');
    API.post(
      `saveTchAssignment/${user[0].userid}/${data.moduleid}/${data.topicid}`,
      body,
    ).then(res => {
      // console.log('assignment response--->', res.data);
      if (res.data.status == 'success') {
        API.post(`savetrainingstatusdata/`, data1).then(
          response1 => {
            //
            API.get(
              `gettrainingoverallmarks/${user[0].userid}/${language}`,
            ).then(
              response2 => {
                const data1 = {
                  userid: user[0].userid,
                  usertype: user[0].usertype,
                  moduleid: contentData[0].moduleid,
                  language: language,
                  passcode: user[0].passcode,
                  managerid: user[0].managerid,
                  managername: user[0].managername,
                };
                dispatch(TrainingSlice.getUserTrainingDetailsStart({data1}));
                const d_data = {
                  userid: user[0].userid,
                  usertype: user[0].usertype,
                  language: language,
                };
                dispatch(TrainingSlice.getModuleStart({d_data}));
                // setdataloading(false);
                // // navigation.goBack();
                // if (response1.data.status == 'success') {
                //   const data1 = {
                //     userid: user[0].userid,
                //     usertype: user[0].usertype,
                //     moduleid: data[0].moduleid,
                //     language: language,
                //   };
                //   dispatch(
                //     TrainingSlice.getUserTrainingDetailsStart({data1}),
                //   );
                // }
              },
              err => {
                //
              },
            );
          },
          err => {
            //
          },
        );
      }

      // console.log(res.data, 'res.data');
      const data1 = {
        userid: user[0].userid,
        usertype: user[0].usertype,
        moduleid: data.moduleid,
        language: language,
        passcode: user[0].passcode,
        managerid: user[0].managerid,
        managername: user[0].managername,
      };
      dispatch(TrainingSlice.getUserTrainingDetailsStart({data1}));
      const d_data = {
        userid: user[0].userid,
        usertype: user[0].usertype,
        language: language,
      };
      dispatch(TrainingSlice.getModuleStart({d_data}));
      setdataloading(false);
      navigation.goBack();
    });
    //     /saveTransAssignmentData
    // body: {
    // userid,
    //  moduleid,
    //  submoduleid,
    //  topicid,
    //  assignmentQuestion,
    //  assignmentAnswer
    // }
  };

  const closeModal = () => {
    setCustomModal(false);
    navigation.goBack();
  };
  return (
    <>
      {dataloading && (
        <ActivityIndicator size="small" color={Colors.primary} style={{}} />
      )}
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
          <View style={styles.container}>
            {
              // contentDetails[0].topicData[0].contentStatus ==
              (data.content_status == false && data.quiz_status == false) ||
              (data.content_status == true && data.quiz_status == false) ||
              (!data.content_status && !data.quiz_status) ? (
                <Modals
                  visible={customModal}
                  heading={'Please Complete the content or quiz.'}
                  backgroundColor={Colors.white}
                  onpressok={closeModal}
                  okstatus={true}
                />
              ) : null
            }

            {data.content_status == true && data.quiz_status == true && (
              <>
                <View style={styles.container}>
                  {assignment_question ? (
                    <Assignment
                      question={assignment_question}
                      uploadFile={updateAssignment}
                    />
                  ) : (
                    <Norecord />
                  )}
                </View>
              </>
            )}
          </View>
          {/* )} */}
        </>
      )}
    </>
  );
};

export default MonthlyAssignment;

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
