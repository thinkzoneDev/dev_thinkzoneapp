import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Alert,
  Image,
  ScrollView,
  Modal,
  AppState,
  PanResponder,
  InteractionManager,
  BackHandler,
} from 'react-native';
// import UserInactiveCheck from 'react-native-user-inactivity-check';
import React, {useEffect, useRef, useState} from 'react';
import DropdownComponent from '../components/DropdownComponent';
import {useFocusEffect} from '@react-navigation/native';
import {useDispatch, useSelector} from 'react-redux';
import * as studentstypes from '../redux/slices/StudentSlice';
import API from '../environment/Api';
import Colors from '../utils/Colors';
// import * as window from '../utils/dimensions';
import * as window from '../utils/dimensions';

import * as FcmSlice from '../redux/slices/FcmSlice';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Entypo from 'react-native-vector-icons/Entypo';
// import {Color} from '../GlobalStyle';
// import Modal from '../components/Modal';
import {Color, FontFamily, FontSize, Border} from '../GlobalStyle';

const Fln = ({navigation, route}) => {
  let stTime = new Date().getTime();
  const appState = useRef(AppState.currentState);
  const [appStateVisible, setAppStateVisible] = useState(appState.current);
  const [quizId, setQuizId] = useState('');
  const [flnStatus, setFlnStatus] = useState({});
  console.log('flnStatus--->', flnStatus);
  console.log('flnStatus--->', flnStatus);
  const [studentDetails, setStudentDetails] = useState({});
  // console.log('student--->', studentDetails);
  const [baselineStatus, setBaselineStatus] = useState(false);
  const [midlineStatus, setmidlineStatus] = useState(false);
  const [endlineStatus, setendlineStatus] = useState(false);
  const [studentSelectStatus, setStudentSelectStatus] = useState(false);
  const [studentList, setStudentList] = useState([]);
  const dispatch = useDispatch();
  const [modal, setModal] = useState(false);
  const quiz_data = route.params.data_type;
  const [examType, setExamType] = useState('');
  const [perStudent, setPerStudent] = useState();
  console.log(studentList, 'juiiiiiiiiiii------------>');
  const [inactive, setInactive] = useState(false);
  const teacherdata = useSelector(state => state.userdata.user?.resData);
  const studentData = useSelector(state => state.studentdata.students);
  // useEffect(() => {
  //   const stTime = new Date().getTime();
  //   dispatch(studentstypes.getStudentStart(teacherdata[0].userid));
  //   return () => {
  //     const clTime = new Date().getTime();
  //     const timeSpent = (clTime - stTime) / 1000;
  //
  //   };
  // }, []);

  // useFocusEffect(
  //   React.useCallback(() => {
  //     // Do something when the screen is focused

  //     quiz_data === 'success' ? setModal(true) : setModal(false);
  //     const students = [{studentname: 'Select Student', id: 1}, ...studentData];
  //     // console.log('1: ', students);
  //     setStudentList(students);
  //   }, [quiz_data]),
  // );

  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      () => {
        if (modal) {
          // If the modal is visible, close the modal
          setModal(false);
          return true; // Prevent default back button behavior
        } else {
          // Navigate back using the navigation prop
          navigation.goBack();
          return true; // Prevent default back button behavior
        }
      },
    );

    return () => {
      // Clean up the event listener when the component unmounts
      backHandler.remove();
    };
  }, [modal, navigation]);

  useEffect(() => {
    dispatch(studentstypes.getStudentStart(teacherdata[0].userid));

    //console.log('called xxxxxxxxxxxxxxxx 1: ');
  }, []);
  useEffect(() => {
    quiz_data == 'success' ? setModal(true) : setModal(false);
  }, [quiz_data]);
  useEffect(() => {
    // console.log('called xxxxxxxxxxxxxxxx 3: ');
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

    dispatch(FcmSlice.clearfcmMessage({}));
    // setTimeout(() => {
    //   setDowns(downsl);
    //   setIsloading(false);
    //   //
    // }, 3000);
    return () => {
      subscription.remove();
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
        managername: teacherdata[0].managername,
        passcode: teacherdata[0].passcode,
        modulename: 'fln',
        duration: duration,
        month: month,
        year: year,
      };

      API.post(`savetimespentrecord/`, data).then(response => {});
    };
  }, []);

  // useEffect(() => {
  //   const students = [{studentname: 'Select Student', id: 1}, ...studentData];
  //   setStudentList(students);
  // }, [studentData]);

  useFocusEffect(
    React.useCallback(() => {
      // Do something when the screen is focused

      const students = [{studentname: 'Select Student', id: 1}, ...studentData];
      setBaselineStatus(false);
      setmidlineStatus(false);
      setendlineStatus(false);
      setStudentSelectStatus(false);
      // console.log('1: ', students);
      setStudentList(students);
    }, [quiz_data, studentData]),
  );

  // console.log(studentData);
  const getStudent = item => {
    setPerStudent(item);
    if (item.id === 1) {
      setBaselineStatus(false);
      setmidlineStatus(false);
      setendlineStatus(false);
      setStudentSelectStatus(false);
    } else if (item.otp_isverified === false) {
      Alert.alert(
        '',
        ` ${item.studentname} ର ରୋଲ୍ ନଂ ଯାଞ୍ଚ୍ କରନ୍ତୁ।`,

        [
          // {
          //   text: 'Cancel',
          //   // onPress: () => Alert.alert('Cancel Pressed'),
          //   style: 'destructive',
          // },
          {
            text: 'OK',
            onPress: () => navigation.navigate('studentlist'),

            style: 'destructive',
          },
        ],
        {cancelable: false},
      );
    } else {
      setBaselineStatus(false);
      setmidlineStatus(false);
      setendlineStatus(false);
      setStudentDetails(item);
      setStudentSelectStatus(true);
      API.get(`checkstudentflnassesment/${item.studentid}`).then(
        response => {
          console.log('respo---->', response.data, item.studentid);
          setFlnStatus(response.data?.data[0]);
          if (response.data?.data) {
            setQuizId(response?.data?.data[0]?._id);
            if (response.data?.data[0]?.baselinestatus == 'complete') {
              setBaselineStatus(true);
            }
            if (response.data?.data[0]?.midlinestatus == 'complete') {
              setmidlineStatus(true);
            }
            if (response.data?.data[0]?.endlinestatus == 'complete') {
              setendlineStatus(true);
            }
          }
        },
        err => {},
      );
    }
  };
  const funFlnContent = () => {
    if (studentSelectStatus) {
      navigation.navigate('flncontent', {studentDetails: studentDetails});
    } else {
      Alert.alert('Please select a student', '');
    }
  };

  const handleReddem = () => {
    // console.log('clicked', flnStatus, perStudent);
    // console.log('clicked2', perStudent);
    console.log('clicked3----->', teacherdata[0].userid, perStudent.studentid);
    API.put(
      `reduceMidlineDays/${teacherdata[0].userid}/${perStudent.studentid}`,
    ).then(response => {
      // console.log('reduced----->', response.data);
      if (response.data.midlineOpen === true) {
        Alert.alert(
          `${response.data.msg}`,
          '',
          [
            {
              text: 'OK',
              onPress: () =>
                navigation.navigate('flnquiz', {
                  type: 'midline',
                  studentDetails: studentDetails,
                  quizId: quizId,
                  navigation: navigation,
                }),
              style: 'destructive',
            },
          ],
          {cancelable: false},
        );
      } else {
        Alert.alert(
          // `${response.data.msg}`,
          // `ଆପଣଙ୍କ ପାଖରେ ଆବଶ୍ୟକୀୟ କଏନ୍ ନାହିଁ।`,
          `${response.data.msg}`,
          `ଆପଣଙ୍କର ଆଉ ${response.data.coinsLeft} ଟି କଏନ୍ ଅଛି ।`,
          [
            {
              text: 'OK',
              onPress: () => null,
              style: 'destructive',
            },
          ],
          {cancelable: false},
        );
      }
    });
  };

  const submitFun = type => {
    navigation.navigate('flnquizreview', {
      studentDetails: studentDetails,
      examType: type,
    });
  };
  const funFlnQuiz = type => {
    setExamType(type);
    if (studentSelectStatus) {
      if (type === 'baseline') {
        // console.log('flnStatus--->', flnStatus);
        if (flnStatus?.baselinestatus == 'complete') {
          Alert.alert(
            'info',
            'You have successfully completed baseline..',

            [
              {
                text: 'Cancel',
                // onPress: () => Alert.alert('Cancel Pressed'),
                style: 'destructive',
              },
              {
                text: 'Review Quiz',
                onPress: () => submitFun(type),

                style: 'destructive',
              },
            ],
            {cancelable: false},
          );
        } else {
          navigation.navigate('flnquiz', {
            type: type,
            studentDetails: studentDetails,
            quizId: quizId,
            navigation: navigation,
          });
        }
      } else if (type === 'midline') {
        // setExamType(type);
        if (flnStatus?.midlinestatus == 'complete') {
          Alert.alert(
            'info',
            'You have successfully completed midline..',
            [
              {
                text: 'Cancel',
                // onPress: () => Alert.alert('Cancel Pressed'),
                style: 'destructive',
              },
              {
                text: 'OK',
                onPress: () => submitFun(type),
                style: 'destructive',
              },
            ],
            {cancelable: false},
          );
        } else {
          if (flnStatus?.baselinestatus == 'complete') {
            if (flnStatus?.midlineOpen == true) {
              navigation.navigate('flnquiz', {
                type: type,
                studentDetails: studentDetails,
                quizId: quizId,
                navigation: navigation,
              });
            } else {
              Alert.alert(
                //  `${flnStatus?.midlineeligibility.message}`,
                // `${flnStatus?.midlineOpen}`,
                ``,
                'ମିଡ୍ ଲାଇନ୍ ପାଇଁ ଆପଣଙ୍କୁ ୬୦ ଦିନ ଅପେକ୍ଷା କରିବାକୁ ପଡ଼ିବ କିମ୍ବା ଆପଣ  ଥିଙ୍କଜୋନ୍ ଆପ୍ ରେ  ଅର୍ଜନ କରିଥିବା କଏନ୍ ବ୍ୟବହାର କରି ମିଡ୍ ଲାଇନ୍ ଦେଇପାରିବେ।',
                [
                  {
                    text: 'Redeem',
                    onPress: () => handleReddem(),
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
          } else {
            Alert.alert(
              'Please Complete baseline.',
              '',
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
        }
      } else if (type === 'endline') {
        if (flnStatus?.endlinestatus == 'complete') {
          Alert.alert(
            'Sucessfully completed endline.',
            '',
            [
              {
                text: 'Cancel',
                // onPress: () => Alert.alert('Cancel Pressed'),
                style: 'destructive',
              },
              {
                text: 'OK',
                onPress: () => submitFun(type),
                style: 'destructive',
              },
            ],
            {cancelable: false},
          );
        } else {
          if (
            flnStatus?.baselinestatus == 'complete' &&
            flnStatus?.midlinestatus == 'complete'
          ) {
            navigation.navigate('flnquiz', {
              type: type,
              studentDetails: studentDetails,
              quizId: quizId,
              navigation: navigation,
            });
          } else if (
            flnStatus?.baselinestatus == 'complete' &&
            flnStatus?.midlinestatus == 'incomplete'
          ) {
            Alert.alert(
              'Please Complete midline.',
              '',
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
          } else {
            Alert.alert(
              'Please Complete baseline and midline.',
              '',
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
        }
      } else {
      }
    } else {
      Alert.alert('Please select a student', 'Select a student');
    }
  };

  // const [showContent, setShowContent] = useState(false);
  // const action = () => {
  //   setShowContent(true);
  //   // Alert.alert('User is not active');
  // };
  // let userInactiveCheckRef = React.createRef();
  // const onButtonPress = () => {
  //   setShowContent(false);
  //   userInactiveCheckRef && userInactiveCheckRef.resetTimer();
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
    <View style={{flex: 1}} {...panResponder.panHandlers}>
      <View style={styles.container} {...panResponder.panHandlers}>
        <DropdownComponent
          data={studentList}
          onChange={getStudent}
          image={require('../assets/Image/profile-2user.png')}
          label={'studentname'}
          label2={'class'}
          Dropdownlabel={'Student List'}
        />
        <View>
          <TouchableOpacity
            style={styles.container2}
            onPress={() => funFlnContent()}>
            <View style={styles.container2}>
              <Image
                style={{marginLeft: 20, marginTop: 15, width: 32, height: 32}}
                source={require('../assets/Image/hierarchy-3.png')}
              />
              <Text
                style={{
                  fontFamily: FontFamily.poppinsMedium,
                  fontWeight: '600',
                  marginTop: 20,
                  left: '20%',
                  color: '#000000',
                }}>
                FLN ଗତିବିଧି
              </Text>
            </View>
          </TouchableOpacity>
        </View>
        <View>
          {baselineStatus ? (
            <TouchableOpacity
              onPress={() => funFlnQuiz('baseline')}
              style={styles.box}>
              <View style={{flexDirection: 'row'}}>
                <Image
                  source={require('../assets/Image/Exams-rafiki.png')}
                  style={styles.img}
                />
                <Text style={styles.Flntext}>ମୂଲ୍ୟାଙ୍କନ ୧</Text>
                <Text style={styles.completed}>Completed</Text>
              </View>
              <Image
                source={require('../assets/Image/progress.png')}
                style={styles.finImg}
              />
              <View style={{flexDirection: 'row', alignSelf: 'center'}}>
                <Image
                  source={require('../assets/Image/receipt-search.png')}
                  style={styles.coinImg}
                />
                <Text style={styles.scored}>Scored :</Text>
                <Text style={styles.mark}>
                  {flnStatus.baselinesecuredmark}/{flnStatus.baselinetotalmark}
                </Text>
              </View>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              onPress={() => funFlnQuiz('baseline')}
              style={styles.box}>
              <View style={{flexDirection: 'row'}}>
                <Image
                  source={require('../assets/Image/Exams-rafiki.png')}
                  style={styles.img}
                />
                <Text style={styles.Flntext}>ମୂଲ୍ୟାଙ୍କନ ୧</Text>
                {/* <Image
                  source={require('../assets/Image/key-square.png')}
                  style={{marginLeft: 70, marginTop: 30}}
                /> */}
              </View>
              <Image
                source={require('../assets/Image/Groupp.png')}
                style={styles.finImg}
              />
              <View
                style={{flexDirection: 'row', alignSelf: 'center', right: 20}}>
                <Image
                  source={require('../assets/Image/coin.png')}
                  style={styles.coinImg}
                />
                <Text style={styles.coin}>2 coins</Text>
              </View>
            </TouchableOpacity>
          )}
          {midlineStatus ? (
            <TouchableOpacity
              onPress={() => funFlnQuiz('midline')}
              style={styles.box}>
              <View style={{flexDirection: 'row'}}>
                <Image
                  source={require('../assets/Image/Degree-pana.png')}
                  style={styles.img}
                />
                <Text style={styles.Flntext}>ମୂଲ୍ୟାଙ୍କନ ୨</Text>
                <Text style={styles.completed}>Completed</Text>
              </View>
              <Image
                source={require('../assets/Image/progress.png')}
                style={styles.finImg}
              />
              <View style={{flexDirection: 'row', alignSelf: 'center'}}>
                <Image
                  source={require('../assets/Image/receipt-search.png')}
                  style={styles.coinImg}
                />
                <Text style={styles.scored}>Scored :</Text>
                <Text style={styles.mark}>
                  {flnStatus.midlinesecuredmark}/{flnStatus.midlinetotalmark}
                </Text>
              </View>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              onPress={() => funFlnQuiz('midline')}
              style={styles.box}>
              <View style={{flexDirection: 'row'}}>
                <Image
                  source={require('../assets/Image/Degree-pana.png')}
                  style={styles.img}
                />
                <Text style={styles.Flntext}>ମୂଲ୍ୟାଙ୍କନ ୨</Text>
                {flnStatus?.midlineeligibility?.status != true ? (
                  <Image
                    source={require('../assets/Image/key-square.png')}
                    style={styles.keyImg}
                  />
                ) : null}
              </View>
              <Image
                source={require('../assets/Image/Groupp.png')}
                style={styles.finImg}
              />
              <View
                style={{flexDirection: 'row', alignSelf: 'center', right: 20}}>
                <Image
                  source={require('../assets/Image/coin.png')}
                  style={styles.coinImg}
                />
                <Text style={styles.coin}>2 coins</Text>
              </View>
            </TouchableOpacity>
          )}
          {endlineStatus ? (
            <TouchableOpacity
              onPress={() => funFlnQuiz('endline')}
              style={styles.box}>
              <View style={{flexDirection: 'row'}}>
                <Image
                  source={require('../assets/Image/Choose-rafiki.png')}
                  style={styles.img}
                />
                <Text style={styles.Flntext}>ମୂଲ୍ୟାଙ୍କନ ୩</Text>
                <Text style={styles.completed}>Completed</Text>
              </View>
              <Image
                source={require('../assets/Image/progress.png')}
                style={styles.finImg}
              />
              <View style={{flexDirection: 'row', alignSelf: 'center'}}>
                <Image
                  source={require('../assets/Image/receipt-search.png')}
                  style={styles.coinImg}
                />
                <Text style={styles.scored}>Scored :</Text>
                <Text style={styles.mark}>
                  {flnStatus.endlinesecuredmark}/{flnStatus.endlinetotalmark}
                </Text>
              </View>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              onPress={() => funFlnQuiz('endline')}
              style={styles.box}>
              <View style={{flexDirection: 'row'}}>
                <Image
                  source={require('../assets/Image/Choose-rafiki.png')}
                  style={styles.img}
                />
                <Text style={styles.Flntext}>ମୂଲ୍ୟାଙ୍କନ ୩</Text>
                {flnStatus?.midlinestatus != 'complete' ? (
                  <Image
                    source={require('../assets/Image/key-square.png')}
                    style={styles.keyImg}
                  />
                ) : null}
              </View>
              <Image
                source={require('../assets/Image/Groupp.png')}
                style={styles.finImg}
              />
              <View
                style={{flexDirection: 'row', alignSelf: 'center', right: 20}}>
                <Image
                  source={require('../assets/Image/coin.png')}
                  style={styles.coinImg}
                />
                <Text style={styles.coin}>2 coins</Text>
              </View>
            </TouchableOpacity>
          )}
        </View>
      </View>
      <Modal animationType="slide" transparent={true} visible={modal}>
        <View style={[styles.centeredView]}>
          <View
            style={[
              styles.modalView,
              {
                // height: window.WindowHeigth * 0.7,

                width: window.WindowWidth * 0.92,
                borderRadius: 20,
              },
            ]}>
            <Image
              style={[
                styles.tinyLogos,
                {
                  width: 250,
                  height: 220,
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginTop: -40,
                },
              ]}
              source={require('../assets/Image/https_coin.gif')}
            />

            <Text
              style={[
                styles.username,
                {
                  fontSize: 18,
                  color: 'black',
                  fontWeight: '600',
                  fontFamily: FontFamily.poppinsMedium,
                  justifyContent: 'center',
                  textTransform: 'capitalize',
                  width: 200,
                  alignSelf: 'center',
                },
              ]}>
              Congratulations! {''}
            </Text>

            <Text
              style={{
                color: 'black',
                fontWeight: '800',
                color: '#666666',
                textTransform: 'capitalize',
              }}>
              {teacherdata[0].username}
            </Text>
            <View style={{flexDirection: 'row'}}>
              <Text
                style={[
                  styles.username,
                  {
                    fontSize: 16,
                    color: '#666666',
                    fontWeight: '400',
                    fontFamily: 'serif',
                    marginTop: 20,
                  },
                ]}>
                {/* You have earned 2 */}
                ଆପଣ ସଫଳତାର ସହ{' '}
                <Text style={{color: 'black'}}>
                  {studentDetails.studentname}
                </Text>{' '}
                ର{/* FLN ମୂଲ୍ୟାଙ୍କନ */}
                {/* ସମ୍ପୂର୍ଣ୍ଣ କରିଥିବାରୁ ୨ଟି coin ହାସଲ୍ କରିଛନ୍ତି। */}
              </Text>
            </View>

            {examType == 'baseline' && quiz_data === 'success' ? (
              <Text
                style={[
                  styles.username,
                  {
                    fontSize: 14,
                    color: '#666666',
                    fontWeight: '400',
                    fontFamily: 'serif',
                    marginTop: 3,
                  },
                ]}>
                FLN ମୂଲ୍ୟାଙ୍କନ ୧ ସମ୍ପୂର୍ଣ୍ଣ କରିଥିବାରୁ ୨ଟି କଏନ୍ ହାସଲ କରିଛନ୍ତି।
                {/* 🎉 */}
              </Text>
            ) : null}

            {examType == 'midline' && quiz_data === 'success' ? (
              <Text
                style={[
                  styles.username,
                  {
                    fontSize: 14,
                    color: '#666666',
                    fontWeight: '400',
                    fontFamily: 'serif',
                    marginTop: 3,
                  },
                ]}>
                FLN ମୂଲ୍ୟାଙ୍କନ 2 ସମ୍ପୂର୍ଣ୍ଣ କରିଥିବାରୁ ୨ଟି କଏନ୍ ହାସଲ କରିଛନ୍ତି।
                {/* 🎉 */}
              </Text>
            ) : null}
            {examType == 'endline' && quiz_data === 'success' ? (
              <Text
                style={[
                  styles.username,
                  {
                    fontSize: 14,
                    color: '#666666',
                    fontWeight: '400',
                    fontFamily: 'serif',
                    marginTop: 3,
                  },
                ]}>
                FLN ମୂଲ୍ୟାଙ୍କନ 3 ସମ୍ପୂର୍ଣ୍ଣ କରିଥିବାରୁ ୨ଟି କଏନ୍ ହାସଲ କରିଛନ୍ତି।
                {/* 🎉 */}
              </Text>
            ) : null}

            <TouchableOpacity
              onPress={() =>
                // navigation.replace('ମୋ ସଫଳତା', {
                //   type: 'ମୋ ସଫଳତା',
                // })
                navigation.navigate('ମୋ ସଫଳତା', {
                  type: 'ମୋ ସଫଳତା',
                })
              }
              style={[
                styles.bu,
                {
                  marginTop: 40,
                  width: window.WindowWidth * 0.5,
                },
              ]}>
              <Text
                style={{
                  fontSize: 15,
                  // color: Color.white,
                  fontWeight: '900',
                  textAlign: 'center',
                  fontFamily: FontFamily.poppinsMedium,
                  color: 'white',
                }}>
                Check Reward
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setModal(false)}
              style={[
                styles.bu,
                {
                  marginTop: 20,
                  backgroundColor: Color.ghostwhite,
                  width: window.WindowWidth * 0.5,
                  borderWidth: 1,
                  borderColor: Color.royalblue,
                },
              ]}>
              <Text
                style={{
                  fontSize: 15,
                  // color: Color.white,
                  fontWeight: '900',
                  textAlign: 'center',
                  fontFamily: FontFamily.poppinsMedium,
                  color: Color.royalblue,
                }}>
                Skip for now
              </Text>
            </TouchableOpacity>
          </View>
        </View>
        {/* </View> */}
      </Modal>
    </View>
  );
};

export default Fln;

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    flex: 1,
  },
  container2: {
    flexDirection: 'row',
    width: window.WindowWidth * 0.92,
    backgroundColor: Color.white,
    borderRadius: 6,
    paddingBottom: 10,
    marginTop: 10,
    alignSelf: 'center',
  },
  box: {
    width: window.WindowWidth * 0.92,
    paddingBottom: 10,

    backgroundColor: 'white',
    marginTop: 20,
    alignSelf: 'center',
    borderRadius: 6,
  },
  img: {
    marginLeft: 10,

    width: 100,
    height: 100,
    marginTop: 10,
  },

  tinyLogo: {
    width: 155,
    height: 112,
    marginRight: 60,
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 2,
      height: 5,
    },
    shadowOpacity: 0.25,
    shadowRadius: 5,
    elevation: 15,
  },
  username: {
    fontSize: 18,
    fontFamily: 'serif',
    color: '#01507B',
    textTransform: 'capitalize',
    marginTop: 15,
    textAlign: 'center',
    fontWeight: '900',
  },
  bu: {
    marginTop: 60,
    width: window.WindowWidth * 0.5,
    backgroundColor: Color.royalblue,
    padding: 5,
    borderRadius: 15,
  },
  texts: {
    fontFamily: FontFamily.balooBhaina2Medium,
    fontSize: 16,
    marginTop: 30,
    left: '10%',
    color: Color.black,
    fontWeight: '600',
    textAlign: 'center',
  },
  Flntext: {
    fontFamily: FontFamily.balooBhaina2Medium,
    fontSize: 16,
    marginTop: 30,
    left: '10%',
    color: Color.black,
    fontWeight: '600',
    textAlign: 'center',
  },
  finImg: {
    width: window.WindowWidth * 0.55,
    height: 10,
    marginLeft: 115,
    marginTop: -40,
    borderRadius: 37.34,
  },
  coin: {
    left: '5%',
    fontFamily: FontFamily.poppinsMedium,
    fontSize: 12,
    color: '#333333',
    marginTop: 18,
  },
  completed: {
    fontFamily: FontFamily.poppinsMedium,
    fontSize: 12,
    marginTop: 30,
    // left: '75%',
    margin: 50,
    color: '#666666',
    fontWeight: '600',
    textAlign: 'right',
  },
  scored: {
    left: '9%',
    fontFamily: FontFamily.poppinsMedium,
    fontSize: 12,
    color: '#333333',
    marginTop: 20,
  },
  mark: {
    left: '7%',
    fontFamily: FontFamily.poppinsMedium,
    fontSize: 12,
    color: '#333333',
    marginTop: 20,
  },
  keyImg: {
    marginTop: 30,
    left: 50,
    margin: 50,
    width: 27,
    height: 27,
    // alignItems: 'flex-end',
  },
  coinImg: {
    // marginLeft: 115,
    width: 18,
    height: 18,
    alignSelf: 'stretch',
    marginTop: 20,
  },
});
