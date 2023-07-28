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
import Norecord from '../components/Norecord';
const Attendancelist = ({navigation}) => {
  const date = new Date();
  const [dob, setDob] = useState(new Date());

  const [todayatt, setTodayatt] = useState(false);
  const dispatch = useDispatch();
  const user = useSelector(state => state.userdata.user?.resData);
  const attendance = useSelector(state => state.studentdata.attendancedate);
  const attendanceList = useSelector(state => state.studentdata.attendance);
  const [customModal, setCustomModal] = useState(false);

  const attendDate = attendance.map(item => {
    const jki = new Date(item);

    return jki.getDate() + '/' + jki.getMonth() + 1 + '/' + jki.getFullYear();
  });

  const check = new Date(dob);

  const checkDate =
    check.getDate() + '/' + check.getMonth() + 1 + '/' + check.getFullYear();

  //

  const checkCalendar = attendDate.filter(el => el === checkDate);

  // console.log(
  //   'filter-->',
  //   attendDate.filter(el => el === checkDate),
  // );

  let currentDate =
    date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate();

  useEffect(() => {
    dispatch(
      studenttypes.getAttendanceListStart({
        userid: user[0].userid,
        attendancedate: currentDate,
      }),
    );
    dispatch(
      studenttypes.getAttendanceReportStart({
        userid: user[0].userid,
        // userid: 'pinkurajesh88@gmail.com',
        attendancedate: currentDate,
      }),
    );
  }, []);

  return (
    <>
      {attendance.length === 0 ? (
        <Norecord />
      ) : (
        <View style={{marginTop: 20}}>
          <FlatList
            data={attendance}
            renderItem={({item}) => (
              <Pressable
                onPress={() =>
                  navigation.navigate('attendancelist', {
                    // navigation.navigate('Attendancelist', {
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
        </View>
      )}
      {/* {attendanceList.length > 0 ? ( */}
    </>
  );
};

export default Attendancelist;

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
