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
  SafeAreaView,
  StatusBar,
  Modal,
  TouchableWithoutFeedback,
} from 'react-native';
import {Color, FontFamily, FontSize, Border} from '../GlobalStyle';

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
const Achivement = () => {
  const user = useSelector(state => state.userdata.user?.resData);

  // const user = [];
  // user.push(userdata);
  // console.log('userdata---->', user);
  const coin = useSelector(state => state.userdata.rewards);

  const dispatch = useDispatch();
  //

  const [isStatus, setisStatus] = useState(false);
  const [achieve, setAchieve] = useState([]);
  // console.log(achieve, 'item---------------------->');

  const [isLoading, setIsloading] = useState(true);
  const [timeSpent_record, setTimeSpent_record] = useState([]);
  const [reward, setReward] = useState('');
  //

  const labels = [
    'ଶିକ୍ଷକ ମୂଲ୍ୟାଙ୍କନ',
    'ପ୍ରବେଶ',
    'ପ୍ରସ୍ତୁତି',
    'ଏଣ୍ଡ୍ ଲାଇନ୍',
    'NSDC',
  ];
  const labels2 = ['ପ୍ରାରମ୍ଭ', 'ପଞ୍ଜିକରଣ', 'ପ୍ରସଙ୍ଗ', 'ପ୍ରସ୍ଥାପିତ'];
  //Bseline,registration,training,endline

  const customStyles = {
    stepIndicatorSize: 25,
    currentStepIndicatorSize: 30,
    separatorStrokeWidth: 2,
    currentStepStrokeWidth: 3,
    stepStrokeCurrentColor: Color.royalblue,
    stepStrokeWidth: 2,
    stepStrokeFinishedColor: Color.royalblue,
    stepStrokeUnFinishedColor: '#aaaaaa',
    separatorFinishedColor: Color.royalblue,
    separatorUnFinishedColor: '#aaaaaa',
    stepIndicatorFinishedColor: Color.royalblue,
    stepIndicatorUnFinishedColor: '#ffffff',
    stepIndicatorCurrentColor: '#ffffff',
    stepIndicatorLabelFontSize: 14,
    currentStepIndicatorLabelFontSize: 16,
    stepIndicatorLabelCurrentColor: 'black',
    stepIndicatorLabelFinishedColor: '#ffffff',
    stepIndicatorLabelUnFinishedColor: '#aaaaaa',
    labelColor: '#000000',
    labelSize: 13,
    currentStepLabelColor: Color.royalblue,
  };
  const numColumns = 5;
  const [background, setBackground] = useState();

  function handlePress() {
    setisStatus(true);
    //
  }
  //For My achievement aPI
  // console.log('achieveprofile--------->', achieve);
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

  useFocusEffect(
    React.useCallback(() => {
      // Do something when the screen is focused
      dispatch(types.rewardsUserstart(user[0].userid));
    }, []),
  );

  //
  const checkStatuses = () => {
    //
    if (achieve.length > 0) {
      if (
        achieve[0].baselineStatus === 'complete' &&
        achieve[0].pptStatus === 'complete' &&
        achieve[0].trainingStatus === 'incomplete' &&
        achieve[0].endlineStatus === 'complete' &&
        achieve[0].nsdcStatus === 'incomplete'
      ) {
        return 3;
      } else if (
        achieve[0].baselineStatus === 'complete' &&
        achieve[0].pptStatus === 'complete' &&
        achieve[0].trainingStatus === 'complete' &&
        achieve[0].endlineStatus === 'complete' &&
        achieve[0].nsdcStatus === 'complete'
      ) {
        return 5;
      } else if (
        achieve[0].baselineStatus === 'incomplete' &&
        achieve[0].pptStatus === 'incomplete' &&
        achieve[0].trainingStatus === 'incomplete' &&
        achieve[0].endlineStatus === 'incomplete' &&
        achieve[0].nsdcStatus === 'incomplete'
      ) {
        return 0;
      } else if (
        achieve[0].baselineStatus === 'complete' &&
        achieve[0].pptStatus === 'incomplete' &&
        achieve[0].trainingStatus === 'incomplete' &&
        achieve[0].endlineStatus === 'incomplete' &&
        achieve[0].nsdcStatus === 'incomplete'
      ) {
        return 1;
      } else if (
        achieve[0].baselineStatus === 'complete' &&
        achieve[0].pptStatus === 'complete' &&
        achieve[0].trainingStatus === 'incomplete' &&
        achieve[0].endlineStatus === 'incomplete' &&
        achieve[0].nsdcStatus === 'incomplete'
      ) {
        return 2;
      }
      // else if (
      //   achieve[0].baselineStatus === 'complete' &&
      //   achieve[0].pptStatus === 'complete' &&
      //   achieve[0].trainingStatus === 'complete' &&
      //   achieve[0].endlineStatus === 'incomplete' &&
      //   achieve[0].nsdcStatus === 'incomplete'
      // )
      //  {
      //   return 3;
      // }
      else if (
        achieve[0].baselineStatus === 'complete' &&
        achieve[0].pptStatus === 'complete' &&
        achieve[0].trainingStatus === 'complete' &&
        achieve[0].endlineStatus === 'complete' &&
        achieve[0].nsdcStatus === 'incomplete'
      ) {
        return 4;
      }
    }
  };

  // For Info modal
  const [show, setShow] = useState(false);

  const handleShow = () => {
    setShow(true);
  };
  const handleClose = () => {
    setShow(false);
  };

  return (
    <ScrollView style={{backgroundColor: '#f3f2ff'}}>
      {isLoading ? (
        <View>
          <MyAchievementSkeleton />
        </View>
      ) : (
        <>
          <View
            style={{
              marginTop: 16,
              paddingBottom: 20,
              paddingTop: 20,
              marginLeft: 12,
              marginRight: 12,
              borderRadius: 8,
              //   backgroundColor: '#bbe4f5',
            }}>
            <Text
              style={{
                textAlign: 'left',
                // marginTop: 5,
                // fontSize: 19,
                // fontWeight: 'bold',
                color: Color.dimgray_200,
                fontSize: FontSize.size_base,
                // color: 'black',
                left: 26,
                top: 0,
                // position: 'absolute',
                paddingBottom: 30,
                fontWeight: '700',
                fontFamily: FontFamily.poppinsMedium,
              }}>
              ମୋ ପ୍ରଗତି
            </Text>
            <View>
              <StepIndicator
                customStyles={customStyles}
                // currentPosition={2}
                stepCount={user[0]?.usertype == 'fellow' ? 5 : 4}
                currentPosition={checkStatuses()}
                labels={user[0]?.usertype == 'fellow' ? labels : labels2}
              />
              {/* <FlatList
              numColumns={numColumns}
              data={labels}
              renderItem={({item}) => (
                <ProgressbarIndicator
                  labels={item.value}
                  style={{ backgroundColor: background }}
                  backgroundColor={isStatus?Color.success:Color.white}
                  onPress={() =>handlePress()}
                />
              )}
            /> */}
            </View>
          </View>
          <View></View>
          <View style={styles.container}>
            <Accordion
              achieve={achieve}
              days={achieve[0].pptData}
              traindays={achieve[0].trainingData}
              user={user}
            />
          </View>
          <View
            style={{
              width: window.WindowWidth * 0.9,
              height: window.WindowHeigth * 0.19,
              marginTop: 22,
              marginLeft: 20,
              backgroundColor: Color.royalblue,
              paddingBottom: 40,
              borderRadius: 8,
            }}>
            <Text
              style={{
                fontSize: FontSize.size_smi,
                color: 'white',
                marginTop: 40,
                marginLeft: 15,
                fontWeight: '700',
              }}>
              You have{' '}
              {coin.length > 0 ? (
                <Text style={{color: '#c0fe3b', fontSize: FontSize.size_smi}}>
                  {coin[0].coins}
                </Text>
              ) : (
                <Text style={{color: '#c0fe3b', fontSize: FontSize.size_smi}}>
                  0
                </Text>
              )}
              <Text
                style={{
                  color: 'white',
                  fontSize: FontSize.size_smi,
                  fontWeight: '700',
                }}>
                {''} coins,use
              </Text>
            </Text>
            <Text
              style={{
                fontSize: FontSize.size_smi,
                color: 'white',
                marginLeft: 15,
                fontWeight: '700',

                // marginTop: 20,
              }}>
              them now!
            </Text>

            <Image
              style={{
                // width: window.WindowWidth * 0.3,
                width: 129,
                height: 150,
                marginTop: -95,
                marginLeft: 200,
              }}
              resizeMode="cover"
              source={require('../assets/Image/—Pngtree—cartoon.png')}
            />
          </View>
          <View>{/* <Text>hii</Text> */}</View>
          {/* <View style={styles.rectangleView} />
          <Text style={[styles.youHave32Container, styles.youTypo]}>
            <Text style={styles.youHave}>{`You have `}</Text>
            <Text style={styles.text2}>32</Text>
            <Text style={styles.youHave}>{` coins ,use 
them now!`}</Text>
          </Text>
          <View style={styles.myProfileChild1} />
          <View style={styles.pngtreecartoonOpenedWooden}>
            <Image
              style={[
                styles.pngtreecartoonOpenedWooden1,
                styles.statusBarBgLayout,
                styles.statusPosition,
              ]}
              resizeMode="cover"
              source={require('../assets/Image/box.png')}
            />
          </View>
          <View style={[styles.rectangleParent, styles.groupLayout1]}>
            <View
              style={[
                styles.groupChild,
                styles.groupLayout1,
                styles.childGroupBg,
              ]}
            />
          </View> */}
          {/* <View
            style={{
              marginLeft: 18,
              backgroundColor: 'white',
              paddingTop: 19,
              paddingBottom: 19,
              marginRight: 12,
              paddingLeft: 10,
              borderRadius: 10,
            }}>
            <View style={{flexDirection: 'row'}}>
              <Text style={{fontSize: 19, color: 'black', fontWeight: 'bold'}}>
                Total Coins:{''}
              </Text>
              {coin.length > 0 ? (
                <Text
                  style={{
                    marginLeft: 5,
                    fontSize: 19,
                    color: 'black',
                    fontWeight: 'bold',
                  }}>
                  {coin[0].coins}
                </Text>
              ) : (
                <Text
                  style={{
                    marginLeft: 5,
                    fontSize: 19,
                    color: 'black',
                    fontWeight: 'bold',
                  }}>
                  0
                </Text>
              )}
              <Image
                style={{
                  width: 30,
                  height: 30,
                  marginTop: 2,
                  marginLeft: 2,
                }}
                source={require('../assets/Photos/star.png')}
              />
              <TouchableOpacity onPress={handleShow}>
                <FontAwesome5
                  name="info-circle"
                  color={Color.black}
                  size={30}
                  style={{marginLeft: 120, marginTop: 4}}
                />
              </TouchableOpacity>
            </View>
          </View> */}

          {/* <Modal transparent={true} visible={show}>
            <View
              style={{
                backgroundColor: '#13538a',
                height: window.WindowHeigth * 0.33,
                marginTop: -0,
                width: window.WindowWidth * 0.9,
                margin: 20,
                // padding: 40,
                justifyContent: 'center',
                borderRadius: 10,
                flex: 1,
                marginTop: 409,
              }}>
              <ScrollView>
                <View
                  style={{
                    backgroundColor: '#857d7d8a',
                    borderRadius: 10,
                  }}>
                  <Text
                    style={{
                      // backgroundColor: 'black',
                      color: 'white',
                      fontSize: 20,
                      fontFamily: 'serif',
                      fontWeight: 'bold',
                      textAlign: 'center',
                      paddingBottom: 20,
                      paddingTop: 20,
                    }}>
                    Rewards Info
                  </Text>
                </View>

                <View>
                  <MaterialCommunityIcons
                    name="close-thick"
                    size={30}
                    onPress={handleClose}
                    color={'white'}
                    style={{marginLeft: 290, marginTop: -50}}
                  />
                </View>

                <View style={styles.view}>
                  <Text style={styles.modalt}>
                    ଶିକ୍ଷକ ପଞ୍ଜିକରଣ: 2{' '}
                    <FontAwesome5Icon
                      name="coins"
                      size={18}
                      color={'#F9C734'}
                      // style={{marginLeft: 35, marginTop: 10}}
                    />
                  </Text>
                  <Text style={styles.modalt}>
                    ଶିକ୍ଷାର୍ଥୀ ପଞ୍ଜିକରଣ:2{' '}
                    <FontAwesome5Icon
                      name="coins"
                      size={18}
                      color={'#F9C734'}
                      // style={{marginLeft: 35, marginTop: 10}}
                    />
                  </Text>
                  <Text style={styles.modalt}>
                    Aadhar Update : 5{' '}
                    <FontAwesome5Icon
                      name="coins"
                      size={18}
                      color={'#F9C734'}
                      // style={{marginLeft: 35, marginTop: 10}}
                    />
                  </Text>
                  <Text style={styles.modalt}>
                    ପ୍ରାକ୍ ଗତିବିଧି : 2{' '}
                    <FontAwesome5Icon
                      name="coins"
                      size={18}
                      color={'#F9C734'}
                      // style={{marginLeft: 35, marginTop: 10}}
                    />
                  </Text>
                  <Text style={styles.modalt}>
                    ପ୍ରାଥମିକ ଗତିବିଧି : 2{' '}
                    <FontAwesome5Icon
                      name="coins"
                      size={18}
                      color={'#F9C734'}
                      // style={{marginLeft: 35, marginTop: 10}}
                    />
                  </Text>
                  <Text style={styles.modalt}>
                    FLN : 2{' '}
                    <FontAwesome5Icon
                      name="coins"
                      size={18}
                      color={'#F9C734'}
                      // style={{marginLeft: 35, marginTop: 10}}
                    />
                  </Text>
                  <Text style={styles.modalt}>
                    ଶିକ୍ଷକ ମୂଲ୍ୟାଙ୍କନ : 5{' '}
                    <FontAwesome5Icon
                      name="coins"
                      size={18}
                      color={'#F9C734'}
                      // style={{marginLeft: 35, marginTop: 10}}
                    />
                  </Text>
                  <Text style={styles.modalt}>
                    ପ୍ରବେଶ:10{' '}
                    <FontAwesome5Icon
                      name="coins"
                      size={18}
                      color={'#F9C734'}
                      // style={{marginLeft: 35, marginTop: 10}}
                    />
                  </Text>

                  <Text style={styles.modalt}>
                    ପ୍ରସ୍ତୁତି :8{' '}
                    <FontAwesome5Icon
                      name="coins"
                      size={18}
                      color={'#F9C734'}
                      // style={{marginLeft: 35, marginTop: 10}}
                    />
                  </Text>
                  <Text style={styles.modalt}>
                    ଏଣ୍ଡ୍ ଲାଇନ୍ :5{' '}
                    <FontAwesome5Icon
                      name="coins"
                      size={18}
                      color={'#F9C734'}
                      // style={{marginLeft: 35, marginTop: 10}}
                    />
                  </Text>
                  <Text style={styles.modalt}>
                    3-day streak :5{' '}
                    <FontAwesome5Icon
                      name="coins"
                      size={18}
                      color={'#F9C734'}
                      // style={{marginLeft: 35, marginTop: 10}}
                    />
                  </Text>
                  <Text style={styles.modalt}>
                    7-day streak :10{' '}
                    <FontAwesome5Icon
                      name="coins"
                      size={18}
                      color={'#F9C734'}
                      // style={{marginLeft: 35, marginTop: 10}}
                    />
                  </Text>
                  <Text style={styles.modalt}>
                    NSDC:10{' '}
                    <FontAwesome5Icon
                      name="coins"
                      size={18}
                      color={'#F9C734'}
                      // style={{marginLeft: 35, marginTop: 10}}
                    />
                  </Text>
                </View>
                {/* <Button title="Close" onPress={handleClose}></Button> */}
          {/* </ScrollView> */}
          {/* </View> */}
          {/* </Modal>  */}

          {/* <View style={{paddingLeft: -19, paddingRight: -19}}>
            <Text style={styles.text}>Time Spent</Text>
          </View> */}
        </>
      )}
    </ScrollView>
  );
};

export default Achivement;

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
    backgroundColor: '#f3f2ff',
  },
  rectangleView: {
    top: 460,
    width: 340,
    height: 110,
    left: 10,
    borderRadius: Border.br_7xs,
    backgroundColor: Color.royalblue,
    position: 'absolute',
  },
  youHave: {
    fontSize: FontSize.size_smi,
    color: Color.white,
  },
  text: {
    flexDirection: 'row',
    marginTop: 15,
    backgroundColor: '#bbe4f5',
    marginLeft: -1,
    marginRight: 1,
    paddingBottom: 25,
    paddingTop: 20,
    borderRadius: 12,
    paddingLeft: 146,
    fontSize: 20,
    fontWeight: 'bold',
    color: 'black',
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
  youHave32Container: {
    top: 492,
    left: 32,
  },
  youTypo: {
    height: 42,
    width: 173,
    fontFamily: FontFamily.poppinsMedium,
    fontWeight: '500',
    textAlign: 'left',
    position: 'absolute',
  },
  myProfileInner: {
    top: 142,
    left: -1,
    height: 12,
  },
  frameChildLayout: {
    width: 386,
    position: 'absolute',
  },
  statusPosition1: {
    left: '0%',
    right: '0%',
  },
  statusPosition2: {
    top: '0%',
    right: '0%',
    position: 'absolute',
    width: '100%',
  },
  statusPosition: {
    bottom: '0%',
    height: '100%',
    top: '0%',
    width: '100%',
  },
  timePosition: {
    opacity: 0.9,
    height: 15,
    width: 29,
    left: '50%',
    top: '50%',
    marginLeft: 11.22,
    overflow: 'hidden',
    position: 'absolute',
  },
  textFlexBox: {
    textAlign: 'right',
    position: 'absolute',
  },
  textTypo4: {
    fontSize: 12,
    marginTop: -7.43,
    textAlign: 'right',
    fontFamily: FontFamily.poppinsRegular,
    height: 15,
    top: '50%',
    left: '0%',
    width: '100%',
  },
  batteryIconLayout: {
    width: 13,
    marginLeft: -5.8,
  },
  iconPosition1: {
    height: 13,
    marginTop: -6.12,
    left: '50%',
    top: '50%',
    position: 'absolute',
  },
  cellularIconSpaceBlock: {
    marginLeft: -22.58,
    width: 13,
  },
  wifiIconLayout: {
    width: 15,
    marginLeft: -39.37,
  },
  statusBarBgLayout: {
    maxHeight: '100%',
    maxWidth: '100%',
    overflow: 'hidden',
    position: 'absolute',
  },
  ramTypo: {
    fontFamily: FontFamily.poppinsSemibold,
    fontWeight: '600',
    fontSize: FontSize.size_lg,
    textAlign: 'left',
    position: 'absolute',
  },
  ramDevPosition: {
    left: 95,
    color: Color.white,
  },
  youTypo: {
    height: 42,
    width: 173,
    fontFamily: FontFamily.poppinsMedium,
    fontWeight: '500',
    textAlign: 'left',
    position: 'absolute',
  },
  frameChildLayout: {
    width: 386,
    position: 'absolute',
  },
  childGroupBg: {
    backgroundColor: Color.white,
    borderRadius: Border.br_7xs,
    left: 0,
  },
  groupLayout1: {
    height: 48,
    width: 338,
    position: 'absolute',
  },
  detailsLayout: {
    height: 26,
    width: 159,
    color: Color.dimgray_200,
    fontSize: FontSize.size_base,
  },
  signOutPosition: {
    top: 13,
    position: 'absolute',
  },
  signOutTypo: {
    fontFamily: FontFamily.poppinsMedium,
    width: 159,
    fontWeight: '500',
    textAlign: 'left',
  },
  iconusersuserLayout: {
    height: 24,
    width: 24,
  },
  privacyPolicyPosition: {
    top: 14,
    position: 'absolute',
  },
  aboutThinkzonePosition: {
    top: 15,
    position: 'absolute',
  },
  groupLayout: {
    height: 419,
    position: 'absolute',
  },
  iconusersuserPosition: {
    left: 15,
    position: 'absolute',
  },
  userContainerTypo: {
    left: '12.91%',
    width: '64.84%',
    height: '4.02%',
    fontFamily: FontFamily.poppinsMedium,
    fontWeight: '500',
    fontSize: FontSize.size_smi,
    textAlign: 'left',
    position: 'absolute',
  },
  containerTypo: {
    left: '13.19%',
    width: '64.84%',
    height: '4.02%',
    fontFamily: FontFamily.poppinsMedium,
    fontWeight: '500',
    fontSize: FontSize.size_smi,
    textAlign: 'left',
    position: 'absolute',
  },
  editTypo: {
    top: 12,
    fontFamily: FontFamily.poppinsMedium,
    fontWeight: '500',
    textAlign: 'left',
    position: 'absolute',
  },
  groupIconPosition: {
    left: 18,
    position: 'absolute',
  },
  groupChildLayout1: {
    height: 1,
    borderTopWidth: 1,
    borderStyle: 'solid',
  },
  groupChildLayout2: {
    width: 233,
    borderColor: '#deeaf5',
    height: 1,
    borderTopWidth: 1,
    borderStyle: 'solid',
  },
  text6Position: {
    top: 279,
    position: 'absolute',
  },
  groupChild10Layout: {
    width: 338,
    height: 180,
    position: 'absolute',
  },
  managerContainerTypo: {
    left: '14.5%',
    width: '69.82%',
    height: '9.37%',
    fontFamily: FontFamily.poppinsMedium,
    fontWeight: '500',
    fontSize: FontSize.size_smi,
    textAlign: 'left',
    position: 'absolute',
  },
  textLayout: {
    height: 17,
    fontWeight: '500',
  },
  textLayout1: {
    width: 139,
    height: 17,
  },
  textTypo3: {
    left: 21,
    height: 17,
    width: 139,
    fontFamily: FontFamily.balooBhaina2Medium,
    color: Color.black,
    fontWeight: '500',
    fontSize: FontSize.size_smi,
    textAlign: 'left',
    position: 'absolute',
  },
  textPosition1: {
    left: 129,
    fontFamily: FontFamily.poppinsMedium,
    position: 'absolute',
  },
  textPosition: {
    left: 20,
    position: 'absolute',
  },
  textTypo2: {
    top: 375,
    height: 17,
    width: 139,
    color: Color.black,
    fontWeight: '500',
    fontSize: FontSize.size_smi,
    textAlign: 'left',
  },
  textTypo1: {
    top: 396,
    height: 17,
    width: 139,
    color: Color.black,
    fontWeight: '500',
    fontSize: FontSize.size_smi,
    textAlign: 'left',
  },
  textTypo: {
    width: 72,
    top: 65,
    height: 17,
    fontFamily: FontFamily.balooBhaina2Medium,
    color: Color.black,
    fontWeight: '500',
    fontSize: FontSize.size_smi,
    textAlign: 'left',
    position: 'absolute',
  },
  groupChildLayout: {
    height: 20,
    width: 21,
    top: 42,
    position: 'absolute',
  },
  groupChildPosition: {
    backgroundColor: Color.aliceblue_200,
    top: 51,
    height: 3,
    width: 71,
    position: 'absolute',
  },
  nsdcLayout: {
    width: 48,
    height: 17,
    position: 'absolute',
  },
  text: {
    color: Color.dimgray_100,
    fontFamily: FontFamily.poppinsRegular,
  },
  time: {
    marginTop: -7.86,
  },
  statusBarContents: {
    height: '75%',
    width: '22.33%',
    top: '8.33%',
    right: '1.94%',
    bottom: '16.67%',
    left: '75.73%',
    overflow: 'hidden',
    position: 'absolute',
  },
  statusBar1: {
    position: 'absolute',
  },
  statusBar: {
    height: '1.44%',
    bottom: '98.56%',
  },
  myProfileChild: {
    height: '8.8%',
    width: '107.22%',
    top: '0.14%',
    right: '-4.44%',
    bottom: '91.07%',
    left: '-2.78%',
    backgroundColor: Color.royalblue,
    position: 'absolute',
  },
  text1: {
    color: Color.white,
    fontFamily: FontFamily.poppinsRegular,
  },
  time1: {
    marginTop: -8.09,
  },
  iconPosition: {
    marginTop: -6.35,
    height: 13,
    left: '50%',
    top: '50%',
    position: 'absolute',
  },
  statusBar2: {
    height: '2.4%',
    bottom: '97.6%',
  },
  myProfileItem: {
    height: '7.49%',
    width: '24.44%',
    right: '73.06%',
    bottom: '89.35%',
    left: '2.5%',
    top: '3.16%',
  },
  helloRam: {
    height: '1.31%',
    width: '43.89%',
    left: '26.39%',
    display: 'none',
    textAlign: 'left',
    top: '3.16%',
    color: Color.white,
  },
  thinkzoneLogoJpgForWhiteB: {
    top: 715,
    left: -4869,
    width: 1865,
    height: 2162,
    position: 'absolute',
  },
  ramDev: {
    top: 46,
    width: 158,
    height: 19,
    textAlign: 'left',
  },
  thisMonthYou: {
    top: 73,
    fontSize: FontSize.size_smi,
  },
  help: {
    top: 91,
    left: 308,
    fontSize: FontSize.size_smi,
    color: Color.white,
  },
  frameChild: {
    top: -1,
    height: 118,
  },
  rectangleWrapper: {
    height: 120,
    left: 0,
    top: 0,
  },
  myProfileInner: {
    top: 142,
    left: -1,
    height: 12,
  },
  rectangleView: {
    top: 460,
    width: 340,
    height: 110,
    left: 10,
    borderRadius: Border.br_7xs,
    backgroundColor: Color.royalblue,
    position: 'absolute',
  },
  youHave: {
    fontSize: FontSize.size_smi,
    color: Color.white,
  },
  text2: {
    color: '#c0fe3b',
    fontSize: FontSize.size_base,
  },
  youHave32Container: {
    top: 492,
    left: 32,
  },
  myProfileChild1: {
    top: 270,
    width: 149,
    height: 180,
    left: 10,
    backgroundColor: Color.white,
    borderRadius: Border.br_7xs,
    position: 'absolute',
  },
  pngtreecartoonOpenedWooden1: {
    right: '100%',
    left: '-100%',
  },
  pngtreecartoonOpenedWooden: {
    top: 435,
    left: 329,
    height: 150,
    transform: [
      {
        rotate: '180deg',
      },
    ],
    width: 129,
    position: 'absolute',
  },
  groupChild: {
    top: 0,
  },
  signOut: {
    left: 50,
  },
  iconarrowrefreshRightSquar: {
    left: 19,
  },
  rectangleParent: {
    top: 1321,
    left: 11,
  },
  privacyPolicy: {
    left: 48,
  },
  iconcontentEditcreativeCom: {
    left: 16,
  },
  rectangleGroup: {
    top: 1261,
    left: 12,
  },
  aboutThinkzone: {
    left: 50,
  },
  iconessentialinfoCircle: {
    left: 19,
  },
  rectangleContainer: {
    top: 1200,
    left: 11,
  },
  groupChild1: {
    width: 339,
    top: 0,
  },
  iconusersuserSearch: {
    top: 137,
  },
  iconuserspeople: {
    top: 97,
  },
  userId: {
    color: Color.black,
  },
  rams123gmailcom: {
    color: Color.darkslategray_400,
  },
  userIdRams123gmailcomContainer: {
    top: '12.89%',
  },
  guardianNameNaContainer: {
    top: '22.43%',
  },
  userTypeFellowContainer: {
    top: '31.98%',
  },
  dob05042000: {
    top: '41.53%',
  },
  genderMale: {
    top: '51.07%',
  },
  qualificationBsc: {
    top: '60.62%',
  },
  livesInCuttackContainer: {
    top: '70.17%',
  },
  regdDate23272028Container: {
    top: '79.71%',
  },
  aadhaarNumber9878Container: {
    top: '89.26%',
  },
  iconusersuserTag: {
    top: 56,
  },
  edit: {
    color: Color.steelblue,
    width: 79,
    height: 18,
    left: 285,
    fontSize: FontSize.size_smi,
  },
  myDetails: {
    top: 11,
  },
  iconessentialcake: {
    top: 176,
  },
  iconbusinesspersonalcard: {
    top: 377,
  },
  groupIcon: {
    top: 220,
    width: 19,
    height: 19,
  },
  iconcontentEditnote: {
    top: 336,
  },
  iconschoolteacher: {
    top: 256,
  },
  iconlocationlocation: {
    top: 296,
  },
  lineView: {
    top: 79,
    left: 48,
    position: 'absolute',
  },
  groupChild2: {
    top: 119,
    left: 48,
    position: 'absolute',
  },
  groupChild3: {
    top: 159,
    left: 48,
    position: 'absolute',
  },
  groupChild4: {
    top: 199,
    left: 48,
    position: 'absolute',
  },
  groupChild5: {
    top: 239,
    left: 48,
    position: 'absolute',
  },
  groupChild6: {
    left: 48,
  },
  groupChild7: {
    top: 319,
    left: 48,
    position: 'absolute',
  },
  groupChild8: {
    top: 359,
    left: 48,
    position: 'absolute',
  },
  groupChild9: {
    top: 398,
    left: 47,
    position: 'absolute',
  },
  groupView: {
    top: 580,
    width: 364,
    left: 10,
  },
  myProfileChild2: {
    top: 860,
    left: 60,
    position: 'absolute',
  },
  groupChild10: {
    top: 0,
  },
  managerDetails: {
    left: 17,
  },
  managerNameNaContainer: {
    top: '30.56%',
  },
  iconshopbarcode: {
    top: 138,
  },
  iconsupportLikeQuestionmed: {
    top: 96,
  },
  vuesaxtwotoneuserSquareIcon: {
    height: '14.05%',
    width: '7.1%',
    top: '31.11%',
    right: '87.57%',
    bottom: '54.84%',
    left: '5.33%',
  },
  groupChild11: {
    top: 80,
    left: 50,
    position: 'absolute',
  },
  managerIdBiswathinkzoneinContainer: {
    top: '52.78%',
  },
  groupChild12: {
    top: 120,
    left: 50,
    position: 'absolute',
  },
  managerIdBiswathinkzoneinContainer1: {
    top: '75%',
  },
  groupChild13: {
    top: 160,
    left: 50,
    position: 'absolute',
  },
  rectangleParent1: {
    top: 1010,
    left: 11,
  },
  appVersion178: {
    height: '1.16%',
    width: '65.56%',
    top: '94.5%',
    left: '33.33%',
    fontStyle: 'italic',
    fontFamily: FontFamily.poppinsMediumItalic,
    color: Color.royalblue,
    fontWeight: '500',
    fontSize: FontSize.size_smi,
    textAlign: 'left',
    position: 'absolute',
  },
  iconcryptowhatsapp: {
    top: 64,
    left: 310,
    position: 'absolute',
  },
  text6: {
    textAlign: 'center',
    fontFamily: FontFamily.balooBhaina2Medium,
    left: 19,
    color: Color.dimgray_200,
    width: 139,
    top: 279,
    fontSize: FontSize.size_base,
  },
  text7: {
    top: 312,
  },
  text8: {
    top: 312,
    color: Color.black,
    fontSize: FontSize.size_smi,
    textAlign: 'left',
  },
  text9: {
    top: 331,
    color: Color.black,
    fontSize: FontSize.size_smi,
    textAlign: 'left',
  },
  text10: {
    top: 352,
    color: Color.black,
    fontSize: FontSize.size_smi,
    textAlign: 'left',
  },
  text13: {
    top: 424,
    color: Color.black,
    fontSize: FontSize.size_smi,
    textAlign: 'left',
  },
  text14: {
    top: 333,
  },
  text15: {
    top: 354,
  },
  text16: {
    fontFamily: FontFamily.balooBhaina2Medium,
  },
  text17: {
    fontFamily: FontFamily.balooBhaina2Medium,
  },
  text18: {
    top: 424,
  },
  myProfileChild3: {
    borderColor: 'rgba(0, 0, 0, 0.2)',
    top: 424,
    height: 1,
    borderTopWidth: 1,
    borderStyle: 'solid',
    left: 20,
    width: 129,
  },
  text19: {
    width: 97,
    top: 65,
    fontFamily: FontFamily.balooBhaina2Medium,
    color: Color.black,
    left: 0,
    fontSize: FontSize.size_smi,
  },
  text20: {
    left: 111,
  },
  myAchievement: {
    left: 26,
    top: 0,
    position: 'absolute',
  },
  ellipseIcon: {
    left: 52,
  },
  groupChild14: {
    top: 50,
    left: 58,
    backgroundColor: Color.steelblue,
    height: 3,
    width: 71,
    position: 'absolute',
  },
  groupChild15: {
    left: 121,
  },
  groupChild16: {
    left: 184,
  },
  groupChild17: {
    left: 244,
  },
  groupChild18: {
    left: 114,
  },
  groupChild19: {
    left: 176,
  },
  groupChild20: {
    left: 238,
  },
  groupChild21: {
    left: 298,
  },
  text21: {
    left: 175,
  },
  text22: {
    left: 226,
  },
  nsdc: {
    textAlign: 'center',
    color: Color.black,
    left: 0,
    top: 0,
    fontSize: FontSize.size_smi,
    fontFamily: FontFamily.poppinsRegular,
  },
  nsdcWrapper: {
    top: 65,
    left: 285,
  },
  parent: {
    top: 154,
    left: 14,
    width: 333,
    height: 82,
    position: 'absolute',
  },
  myProfile: {
    backgroundColor: Color.aliceblue_100,
    flex: 1,
    height: 1455,
    width: '100%',
  },
});
