import {
  StyleSheet,
  Text,
  View,
  FlatList,
  Pressable,
  Alert,
  ActivityIndicator,
  TouchableOpacity,
  Image,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import * as studenttypes from '../redux/slices/StudentSlice';
import Colors from '../utils/Colors';
import AntDesign from 'react-native-vector-icons/AntDesign';
import ListItem from '../components/ListItem';
import Header from '../components/Header';
import * as window from '../utils/dimensions';
import {Color, FontFamily, FontSize, Border} from '../GlobalStyle';

import FontAwesome from 'react-native-vector-icons/FontAwesome';
// import Color from '../utils/Colors';
import {log} from 'react-native-reanimated';
import ButtonComponent from '../components/ButtonComponent';
import {ScrollView} from 'react-native-gesture-handler';
import Norecord from '../components/Norecord';
import Modals from '../components/Modals';
const AttendancemodalList = ({navigation, route}) => {
  const [attendanceList, setAttendanceList] = useState([]);
  const [customModal, setCustomModal] = useState(true);
  const [refresh, setRefreshList] = useState(new Date());
  const isLoading = useSelector(state => state.studentdata.isLoading);
  const dispatch = useDispatch();
  const attendance = useSelector(state => state.studentdata.attendance);

  const [newStudentList, setNewStudentList] = useState([]);
  //
  let totalStudent = 0;
  let unattended = 0;
  let studentforattendance = useSelector(
    state => state.studentdata.studentsforattendance,
  );

  //
  useEffect(() => {
    let data = [];

    if (studentforattendance.length > 0) {
      totalStudent = studentforattendance.length;
      unattended = totalStudent;

      studentforattendance.forEach(element => {
        data.push({
          absentbutton: false,
          detail: element,
          presentbutton: false,
          selectionState: 0,
        });
      });
    }
    setNewStudentList(data);
  }, [studentforattendance]);

  useEffect(() => {
    // console.log(route.params.userid, route.params.date, 'datahhg');
    dispatch(
      studenttypes.getAttendanceListStart({
        userid: route.params.userid,
        attendancedate: route.params.date,
      }),
    );
  }, []);

  useEffect(() => {
    const studentcategory = 'app';
    dispatch(
      studenttypes.getStudentListforAttendanceStart({
        userid: route.params.userid,
        studentcategory: studentcategory,
      }),
    );
  }, []);
  const setAttendance = (item, atdStatus) => {
    if (atdStatus == 'present') {
      item.presentbutton = true;
    } else {
      item.absentbutton = true;
    }
    //
    const modifiedList = newStudentList.map(element => {
      if (element.detail.studentid === item.detail.studentid) {
        if (atdStatus == 'present') {
          item.presentbutton = true;
          return {...element, absentbutton: false, presentbutton: true};
        } else {
          return {...element, presentbutton: false, absentbutton: true};
        }
      }
      return element;
    });
    //
    setNewStudentList(modifiedList);
    const obj = {
      isholiday: false,
      holidayname: '',
      availability: atdStatus,
      userid: item.detail.userid,
      username: item.detail.username,
      centerid: '',
      centername: '',
      attendancedate: route.params.date,
      attendanceday: route.params.day,
      studentid: item.detail.studentid,
      studentname: item.detail.studentname,
      program: item.detail.program,
      geolocation: item.detail.geolocation,
    };

    if (attendanceList.length > 0) {
      let i = 0,
        index = -1;
      attendanceList.forEach(element => {
        if (element.studentid == item.detail.studentid) {
          index = i;
          return;
        }
        i++;
      });
      if (index >= 0) {
        attendanceList.splice(index, 1, obj);
      } else {
        attendanceList.push(obj);
      }
    } else {
      attendanceList.push(obj);
    }
    //
  };
  // useEffect(() => {
  //   newStudentList.map(item => {
  //
  //   });
  // }, [newStudentList[0].presentbutton]);
  const saveBut = () => {
    {
      attendanceList.length === newStudentList.length
        ? dispatch(studenttypes.postAttendanceStart(attendanceList)) &&
          // navigation.navigate('home')
          setTimeout(() => {
            navigation.navigate('studentAttendance');
          }, 2000)
        : Alert.alert(
            'ଧ୍ୟାନ ଦିଅନ୍ତୁ! ',
            'ଆପଣ ଆପ୍ଲିକେନରେ ପଞ୍ଜିକରଣ କରିଥିବା ସମସ୍ତ ଶିକ୍ଷାର୍ଥୀଙ୍କ ଉପସ୍ଥାନ ରେକର୍ଡ କରନ୍ତୁ।',
            // [
            //   {
            //     text: 'Cancel',
            //     onPress: () => null,
            //     style: 'cancel',
            //   },
            //   {text: 'YES', onPress: () => null},
            // ],
            [
              {
                text: 'Ok',
                onPress: () => null,
                style: 'default',
              },
            ],
          );
    }
    // dispatch(studenttypes.postAttendanceStart(attendanceList));
    // navigation.navigate('home');
  };
  const closeModal = () => {
    setCustomModal(false);
    navigation.goBack();
  };
  return (
    <>
      {isLoading ? (
        <ActivityIndicator
          size="large"
          color={Color.primary}
          style={{justifyContent: 'center', alignSelf: 'center'}}
        />
      ) : (
        <>
          <ScrollView>
            {newStudentList.length === 0 ? (
              <Modals
                visible={customModal}
                heading={'No Student Available'}
                backgroundColor={Colors.white}
                // onpressyes={closeModal}
                // onpressno={closeModal}
                onpressok={closeModal}
                okstatus={true}
              />
            ) : (
              <View style={styles.container}>
                {/* <Header /> */}
                {route.params.takeAttendance ? (
                  // console.log('check params-->', route.params),
                  <View>
                    {/* <Text
            style={{
              fontSize: 29,
              textAlign: 'center',
              paddingBottom: 18,
              paddingTop: 12,
              fontWeight: 'bold',
              backgroundColor: Color.primary,
              marginTop: 10,
              marginLeft:19,
              marginRight:19,
              borderRadius:12,
              color:"white"
            }}>
            Take Attendance
          </Text> */}
                    <View
                      style={{
                        flexDirection: 'row',
                        top: 15,
                        // alignSelf: 'center',
                        justifyContent: 'space-around',
                        paddingLeft: 20,
                      }}>
                      <Text
                        style={{
                          color: '#333333',
                          fontSize: 13,
                          fontWeight: '600',
                          fontFamily: FontFamily.poppinsMedium,
                          right: 15,
                        }}>
                        Student Details
                      </Text>
                      <Text
                        style={{
                          color: '#333333',
                          fontSize: 13,
                          fontWeight: '600',
                          fontFamily: FontFamily.poppinsMedium,
                          left: 15,
                          marginLeft: 30,
                        }}>
                        Present
                      </Text>
                      <Text
                        style={{
                          color: '#333333',
                          fontSize: 13,
                          fontWeight: '600',
                          fontFamily: FontFamily.poppinsMedium,
                          // left: 10,
                        }}>
                        Absent
                      </Text>
                    </View>
                    {newStudentList.map((item, index) => (
                      <View
                        style={{
                          width: window.WindowWidth * 0.9,
                          height: window.WindowHeigth * 0.14,
                          marginLeft: 20,
                          marginTop: 25,
                          paddingBottom: 10,
                          paddingTop: 5,
                          backgroundColor: 'white',
                          overflow: 'scroll',
                          borderRadius: 10,
                        }}>
                        <Text
                          style={{
                            fontSize: 19,
                            color: Color.darkslategray_200,
                            left: '9%',
                            fontFamily: FontFamily.poppinsMedium,
                            fontWeight: '500',
                            textAlign: 'left',
                            // height: '2.38%',
                            position: 'absolute',
                            textTransform: 'capitalize',
                            paddingTop: 5,
                          }}>
                          {item.detail.studentname}
                        </Text>
                        <View
                          style={{
                            flexDirection: 'row',
                            justifyContent: 'space-evenly',
                            right: 10,
                          }}>
                          <View>
                            {item.presentbutton ? (
                              <Pressable
                                onPress={() => {
                                  setAttendance(item, 'present');
                                }}>
                                <Image
                                  style={{
                                    marginLeft: 220,
                                    marginTop: 30,
                                    width: 35,
                                    height: 35,
                                  }}
                                  source={require('../assets/Image/user-tick.png')}
                                />
                              </Pressable>
                            ) : (
                              <Pressable
                                onPress={() => {
                                  setAttendance(item, 'present');
                                }}>
                                <Image
                                  style={{
                                    marginLeft: 220,
                                    marginTop: 30,
                                    width: 35,
                                    height: 35,
                                  }}
                                  source={require('../assets/Image/tick.png')}
                                />
                              </Pressable>
                            )}
                          </View>
                          {item.absentbutton ? (
                            <Pressable
                              onPress={() => {
                                setAttendance(item, 'absent');
                              }}>
                              <Image
                                style={{
                                  marginLeft: 30,
                                  marginTop: 30,
                                  width: 35,
                                  height: 35,
                                }}
                                source={require('../assets/Image/user-remove.png')}
                              />
                            </Pressable>
                          ) : (
                            <Pressable
                              onPress={() => {
                                setAttendance(item, 'absent');
                              }}>
                              <Image
                                style={{
                                  marginLeft: 30,
                                  marginTop: 30,
                                  width: 35,
                                  height: 35,
                                }}
                                source={require('../assets/Image/remove.png')}
                              />
                            </Pressable>
                          )}

                          {/* <TouchableOpacity
                            onPress={() => {
                              setAttendance(item, 'absent');
                            }}
                            updateButton={true}
                            bgcolor={Color.success}>
                            <Image
                              style={{marginLeft: 220, marginTop: 20}}
                              source={require('../assets/Image/user-tick.png')}
                            />
                          </TouchableOpacity>
                          <TouchableOpacity
                            onPress={() => {
                              setAttendance(item, 'absent');
                            }}
                            deleteButton={true}
                            bgcolor={Color.danger}>
                            <Image
                              style={{marginLeft: 30, marginTop: 20}}
                              source={require('../assets/Image/user-remove.png')}
                            />
                          </TouchableOpacity> */}
                        </View>
                        <Text
                          style={{
                            marginTop: 40,
                            fontSize: 17,
                            color: Color.darkslategray_200,
                            left: '25%',
                            fontFamily: FontFamily.poppinsMedium,
                            fontWeight: '500',
                            textAlign: 'left',
                            // height: '2.38%',
                            position: 'absolute',
                            textTransform: 'capitalize',
                            fontSize: FontSize.size_smi,
                            left: '9%',
                            color: Color.dimgray_100,
                          }}>
                          Program :
                          <Text style={{textTransform: 'uppercase'}}>
                            {item.detail.program}
                          </Text>
                        </Text>
                        {item.detail.program == 'pge' ? (
                          <Text
                            style={{
                              marginTop: 70,
                              fontSize: 17,
                              color: Color.darkslategray_200,
                              left: '25%',
                              fontFamily: FontFamily.poppinsMedium,
                              fontWeight: '500',
                              textAlign: 'left',
                              // height: '2.38%',
                              position: 'absolute',
                              textTransform: 'capitalize',
                              fontSize: FontSize.size_smi,
                              left: '9%',
                              color: Color.dimgray_100,
                            }}>
                            Class : {item.detail.class}
                          </Text>
                        ) : (
                          <Text
                            style={{
                              marginTop: 70,
                              fontSize: 17,
                              color: Color.darkslategray_200,
                              left: '25%',
                              fontFamily: FontFamily.poppinsMedium,
                              fontWeight: '500',
                              textAlign: 'left',
                              // height: '2.38%',
                              position: 'absolute',
                              textTransform: 'capitalize',
                              fontSize: FontSize.size_smi,
                              left: '9%',
                              color: Color.dimgray_100,
                            }}>
                            Level : {item.detail.class}
                          </Text>
                        )}
                      </View>
                    ))}

                    {/* <FlatList
                      removeClippedSubviews={true}
                      maxToRenderPerBatch={10}
                      initialNumToRender={10}
                      updateCellsBatchingPeriod={40}
                      key={item => item.detail.studentid}
                      data={newStudentList}
                      extraData={refresh}
                      renderItem={({item, index}) => (
                        <ListItem
                          key={index}
                          title={item.detail.studentname}
                          subTitle={item.detail.program}
                          subSub={item.detail.class}
                          color={'black'}
                          IconComponent={
                            <View>
                              {item.absentbutton ? (
                                <Pressable
                                  onPress={() => {
                                    setAttendance(item, 'absent');
                                  }}>
                                  <FontAwesome
                                    name="times-circle"
                                    size={40}
                                    color={Color.red}
                                    style={styles.icon}
                                  />
                                </Pressable>
                              ) : (
                                <Pressable
                                  onPress={() => {
                                    setAttendance(item, 'absent');
                                  }}>
                                  <FontAwesome
                                    name="times-circle"
                                    size={40}
                                    color={Color.lightBlue}
                                    style={styles.icon}
                                  />
                                </Pressable>
                              )}
                            </View>
                          }
                          IconComponent1={
                            <View>
                              {item.presentbutton ? (
                                <Pressable
                                  onPress={() => {
                                    setAttendance(item, 'present');
                                  }}>
                                  <FontAwesome
                                    name="check-circle"
                                    size={40}
                                    color={Color.success}
                                    style={styles.icon}
                                  />
                                </Pressable>
                              ) : (
                                <Pressable
                                  onPress={() => {
                                    setAttendance(item, 'present');
                                  }}>
                                  <FontAwesome
                                    name="check-circle"
                                    size={40}
                                    color={Color.lightBlue}
                                    style={styles.icon}
                                  />
                                </Pressable>
                              )}
                            </View>
                          }
                        />
                      )}
                    /> */}
                    {/* <ButtonComponent buttonName={'SAVE'} buttonPressed={saveBut} /> */}
                    <TouchableOpacity style={styles.button} onPress={saveBut}>
                      <Text style={styles.text}>SAVE</Text>
                    </TouchableOpacity>
                  </View>
                ) : (
                  <View style={{}}>
                    {/* <Text style={{paddingLeft:23}}>AttendancemodalList</Text> */}
                    {/* <View>
            <Text>Attendance Taken</Text>
          </View> */}
                    <FlatList
                      data={attendance}
                      renderItem={({item, index}) => (
                        <View>
                          {item.isholiday === true ? (
                            <View>
                              <Text
                                style={{
                                  alignItems: 'center',
                                  flexDirection: 'row',
                                  padding: 18,
                                  fontSize: 23,
                                  fontWeight: 'bold',
                                  marginTop: 23,
                                  backgroundColor: 'white',
                                  borderRadius: 15,
                                  marginBottom: 10,
                                  marginLeft: 10,
                                  marginRight: 10,
                                }}>
                                It was a holiday. 🙌😴
                              </Text>
                            </View>
                          ) : (
                            <View>
                              <View style={styles.card}>
                                <Text style={styles.listtext}>
                                  {item.studentname}
                                </Text>
                                {item.availability == 'present' ? (
                                  // <AntDesign
                                  //   name="checkcircle"
                                  //   size={23}
                                  //   color={Colors.success}
                                  //   style={styles.icon}
                                  // />
                                  <Image
                                    style={{width: 35, height: 35}}
                                    source={require('../assets/Image/user-tick.png')}
                                  />
                                ) : (
                                  <Image
                                    style={{width: 35, height: 35}}
                                    source={require('../assets/Image/user-remove.png')}
                                  />
                                )}
                              </View>
                            </View>
                          )}
                        </View>
                      )}></FlatList>
                  </View>
                )}
              </View>
            )}
          </ScrollView>
        </>
      )}
    </>
  );
};

export default AttendancemodalList;

const styles = StyleSheet.create({
  container: {
    paddingBottom: 10,
    marginTop: -3,
  },
  card: {
    alignSelf: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    margin: 2,
    height: 68,
    width: 340,
    backgroundColor: Colors.white,
    borderRadius: 10,
    marginTop: 12,
  },
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 37,
    borderRadius: 4,
    elevation: 3,
    marginLeft: 89,
    marginRight: 85,
    marginBottom: 16,
    backgroundColor: Color.royalblue,
    borderRadius: 15,
    marginTop: 15,
  },
  text: {
    fontSize: 16,
    lineHeight: 21,
    fontWeight: 'bold',
    letterSpacing: 0.25,
    color: 'white',
  },
  listtext: {
    // paddingStart: 10,
    // paddingTop: 15,
    // paddingBottom: 5,
    color: Colors.black,
    fontSize: 19,
    // fontWeight: 'bold',
    paddingLeft: 14,
    textTransform: 'capitalize',
  },
  icon: {
    paddingRight: 12,
  },
});
