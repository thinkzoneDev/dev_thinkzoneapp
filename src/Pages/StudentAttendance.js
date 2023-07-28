import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  Button,
  Pressable,
  Image,
} from 'react-native';
import moment from 'moment';
import CalendarPicker from 'react-native-calendar-picker';
import React, {useEffect, useState} from 'react';
import {Color, FontFamily, FontSize, Border} from '../GlobalStyle';
import * as window from '../utils/dimensions';

import {useDispatch, useSelector} from 'react-redux';
import * as studenttypes from '../redux/slices/StudentSlice';
import {style} from 'd3';
import Colors from '../utils/Colors';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {showMessage} from 'react-native-flash-message';
import DatePicker from 'react-native-datepicker';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {ScrollView} from 'react-native-gesture-handler';
import Modals from '../components/Modals';
import Header from '../components/Header';
import {color} from 'react-native-reanimated';
import {useFocusEffect} from '@react-navigation/native';
// import {useFocusEffect} from '@react-navigation/native';
const StudentAttendance = ({navigation}) => {
  const date = new Date();
  const [dob, setDob] = useState(new Date());

  //
  const [todayatt, setTodayatt] = useState(false);
  const dispatch = useDispatch();
  const user = useSelector(state => state.userdata.user?.resData);
  const attendance = useSelector(state => state.studentdata.attendancedate);
  const attendanceList = useSelector(state => state.studentdata.attendance);
  const [customModal, setCustomModal] = useState(false);
  //

  //
  // const[jkl,setJkl] = useState();
  //
  const attendDate = attendance.map(item => {
    const jki = new Date(item);
    //  return jki.getMonth() + 1 + '/' + jki.getDate() + '/' + jki.getFullYear();
    return jki.getDate() + '/' + jki.getMonth() + 1 + '/' + jki.getFullYear();
  });

  const check = new Date(dob);

  // var day = check.getDate();
  // var month = check.getMonth() + 1;
  // var year = check.getFullYear();
  // const checkDate = month + '/' + day + '/' + year;
  const checkDate =
    check.getDate() + '/' + check.getMonth() + 1 + '/' + check.getFullYear();

  //

  const checkCalendar = attendDate.filter(el => el === checkDate);

  // console.log('filter-->', checkCalendar);

  // const fgi = [];
  //

  // const checks = attendDate.find((str) => str === checksum);
  //

  // if(checksum.length > 0){
  //   checksum.push(fgi);
  // }else{
  //
  // }
  // checksum.push(fgi);
  //

  // const attendanceDa = attendance.map(item=>{
  //   const myDate = new Date(item);
  //   return myDate.getFullYear()+ '/' + (myDate.getMonth()+1)  + '/' + myDate.getDate()

  // })
  //

  // const strdate = date.toString();
  let currentDate =
    date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate();

  useEffect(() => {
    dispatch(
      studenttypes.getAttendanceListStart({
        userid: user[0].userid,
        attendancedate: currentDate,
      }),
    );
    // dispatch(
    //   studenttypes.getAttendanceReportStart({
    //     userid: user[0].userid,
    //     // userid: 'pinkurajesh88@gmail.com',
    //     attendancedate: currentDate,
    //   }),
    // );
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      // Do something when the screen is focused
      dispatch(
        studenttypes.getAttendanceReportStart({
          userid: user[0].userid,
          // userid: 'pinkurajesh88@gmail.com',
          attendancedate: currentDate,
        }),
      );
    }, []),
  );

  const setHoliday = () => {
    setCustomModal(false);

    const data = [
      {
        isholiday: true,
        holidayname: 'holiday_name',
        availability: null,
        userid: user[0].userid,
        username: user[0].username,
        centerid: null,
        centername: null,
        attendancedate: dob,
        attendanceday: '',
        studentid: null,
        studentname: null,
        program: null,
      },
    ];
    // showMessage({
    //   message: `Successfully Attendance Taken.`,
    //   // description: 'Successfully Attendance Taken..',

    //   type: 'success',
    //   backgroundColor: Colors.success,
    // });
    dispatch(studenttypes.postAttendanceStart(data));
    setTimeout(() => {
      navigation.navigate('home');
    }, 2000);
  };

  // const minDate = new Date(); // Today
  // const minDate = new Date().getFullYear()+","+ new Date().getMonth()+ "," + (new Date().getDate()-7);
  const minDate = new Date() - 7 * 24 * 60 * 60 * 1000;
  //
  const maxDate = new Date();
  //

  // const minDys = minDate.getDate()-7;
  // const minDys = new Date().getFullYear() + "," + new Date().getMonth() + "," + new Date().getDate()-7;
  //
  // const minDys =
  //   minDate.getFullYear() +
  //   ',' +
  //   (minDate. getDate() - 7) +
  //   ',' +
  //   minDate.getMonth();
  //

  // const [currentMonth, setcurrentMonth] = useState( new Date().getDate()-7);
  //
  const closeModal = () => {
    setCustomModal(false);
  };
  const yesModal = () => {
    setCustomModal(true);
  };
  return (
    <View>
      <Modals
        visible={customModal}
        heading={"ଆପଣ ଏହି ତାରିଖକୁ 'Holiday' ମାର୍କ କରିବା ପାଇଁ ନିଶ୍ଚିତ ତ?"}
        backgroundColor={Colors.white}
        yesStatus={true}
        noStatus={true}
        onpressyes={setHoliday}
        onpressno={closeModal}
        // onpressok={closeModal}
        // okstatus={true}
      />
      <View>
        <ScrollView>
          {/* <Header /> */}
          <View>
            <View>
              {/*  <View>
            {attendanceList.length > 0 ? (
              <View>
                {
                  attendanceList[0].isholiday ? (
                    <View>
                 
                     for emoji --> window key + . */}
              {/* <Text
                        style={{
                          textAlign: 'center',
                          marginTop: 18,
                          fontSize: 27,
                          fontWeight: 'bold',
                        }}>
                        Holiday😁
                      </Text> 
                    </View>
                  ) : null 
                
                }
              </View>
            ) : null}
          </View>*/}

              <View style={styles.dob}>
                <CalendarPicker
                  format="YYYY-MM-DD"
                  minDate={minDate}
                  maxDate={maxDate}
                  todayBackgroundColor={Color.gray_100}
                  selectedDayColor={Color.royalblue}
                  selectedDayStyle={{
                    width: 40,
                    height: 40,
                    backgroundColor: Color.royalblue,
                    borderRadius: 5,
                  }}
                  selectedDayTextColor="white"
                  textStyle={{
                    fontFamily: FontFamily.poppinsSemibold,
                    color: '#000000',
                  }}
                  nextTitleStyle={{
                    marginRight: 19,
                  }}
                  previousTitleStyle={{
                    marginLeft: 19,
                  }}
                  onDateChange={date => {
                    setDob(date);
                    // navigation.navigate('attendancelist', {
                    //   takeAttendance: true,
                    //   userid: user[0].userid,
                    //   studentcategory: user[0].studentcategory,
                    //   date: dob,
                    //   day: '',
                    // });
                  }}
                />
              </View>

              <Pressable
                // style={styles.button1}
                onPress={
                  () => {
                    {
                      checkCalendar.length > 0
                        ? navigation.navigate('studentAttendance', {})
                        : navigation.navigate('attendancelist', {
                            takeAttendance: true,
                            userid: user[0].userid,
                            studentcategory: user[0].studentcategory,
                            date: dob,
                            day: '',
                          });
                    }
                  }
                  // if(attendanceDa === )
                }>
                {checkCalendar.length > 0 ? null : (
                  // <View>
                  //   <Pressable style={styles.button} onPress={setHoliday}>
                  //     <Text style={styles.text}>Holiday🤷‍♀️</Text>
                  //   </Pressable>
                  //   <View style={styles.button1}>
                  //     <Text style={styles.text}>Take Attendance🙋‍♂️</Text>
                  //   </View>
                  // </View>

                  <View
                    style={{
                      flexDirection: 'row',
                      marginTop: 20,
                      marginLeft: -15,
                    }}>
                    <TouchableOpacity
                      style={{
                        // backgroundColor: '#677880',
                        // marginLeft: 42,
                        // paddingRight: 12,
                        // paddingLeft: 19,
                        // alignItems: 'center',
                        // justifyContent: 'center',
                        // paddingVertical: 20,
                        // paddingHorizontal: 39,
                        // borderRadius: 4,
                        // elevation: 3,
                        // marginLeft: 10,
                        // marginRight: 60,
                        // marginBottom: 22,
                        // paddingBottom: 18,
                        margin: 8,
                        paddingLeft: 10,
                        paddingRight: 10,
                        paddingTop: 5,
                        paddingBottom: 5,
                        height: 45,
                        borderRadius: Border.br_xl,
                        backgroundColor: Color.royalblue,
                        width: 142,
                        height: 45,

                        // position: 'absolute',
                        // width: window.WindowWidth * 0.75,
                        justifyContent: 'center',
                        alignItems: 'center',

                        flexDirection: 'row',
                        // justifyContent: 'space-between',
                        // marginRight: 10,
                        marginLeft: 35,
                        // marginTop: 670,
                      }}
                      onPress={yesModal}>
                      <Text style={styles.text}>Holiday</Text>
                    </TouchableOpacity>
                    <View
                      style={{
                        // backgroundColor: Colors.primary,
                        // alignItems: 'center',
                        // justifyContent: 'center',
                        // paddingVertical: 15,
                        // paddingHorizontal: 20,
                        // borderRadius: 4,
                        // elevation: 3,
                        // marginLeft: -55,
                        // marginRight: 70,
                        // marginBottom: 22,
                        margin: 8,
                        paddingLeft: 10,
                        paddingRight: 10,
                        paddingTop: 5,
                        paddingBottom: 5,
                        height: 45,
                        borderRadius: Border.br_xl,
                        backgroundColor: Color.royalblue,
                        width: 142,
                        height: 45,

                        // position: 'absolute',
                        // width: window.WindowWidth * 0.75,
                        justifyContent: 'center',
                        alignItems: 'center',

                        flexDirection: 'row',
                        // justifyContent: 'space-between',
                        // marginRight: 10,
                        marginLeft: 35,
                        // marginTop: 670,
                      }}>
                      <Text style={styles.text}>Attendance</Text>
                    </View>
                  </View>
                )}
              </Pressable>
            </View>
          </View>
          <View style={{marginTop: 50, paddingBottom: 20}}>
            {/* <Text
              style={{
                color: Colors.grey,
                textAlign: 'center',
                marginTop: -40,
                fontWeight: 'bold',
                fontSize: 19,
                fontFamily: FontFamily.balooBhaina2Semibold,
                paddingBottom: 30,
                paddingTop: 20,
              }}>
              ବିଗତ ୭ ଦିନର ଉପସ୍ଥାନ
            </Text> */}
            <View
              style={{
                width: window.WindowWidth * 0.9,
                height: window.WindowHeigth * 0.2,
                backgroundColor: 'white',
                marginLeft: 20,
                borderRadius: 15,
                // marginTop: 15,
                paddingBottom: 10,
              }}>
              <View
                style={{
                  flexDirection: 'row',
                }}>
                <Text
                  style={{
                    width: 200,
                    FontFamily: FontFamily.balooBhaina2Medium,
                    color: '#333333',
                    marginLeft: 20,
                    marginTop: 40,
                  }}>
                  ନିଜର ଶିକ୍ଷାର୍ଥୀମାନଙ୍କ ବିଗତ 7 ଦିନର ଉପସ୍ଥାନ ଯାଞ୍ଚ କରନ୍ତୁ
                </Text>
                <Image
                  style={{
                    width: 100,
                    height: 100,
                    left: '2%',
                    top: '5%',
                    // marginTop: 30,
                  }}
                  resizeMode="cover"
                  source={require('../assets/Image/calender-dynamic-gradient.png')}
                />
              </View>
              <TouchableOpacity
                onPress={() => navigation.navigate('attendanceList')}
                style={{
                  backgroundColor: Color.royalblue,
                  marginLeft: 20,
                  borderRadius: 20,
                  width: window.WindowWidth * 0.21,
                  heightgg: 30,
                  marginTop: 5,
                }}>
                <Text
                  style={{
                    // width: 155,
                    FontFamily: FontFamily.balooBhaina2Medium,
                    color: '#333333',
                    textAlign: 'center',
                    // marginLeft: 10,
                    color: Color.white,
                    // marginTop: 40,
                    paddingBottom: 4,
                    paddingTop: 4,
                    fontSize: 11,
                  }}>
                  Click Here
                </Text>
              </TouchableOpacity>
            </View>
            {/* <View style={{marginTop: 20}}>
              <FlatList
                data={attendance}
                renderItem={({item}) => (
                  <Pressable
                    onPress={() =>
                      navigation.navigate('attendancelist', {
                        // navigation.navigate('studentAttendance', {
                        takeAttendance: false,
                        userid: user[0].userid,
                        date: item,
                      })
                    }>
                    <View style={styles.card}>
                      <Text style={styles.listtext}>
                        {moment(item).format('DD/MM/YYYY')}
                      </Text>
                      <Ionicons
                        name="md-checkmark-done-circle-sharp"
                        size={20}
                        color={Colors.success}
                        style={[styles.icon, {marginRight: 10}]}
                      />
                    </View>
                  </Pressable>
                )}></FlatList>
            </View> */}
          </View>
          {/* {attendanceList.length > 0 ? ( */}
        </ScrollView>
      </View>
    </View>
  );
};

export default StudentAttendance;

const styles = StyleSheet.create({
  card: {
    alignSelf: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    margin: 5,
    height: 50,
    width: 340,
    backgroundColor: Colors.white,

    borderRadius: 10,
    // marginBottom: 409,
  },

  button: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 39,
    borderRadius: 4,
    elevation: 3,
    marginLeft: 90,
    marginRight: 71,
    marginBottom: 22,
    paddingBottom: 18,
    backgroundColor: '#677880',
  },
  button1: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
    paddingHorizontal: 37,
    borderRadius: 4,
    elevation: 3,
    marginLeft: 90,
    marginRight: 70,
    marginBottom: 12,
    backgroundColor: Colors.primary,
  },
  text: {
    fontSize: 14,
    lineHeight: 21,
    fontWeight: 'bold',
    letterSpacing: 0.2,
    color: 'white',
    paddingLeft: 8,
  },
  dob: {
    // backgroundColor: '#7393B3',
    // backgroundColor: '#5e90af',
    todayBackgroundColor: Color.royalblue,
    selectedDayColor: Color.royalblue,
    selectedDayTextColor: Color.royalblue,
    marginBottom: 27,
    marginTop: 30,
    // marginLeft: 15,
    // marginRight: 15,
    // borderRadius: 12,
    // boxShadow: 2,
  },

  listtext: {
    paddingLeft: 15,
    textAlign: 'center',
    // color: Colors.black,
    fontSize: 16,
    fontWeight: 'bold',
    fontFamily: FontFamily.poppinsMedium,
  },
  listtext1: {
    paddingLeft: 15,
    textAlign: 'center',
    color: Colors.black,
    fontSize: 23,
    fontWeight: 'bold',
    marginTop: 18,
    backgroundColor: '',
  },
});
