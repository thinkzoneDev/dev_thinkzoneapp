import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  BackHandler,
  Alert,
  ActivityIndicator,
  Modal,
} from 'react-native';
import React from 'react';
import {useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import API from '../environment/Api';
// import Quiz from '../components/Quiz';
import QzLs from '../components/QzLs';
import {useState} from 'react';
import Modals from '../components/Modals';
import Color from '../utils/Colors';
import * as window from '../utils/dimensions';

const NsdcQuiz = ({route, navigation}) => {
  const teacherdata = useSelector(state => state.userdata.user?.resData);
  const isLoading = useSelector(state => state.userdata.isLoading);
  const [questions, setQuestions] = useState([]);
  const [customModal, setCustomModal] = useState(true);
  const [counter, setCounter] = useState('');
  // console.log('questions-->', questions);
  const [totalTime, setTotalTime] = useState();

  useEffect(() => {
    API.get(`getallnsdcexamquestions/${teacherdata[0].userid}`).then(
      res => {
        // console.log(
        //   res.data,
        //   res.data.length,
        //   'resDATA--------------------------------------->>>>>>>>>>>>>>>',
        // );

        if (res.data.data.length > 0) {
          // console.log(res.status, 'res.status');
          if (res.data.status == 'allowed') {
            // this.quizstatus = false;
            // console.log(res.status, 'res.status');
            setCounter(res.data.totalTime);
            setQuestions(res.data.data);
          } else {
            Alert.alert(
              'You are not allowed to appear NSDC exam.',
              'Please contact your manager.',
              [
                {
                  text: 'Cancel',
                  // onPress: () => Alert.alert('Cancel Pressed'),
                  style: 'destructive',
                },
                {
                  text: 'OK',
                  // onPress: () => submitFun(),
                  style: 'destructive',
                },
              ],
              {cancelable: false},
            );
          }
          // this.save_operation = 'update';
        } else {
          // this.quizstatus = true;
          // loading.dismiss();
          // this.displaytext = this.no_contents_found;
          // // this.save_operation = 'save';
        }
        // loading.dismiss();
      },
      err => {
        // loading.dismiss();
        // this.serverDownMsg.presentToast();
      },
    );
  }, []);
  const onend_quiz = (score, length, questions) => {
    // console.log(
    //   score,
    //   length,
    //   questions,
    //   'score, allQuestions.length, questions',
    // );
    const data = {
      userid: teacherdata[0].userid,
      // starttime: this.startTime,
      // endtime: this.stopTime,
      questionanswer: questions,
      score: score,
      totalmark: length,
      evaluate: 'pending',
      username: teacherdata[0].username,
      usertype: teacherdata[0].usertype,
      contactnumber: teacherdata[0].contactnumber,
      gender: teacherdata[0].gender,
      udisecode: teacherdata[0].udisecode,
      schoolname: teacherdata[0].schoolname,
      managerid: teacherdata[0].managerid,
      managername: teacherdata[0].managername,
      passcode: teacherdata[0].passcode,
      stateid: teacherdata[0].stateid,
      statename: teacherdata[0].statename,
      districtid: teacherdata[0].districtid,
      districtname: teacherdata[0].districtname,
      blockid: teacherdata[0].blockid,
      blockname: teacherdata[0].blockname,
    };
    // console.log('nsdc save-------------------------------------------->', data);

    API.post(`saveusernsdcexam`, data).then(
      res => {
        if (res.status == 'success') {
          Alert.alert(
            'Successfully Completed.',
            'Please visit again.',
            [
              {
                text: 'Cancel',
                // onPress: () => Alert.alert('Cancel Pressed'),
                style: 'destructive',
              },
              {
                text: 'OK',
                // onPress: () => submitFun(),
                style: 'destructive',
              },
            ],
            {cancelable: false},
          );

          // this.progressSaved = true;
        } else if (res.status == 'already_submitted') {
          Alert.alert(
            'Error.',
            'Quiz already submitted.',
            [
              {
                text: 'Cancel',
                // onPress: () => Alert.alert('Cancel Pressed'),
                style: 'destructive',
              },
              {
                text: 'OK',
                // onPress: () => submitFun(),
                style: 'destructive',
              },
            ],
            {cancelable: false},
          );
        } else if (res.status == 'error') {
          Alert.alert(
            'Error.',
            'Internal server error',
            [
              {
                text: 'Cancel',
                // onPress: () => Alert.alert('Cancel Pressed'),
                style: 'destructive',
              },
              {
                text: 'OK',
                // onPress: () => submitFun(),
                style: 'destructive',
              },
            ],
            {cancelable: false},
          );
        }
      },
      err => {
        this.serverDownMsg.presentToast();
      },
    );
  };
  const closeModal = () => {
    setCustomModal(false);
    navigation.goBack();
  };

  useEffect(() => {
    const backAction = () => {
      Alert.alert(
        'ଧ୍ୟାନ ଦିଅନ୍ତୁ! ',
        'ଆପଣ ନିବେଶ କରିଥିବା ତଥ୍ୟ Save ହୋଇଯିବ। ଆପଣ ଏହା ଅବଗତ ଅଛନ୍ତି ତ?',
        [
          {
            text: 'SUBMIT',
            // onPress: () => navigation.navigate('home'),
            onPress: () => onend_quiz(navigation.navigate('home')),
            style: 'default',
            style: 'cancel',
          },
          {text: 'Cancel', onPress: () => null},
        ],
      );
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );

    return () => backHandler.remove();
  }, []);

  React.useEffect(() => {
    const timer =
      counter > 0 && setInterval(() => setCounter(counter - 1), 1000);
    return () => clearInterval(timer);
  }, [counter]);
  const [quizModal, setQuizModal] = useState(true);

  return (
    <View>
      {/* {isLoading ? (
        <ActivityIndicator
          size="large"
          color={Color.primary}
          style={{justifyContent: 'center', alignSelf: 'center'}}
        />
      ) : ( */}
      <>
        {counter == 0 ? null : (
          // Alert.alert(
          //   'ପରୀକ୍ଷା ପାଇଁ ନିର୍ଦ୍ଧାରିତ ସମୟ ଶେଷ ହୋଇସାରିଛି ଏବଂ ଆପଣ ଦେଇଥିବା ଉତ୍ତର ସଫଳତାର ସହ ପୈଠ ହୋଇଅଛି',
          //   '',
          //   [
          //     {
          //       // text: 'Cancel',
          //       // onPress: () => Alert.alert('Cancel Pressed'),
          //       style: 'destructive',
          //     },
          //     {
          //       text: 'Ok',
          //       // onPress: () => onend_quiz(navigation.navigate('home')),
          //     },
          //   ],
          //   {cancelable: false},
          // )
          <Text
            style={{
              color: 'royalblue',
              fontWeight: '500',
              fontSize: 30,
              alignSelf: 'center',
              marginTop: 10,
              // top: 0,
              borderRadius: 10,
              borderWidth: 2,
              borderColor: 'royalblue',
              padding: 6,
              // position: 'absolute',
            }}>
            {new Date(counter * 1000).toISOString().slice(11, 19)}
          </Text>
        )}
        {questions.length > 0 ? (
          // <ScrollView>
          <Modal animationType="slide" transparent={true} visible={quizModal}>
            <View style={[styles.centeredView]}>
              <View
                style={[
                  styles.modalView,
                  {
                    height: window.WindowHeigth * 1,
                    // marginTop: -0,
                    backgroundColor: 'white',
                    top: -10,
                    width: window.WindowWidth * 2,
                  },
                ]}>
                <View style={{alignSelf: 'center'}}>
                  <QzLs
                    questions={questions}
                    onend_quiz={onend_quiz}
                    navigation={navigation}
                  />
                </View>
              </View>
            </View>
            {/* </View> */}
          </Modal>
        ) : (
          // </ScrollView>

          // <Text>no question</Text>
          <Modals
            visible={customModal}
            heading={'No question Available'}
            backgroundColor={'white'}
            onpressok={closeModal}
            okstatus={true}
          />
        )}
      </>
      {/* )} */}
    </View>
  );
};

export default NsdcQuiz;

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
});
