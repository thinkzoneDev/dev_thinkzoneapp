import {StyleSheet, Text, View, Image} from 'react-native';
import React, {useState, useEffect} from 'react';
import DatePicker from 'react-native-datepicker';
import * as userscall from '../redux/slices/UserCallSlice';
import * as window from '../utils/dimensions';

import {useSelector, useDispatch} from 'react-redux';
import API from '../environment/Api';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
// import Color from '../utils/Colors';
import CalendarPicker from 'react-native-calendar-picker';
import {ScrollView} from 'react-native-gesture-handler';
import Header from '../components/Header';
import {Color, FontFamily, FontSize, Border} from '../GlobalStyle';
import {MonthSwitch, DateData} from 'react-native-month-switch';
const CallList = navigation => {
  const dispatch = useDispatch();
  const user = useSelector(state => state.userdata.user?.resData);
  // const callrecords = useSelector(state => state.userscalllist.callrecords);
  // console.log(callrecords, 'callrecords');

  //for calendar
  const date = new Date();
  let currentDate =
    date.getMonth() + 1 + '-' + date.getDate() + '-' + date.getFullYear();
  // console.log('date-->', currentDate);

  const [callrecords, setCallrecords] = useState([]);
  const [dob, setDob] = useState(new Date());
  // console.log('dob-->', dob);
  const [currentMonth, setcurrentMonth] = useState(date.getMonth() + 1);
  const [currentYear, setcurrentYear] = useState(date.getFullYear());
  // console.log('currentMonth-->', currentMonth);
  // console.log('currentYear-->', currentYear);

  // const check = new Date(dob);
  // console.log("check-->",check)

  useEffect(() => {
    setcurrentMonth(new Date(dob).getMonth() + 1);
    setcurrentYear(new Date(dob).getFullYear());
    const data = {
      userid: user[0].userid,
      language: 'od',
      month: currentMonth,
      year: currentYear,
    };
    API.get(
      `gettranspostcallactivitiesbyuserid/${data.userid}/${data.language}/${data.month}/${data.year}`,
      // `gettranspostcallactivitiesbyuserid/pinkurajesh88@gmail.com/od/09/2022`,
    ).then(
      response => {
        setCallrecords(response.data);
      },
      err => {
        // console.log(err);
      },
    );
    // getCallrecord();
  }, [dob, currentMonth, currentYear]);
  // const getCallrecord=async ()=>
  //   await API.get(
  //     `gettranspostcallactivitiesbyuserid/${data.userid}/${data.language}/${data.month}/${data.year}`,
  //   );
  const minDate = new Date(2022, 1, 3);
  const maxDate = new Date(2030, 6, 3);

  const handleMonth = () => {
    // console.log('month change');
  };

  return (
    <ScrollView>
      <View style={{marginTop: -3}}>
        {/* <Header /> */}
        {/* <DatePicker
        style={{width: 200}}
        date={dob}
        mode="date"
        placeholder="select date"
        format="YYYY-MM-DD"
        minDate="2010-01-01"
        // maxDate="2020-01-01"
        confirmBtnText="Confirm"
        cancelBtnText="Cancel"
        customStyles={{
          dateIcon: {
            position: 'absolute',
            right: 0,
            top: 4,
            marginLeft: 0,
          },
          dateInput: {
            marginLeft: 36,
          },
          // ... You can check the source to find the other keys.
        }}
        onDateChange={date => {
          setDob(date);
        }}
      />  */}
        <View style={styles.dob}>
          <View>
            <MonthSwitch
              format={'MMMM yyyy'}
              renderCustomArrow={direction => {
                const arrowImage =
                  direction === 'left'
                    ? require('../assets/Image/left.png')
                    : require('../assets/Image/right.png');

                return (
                  <Image
                    style={{
                      width: 35,
                      height: 35,
                    }}
                    source={arrowImage}
                  />
                );
              }}
              onLeftArrow={date => {
                setDob(date);
              }}
              onRightArrow={date => {
                setDob(date);
              }}
            />
          </View>
          {/* <CalendarPicker
            format="YYYY-MM-DD"
            minDate={minDate}
            maxDate={maxDate}
            disabledDates="false"
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
              color: 'black',
            }}
            previousTitleStyle={{
              marginLeft: 19,
              color: 'black',
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
          /> */}
        </View>

        <View>
          {callrecords.length > 0 ? (
            <>
              {callrecords.map((item, i) => (
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
                  <Image
                    style={{
                      width: 50,
                      height: 50,
                      marginLeft: 20,
                      marginTop: 20,
                    }}
                    source={require('../assets/Image/callg.png')}
                  />

                  <Text
                    style={{
                      fontSize: 17,
                      color: Color.darkslategray_200,
                      left: '25%',
                      fontFamily: FontFamily.poppinsMedium,
                      fontWeight: '600',
                      textAlign: 'left',
                      // height: '2.38%',
                      position: 'absolute',
                      marginTop: 20,
                      textTransform: 'capitalize',
                    }}>
                    {/* window key + . */}
                    {item._id.studentname}
                  </Text>
                  <Text
                    style={{
                      marginTop: 60,
                      fontSize: 17,
                      color: Color.darkslategray_200,

                      fontFamily: FontFamily.poppinsMedium,
                      fontWeight: '500',
                      textAlign: 'left',
                      // height: '2.38%',
                      position: 'absolute',
                      textTransform: 'capitalize',
                      fontSize: FontSize.size_smi,
                      left: '25%',
                      color: Color.dimgray_100,
                    }}>
                    {' '}
                    Call: {item.detailsarr?.length}
                  </Text>
                </View>
              ))}
            </>
          ) : (
            <>
              <View style={{flexDirection: 'row'}}>
                <FontAwesome
                  name="times-circle"
                  size={40}
                  color={Color.danger}
                  style={styles.icon}
                />
                <Text
                  style={{
                    paddingLeft: 19,
                    fontSize: 23,
                    fontWeight: 'bold',
                    color: 'red',
                    marginTop: 3,
                  }}>
                  No Callrecords
                </Text>
              </View>
            </>
          )}
        </View>
      </View>
    </ScrollView>
  );
};

export default CallList;

const styles = StyleSheet.create({
  dob: {
    // backgroundColor: '#7393B3',
    backgroundColor: 'white',
    paddingBottom: 49,
    paddingTop: 34,

    marginBottom: 17,
    marginTop: 20,
    marginLeft: 15,
    marginRight: 15,
    borderRadius: 12,
    boxShadow: 2,
  },
  icon: {
    paddingLeft: 12,
    paddingHorizontal: 9,
  },
});
