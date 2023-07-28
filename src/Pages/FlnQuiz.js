import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  Button,
  ImageBackground,
  BackHandler,
  Image,
  Alert,
  Modal,
} from 'react-native';
import * as window from '../utils/dimensions';
import {FontFamily, Color, FontSize, Border} from '../GlobalStyle';

import {useDispatch, useSelector} from 'react-redux';
import React, {useEffect, useState} from 'react';
import API from '../environment/Api';
import ListItem from '../components/ListItem';
import Loader from '../components/Loader';
import FlnScreenSkeleton from '../skeletons/FlnScreenSkeleton';
// import Color from '../utils/Colors';
import AntDesign from 'react-native-vector-icons/AntDesign';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import {style} from 'd3';
import Norecord from '../components/Norecord';
import Colors from '../utils/Colors';
import FontAwesome5Icon from 'react-native-vector-icons/FontAwesome5';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import DocumentPicker from 'react-native-document-picker';
import * as types from '../redux/slices/UserSlice';
import Entypo from 'react-native-vector-icons/Entypo';
import {useFocusEffect} from '@react-navigation/native';
const FlnQuiz = ({route, navigation}) => {
  const teacherdata = useSelector(state => state.userdata.user?.resData);
  const studentData = useSelector(state => state.studentdata.students);

  // console.log('teacherdata------->', teacherdata);
  let [securedMark, setSecuredMark] = useState(0);
  const [language, setLanguage] = useState('od');
  const [refresh, setRefreshList] = useState(new Date());
  const [quizs, setQuizs] = useState([]);
  const [isLoading, setIsloading] = useState(true);
  const [modal, setModal] = useState(false);
  const [image, setImage] = useState('');
  const [imageModal, setImageModal] = useState(false);
  const [quizModal, setQuizModal] = useState(true);

  const [singleFile, setSingleFile] = useState({});

  const {studentDetails, type, quizId} = route.params;
  // console.log("studentDetails------>",studentDetails)

  const dispatch = useDispatch();
  var today = new Date();
  var tomorrow = new Date(today);
  useFocusEffect(
    React.useCallback(() => {
      // Do something when the screen is focused
      const backAction = () => {
        // setModal(true);

        Alert.alert(
          'ଧ୍ୟାନ ଦିଅନ୍ତୁ! ',
          'ଆପଣ ନିବେଶ କରିଥିବା ତଥ୍ୟ Save ହେବ ନାହିଁ। ଆପଣ ଏହା ଅବଗତ ଅଛନ୍ତି ତ?',
          [
            {
              text: 'Cancel',
              onPress: () => null,
              style: 'default',
            },
            {text: 'Ok', onPress: () => navigation.goBack(), style: 'default'},
          ],
        );
        return true;
      };

      const backHandler = BackHandler.addEventListener(
        'hardwareBackPress',
        backAction,
      );

      return () => backHandler.remove();
    }, []),
  );

  // useEffect(() => {
  //   const backAction = () => {
  //     // setModal(true);

  //     Alert.alert(
  //       'ଧ୍ୟାନ ଦିଅନ୍ତୁ! ',
  //       'ଆପଣ ନିବେଶ କରିଥିବା ତଥ୍ୟ Save ହେବ ନାହିଁ। ଆପଣ ଏହା ଅବଗତ ଅଛନ୍ତି ତ?',
  //       [
  //         {
  //           text: 'Cancel',
  //           onPress: () => null,
  //           style: 'default',
  //         },
  //         {text: 'Ok', onPress: () => navigation.goBack(), style: 'default'},
  //       ],
  //     );
  //     return true;
  //   };

  //   const backHandler = BackHandler.addEventListener(
  //     'hardwareBackPress',
  //     backAction,
  //   );

  //   return () => backHandler.remove();
  // }, []);

  // console.log(quizs, 'quizs');
  // console.log(quizId, 'studentDetails');
  useEffect(() => {
    API.get(
      `getflnassessment/${type}/${language}/${studentDetails.program}/${studentDetails.class}`,
    ).then(
      response => {
        // console.log(response.data, 'response.data');
        let data = response.data.map(element => {
          return {...element, answer: '', answerStatus: 0};
        });
        // console.log(data, 'data');
        setQuizs(data);
        setIsloading(false);
      },
      err => {
        console.log(err);
      },
    );
  }, []);
  const setAttendance = (item, atdStatus) => {
    // console.log(item, atdStatus, 'item');
    if (atdStatus == 'yes') {
      item.answer = 'yes';
    } else {
      item.answer = 'no';
    }
    // console.log(item, atdStatus, 'item1');

    const modifiedQuiz = quizs.map(element => {
      // console.log('quiz-->', quizs);

      if (element._id === item._id) {
        if (atdStatus == 'yes') {
          element.answer = 'yes';
          element.answerStatus = 1;
        } else {
          element.answer = 'no';
          element.answerStatus = 0;
        }
      }
      return element;
    });
    setQuizs(modifiedQuiz);
  };

  const Func = item => {
    // console.log('=============here in : ', item);
    setImage(item.imageurl);
    setImageModal(true);
  };

  // console.log(quizs, 'quizs');
  const saveData = () => {
    const scMark = quizs.reduce(
      (acc, curr) => {
        return acc + curr.answerStatus;
      },

      0,
    );
    // console.log('scMark----->', scMark);
    // console.log('total mark-------->', quizs.length);
    const totMark = quizs.filter(x => x.answer == 'yes');
    const totMarks = quizs.filter(x => x.answer == 'no');
    // console.log(totMark.length, 'totMarkyes');
    // console.log(totMarks.length, 'totMark');
    // console.log('Total-->', totMark.length + totMarks.length);
    // console.log('item set-->', quizs.length);
    // console.log('check-->', quizs.length === totMark.length + totMarks.length);
    if (quizs.length === totMark.length + totMarks.length) {
      if (type == 'baseline') {
        // console.log('baseline');
        const data1 = {
          userid: studentDetails.userid,
          username: studentDetails.username,
          usertype: studentDetails.usertype,
          passcode: studentDetails.passcode,
          managerid: studentDetails.managerid,
          managername: teacherdata[0].managername,
          udisecode: studentDetails.udisecode,
          schoolname: studentDetails.schoolname,
          studentid: studentDetails.studentid,
          studentname: studentDetails.studentname,
          program: studentDetails.program,
          class: studentDetails.class,
          phone: studentDetails.phone,
          gender: studentDetails.gender,
          dob: studentDetails.dob,
          parentsname: studentDetails.parentsname,
          registration_date: studentDetails.registration_date,
          studentcategory: studentDetails.studentcategory,
          studentstatus: studentDetails.studentstatus,
          baselinestatus: 'complete',
          baselinetotalmark: quizs.length,
          baselinesecuredmark: scMark,
          baselinedata: quizs,
          baselinedate: today,
          midlineOpenDate: new Date(tomorrow.setDate(today.getDate() + 60)),
        };
        // setModal(true);

        // console.log(data1, 'FlnQuiz------------------->');
        API.post(`savestudentflnassesment`, data1).then(
          response => {
            // dispatch(types.rewardsUserstart(teacherdata[0].userid));
            // navigation.goBack();
            // navigation.navigate('fln');
            if (response.data.status == 'success') {
              // navigation.navigate('fln', data:response.data.status);
              navigation.navigate('fln', {
                data_type: response.data.status,
              });
              dispatch(types.rewardsUserstart(teacherdata[0].userid));
              // Alert.alert(
              //   'Sucessfully completed .',
              //   '',
              //   [
              //     {
              //       text: 'Cancel',
              //       // onPress: () => Alert.alert('Cancel Pressed'),
              //       style: 'destructive',
              //     },
              //     {
              //       text: 'OK',
              //       // onPress: () => submitFun(),
              //       style: 'destructive',
              //     },
              //   ],
              //   {cancelable: false},
              // );
            } else {
              Alert.alert(
                'Error.',
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
            // console.log(response.data, 'responseData');
          },
          err => {
            // console.log(err);
          },
        );
      } else if (type == 'midline') {
        const data2 = {
          userid: studentDetails.userid,
          midlinestatus: 'complete',
          midlinetotalmark: quizs.length,
          midlinesecuredmark: scMark,
          midlinedata: quizs,
          midlinedate: new Date(),
        };
        // console.log(
        //   data2,
        //   'quizId----------------------------------------------->',
        // );
        // console.log('midline');
        API.put(`updateflnassessment/${quizId}`, data2).then(
          response => {
            // console.log(response.data, 'responseData');
            if (response.data.status == 'success') {
              // dispatch(types.rewardsUserstart(studentDetails.userid));
              // setModal(true);
              navigation.navigate('fln', {
                data_type: response.data.status,
              });
              dispatch(types.rewardsUserstart(teacherdata[0].userid));
              // Alert.alert(
              //   'Sucessfully completed .',
              //   '',
              //   [
              //     {
              //       text: 'Cancel',
              //       // onPress: () => Alert.alert('Cancel Pressed'),
              //       style: 'destructive',
              //     },
              //     {
              //       text: 'OK',
              //       // onPress: () => submitFun(),
              //       style: 'destructive',
              //     },
              //   ],
              //   {cancelable: false},
              // );
            } else {
              Alert.alert(
                'Error.',
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
          },
          err => {
            // console.log(err);
          },
        );
      } else if (type == 'endline') {
        const data3 = {
          userid: studentDetails.userid,
          endlinestatus: 'complete',
          endlinetotalmark: quizs.length,
          endlinesecuredmark: scMark,
          endlinedata: quizs,
          endlinedate: new Date(),
        };
        // console.log('endline');
        API.put(`updateflnassessment/${quizId}`, data3).then(
          response => {
            // console.log(response.data, 'responseData');
            if (response.data.status == 'success') {
              // setModal(true);
              navigation.navigate('fln', {
                data_type: response.data.status,
              });
              dispatch(types.rewardsUserstart(teacherdata[0].userid));

              // Alert.alert(
              //   'Sucessfully completed .',
              //   '',
              //   [
              //     {
              //       text: 'Cancel',
              //       // onPress: () => Alert.alert('Cancel Pressed'),
              //       style: 'destructive',
              //     },
              //     {
              //       text: 'OK',
              //       // onPress: () => submitFun(),
              //       style: 'destructive',
              //     },
              //   ],
              //   {cancelable: false},
              // );
            } else {
              Alert.alert(
                'Error.',
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
          },
          err => {
            // console.log(err);
          },
        );
      } else {
        // console.log('no One');
      }
      // navigation.navigate('fln');
    } else {
      Alert.alert(
        'ଧ୍ୟାନ ଦିଅନ୍ତୁ! ',
        'ଏଫ୍.ଏଲ୍.ଏନ୍ ଅନ୍ତର୍ଗତ ସମସ୍ତ କୁଇଜ୍ ର ଉତ୍ତର ଦିଅନ୍ତୁ।',
        [
          {
            text: 'Cancel',
            onPress: () => null,
            style: 'cancel',
          },
          {text: 'OK', onPress: () => null},
        ],
      );
    }
  };
  const handleBackButton = () => {
    if (quizModal) {
      setQuizModal(false);
      return true; // Prevent default back button behavior
    }
    return false; // Allow default back button behavior
  };
  const back = async () => {
    Alert.alert(
      'ଧ୍ୟାନ ଦିଅନ୍ତୁ!',
      'ଆପଣ ନିବେଶ କରିଥିବା ତଥ୍ୟ Save ହେବ ନାହିଁ। ଆପଣ ଏହା ଅବଗତ ଅଛନ୍ତି ତ?',
      [
        {
          text: 'Cancel',
          onPress: () => null,
          style: 'default',
        },
        {text: 'Ok', onPress: () => navigation.goBack(), style: 'default'},
      ],
    );
  };
  useEffect(() => {
    BackHandler.addEventListener('hardwareBackPress', handleBackButton);

    // Clean up event listeners when the component unmounts
    return () => {
      BackHandler.removeEventListener('hardwareBackPress', handleBackButton);
    };
  }, []);

  return (
    <View style={styles.container}>
      {/* <Modal animationType="slide" transparent={true} visible={modal}>
        <View style={styles.centeredView}>
          <View
            style={[styles.modalView, {height: window.WindowHeigth * 0.45}]}>
            <Image
              source={require('../assets/Photos/warn.png')}
              style={{width: 70, height: 70}}
            />
            <Text style={[styles.username]}>
              ଆପଣ ନିବେଶ କରିଥିବା ତଥ୍ୟ Save ହେବ ନାହିଁ। ଆପଣ ଏହା ଅବଗତ ଅଛନ୍ତି ତ?
            </Text>
            <View style={{flexDirection: 'row'}}>
              <TouchableOpacity onPress={() => setModal(false)}>
              
                <Text
                  style={{
                    alignItems: 'flex-start',
                    justifyContent: 'center',
                    paddingVertical: 12,
                    paddingHorizontal: 10,
                    borderRadius: 4,
                    elevation: 3,
                    backgroundColor: '#B9B6B6',
                    color: 'white',
                    marginRight: 100,
                    marginTop: 40,
                    fontSize: 15,
                    fontWeight: '700',
                  }}>
                  Cancel
                </Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => navigation.goBack()}>
                <Text
                  style={{
                    alignItems: 'flex-end',
                    justifyContent: 'center',
                    paddingVertical: 12,
                    paddingHorizontal: 30,
                    borderRadius: 4,
                    elevation: 3,
                    backgroundColor: '#317ca7',
                    color: 'white',
                    marginTop: 40,
                    fontSize: 15,
                    fontWeight: '700',
                  }}>
                  Ok
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal> */}
      {isLoading ? (
        <View>
          <FlnScreenSkeleton />
        </View>
      ) : (
        <>
          {quizs.length > 0 ? (
            <>
              <Modal
                animationType="slide"
                transparent={true}
                onRequestClose={() => back()}
                visible={quizModal}>
                <View style={[styles.centeredView]}>
                  <View
                    style={[
                      styles.modalView,
                      {
                        height: window.WindowHeigth * 1,
                        // marginTop: -0,
                        top: -10,
                        width: window.WindowWidth * 2,
                      },
                    ]}>
                    <View style={{alignSelf: 'center'}}>
                      <FlatList
                        removeClippedSubviews={true}
                        maxToRenderPerBatch={10}
                        initialNumToRender={10}
                        updateCellsBatchingPeriod={40}
                        key={item => item._id}
                        data={quizs}
                        extraData={refresh}
                        renderItem={({item, index}) => (
                          // console.log('item-->', Object.keys(item).length),
                          // console.log('check answer-->',item.answer.length),
                          // console.log('quiz-->',quizs.length),
                          // console.log('check item-->',item),
                          <View style={[styles.Flngati, {textAlign: 'center'}]}>
                            <View
                              style={{
                                // height: 30,
                                // width: 30,
                                // borderRadius: 100,
                                // backgroundColor: Colors.primary,
                                // alignItems: 'center',
                                flexDirection: 'row',
                              }}>
                              <Text
                                style={{
                                  fontSize: 17,
                                  textAlign: 'justify',
                                  fontWeight: 'bold',
                                  justifyContent: 'flex-end',
                                  color: '#333333',
                                  marginLeft: 15,
                                  marginTop: 15,
                                }}>
                                {index + 1}.
                              </Text>

                              <Text
                                style={[
                                  styles.texts,
                                  {
                                    fontSize: 13,
                                    textAlign: 'justify',
                                    marginTop: 20,
                                    paddingBottom: 50,
                                    fontWeight: 'bold',
                                    paddingRight: 10,
                                    marginLeft: 20,
                                    justifyContent: 'flex-end',
                                  },
                                ]}>
                                {item.assessmentquestion}
                              </Text>
                            </View>
                            {item.imageurl != '' ? (
                              <TouchableOpacity
                                id={index}
                                onPress={() => Func(item)}>
                                <Image
                                  source={{uri: `${item.imageurl}`}}
                                  style={{
                                    width: window.WindowWidth * 0.9,
                                    height: window.WindowHeigth * 0.35,
                                    // marginLeft: 80,
                                    marginTop: -20,
                                    // width: 250,
                                    // height: 280,
                                    left: '5%',
                                    marginTop: -20,
                                    padding: 20,
                                  }}
                                />
                              </TouchableOpacity>
                            ) : (
                              <></>
                            )}
                            {item.instructions != '' ? (
                              <View
                                style={[
                                  {
                                    width: window.WindowWidth * 0.9,
                                    marginLeft: 12,
                                    paddingRight: 10,
                                    borderRadius: 10,
                                    borderWidth: 0.5,
                                    marginTop: 20,
                                    borderColor: '#137BD4',
                                    flexDirection: 'column',
                                  },
                                ]}>
                                <Text
                                  style={{
                                    color: 'green',
                                    textAlign: 'center',
                                    fontSize: 15,
                                    fontWeight: 'bold',
                                    fontFamily: 'serif',
                                  }}>
                                  Instruction
                                </Text>
                                <Text
                                  style={[
                                    styles.texts,
                                    {
                                      fontSize: 12,
                                      fontWeight: '600',
                                      margin: 5,
                                    },
                                  ]}>
                                  {item.instructions}
                                </Text>
                              </View>
                            ) : (
                              <></>
                            )}

                            <View style={{flexDirection: 'row'}}>
                              <View>
                                {item.answer == 'yes' ? (
                                  <TouchableOpacity
                                    style={[
                                      styles.buttons,
                                      {
                                        backgroundColor: Color.royalblue,
                                        color: 'white',
                                      },
                                    ]}
                                    onPress={() => {
                                      setAttendance(item, 'yes');
                                    }}>
                                    <Text
                                      style={{
                                        fontSize: 20,
                                        marginTop: 10,
                                        color: 'white',
                                        textAlign: 'center',
                                      }}>
                                      ହଁ
                                    </Text>
                                  </TouchableOpacity>
                                ) : (
                                  <TouchableOpacity
                                    style={[
                                      styles.buttons,
                                      {
                                        color: '#333333',
                                        backgroundColor: Color.ghostwhite,
                                      },
                                    ]}
                                    onPress={() => {
                                      setAttendance(item, 'yes');
                                    }}>
                                    <Text
                                      style={{
                                        fontSize: 20,
                                        marginTop: 10,
                                        color: '#333333',
                                        textAlign: 'center',
                                      }}>
                                      ହଁ
                                    </Text>
                                  </TouchableOpacity>
                                )}
                              </View>
                              <View style={{marginLeft: 60}}>
                                {item.answer == 'no' ? (
                                  <TouchableOpacity
                                    style={[
                                      styles.button,
                                      {
                                        backgroundColor: Color.royalblue,
                                        color: 'white',
                                      },
                                    ]}
                                    onPress={() => {
                                      setAttendance(item, 'no');
                                    }}>
                                    <Text
                                      style={{
                                        fontSize: 20,
                                        marginTop: 10,
                                        color: 'white',
                                        textAlign: 'center',
                                      }}>
                                      ନା
                                    </Text>
                                  </TouchableOpacity>
                                ) : (
                                  <TouchableOpacity
                                    style={[
                                      styles.button,
                                      {
                                        color: '#333333',
                                        backgroundColor: Color.ghostwhite,
                                      },
                                    ]}
                                    onPress={() => {
                                      setAttendance(item, 'no');
                                    }}>
                                    <Text
                                      style={{
                                        fontSize: 20,
                                        marginTop: 10,
                                        color: '#333333',
                                        textAlign: 'center',
                                      }}>
                                      ନା
                                    </Text>
                                  </TouchableOpacity>
                                )}
                              </View>
                            </View>
                          </View>
                        )}
                      />

                      <Modal
                        animationType="slide"
                        transparent={true}
                        visible={imageModal}>
                        <View style={[styles.centeredView]}>
                          <TouchableOpacity
                            onPress={() => setImageModal(false)}>
                            <Image
                              style={[
                                {
                                  width: window.WindowWidth * 1,
                                  height: window.WindowHeigth * 0.4,
                                  justifyContent: 'center',
                                  alignItems: 'center',
                                },
                              ]}
                              source={{uri: `${image}`}}
                            />
                          </TouchableOpacity>
                        </View>
                        {/* </View> */}
                      </Modal>
                      <TouchableOpacity
                        onPress={() => saveData()}
                        style={[styles.submit]}>
                        <Text
                          style={{
                            fontSize: 20,
                            textAlign: 'center',
                            fontWeight: '600',
                            color: 'white',
                            marginTop: 10,
                            paddingBottom: 10,
                            fontFamily: FontFamily.poppinsMedium,
                          }}>
                          SUBMIT
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
                {/* </View> */}
              </Modal>

              {/* <Button onPress={() => saveData()} title="SAVE" /> */}
            </>
          ) : (
            <Norecord />
            // </ImageBackground>
          )}
        </>
      )}
    </View>
  );
};

export default FlnQuiz;

const styles = StyleSheet.create({
  container: {
    paddingBottom: 100,
    // backgroundColor: Color.ghostwhite,
  },
  Flngati: {
    width: window.WindowWidth * 0.96,
    // hright: 550,
    marginVertical: 8,
    backgroundColor: 'white',
    borderRadius: 10,
    textAlign: 'center',
    marginLeft: 10,
    // marginTop: 10,
    // marginRight: 90,
  },
  texts: {
    // fontWeight: 'bold',
    flex: 1,
    fontSize: 15,
    color: 'black',
    textAlign: 'center',
    // marginTop: 20,
    paddingBottom: 30,
  },
  buttons: {
    width: 50,
    height: 47,
    marginLeft: 70,
    borderRadius: 10,
    // backgroundColor: '#137BD4',
    color: 'white',
    borderWidth: 1.5,
    fontSize: 20,
    textAlign: 'center',
    fontWeight: 'bold',
    marginTop: 30,
    borderColor: Color.royalblue,
  },
  button: {
    width: 50,
    height: 47,
    marginLeft: 70,
    borderRadius: 6,
    // backgroundColor: '#137BD4',
    color: 'white',
    borderWidth: 1.5,
    borderColor: Color.royalblue,
    fontSize: 20,
    textAlign: 'center',
    marginBottom: 20,
    fontWeight: 'bold',
    marginTop: 30,
  },
  submit: {
    width: window.WindowWidth * 0.4,

    // height: 60,
    marginLeft: 120,
    borderRadius: 30,
    backgroundColor: Color.royalblue,
    color: 'white',
    // borderWidth: 1,

    marginTop: 30,
  },
  Fln: {
    alignItems: 'center',
    flexDirection: 'row',
    padding: 15,
    width: window.WindowWidth * 0.9,
    hright: '100%',
    color: 'black',
    fontSize: 20,
    fontFamily: 'serif',
    fontWeight: 'bold',
    backgroundColor: 'white',
    borderRadius: 10,
    marginBottom: 10,
    textAlign: 'center',
    marginLeft: 20,
    marginTop: 120,
    // paddingRight: 10,
  },
  backgroundImg: {
    height: 800,
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
  text: {
    fontSize: 16,
    lineHeight: 21,
    fontWeight: 'bold',
    letterSpacing: 0.25,
    color: 'black',
    paddingLeft: 8,
    flexDirection: 'row',
  },
  p: {
    fontFamily: 'Arial, Helvetica, sans-serif',
    letterSpacing: 1,
    fontWeight: '700',
    textAlign: 'center',
    textTransform: 'capitalize',

    fontSize: 18,

    color: 'black',

    marginBottom: 25,
    marginTop: 40,
    textAlign: 'center',
  },

  bu: {
    marginTop: 60,
    width: window.WindowWidth * 0.5,
    backgroundColor: Color.royalblue,
    padding: 5,
    borderRadius: 15,
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
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  // button: {
  //   borderRadius: 20,
  //   padding: 10,
  //   elevation: 2,
  // },
  modalContainer: {
    height: window.WindowHeigth * 0.1,
    backgroundColor: Colors.white,
    elevation: 5,
    width: '100%',
    flex: 1,
    justifyContent: 'space-evenly',
    alignItems: 'center',
    flexDirection: 'row',
  },
});
