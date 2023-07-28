import {
  StyleSheet,
  Text,
  View,
  FlatList,
  Linking,
  Image,
  TouchableOpacity,
  Alert,
  ScrollView,
  RefreshControl,
  ActivityIndicator,
  Modal,
  ToastAndroid,
  SafeAreaView,
} from 'react-native';
import axios from 'axios';
import moment from 'moment';
import {FontFamily, FontSize, Border, Color} from '../GlobalStyle';

import * as window from '../utils/dimensions';
import React, {useEffect, useState, useCallback} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import * as studentstypes from '../redux/slices/StudentSlice';
import ListItem from '../components/ListItem';
import {SwipeListView} from 'react-native-swipe-list-view';
import ListItemDelete from '../components/ListItemDelete';
import {Offline, Online, useNetInfo} from 'react-native-offline';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Entypo from 'react-native-vector-icons/Entypo';

import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import SearchBar from '../components/SearchBar';
import Modals from '../components/Modals';
import Norecord from '../components/Norecord';
import InputModal from '../components/InputModal';
import Api from '../environment/Api';
import Header from '../components/Header';
import {log} from 'console';
import BottomNav from '../components/BottomNav';
// import Modals from '../components/Modals';
const StudentList = ({navigation, route}) => {
  const [refreshing, setRefreshing] = React.useState(false);
  const dispatch = useDispatch();
  const teacherdata = useSelector(state => state.userdata.user?.resData);
  // const teacherdata = [];
  // teacherdata.push(userdata);

  const studentData = useSelector(state => state.studentdata.students);
  // console.log(
  //   studentData,
  //   'studentData-------------------------------------------------------->',
  // );

  const isLoading = useSelector(state => state.studentdata.isLoading);
  // console.log(
  //   isLoading,
  //   'isLoading-------------------------------------------------------->',
  // );
  // console.log(
  //   isLoading,
  //   'isLoading-------------------------------------------------------->',
  // );
  const [customModal, setCustomModal] = useState(true);
  const [modal, setModal] = useState(false);
  const [verifiedModalStatus, setVerifiedModalStatus] = useState(false);
  const [studentList, setStudentList] = useState([]);

  const [change, setChange] = useState([]);
  const [verifiedStudent, setVerifiedStudent] = useState({});
  // console.log('verifiedStudent--->', verifiedStudent);
  const [studentName, setStudentName] = useState('');
  const [clas, setClas] = useState('');
  // console.log(
  //   verifiedStudent,
  //   'verifiedStudent------------------------------->',
  // );

  // const deleteStudent = studentList.filter(
  //   item => item.studentid !== data.studentid,
  // );
  // console.log(verifiedStudent, 'verified student-------->');

  useEffect(() => {
    studentData ? setStudentList(studentData) : null;
  }, [studentData, navigation]);

  // useEffect(()=>{
  //   deleteStudent ?   setStudentList(deleteStudent) : null;
  // },[deleteStudent]);

  useEffect(() => {
    dispatch(studentstypes.getStudentStart(teacherdata[0].userid));
  }, [navigation, route.params]);

  // const deleteStudent =  studentList.filter(
  //   item => item.studentid !== data.studentid,
  // );
  // setStudentList(deleteStudent);

  // const deleteStudent = studentList.filter(
  //      item => item.studentid !== data.studentid,
  //    );
  //     useEffect(()=>{
  //       deleteStudent ? setStudentList(deleteStudent):null;
  //     },[deleteStudent])

  const listItemDeletePressed = data => {
    // console.log('data----hghghg------>', data);
    const datas = {
      userid: data.userid,
      studentid: data.studentid,
    };
    setStudentName(data.studentname);
    setClas(data.clas);
    // console.log('consoledata-------->', data);
    Alert.alert(
      // 'ନିଶ୍ଚିତକରଣ !!!',
      // 'ଆପଣ ନିଶ୍ଚିତ କି?',

      data.studentname,
      'ଙ୍କ ବିବରଣୀ କାଟିବାକୁ ଚାହୁଁଛନ୍ତି ?',

      [
        {
          text: 'Cancel',
          onPress: () => null,
          style: 'default',
        },
        {
          text: 'Ok',
          //   onPress: () => Alert.alert("Cancel Pressed"),
          onPress: () => (
            dispatch(studentstypes.deleteStudentStart(datas)),
            dispatch(studentstypes.getStudentStart(teacherdata[0].userid))
          ),

          style: 'cancel',
        },
      ],
      {
        cancelable: true,
        // onDismiss: () =>
        // Alert.alert(
        //   'This alert was dismissed by tapping outside of the alert dialog.',
        // ),
      },
    );

    // const deleteStudent = studentList.filter(
    //   item => item.studentid !== data.studentid,
    // );
    // setStudentList(deleteStudent);

    //
    //
  };

  const listItemUpdatePressed = item => {
    navigation.navigate('studentregister', {updateData: item});
    // console.log("item---------------", item);
  };

  const searchStudent = text => {
    if (text != null && text != undefined && text.length >= 0) {
      let newdata = studentData.filter(item => {
        return item.studentname
          .toLocaleLowerCase()
          .includes(text.toLocaleLowerCase());
      });
      setStudentList(newdata);
    } else {
      setStudentList(studentData);
    }
  };
  const closeModal = () => {
    setCustomModal(false);
    navigation.goBack();
  };

  const verifiyOTP = data => {
    //console.log(data, 'jsgdbjgddgjdjgjgds=========>');

    if (data.length > 0) {
      const body = {
        id: verifiedStudent._id,
        otp: data,
        userid: teacherdata[0].userid,
      };
      // console.log('body--->', body);

      Api.post('verifystudentotp/', body).then(response => {
        // console.log('response.data--->', response.data);
        if (response.data.status == 'success') {
          dispatch(studentstypes.getStudentStart(teacherdata[0].userid));
          // ToastAndroid.show('OTP ସଫଳତାର ସହ ଯାଞ୍ଚ ହୋଇଛି ।', ToastAndroid.SHORT);
          setModal(true);
        } else {
          ToastAndroid.show('Wrong roll number.', ToastAndroid.SHORT);
        }
      });
    } else {
      ToastAndroid.show(
        'Please enter a valid roll number.',
        ToastAndroid.SHORT,
      );
    }
  };
  const resendOtp = () => {
    // console.log('selected student--->', studentData[0].studentname);
    var rollno = 'TZ' + Math.floor(1000 + Math.random() * 9000);
    console.log('rollno------------------: ', rollno);
    var urls = `https://m1.sarv.com/api/v2.0/sms_campaign.php?token=19818771645efefd49187ff7.92128852&user_id=96192514&route=TR&template_id=11454&sender_id=THNKZN&language=UC&template=%E0%AC%A5%E0%AC%BF%E0%AC%99%E0%AD%8D%E0%AC%95%E0%AC%9C%E0%AD%8B%E0%AC%A8%E0%AD%8D+%E0%AC%B0%E0%AD%87+${verifiedStudent.studentname}%E0%AC%B0+%E0%AC%A8%E0%AC%BE%E0%AC%AE+%E0%AC%AA%E0%AC%9E%E0%AD%8D%E0%AC%9C%E0%AD%80%E0%AC%95%E0%AC%B0%E0%AC%A3+%E0%AC%95%E0%AC%B0%E0%AC%BF%E0%AC%AC%E0%AC%BE%E0%AC%B0+%E0%AC%B0%E0%AD%8B%E0%AC%B2+%E0%AC%A8%E0%AC%AE%E0%AD%8D%E0%AC%AC%E0%AC%B0+%E0%AC%B9%E0%AD%87%E0%AC%89%E0%AC%9B%E0%AC%BF+${rollno}+%E0%A5%A4+%E0%AC%8F%E0%AC%B9%E0%AC%BE%E0%AC%95%E0%AD%81+%E0%AC%B6%E0%AC%BF%E0%AC%95%E0%AD%8D%E0%AC%B7%E0%AC%95+${teacherdata[0].username}%20 %E0%AC%99%E0%AD%8D%E0%AC%95%E0%AD%81+%E0%AC%A6%E0%AD%87%E0%AC%87+%E0%AC%AA%E0%AC%9E%E0%AD%8D%E0%AC%9C%E0%AD%80%E0%AC%95%E0%AC%B0%E0%AC%A3+%E0%AC%A8%E0%AC%BF%E0%AC%B6%E0%AD%8D%E0%AC%9A%E0%AC%BF%E0%AC%A4+%E0%AC%95%E0%AC%B0%E0%AC%A8%E0%AD%8D%E0%AC%A4%E0%AD%81+%E0%A5%A4+ThinkZone&contact_numbers=${verifiedStudent.phone}`;
    // console.log('urls------------------: ', urls);
    axios.get(urls).then(response => {
      // console.log('res: ', response.data);
      if (response.data.code === 200) {
        // console.log('verifiedStudentupdate---->', verifiedStudent);
        ToastAndroid.show('Roll number generate success.', ToastAndroid.SHORT);
        Api.put(`updatestudentotp/${verifiedStudent._id}/${rollno}`).then(
          response => {
            // console.log('res2------->', verifiedStudent._id);
            setChange(response.data);
          },
        );
      } else {
        ToastAndroid.show(
          'Roll number generate error. Please try again.',
          ToastAndroid.SHORT,
        );
      }
    });

    // console.log('ram-------------------------------->', verifiedStudent);
  };
  // React.useEffect(() => {
  //   const timer =
  //     counter > 0 && setInterval(() => setCounter(counter - 1), 1000);
  //   return () => clearInterval(timer);
  // }, [counter]);

  const [isConnected, setIsConnected] = useState(true);
  // console.log('isConnected--->', isConnected);
  // useEffect(() => {
  //   const unsubscribe = NetInfo.addEventListener(state => {
  //     setIsConnected(state.isConnected);
  //   });

  //   return () => {
  //     unsubscribe();
  //   };
  // }, []);

  return (
    <SafeAreaView>
      <ScrollView>
        {isLoading ? (
          <ActivityIndicator
            size="large"
            color={Color.primary}
            style={{justifyContent: 'center', alignSelf: 'center'}}
          />
        ) : (
          <>
            {studentData.length === 0 ? (
              <Modals
                visible={customModal}
                heading={'No Student Available'}
                backgroundColor={'white'}
                onpressok={closeModal}
                okstatus={true}
              />
            ) : (
              <View style={{marginTop: -3}}>
                <View>
                  {/* <Header /> */}
                  <View style={styles.editFormContainer}>
                    <SearchBar
                      placeholder="Search Student"
                      onChangeText={text => searchStudent(text)}
                      keyboardType="default"
                    />
                    {verifiedModalStatus && (
                      <InputModal
                        Title={'Roll No Verification'}
                        description={`We Will send you a roll number on 
                       +91-${verifiedStudent.phone}`}
                        visible={verifiedModalStatus}
                        onClose={() => setVerifiedModalStatus(false)}
                        // onClose={resendOtp}
                        onSubmit={verifiyOTP}
                        onEdit={resendOtp}
                        onChangeText={value => setChange(value)}
                        maxLength={6}
                      />
                    )}

                    {studentList.map((item, index) => (
                      <View style={styles.contener}>
                        <View style={{flexDirection: 'row'}}>
                          <TouchableOpacity
                            onPress={() => {
                              Linking.openURL(`tel:${item.phone}`);

                              navigation.navigate('callresponseList', {item});
                            }}>
                            <Image
                              style={styles.call}
                              source={require('../assets/Image/Group-call.png')}
                            />
                          </TouchableOpacity>

                          <Text style={styles.name}>{item.studentname}</Text>
                          <View
                            style={{
                              // justifyContent: 'flex-end',
                              alignSelf: 'flex-end',
                              right: 27,
                              top: -2,
                              // marginLeft: 250,
                              position: 'absolute',
                            }}>
                            {item.otp_isverified == true ? (
                              <TouchableOpacity onPress={() => {}}>
                                <Text style={styles.verifi}>
                                  Verified{' '}
                                  <AntDesign
                                    name="checkcircle"
                                    size={10}
                                    color={'#A3D735'}
                                  />
                                  {/* <Image
                                  style={{marginTop: 20}}
                                  source={require('../assets/Image/tick-circle.png')}
                                /> */}
                                </Text>
                              </TouchableOpacity>
                            ) : (
                              <TouchableOpacity
                                onPress={() => {
                                  setVerifiedStudent(item);
                                  setVerifiedModalStatus(true);
                                }}>
                                <Text style={styles.verify}>
                                  Verify Now{' '}
                                  <Entypo
                                    name="warning"
                                    size={10}
                                    color={'#FF9515'}
                                  />
                                  {/* <Image
                                  style={{marginTop: 10}}
                                  source={require('../assets/Image/danger.png')}
                                /> */}
                                </Text>
                              </TouchableOpacity>
                            )}
                          </View>
                        </View>
                        <View
                          style={{
                            flexDirection: 'row',
                            alignSelf: 'flex-end',
                            right: 20,
                            top: 10,
                          }}>
                          <TouchableOpacity
                            // style={styles.editIcon}
                            onPress={() => listItemUpdatePressed(item)}
                            updateButton={true}
                            bgcolor={Color.success}
                            style={styles.editIcon}>
                            {/* <Image
                            style={styles.editIcon}
                            source={require('../assets/Image/edit.png')}
                          /> */}
                            <FontAwesome5
                              name="edit"
                              size={22}
                              color={Color.royalblue}
                            />
                          </TouchableOpacity>
                          <TouchableOpacity
                            onPress={() => listItemDeletePressed(item)}
                            deleteButton={true}
                            bgcolor={Color.danger}
                            style={styles.delIcon}>
                            {/* <Image
                            style={styles.delIcon}
                            source={require('../assets/Image/trush-square.png')}
                          /> */}
                            <MaterialIcons
                              name="delete"
                              size={28}
                              color={'#eb3875'}
                            />
                          </TouchableOpacity>
                        </View>
                        <Text style={styles.pogram}>
                          Program :
                          <Text style={{textTransform: 'uppercase'}}>
                            {item.program}
                          </Text>
                        </Text>
                        {item.program == 'pge' ? (
                          <Text style={styles.class}>Class : {item.class}</Text>
                        ) : (
                          <Text style={styles.class}>Level : {item.class}</Text>
                        )}
                        <Text style={styles.register}>
                          Registered on :
                          <Text style={{textTransform: 'uppercase'}}>
                            {moment(item.createdon).format('DD/MM/YY')}
                          </Text>
                        </Text>
                      </View>
                    ))}
                  </View>
                </View>
              </View>
            )}
          </>
        )}
        <Modal animationType="slide" transparent={true} visible={modal}>
          <View style={[styles.centeredView]}>
            <View
              style={[
                styles.modalView,
                {
                  // height: window.WindowHeigth * 0.6,

                  width: window.WindowWidth * 0.9,
                  borderRadius: 20,
                },
              ]}>
              {/* <Pressable onPress={() => setModal(false)}>
              <Entypo
                name="circle-with-cross"
                // color={Color.primary}
                size={30}
                style={{marginLeft: 255, marginTop: -25}}
              />
            </Pressable> */}
              <Image
                style={[
                  styles.tinyLogos,
                  {
                    width: 250,
                    height: 220,
                    justifyContent: 'center',
                    alignItems: 'center',
                    // marginTop: -40,
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
                    // width: 200,
                    alignSelf: 'center',
                  },
                ]}>
                Congratulations! {''}
              </Text>
              <Text
                style={{
                  color: '#666666',
                  // fontWeight: '800',
                  fontWeight: '600',
                  fontFamily: FontFamily.poppinsMedium,
                  textTransform: 'capitalize',
                }}>
                {teacherdata[0].username}
              </Text>

              <Text
                style={[
                  styles.username,
                  {
                    fontSize: 13,
                    // color: '#666666',
                    color: '#666666',
                    fontWeight: '400',
                    fontFamily: FontFamily.poppinsMedium,
                    marginTop: 10,
                    alignSelf: 'center',
                  },
                ]}>
                ଆପଣ ସଫଳତାର ସହ {verifiedStudent.studentname} ଙ୍କ{' '}
                {verifiedStudent.class}ଶ୍ରେଣୀ ରେ ପଞ୍ଜୀକରଣ କରିଛନ୍ତି ଏବଂ ୨ଟି କଏନ
                ହାସଲ କରିଛନ୍ତି ।
              </Text>
              <TouchableOpacity
                onPress={() =>
                  navigation.navigate('ମୋ ସଫଳତା', {
                    type: 'ମୋ ସଫଳତା',
                  })
                }
                style={[
                  styles.bu,
                  {
                    marginTop: 40,
                  },
                ]}>
                <Text
                  style={{
                    fontSize: 15,
                    // color: Color.white,
                    // fontWeight: '900',
                    textAlign: 'center',
                    fontFamily: FontFamily.poppinsMedium,
                    color: 'white',
                  }}>
                  Check Reward
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => navigation.navigate('home')}
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
                    // fontWeight: '900',
                    textAlign: 'center',
                    fontFamily: FontFamily.poppinsMedium,
                    color: Color.royalblue,
                  }}>
                  Skip for now
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </ScrollView>
    </SafeAreaView>
  );
};
export default StudentList;

const styles = StyleSheet.create({
  contener: {
    width: window.WindowWidth * 0.95,
    marginTop: 25,
    paddingBottom: 5,
    paddingTop: 5,
    backgroundColor: 'white',
    overflow: 'scroll',
    borderRadius: 10,
    paddingEnd: 5,
    paddingBottom: 40,
  },
  call: {
    width: 50,
    height: 50,
    marginLeft: 20,
    marginTop: 20,
  },
  name: {
    fontSize: 13,
    color: '#000',
    left: '25%',
    fontFamily: FontFamily.poppinsMedium,
    // fontWeight: '500',
    textAlign: 'left',
    marginTop: 5,
    width: 170,
    // height: '2.38%',
    position: 'absolute',
    textTransform: 'capitalize',
    paddingBottom: 40,
    flexDirection: 'row',
  },
  pogram: {
    marginTop: 30,
    fontSize: 11,
    color: Color.darkslategray_200,

    fontFamily: FontFamily.poppinsMedium,
    fontWeight: '500',
    textAlign: 'left',
    // height: '2.38%',
    position: 'absolute',
    textTransform: 'capitalize',
    // fontSize: FontSize.size_smi,
    left: '25%',
    color: Color.dimgray_100,
    paddingTop: 20,
    paddingBottom: 20,
  },
  register: {
    paddingTop: 30,
    left: '25%',
    fontSize: 11,
    color: Color.darkslategray_200,
    color: Color.dimgray_100,
    fontSize: FontSize.size_smi,
    textTransform: 'capitalize',
  },
  class: {
    marginTop: 80,
    fontSize: 11,
    color: Color.darkslategray_200,
    left: '25%',
    fontFamily: FontFamily.poppinsMedium,
    fontWeight: '500',
    textAlign: 'left',
    // height: '2.38%',
    position: 'absolute',
    textTransform: 'capitalize',

    left: '25%',
    color: Color.dimgray_100,
  },

  editIcon: {
    marginTop: -30,
    width: 30,
    height: 30,
  },
  delIcon: {marginLeft: 25, marginTop: -30},
  verify: {
    fontSize: 11,
    marginTop: 8,
    height: 70,
    left: '8%',
    // marginLeft: 20,
    color: Color.royalblue,
    fontFamily: FontFamily.poppinsMedium,
  },
  verifi: {
    fontSize: 11,
    marginTop: 5,
    height: 70,
    fontWeight: '700',
    color: '#A3D735',
    textAlign: 'right',
    fontFamily: FontFamily.poppinsMedium,
  },
  editFormContainer: {
    marginHorizontal: 10,

    borderRadius: 8,
    paddingTop: 20,
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
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  bu: {
    marginTop: 60,
    width: window.WindowWidth * 0.5,
    backgroundColor: Color.royalblue,
    padding: 5,
    borderRadius: 15,
  },
});
