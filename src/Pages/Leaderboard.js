import {
  Alert,
  StyleSheet,
  Text,
  View,
  Image,
  FlatList,
  DropDown,
  TouchableOpacity,
} from 'react-native';
// import Color from '../utils/Colors';
import Entypo from 'react-native-vector-icons/Entypo';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import DropdownComponent from '../components/DropdownComponent';
import Norecord from '../components/Norecord';
import React from 'react';
import {useEffect, useRef, useCallback, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import moment from 'moment';
import API from '../environment/Api';
import ButtomSheet from '../components/BottomSheet';
import AppTextInput from '../components/TextInput';
import * as window from '../utils/dimensions';
import ListItem from '../components/ListItem';
import LinearGradient from 'react-native-linear-gradient';
import PgeSkeleton from '../skeletons/PgeSkeleton';
import ModalComponent from '../components/ModalComponent';
import {Color, FontFamily, FontSize, Border} from '../GlobalStyle';

const Leaderboard = () => {
  const dispatch = useDispatch();
  const user = useSelector(state => state.userdata.user?.resData);
  //
  const modalRef = useRef(null);
  const modalHeight = window.WindowHeigth * 0.3;
  const curYear = new Date().getFullYear();
  const curMonth = new Date().getMonth() + 1;
  const [year, setYear] = useState(curYear);
  const [month, setMonth] = useState(new Date().getMonth() + 1);

  const [date, setDate] = useState('');
  const [result, setResult] = useState([]);
  // console.log('result---->', result);
  const [language, setLanguage] = useState('od');
  const [isLoading, setIsloading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalData, setModalData] = useState({});
  useEffect(() => {
    if (curYear < year && curMonth < month) {
      Alert.alert(
        'Info',
        'Selected month cannot be greater than or equal to current month',
      );
    }
    if (curYear == year && curMonth < month) {
      Alert.alert(
        'Info',

        'Selected month cannot be greater than or equal to current month',
      );
    } else if (curYear == year && curMonth == month) {
      //
      API.get(`getleaderboarddata/${user[0].usertype}/${month}/${year}`).then(
        response => {
          //
          setResult(response.data);

          setIsloading(false);
        },
        err => {},
      );
    } else {
      //
      API.get(`getleaderboarddata/${user[0].usertype}/${month}/${year}`).then(
        response => {
          //
          setResult(response.data);
          setIsloading(false);
        },
        err => {},
      );
    }
  }, [month, year]);
  const handleClick = data1 => {
    setModalVisible(true);
    setModalData(data1);
  };

  return (
    <>
      <ModalComponent
        modalVisible={modalVisible}
        data={modalData}
        onClick={() => setModalVisible(false)}
      />
      <View>
        <DropdownComponent
          data={yearList}
          value={year}
          label={'name'}
          set={year}
          onChange={item => setYear(item.value)}
        />
        <DropdownComponent
          data={monthlist}
          value={month}
          label={'name'}
          set={
            month == 1
              ? 'Jan'
              : month == 2
              ? 'Feb'
              : month == 3
              ? 'March'
              : month == 4
              ? 'April'
              : month == 5
              ? 'May'
              : month == 6
              ? 'June'
              : month == 7
              ? 'July'
              : month == 8
              ? 'Aug'
              : month == 9
              ? 'Sep'
              : month == 10
              ? 'Oct'
              : month == 11
              ? 'Nov'
              : month == 12
              ? 'Dec'
              : 'NA'

            //   ? month == 5
            //   : 'May'
            //   ? month == 6
            //   : 'June'
            //   ? month == 7
            //   : 'July'
            //   ? month == 8
            //   : 'Aug'
            //   ? month == 9
            //   : 'Sep'
            //   ? month == 10
            //   : 'Oct'
            //   ? month == 11
            //   : 'Nov'
            //   ? month == 12
            //   : 'Dec'
            // : 'NA'
          }
          onChange={item => setMonth(item.value)}
        />
      </View>
      {isLoading ? (
        <View>
          <PgeSkeleton />
        </View>
      ) : result.length == 0 ? (
        <Norecord />
      ) : (
        <FlatList
          removeClippedSubviews={true}
          maxToRenderPerBatch={10}
          initialNumToRender={10}
          updateCellsBatchingPeriod={40}
          data={result}
          renderItem={({item, index}) => (
            <>
              <View>
                <TouchableOpacity onPress={() => handleClick(item)}>
                  <View style={styles.view}>
                    {/* <Text>{index + 1}</Text> */}

                    {(index == 0) | (index == 1) | (index == 2) ? (
                      <View>
                        <View style={styles.first}>
                          <Image
                            style={styles.tinyLogos}
                            source={require('../assets/Photos/userss.png')}
                          />
                          <Text style={styles.FlngatiTexti}>
                            {item.username}
                          </Text>
                          <View style={styles.views}>
                            <Image
                              style={styles.texts}
                              source={require('../assets/Photos/lb.png')}
                            />

                            <Text style={styles.FlngatiTextss}>
                              {item.finalrank.toFixed()}
                            </Text>
                          </View>
                        </View>
                      </View>
                    ) : (
                      <View style={styles.Flngati}>
                        <Image
                          style={styles.tinyLogo}
                          source={require('../assets/Photos/userss.png')}
                        />
                        <Text style={styles.FlngatiText}>{item.username}</Text>

                        <View style={styles.views}>
                          <Entypo
                            style={[
                              styles.text,
                              {
                                color: Color.royalblue,

                                fontSize: 25,
                                // paddingRight: -6,
                                // marginRight: 1,
                              },
                            ]}
                            name="star"
                            color={'blue'}
                          />
                          <Text style={[styles.FlngatiTexts]}>
                            {item.finalrank.toFixed()}
                          </Text>
                        </View>
                      </View>
                    )}

                    {/* finalrank */}
                  </View>
                </TouchableOpacity>
                {/* // </LinearGradient> */}
              </View>
            </>
          )}
        />
      )}
    </>
  );
};

export default Leaderboard;

const styles = StyleSheet.create({
  Flngati: {
    alignItems: 'center',
    flexDirection: 'row',
    padding: 15,
    width: window.WindowWidth * 0.9,
    // height: 90,
    backgroundColor: 'white',
    borderRadius: 10,
    marginTop: 10,
    textAlign: 'center',
    marginLeft: 20,
    marginRight: 10,
  },
  first: {
    alignItems: 'center',
    flexDirection: 'row',
    // padding: 15,
    width: window.WindowWidth * 0.9,
    // height: 10,
    backgroundColor: Color.royalblue,
    paddingBottom: 5,
    borderRadius: 10,
    marginTop: 10,
    textAlign: 'center',
    marginLeft: 20,
    marginRight: 10,
  },
  FlngatiText: {
    fontSize: 12,
    textAlign: 'center',
    color: 'black',
    textTransform: 'capitalize',
    fontFamily: FontFamily.poppinsMedium,
    // fontFamily: 'serif',
    // fontFamily: 'serif',
    textAlign: 'left',
    flex: 1,
    fontWeight: '600',
    // paddingRight: 5,
  },
  FlngatiTexti: {
    fontSize: 14,
    textAlign: 'center',
    color: 'white',
    textTransform: 'capitalize',
    // fontFamily: 'serif',
    fontFamily: FontFamily.poppinsMedium,
    textAlign: 'left',
    flex: 1,
  },
  FlngatiTexts: {
    fontSize: 13,
    fontWeight: 'bold',
    justifyContent: 'center',
    // letterSpacing: 1,
    fontFamily: FontFamily.poppinsMedium,
    color: 'black',
    left: 20,

    textAlign: 'center',
  },
  FlngatiTextss: {
    fontSize: 15,
    fontWeight: 'bold',

    fontFamily: FontFamily.poppinsMedium,
    color: 'white',
    // marginRight: 20,
    left: 15,
    top: 5,

    textAlign: 'center',
  },
  tinyLogo: {
    width: 60,
    height: 60,
    marginLeft: 5,
    marginLeft: 10,
    marginRight: 10,

    marginTop: 10,
  },
  tinyLogos: {
    width: 70,
    height: 85,

    marginLeft: 10,
    marginRight: 10,

    marginTop: 20,
  },
  view: {
    flexDirection: 'row',
    // justifyContent: 'space-around',
  },
  views: {
    display: 'flex',
    justifyContent: 'space-around',
    flex: 1,
    // alignItems: 'auto',
    // flexDirection: 'flexEnd',
    // textAlign: 'right',
  },

  text: {
    // marginRight: 35,
    fontWeight: 'bold',
    alignSelf: 'center',
    left: 20,
  },
  texts: {
    marginLeft: 50,
    fontWeight: 'bold',
    textAlign: 'right',
    width: 70,
    height: 70,
    right: '5%',
  },
  FlngatiTextsy: {
    fontSize: 15,
    fontWeight: 'bold',
    justifyContent: 'center',
    letterSpacing: 1,
    fontFamily: 'cursive',
    color: 'red',
    marginRight: 33,

    textAlign: 'right',
  },
});
const monthlist = [
  // {id: 1, name: 'Select Month'},
  {name: 'January', value: 1},
  {name: 'Febuary', value: 2},
  {name: 'March', value: 3},
  {name: 'April', value: 4},
  {name: 'May', value: 5},
  {name: 'June', value: 6},
  {name: 'July', value: 7},
  {name: 'August', value: 8},
  {name: 'September', value: 9},
  {name: 'October', value: 10},
  {name: 'November', value: 11},
  {name: 'December', value: 12},
];

const yearList = [
  // {id: 1, name: 'Select Year'},
  {name: '2022', value: 2022},
  {name: '2023', value: 2023},
  // {name: '2024', value: 2024},
  // {name: '2025', value: 2025},
  // {name: '2026', value: 2026},
  // {name: '2027', value: 2027},
  // {name: '2028', value: 2028},
  // {name: '2029', value: 2029},
  // {name: '2030', value: 2030},
];
