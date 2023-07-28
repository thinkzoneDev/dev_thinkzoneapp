import {
  StyleSheet,
  Text,
  View,
  Button,
  // TouchableOpacity,
  FlatList,
  LayoutAnimation,
  Image,
  TouchableOpacity,
  ToastAndroid,
  SafeAreaView,
  StatusBar,
  Modal,
  TouchableWithoutFeedback,
  Pressable,
} from 'react-native';
import {Rating, AirbnbRating} from 'react-native-ratings';
import FontAwesome5Icon from 'react-native-vector-icons/FontAwesome5';
// import Color from '../utils/Colors';
import React from 'react';
import {ScrollView} from 'react-native-gesture-handler';
import {Colors, DataTable} from 'react-native-paper';
import Accordion from '../components/Accordion';
import StepIndicator from 'react-native-step-indicator';
import ProgressbarIndicator from '../components/ProgressbarIndicator';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {useEffect} from 'react';
import API from '../environment/Api';
import * as types from '../redux/slices/UserSlice';
import {Item} from 'react-native-paper/lib/typescript/components/List/List';
import MyAchievementSkeleton from '../skeletons/MyAchievementSkeleton';
import * as window from '../utils/dimensions';
import {useFocusEffect} from '@react-navigation/native';
import moment from 'moment';
import {FontFamily, Color, FontSize, Border} from '../GlobalStyle';
import {
  green200,
  red200,
} from 'react-native-paper/lib/typescript/styles/colors';

const Myachivement = ({navigation}) => {
  const user = useSelector(state => state.userdata.user?.resData);
  //
  const coin = useSelector(state => state.userdata.rewards);
  // console.log(coin[0].streakDays, 'coins------------------------------->');

  const dispatch = useDispatch();
  //

  const [isStatus, setisStatus] = useState(false);
  const [achieve, setAchieve] = useState([]);
  const [isLoading, setIsloading] = useState(true);
  const [timeSpent_record, setTimeSpent_record] = useState([]);
  const [transaction_record, setTransaction_record] = useState([]);
  // console.log(transaction_record,"transaction_record====================");
  const [reward, setReward] = useState('');
  const [modalVisible, setModalVisible] = useState(false);

  const data = [
    {id: 1, value: 'Baseline', baselineMark: '23'},
    {id: 2, value: 'Prabesha', endlineMark: '18'},
    {id: 3, value: 'Prastusti'},
    {id: 4, value: 'Endline'},
    {id: 5, value: 'NSDC'},
  ];
  let tableHead = ['Months', 'TimeSpent'];
  // let tableTitle = ['Jan', 'Feb', 'Mar', 'Apr','May', 'Jun','Jul','Aug','Sep', 'Oct','Nov','Dec'];
  //  let tableTitle = [];
  let tableData = [
    {month: 'Jan', time: 12},
    {month: 'Feb', time: 23},
    {month: 'Mar', time: 34},
    {month: 'Apr', time: 45},
    {month: 'May', time: 67},
    {month: 'Jun', time: 34},
    {month: 'Jul', time: 56},
    {month: 'Aug', time: 45},
    {month: 'Sep', time: 23},
    {month: 'Oct', time: 34},
    {month: 'Nov', time: 56},
    {month: 'Dec', time: 12},
  ];

  const labels = [
    'ଶିକ୍ଷକ ମୂଲ୍ୟାଙ୍କନ',
    'ପ୍ରବେଶ',
    'ପ୍ରସ୍ତୁତି',
    'ଏଣ୍ଡ୍ ଲାଇନ୍',
    'NSDC',
  ];

  const customStyles = {
    stepIndicatorSize: 25,
    currentStepIndicatorSize: 30,
    separatorStrokeWidth: 2,
    currentStepStrokeWidth: 3,
    stepStrokeCurrentColor: Color.primary,
    stepStrokeWidth: 2,
    stepStrokeFinishedColor: Color.primary,
    stepStrokeUnFinishedColor: '#aaaaaa',
    separatorFinishedColor: Color.primary,
    separatorUnFinishedColor: '#aaaaaa',
    stepIndicatorFinishedColor: Color.primary,
    stepIndicatorUnFinishedColor: '#ffffff',
    stepIndicatorCurrentColor: '#ffffff',
    stepIndicatorLabelFontSize: 14,
    currentStepIndicatorLabelFontSize: 16,
    stepIndicatorLabelCurrentColor: 'black',
    stepIndicatorLabelFinishedColor: '#ffffff',
    stepIndicatorLabelUnFinishedColor: '#aaaaaa',
    labelColor: '#000000',
    labelSize: 13,
    currentStepLabelColor: Color.primary,
  };
  const numColumns = 5;
  const [background, setBackground] = useState();

  function handlePress() {
    setisStatus(true);
    //
  }
  //For My achievement aPI

  useEffect(() => {
    API.get(`getUserProgress/${user[0].userid}`).then(
      // API.get(`getUserProgress/jayprakashbehera030@gmail.com`).then(
      response => {
        //
        setAchieve(response.data);
        setTimeSpent_record(response.data[0].timeSpentData);
        setIsloading(false);
      },
      err => {},
    );
  }, []);

  //For Transaction aPI
  useEffect(() => {
    API.get(`getLast5CoinsTransaction/${user[0].userid}`).then(
      response => {
        // console.log("dataaaaaaaaaaaaaaaaaaa-----------------",response.data,user[0].userid );
        setTransaction_record(response.data.data);
        //  console.log(response.data.data,"response.data------------------------------------------");
        setIsloading(false);
      },
      err => {},
    );
    // console.log(user[0].userid, "userid-------------------")
  }, []);

  // useEffect(() => {
  //   // API.get(`getTotalCoins/${user[0].userid}`).then(response => {
  //   //
  //   //   setReward(response.data[0].coins);
  //   // });
  //   dispatch(types.rewardsUserstart(user[0].userid));
  // }, []);

  useFocusEffect(
    React.useCallback(() => {
      // Do something when the screen is focused
      dispatch(types.rewardsUserstart(user[0].userid));
    }, []),
  );

  // For Info modal
  const [show, setShow] = useState(false);

  //  const lastFiveTransactions = transaction_record.slice(-5);

  return (
    <ScrollView>
      <View>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-evenly',
            marginTop: 30,
          }}>
          <View
            style={{
              width: 149,
              // height: 201,
              backgroundColor: 'white',
              borderRadius: 6,
              alignItems: 'center',
              paddingTop: 5,
              paddingBottom: 20,
            }}>
            <Image
              source={require('../assets/Image/Screenshot.png')}
              style={{width: 83.81, height: 80.3}}
            />
            <Text
              style={{
                fontFamily: FontFamily.poppinsMedium,
                color: '#333333',
                fontSize: 13,
              }}>
              ThinkZone coins
            </Text>
            {coin.length > 0 ? (
              <Text
                style={{
                  fontFamily: FontFamily.poppinsMedium,
                  color: '#333333',
                  fontSize: 22,
                  fontWeight: '900',
                }}>
                {coin[0].coins}
              </Text>
            ) : (
              <Text
                style={{
                  fontFamily: FontFamily.poppinsMedium,
                  color: '#333333',
                  fontSize: 22,
                  fontWeight: '900',
                }}>
                0
              </Text>
            )}
            {/* {coin.length > 0 ? (
            <TouchableOpacity
              onPress={() =>
                ToastAndroid.show(
                  'This Action is under maintenance. It will be LIVE soon.',
                  ToastAndroid.SHORT,
                )
              }
              // onPress={() =>
              //   navigation.navigate('NSDC', {
              //     type: 'NSDC',
              //   })
              // }
              style={{
                backgroundColor: Color.royalblue,
                // marginLeft: 20,
                borderRadius: 8,
                width: window.WindowWidth * 0.3,
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
                  fontSize: 13,
                }}>
                use them
              </Text>
            </TouchableOpacity>
          ) : null} */}
          </View>
          <View
            style={{
              width: 149,
              // height: 201,
              backgroundColor: 'white',
              borderRadius: 6,
              alignItems: 'center',
              paddingTop: 5,
              paddingBottom: 20,
            }}>
            <Image
              source={require('../assets/Image/2385856.png')}
              style={{width: 68.05, height: 78.39}}
            />
            <Text
              style={{
                fontFamily: FontFamily.poppinsMedium,
                color: '#333333',
                fontSize: 13,
              }}>
              Your StreakDays
            </Text>
            <Text
              style={{
                fontFamily: FontFamily.poppinsMedium,
                color: '#333333',
                fontSize: 22,
                fontWeight: '900',
              }}>
              {coin[0]?.streakDays}
            </Text>
            {/* <TouchableOpacity
            // onPress={() =>
            //   navigation.navigate('NSDC', {
            //     type: 'NSDC',
            //   })
            // }
            style={{
              backgroundColor: Color.royalblue,
              // marginLeft: 20,
              borderRadius: 8,
              width: window.WindowWidth * 0.3,
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
                fontSize: 13,
              }}>
              Check
            </Text>
          </TouchableOpacity> */}
          </View>
        </View>
        <View
          style={{
            paddingLeft: -19,
            paddingRight: -19,
            width: window.WindowWidth * 0.92,
            alignSelf: 'center',
            // top: 50,
            margin: 10,
          }}>
          <Text style={styles.text1}>Reward Transaction</Text>
        </View>

        {transaction_record.length > 0 ? (
          <View
            style={{
              // width: window.WindowWidth * 0.92,
              alignSelf: 'center',
              backgroundColor: 'white',
              borderRadius: 6,
              // top: 20,
              margin: 10,
              flexDirection: 'column',
            }}>
            {transaction_record.map((item, index) => (
              <View>
                {item.transactionType === 'credit' ? (
                  <>
                    <View style={{flexDirection: 'row'}}>
                      <Text style={{marginLeft: 16, color: 'green'}}>
                        Prev.Bal.- {item.previousBalance}
                      </Text>
                      <Text style={{marginLeft: 55, color: 'green'}}>
                        Cur.Bal.- {item.currentBalance}
                      </Text>
                    </View>
                    <View
                      style={{
                        flexDirection: 'row',
                        borderBottomWidth: 0.7,
                        borderBottomColor: Color.greyGrey300,
                      }}>
                      <Text style={{marginLeft: 16, color: 'green'}}>
                        {moment(item.createdon).format('DD/MM/YY')}
                      </Text>
                      <Text style={{marginLeft: 70, color: 'green'}}>
                        {item.msg}
                      </Text>
                    </View>
                  </>
                ) : (
                  <>
                    <View style={{flexDirection: 'row'}}>
                      <Text style={{marginLeft: 16, color: 'red'}}>
                        Prev.Bal.- {item.previousBalance}
                      </Text>
                      <Text style={{marginLeft: 55, color: 'red'}}>
                        Cur.Bal.- {item.currentBalance}
                      </Text>
                    </View>
                    <View
                      style={{
                        flexDirection: 'row',
                        borderBottomWidth: 0.7,
                        borderBottomColor: Color.greyGrey300,
                      }}>
                      <Text style={{marginLeft: 16, color: 'red'}}>
                        {moment(item.createdon).format('DD/MM/YY')}
                      </Text>
                      <Text style={{marginLeft: 70, color: 'red'}}>
                        {item.msg}
                      </Text>
                    </View>
                  </>
                )}

                {/* ) : null} */}
              </View>
            ))}
            <TouchableOpacity
              onPress={() => navigation.navigate('rewardtransaction')}
              style={{
                marginLeft: 202,
                color: Color.royalblue,
                alignItems: 'center',
                // marginTop: 0,
                // paddingTop: 2,
              }}>
              <Text
                style={{
                  color: Color.royalblue,
                  fontWeight: '600',
                  fontFamily: FontFamily.poppinsSemibold,
                }}>
                View More
              </Text>
            </TouchableOpacity>
          </View>
        ) : (
          <Text
            style={{
              fontSize: 22,
              textAlign: 'center',
              color: 'red',
              marginTop: 12,
            }}>
            No data found
          </Text>
        )}

        <View
          style={{
            paddingLeft: -19,
            paddingRight: -19,
            width: window.WindowWidth * 0.92,
            alignSelf: 'center',
            // top: 50,
            margin: 10,
          }}>
          <Text style={styles.text}>Time Spent Report</Text>
        </View>

        {timeSpent_record.length > 0 ? (
          <View
            style={{
              width: window.WindowWidth * 0.92,
              alignSelf: 'center',
              backgroundColor: 'white',
              borderRadius: 6,
              // top: 20,
              margin: 10,
            }}>
            <DataTable>
              <DataTable.Header>
                <DataTable.Title style={{flex: 3, marginLeft: 36}}>
                  Year
                </DataTable.Title>
                <DataTable.Title style={{flex: 3}}>Month</DataTable.Title>
                <DataTable.Title style={{flex: 3}}>Time Spent</DataTable.Title>
              </DataTable.Header>
              <FlatList
                removeClippedSubviews={true}
                maxToRenderPerBatch={10}
                initialNumToRender={10}
                updateCellsBatchingPeriod={40}
                data={timeSpent_record}
                renderItem={({item, index}) => (
                  <DataTable.Row style={{flex: 3}}>
                    <DataTable.Cell style={{marginLeft: 32}}>
                      {item.year ? item.year : 'NA'}
                    </DataTable.Cell>
                    <DataTable.Cell style={{flex: 1, paddingLeft: 20}}>
                      {item.month === 1
                        ? 'Jan'
                        : item.month === 2
                        ? 'Feb'
                        : item.month === 3
                        ? 'March'
                        : item.month === 4
                        ? 'April'
                        : item.month === 5
                        ? 'May'
                        : item.month === 6
                        ? 'June'
                        : item.month === 7
                        ? 'July'
                        : item.month === 8
                        ? 'Aug'
                        : item.month === 9
                        ? 'Sep'
                        : item.month === 10
                        ? 'Oct'
                        : item.month === 11
                        ? 'Nov'
                        : item.month === 12
                        ? 'Dec'
                        : 'NA'}
                    </DataTable.Cell>
                    <DataTable.Cell style={{paddingLeft: 13}}>
                      {/* {Math.floor(item.duration / 60)} */}

                      {item.timeSpent ? item.timeSpent + 'mins' : '0 mins'}
                    </DataTable.Cell>
                  </DataTable.Row>
                )}
              />
            </DataTable>
          </View>
        ) : (
          <Text
            style={{
              fontSize: 22,
              textAlign: 'center',
              color: 'red',
              marginTop: 12,
            }}>
            No data found
          </Text>
        )}
      </View>
    </ScrollView>
  );
};

export default Myachivement;

const styles = StyleSheet.create({
  tab: {paddingTop: 6},
  head: {height: 40, backgroundColor: '#f1f8ff'},
  wrapper: {flexDirection: 'row'},
  title: {flex: 1, backgroundColor: '#f6f8fa'},
  row: {height: 28},
  text2: {textAlign: 'center', color: 'black'},
  container: {
    paddingVertical: '2%',
    paddingHorizontal: '3%',
    backgroundColor: '#e7e7e7',
  },
  text: {
    flexDirection: 'row',
    marginTop: 15,
    textAlign: 'center',

    backgroundColor: Color.royalblue,

    paddingBottom: 15,
    paddingTop: 20,
    borderRadius: 12,

    fontSize: 20,

    color: 'white',
    fontFamily: FontFamily.poppinsSemibold,
  },
  text1: {
    flexDirection: 'row',
    marginTop: 15,
    textAlign: 'center',

    backgroundColor: Color.white,

    paddingBottom: 10,
    paddingTop: 15,
    borderRadius: 12,

    fontSize: 20,

    color: 'royalblue',
    fontFamily: FontFamily.poppinsSemibold,
  },
  modalt: {
    color: 'white',
    fontSize: 15,
    marginLeft: 20,
    textAlign: 'right',
    paddingRight: 70,
    paddingBottom: 10,
    fontWeight: '700',
    fontFamily: 'serif',
    // justifyContent: 'flex-start',
  },
  view: {
    paddingTop: 20,
  },
  textFeedback: {
    fontSize: 14,
    lineHeight: 21,
    fontWeight: 'bold',
    letterSpacing: 0.2,
    color: 'black',
    paddingLeft: 8,
  },
  centeredView: {
    flex: 1,
    // width: window.WindowWidth * 0.7,
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
  button: {
    borderRadius: 10,
    padding: 10,
    elevation: 2,
  },
  buttonOpen: {
    backgroundColor: '#F194FF',
  },
  buttonClose: {
    backgroundColor: 'green',
    // marginTop: 184,
    marginTop: 29,
    paddingLeft: 49,
    paddingRight: 49,
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
    color: 'black',
    fontSize: 19,
  },
});
