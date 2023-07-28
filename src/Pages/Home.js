import React, {useEffect, useMemo, useState} from 'react';
import LinearGradient from 'react-native-linear-gradient';
import {
  SafeAreaView,
  StyleSheet,
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  ImageBackground,
  Dimensions,
  StatusBar,
  Linking,
  Alert,
  Modal,
  useWindowDimensions,
  ToastAndroid,
  RefreshControl,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {useIsConnected} from 'react-native-offline';
import Colors from '../utils/Colors';
import axios from 'axios';
import Entypo from 'react-native-vector-icons/Entypo';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import API from '../environment/Api';
import * as window from '../utils/dimensions';
// import Color from '../utils/Colors';
import {useTranslation} from 'react-i18next';
import {Color, FontFamily, FontSize, Border} from '../GlobalStyle';
import {GoogleSignin} from '@react-native-google-signin/google-signin';

// import TouchableOpacity from 'react-native/Libraries/Components/TouchableOpacity/TouchableOpacity';
import {useDispatch, useSelector} from 'react-redux';
import storeage from '../utils/AsyncStorage';
import Separator from '../components/Separator';
import StepIndicator from 'react-native-step-indicator';
import {
  LineChart,
  BarChart,
  PieChart,
  ProgressChart,
  ContributionGraph,
  StackedBarChart,
} from 'react-native-chart-kit';

import {
  VictoryBar,
  VictoryChart,
  VictoryTheme,
  VictoryPolarAxis,
} from 'victory-native';
import AppHeader from '../components/AppHeader';
import {FlatList} from 'react-native-gesture-handler';
import Animated, {
  interpolate,
  Extrapolate,
  useSharedValue,
  useAnimatedStyle,
  log,
} from 'react-native-reanimated';
import Carousel from 'react-native-snap-carousel';
import CarouselImage from '../components/CarouselImage';
import ModuleComponent from '../components/ModuleComponent';
import ModalComponent from '../components/ModalComponent';
import * as types from '../redux/slices/UserSlice';

import * as TrainingSlice from '../redux/slices/TrainingSlice';
import * as FcmSlice from '../redux/slices/FcmSlice';
// import {requestUserPermission} from '../utils/PushnotificationHelper';
import messaging from '@react-native-firebase/messaging';
import dynamicLinks from '@react-native-firebase/dynamic-links';
// import {openDatabase} from 'react-native-sqlite-storage';
import Header from '../components/Header';
// var db = openDatabase({name: 'StudentDatabase.db'});
const image = [
  {
    no: 1,
    image: require('../assets/Image/secondslider.png'),
  },
  {
    no: 1,
    image: require('../assets/Image/firstslider.png'),
    // url: 'http://factorymattresstexas.com/specials/beautyrest-lumbar-support',
  },
  {
    no: 1,
    // image: {
    //   uri: 'https://wearemarketers.net/wp-content/uploads/2019/05/foto-pixabay.jpg',
    // },
    image: require('../assets/Image/rewards.png'),
  },
];
const WIDTH = Dimensions.get('window').width;
const HEIGHT = Dimensions.get('window').height;
const AnimatedFlatList = Animated.createAnimatedComponent(FlatList);

const Item = ({index, scrollX}) => {
  const size = useSharedValue(0.8);
  const inputRange = [
    (index - 1) * window.WindowWidth * 0.8,
    index * window.WindowWidth * 0.8,
    (index + 1) * window.WindowWidth * 0.8,
  ];
  const {height, width, scale, fontScale} = useWindowDimensions();

  const cardStyle = useAnimatedStyle(() => {
    // size.value = interpolate(
    //   scrollX,
    //   inputRange,
    //   [0.8, 1, 0.8],
    //   Extrapolate.CLAMP,
    // );

    return {transform: [{scaleY: size.value}]};
  });
  return (
    <Animated.View
      style={[
        styles.card,
        cardStyle,
        {
          marginLeft:
            index === 0
              ? (window.WindowWidth * 0.18) / 2
              : window.WindowWidth * 0.02,
          marginRight:
            index === 2
              ? (window.WindowWidth * 0.18) / 2
              : window.WindowWidth * 0.02,
        },
      ]}>
      <Image
        source={require('../assets/Photos/bg.png')}
        style={{
          width: window.WindowWidth * 0.7,
          height: window.WindowHeigth * 0.25,
          borderRadius: 20,
        }}
      />
    </Animated.View>
  );
};

const Home = ({navigation}) => {
  const pptModuleArr = useSelector(state => state.trainingdata.pptmodules);
  const monthlyModuleArr = useSelector(state => state.trainingdata.modules);
  const user = useSelector(state => state.userdata.user?.resData);
  // console.log('homepageuser-------->', user);
  const isConnected = useIsConnected();
  const chartConfig = {
    backgroundGradientFrom: '#1E2923',
    backgroundGradientFromOpacity: 0,
    backgroundGradientTo: '#08130D',
    backgroundGradientToOpacity: 0.5,
    color: (opacity = 1) => `rgba(26, 255, 146, ${opacity})`,
    strokeWidth: 2, // optional, default 3
    barPercentage: 0.5,
    useShadowColorFromDataset: false, // optional
  };

  messaging().setBackgroundMessageHandler(async remoteMessage => {
    dispatch(FcmSlice.getfcmMessage(remoteMessage));
    // navigation.navigate(`${remoteMessage.data.navigateto}`);
  });
  const [isLoading, setIsloading] = useState(true);
  const [achieve, setAchieve] = useState([]);

  const [refreshing, setRefreshing] = React.useState(false);
  const [logOuts, setLogOuts] = useState(false);
  //fOR mY Achievement Section
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
  // useEffect(() => {
  //
  //   {
  //     isConnected ? Alert.alert('Connect') : Alert.alert('DisConnect');
  //   }
  // }, [isConnected]);
  // useEffect(() => {
  //   db.transaction(txn => {
  //     txn.executeSql(
  //       "SELECT name FROM sqlite_master WHERE type='table' AND name='student_table'",
  //       [],
  //       function (tx, res) {
  //
  //         if (res.rows.length == 0) {
  //           txn.executeSql('DROP TABLE IF EXISTS student_table', []);
  //           txn.executeSql(
  //             'CREATE TABLE IF NOT EXISTS student_table(userid VARCHAR(20), username VARCHAR(20), centerid VARCHAR(20),centername VARCHAR(20),studentid VARCHAR(20),studentname VARCHAR(20),studentcategory VARCHAR(20),program VARCHAR(20),class VARCHAR(20),phone VARCHAR(20),gender VARCHAR(20),dob NUMERIC,parentsname VARCHAR(20),schoolname VARCHAR(20),udisecode VARCHAR(20),usertype VARCHAR(20),passcode VARCHAR(20),managerid VARCHAR(20),managername VARCHAR(20))',
  //             [],
  //           );
  //         }
  //       },
  //     );
  //   });
  // }, []);
  let [flatListItems, setFlatListItems] = useState([]);
  useEffect(() => {
    // messaging().onNotificationOpenedApp(remotoMessage => {
    //   Alert.alert(JSON.stringify('monalisa fcm1'));
    //
    // });

    // messaging().getInitialNotification(remotoMessage => {
    //   Alert.alert(JSON.stringify('monalisa fcm2'));
    //
    // });
    // messaging().setBackgroundMessageHandler(remotoMessage => {
    //   // Alert.alert(JSON.stringify(remotoMessage));

    //
    //   navigation.navigate(`${remotoMessage.data.navigateto}`);
    // });

    messaging().onMessage(remotoMessage => {
      // Alert.alert(JSON.stringify(remotoMessage));
      navigation.navigate(`${remotoMessage.data.navigateto}`);

      //
    });
  }, []);
  const onRefresh = React.useCallback(() => {
    setRefreshing(true);

    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  }, []);
  // useEffect(() => {
  //   db.transaction(tx => {
  //     tx.executeSql('SELECT * FROM student_table', [], (tx, results) => {
  //
  //       var temp = [];
  //       for (let i = 0; i < results.rows.length; ++i)
  //         temp.push(results.rows.item(i));
  //       //

  //       setFlatListItems(temp);
  //     });
  //   });
  // }, []);
  //
  // const handleDynamicLink = link => {
  //
  //   // Handle dynamic link inside your own application
  //   if (link.url === 'https://invertase.io/offer') {
  //     // ...navigate to your offers screen
  //   }
  // };

  // useEffect(() => {
  //   const unsubscribe = dynamicLinks().onLink(handleDynamicLink);
  //   // When the component is unmounted, remove the listener
  //   return () => unsubscribe();
  // }, []);
  // useEffect(() => {
  //   dynamicLinks()
  //     .getInitialLink()
  //     .then(link => {
  //
  //       if (link.url === 'https://invertase.io/offer') {
  //         // ...set initial route as offers screen
  //
  //     });
  // }, []);
  //For My achievement aPI

  useEffect(() => {
    API.get(`getUserProgress/${user[0].userid}`).then(
      // API.get(`getUserProgress/jayprakashbehera030@gmail.com`).then(
      response => {
        //
        setAchieve(response.data);
        //setTimeSpent_record(response.data[0].timeSpentData);
        setIsloading(false);
      },
      err => {
        //
      },
    );
  }, []);

  //Check acahievement data
  // console.log('achievehome--------->', achieve);
  // console.log('achievehome--------->', achieve);
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
  const app_versions = '1.8.6';
  const {t} = useTranslation();
  const dispatch = useDispatch();

  const fcmbgmessage = useSelector(state => state.fcmMessage.fcmMessage);
  const [language, setLanguage] = useState('od');
  const [coin, setCoin] = useState('');
  const [imgActive, setImgActive] = useState(0);
  const [scrollx, setScrollx] = useState(0);
  const [result, setResult] = useState([]);
  const [modal, setModal] = useState(false);
  const [versionModal, setVersionModal] = useState(false);
  const [status, setStatus] = useState(false);
  const [statusData, setStatusData] = useState([]);
  const [statusMsg, setStatusMsg] = useState([]);
  //
  const [statusModal, setStatusModal] = useState(false);
  useEffect(() => {
    dispatch(FcmSlice.getfcmMessagestore());
    //
    if (fcmbgmessage) {
      if (Object.keys(fcmbgmessage).length > 0) {
        // dispatch(FcmSlice.clearfcmMessage({}));
        navigation.navigate(`${fcmbgmessage.data.navigateto}`);
      }
    }
  }, [fcmbgmessage]);
  //
  // const [statusModal, setStatusModal] = useState(true);
  useEffect(() => {
    const navigateScreen = async () => {
      const getInitialLink = await dynamicLinks().getInitialLink();

      if (getInitialLink !== null) {
        let decodeUrl = getInitialLink.url.split('=');
        const [params1, params2, params3, params4, params5, params6] =
          decodeUrl[1].split('?');
        if (params1 == 'eccontent') {
          navigation.navigate(params1, {
            contentDetails: params2,
            class: params3,
          });
        } else if (params1 == 'Content') {
          navigation.navigate(params1, {
            preferedlanguage: params2,
            program: params3,
            subject: params4,
            class: params5,
            skillsetid: params6,
          });
        } else if (params1 == 'contentdetails') {
          const topic = {
            moduleid: params2,
            submoduleid: params3,
            topicid: params4,
          };
          if (user[0].usertype == 'fellow') {
            API.get(
              `ppt_trans_getoverallstatus/${user[0].userid}/${language}`,
            ).then(res => {
              if (res.data.status == 'complete') {
                monthlyModuleArr.map(item => {
                  if (item.moduleid == topic.moduleid) {
                    if (item.lockstatus == 'unlock') {
                      navigation.navigate(params1, {
                        data: topic,
                        data_type: 'content',
                      });
                    } else {
                      ToastAndroid.show(
                        'Please Complete previous Modules.',
                        ToastAndroid.SHORT,
                      );
                    }
                  } else {
                    ToastAndroid.show(
                      'Something went wrong. Please try again.',
                      ToastAndroid.SHORT,
                    );
                  }
                });
              } else {
                Alert.alert(
                  'ଧ୍ୟାନ ଦିଅନ୍ତୁ!',
                  'ଆଗକୁ ବଢ଼ିବାକୁ ହେଲେ, ଦୟାକରି ସମସ୍ତ ପ୍ରବେଶ ପେଟିକା ସମ୍ପୂର୍ଣ୍ଣ କରନ୍ତୁ।',
                  [
                    {
                      text: 'Cancel',
                      onPress: () => null,
                      style: 'cancel',
                    },
                    {text: 'Ok', onPress: () => null},
                  ],
                );
              }
            });
          } else {
            API.get(`getteacherbaselinestatus/${user[0].userid}`).then(
              res => {
                if (res.data.status == 'complete') {
                  monthlyModuleArr.map(item => {
                    if (item.moduleid == topic.moduleid) {
                      if (item.lockstatus == 'unlock') {
                        navigation.navigate(params1, {
                          data: topic,
                          data_type: 'content',
                        });
                      } else {
                        ToastAndroid.show(
                          'Please Complete previous Modules.',
                          ToastAndroid.SHORT,
                        );
                      }
                    } else {
                      ToastAndroid.show(
                        'Something went wrong. Please try again.',
                        ToastAndroid.SHORT,
                      );
                    }
                  });
                } else {
                  Alert.alert(
                    'ଧ୍ୟାନ ଦିଅନ୍ତୁ!',
                    'ଆଗକୁ ବଢ଼ିବାକୁ ହେଲେ, ଦୟାକରି ଶିକ୍ଷକ ମୂଲ୍ୟାଙ୍କନ ସମ୍ପୂର୍ଣ୍ଣ କରନ୍ତୁ।',
                    [
                      {
                        text: 'Cancel',
                        onPress: () => null,
                        style: 'cancel',
                      },
                      {text: 'Ok', onPress: () => null},
                    ],
                  );
                }
              },
              err => {
                this.serverDownMsg.presentToast();
              },
            );
          }
          // monthlyModuleArr.map(item => {
          //   if (item.moduleid == topic.moduleid) {
          //     if (item.lockstatus == 'unlock') {
          //       navigation.navigate(params1, {
          //         data: topic,
          //         data_type: 'content',
          //       });
          //     } else {
          //       ToastAndroid.show(
          //         'Please Complete previous Modules.',
          //         ToastAndroid.SHORT,
          //       );
          //     }
          //   } else {
          //     ToastAndroid.show(
          //       'Something went wrong. Please try again.',
          //       ToastAndroid.SHORT,
          //     );
          //   }
          // });
          // navigation.navigate(params1, {
          //   data: topic,
          //   data_type: 'content',
          // });
        } else if (params1 == 'preprogram_training_content') {
          const topic = {
            moduleid: params2,
            submoduleid: params3,
            topicid: params4,
          };
          API.get(`getteacherbaselinestatus/${user[0].userid}`).then(res => {
            //
            if (res.data.status == 'complete') {
              pptModuleArr.map(item => {
                if (item.moduleid == topic.moduleid) {
                  if (item.lockstatus == 'unlock') {
                    navigation.navigate(params1, {
                      data: topic,
                      data_type: 'content',
                    });
                  } else {
                    ToastAndroid.show(
                      'Please Complete previous Modules.',
                      ToastAndroid.SHORT,
                    );
                  }
                } else {
                  ToastAndroid.show(
                    'Something went wrong. Please try again.',
                    ToastAndroid.SHORT,
                  );
                }
              });
            } else {
              Alert.alert(
                'ଧ୍ୟାନ ଦିଅନ୍ତୁ! ',
                'ଆଗକୁ ବଢ଼ିବାକୁ ହେଲେ, ଦୟାକରି ଶିକ୍ଷକ ମୂଲ୍ୟାଙ୍କନ ସମ୍ପୂର୍ଣ୍ଣ କରନ୍ତୁ।',
                [
                  {
                    text: 'Cancel',
                    onPress: () => null,
                    style: 'cancel',
                  },
                  {text: 'Ok', onPress: () => null},
                ],
              );
            }
          });
          // pptModuleArr.map(item => {
          //   if (item.moduleid == topic.moduleid) {
          //     if (item.lockstatus == 'unlock') {
          //       navigation.navigate(params1, {
          //         data: topic,
          //         data_type: 'content',
          //       });
          //     } else {
          //       ToastAndroid.show(
          //         'Please Complete previous Modules.',
          //         ToastAndroid.SHORT,
          //       );
          //     }
          //   } else {
          //     ToastAndroid.show(
          //       'Something went wrong. Please try again.',
          //       ToastAndroid.SHORT,
          //     );
          //   }
          // });
          // navigation.navigate(params1, {
          //   data: topic,
          //   data_type: 'content',
          // });
        } else {
          ToastAndroid.show('url not found', ToastAndroid.SHORT);
        }
      }
    };
    navigateScreen();
  }, []);
  useEffect(() => {
    const unsubscribe = dynamicLinks().onLink(handleDynamiclink);
    // const linkingEvent = Linking.addEventListener('url home', handleDeepLink);
    // Linking.getInitialURL().then(url => {
    //   if (url) {
    //     handleDeepLink({url});
    //   }
    // });
    return () => {
      // linkingEvent.remove();
      unsubscribe();
    };
    // Linking.addEventListener('url', handleDynamicLink);
    // const unsubscribe = dynamicLinks().onLink(handleDynamicLink);
    // When the component is unmounted, remove the listener
    // return () => unsubscribe();
  });

  const handleDynamiclink = ({url}) => {
    let decodeUrl = url.split('=');
    const [params1, params2, params3, params4, params5, params6] =
      decodeUrl[1].split('?');
    if (params1 == 'eccontent') {
      navigation.navigate(params1, {
        contentDetails: params2,
        class: params3,
      });
    } else if (params1 == 'Content') {
      navigation.navigate(params1, {
        preferedlanguage: params2,
        program: params3,
        subject: params4,
        class: params5,
        skillsetid: params6,
      });
    } else if (params1 == 'contentdetails') {
      const topic = {
        moduleid: params2,
        submoduleid: params3,
        topicid: params4,
      };
      if (user[0].usertype == 'fellow') {
        API.get(
          `ppt_trans_getoverallstatus/${user[0].userid}/${language}`,
        ).then(res => {
          if (res.data.status == 'complete') {
            monthlyModuleArr.map(item => {
              if (item.moduleid == topic.moduleid) {
                if (item.lockstatus == 'unlock') {
                  navigation.navigate(params1, {
                    data: topic,
                    data_type: 'content',
                  });
                } else {
                  ToastAndroid.show(
                    'Please Complete previous Modules.',
                    ToastAndroid.SHORT,
                  );
                }
              } else {
                ToastAndroid.show(
                  'Something went wrong. Please try again.',
                  ToastAndroid.SHORT,
                );
              }
            });
          } else {
            Alert.alert(
              'ଧ୍ୟାନ ଦିଅନ୍ତୁ!',
              'ଆଗକୁ ବଢ଼ିବାକୁ ହେଲେ, ଦୟାକରି ସମସ୍ତ ପ୍ରବେଶ ପେଟିକା ସମ୍ପୂର୍ଣ୍ଣ କରନ୍ତୁ।',
              [
                {
                  text: 'Cancel',
                  onPress: () => null,
                  style: 'cancel',
                },
                {text: 'Ok', onPress: () => null},
              ],
            );
          }
        });
      } else {
        API.get(`getteacherbaselinestatus/${user[0].userid}`).then(
          res => {
            if (res.data.status == 'complete') {
              monthlyModuleArr.map(item => {
                if (item.moduleid == topic.moduleid) {
                  if (item.lockstatus == 'unlock') {
                    navigation.navigate(params1, {
                      data: topic,
                      data_type: 'content',
                    });
                  } else {
                    ToastAndroid.show(
                      'Please Complete previous Modules.',
                      ToastAndroid.SHORT,
                    );
                  }
                } else {
                  ToastAndroid.show(
                    'Something went wrong. Please try again.',
                    ToastAndroid.SHORT,
                  );
                }
              });
            } else {
              Alert.alert(
                'ଧ୍ୟାନ ଦିଅନ୍ତୁ!',
                'ଆଗକୁ ବଢ଼ିବାକୁ ହେଲେ, ଦୟାକରି ଶିକ୍ଷକ ମୂଲ୍ୟାଙ୍କନ ସମ୍ପୂର୍ଣ୍ଣ କରନ୍ତୁ।',
                [
                  {
                    text: 'Cancel',
                    onPress: () => null,
                    style: 'cancel',
                  },
                  {text: 'Ok', onPress: () => null},
                ],
              );
            }
          },
          err => {
            this.serverDownMsg.presentToast();
          },
        );
      }
      // monthlyModuleArr.map(item => {
      //   if (item.moduleid == topic.moduleid) {
      //     if (item.lockstatus == 'unlock') {
      //       navigation.navigate(params1, {
      //         data: topic,
      //         data_type: 'content',
      //       });
      //     } else {
      //       ToastAndroid.show(
      //         'Please Complete previous Modules.',
      //         ToastAndroid.SHORT,
      //       );
      //     }
      //   } else {
      //     ToastAndroid.show(
      //       'Something went wrong. Please try again.',
      //       ToastAndroid.SHORT,
      //     );
      //   }
      // });
      // navigation.navigate(params1, {
      //   data: topic,
      //   data_type: 'content',
      // });
    } else if (params1 == 'preprogram_training_content') {
      const topic = {
        moduleid: params2,
        submoduleid: params3,
        topicid: params4,
      };
      API.get(`getteacherbaselinestatus/${user[0].userid}`).then(res => {
        //
        if (res.data.status == 'complete') {
          pptModuleArr.map(item => {
            if (item.moduleid == topic.moduleid) {
              if (item.lockstatus == 'unlock') {
                navigation.navigate(params1, {
                  data: topic,
                  data_type: 'content',
                });
              } else {
                ToastAndroid.show(
                  'Please Complete previous Modules.',
                  ToastAndroid.SHORT,
                );
              }
            } else {
              ToastAndroid.show(
                'Something went wrong. Please try again.',
                ToastAndroid.SHORT,
              );
            }
          });
        } else {
          Alert.alert(
            'ଧ୍ୟାନ ଦିଅନ୍ତୁ! ',
            'ଆଗକୁ ବଢ଼ିବାକୁ ହେଲେ, ଦୟାକରି ଶିକ୍ଷକ ମୂଲ୍ୟାଙ୍କନ ସମ୍ପୂର୍ଣ୍ଣ କରନ୍ତୁ।',
            [
              {
                text: 'Cancel',
                onPress: () => null,
                style: 'cancel',
              },
              {text: 'Ok', onPress: () => null},
            ],
          );
        }
      });
      // pptModuleArr.map(item => {
      //   if (item.moduleid == topic.moduleid) {
      //     if (item.lockstatus == 'unlock') {
      //       navigation.navigate(params1, {
      //         data: topic,
      //         data_type: 'content',
      //       });
      //     } else {
      //       ToastAndroid.show(
      //         'Please Complete previous Modules.',
      //         ToastAndroid.SHORT,
      //       );
      //     }
      //   } else {
      //     ToastAndroid.show(
      //       'Something went wrong. Please try again.',
      //       ToastAndroid.SHORT,
      //     );
      //   }
      // });
      // navigation.navigate(params1, {
      //   data: topic,
      //   data_type: 'content',
      // });
    } else {
      ToastAndroid.show('url not found', ToastAndroid.SHORT);
    }
  };

  const handleDeepLink = ({url}) => {
    dynamicLinks()
      .resolveLink(url)
      .then(link => {
        let decodeUrl = link.url.split('=');
        const [params1, params2, params3, params4, params5, params6] =
          decodeUrl[1].split('?');
        if (params1 == 'eccontent') {
          navigation.navigate(params1, {
            contentDetails: params2,
            class: params3,
          });
        } else if (params1 == 'Content') {
          navigation.navigate(params1, {
            preferedlanguage: params2,
            program: params3,
            subject: params4,
            class: params5,
            skillsetid: params6,
          });
        } else if (params1 == 'contentdetails') {
          const topic = {
            moduleid: params2,
            submoduleid: params3,
            topicid: params4,
          };
          if (user[0].usertype == 'fellow') {
            API.get(
              `ppt_trans_getoverallstatus/${user[0].userid}/${language}`,
            ).then(res => {
              if (res.data.status == 'complete') {
                monthlyModuleArr.map(item => {
                  if (item.moduleid == topic.moduleid) {
                    if (item.lockstatus == 'unlock') {
                      navigation.navigate(params1, {
                        data: topic,
                        data_type: 'content',
                      });
                    } else {
                      ToastAndroid.show(
                        'Please Complete previous Modules.',
                        ToastAndroid.SHORT,
                      );
                    }
                  } else {
                    ToastAndroid.show(
                      'Something went wrong. Please try again.',
                      ToastAndroid.SHORT,
                    );
                  }
                });
              } else {
                Alert.alert(
                  'ଧ୍ୟାନ ଦିଅନ୍ତୁ!',
                  'ଆଗକୁ ବଢ଼ିବାକୁ ହେଲେ, ଦୟାକରି ସମସ୍ତ ପ୍ରବେଶ ପେଟିକା ସମ୍ପୂର୍ଣ୍ଣ କରନ୍ତୁ।',
                  [
                    {
                      text: 'Cancel',
                      onPress: () => null,
                      style: 'cancel',
                    },
                    {text: 'Ok', onPress: () => null},
                  ],
                );
              }
            });
          } else {
            API.get(`getteacherbaselinestatus/${user[0].userid}`).then(
              res => {
                if (res.data.status == 'complete') {
                  monthlyModuleArr.map(item => {
                    if (item.moduleid == topic.moduleid) {
                      if (item.lockstatus == 'unlock') {
                        navigation.navigate(params1, {
                          data: topic,
                          data_type: 'content',
                        });
                      } else {
                        ToastAndroid.show(
                          'Please Complete previous Modules.',
                          ToastAndroid.SHORT,
                        );
                      }
                    } else {
                      ToastAndroid.show(
                        'Something went wrong. Please try again.',
                        ToastAndroid.SHORT,
                      );
                    }
                  });
                } else {
                  Alert.alert(
                    'ଧ୍ୟାନ ଦିଅନ୍ତୁ!',
                    'ଆଗକୁ ବଢ଼ିବାକୁ ହେଲେ, ଦୟାକରି ଶିକ୍ଷକ ମୂଲ୍ୟାଙ୍କନ ସମ୍ପୂର୍ଣ୍ଣ କରନ୍ତୁ।',
                    [
                      {
                        text: 'Cancel',
                        onPress: () => null,
                        style: 'cancel',
                      },
                      {text: 'Ok', onPress: () => null},
                    ],
                  );
                }
              },
              err => {
                this.serverDownMsg.presentToast();
              },
            );
          }
          // monthlyModuleArr.map(item => {
          //   if (item.moduleid == topic.moduleid) {
          //     if (item.lockstatus == 'unlock') {
          //       navigation.navigate(params1, {
          //         data: topic,
          //         data_type: 'content',
          //       });
          //     } else {
          //       ToastAndroid.show(
          //         'Please Complete previous Modules.',
          //         ToastAndroid.SHORT,
          //       );
          //     }
          //   } else {
          //     ToastAndroid.show(
          //       'Something went wrong. Please try again.',
          //       ToastAndroid.SHORT,
          //     );
          //   }
          // });
        } else if (params1 == 'preprogram_training_content') {
          const topic = {
            moduleid: params2,
            submoduleid: params3,
            topicid: params4,
          };
          API.get(`getteacherbaselinestatus/${user[0].userid}`).then(res => {
            //
            if (res.data.status == 'complete') {
              pptModuleArr.map(item => {
                if (item.moduleid == topic.moduleid) {
                  if (item.lockstatus == 'unlock') {
                    navigation.navigate(params1, {
                      data: topic,
                      data_type: 'content',
                    });
                  } else {
                    ToastAndroid.show(
                      'Please Complete previous Modules.',
                      ToastAndroid.SHORT,
                    );
                  }
                } else {
                  ToastAndroid.show(
                    'Something went wrong. Please try again.',
                    ToastAndroid.SHORT,
                  );
                }
              });
            } else {
              Alert.alert(
                'ଧ୍ୟାନ ଦିଅନ୍ତୁ! ',
                'ଆଗକୁ ବଢ଼ିବାକୁ ହେଲେ, ଦୟାକରି ଶିକ୍ଷକ ମୂଲ୍ୟାଙ୍କନ ସମ୍ପୂର୍ଣ୍ଣ କରନ୍ତୁ।',
                [
                  {
                    text: 'Cancel',
                    onPress: () => null,
                    style: 'cancel',
                  },
                  {text: 'Ok', onPress: () => null},
                ],
              );
            }
          });
          // navigation.navigate(params1, {
          //   data: topic,
          //   data_type: 'content',
          // });
        } else {
          ToastAndroid.show('url not found', ToastAndroid.SHORT);
        }
      });
    //
    // let result = url.slice(31);
    // //
    // navigation.navigate(`${result}`);

    // const interval = setInterval(() => {
    //   //
    // }, 60000);
    // return () => clearInterval(interval);
  };

  const openPPT = () => {
    // navigation.navigate('preprogramtraining', {
    //   type: 'ppt',
    // });
    API.get(`getteacherbaselinestatus/${user[0].userid}`).then(res => {
      //
      // console.log('responseppt--------->', res.data.status);
      if (res.data.status == 'complete') {
        navigation.navigate('preprogramtraining', {
          type: 'ppt',
        });
      } else {
        Alert.alert(
          'ଧ୍ୟାନ ଦିଅନ୍ତୁ! ',
          'ଆଗକୁ ବଢ଼ିବାକୁ ହେଲେ, ଦୟାକରି ଶିକ୍ଷକ ମୂଲ୍ୟାଙ୍କନ ସମ୍ପୂର୍ଣ୍ଣ କରନ୍ତୁ।',
          [
            {
              text: 'Cancel',
              onPress: () => null,
              style: 'cancel',
            },
            {text: 'Ok', onPress: () => null},
          ],
        );
      }
    });
  };

  //New PPT
  const openPPTNew = () => {
    navigation.navigate('preprogramtrainingnew', {
      type: 'ppt',
    });
  };

  //For tick baseline

  const [statusBaseline, setStatusBaseline] = useState('');
  //
  useEffect(() => {
    API.get(`getteacherbaselinestatus/${user[0].userid}`).then(
      response => {
        //
        setStatusBaseline(response.data.status);
      },
      err => {
        //
      },
    );
  }, []);

  //For tick prabesha
  const [statusPPT, setStatusPPT] = useState(false);

  useEffect(() => {
    API.get(`ppt_trans_getoverallstatus/${user[0].userid}/${language}`).then(
      response => {
        //
        if (response.data.status == 'complete') {
          setStatusPPT(true);
        }
      },
    );
  }, []);

  //For tick endline

  const [statusMonthly, setStatusMonthly] = useState(false);
  const [statusEndline, setStatusEndline] = useState(false);

  //

  useEffect(() => {
    API.get(`gettrainingoverallmarks/${user[0].userid}/${language}`).then(
      response => {
        //

        if (response.data[0].training_status == 'complete') {
          setStatusMonthly(true);
        }
      },
      err => {
        //
      },
    );
    API.get(`checknsdceligibility/${user[0].userid}`).then(
      response => {
        if (response.data.status != 'endline incomplete') {
          setStatusEndline(true);
        }
      },
      err => {
        //
      },
    );
  }, []);

  const openMonthly = () => {
    // navigation.navigate('monthlytraining', {
    //   type: 'monthly',
    // });
    if (user[0].usertype == 'fellow') {
      API.get(`ppt_trans_getoverallstatus/${user[0].userid}/${language}`).then(
        res => {
          if (res.data.status == 'complete') {
            navigation.navigate('monthlytraining', {
              type: 'monthly',
            });
          } else {
            Alert.alert(
              'ଧ୍ୟାନ ଦିଅନ୍ତୁ!',
              'ଆଗକୁ ବଢ଼ିବାକୁ ହେଲେ, ଦୟାକରି ସମସ୍ତ ପ୍ରବେଶ ପେଟିକା ସମ୍ପୂର୍ଣ୍ଣ କରନ୍ତୁ।',
              [
                {
                  text: 'Cancel',
                  onPress: () => null,
                  style: 'cancel',
                },
                {text: 'Ok', onPress: () => null},
              ],
            );
          }
        },
      );
    } else {
      API.get(`getteacherbaselinestatus/${user[0].userid}`).then(
        res => {
          if (res.data.status == 'complete') {
            navigation.navigate('monthlytraining', {
              type: 'monthly',
            });
          } else {
            Alert.alert(
              'ଧ୍ୟାନ ଦିଅନ୍ତୁ!',
              'ଆଗକୁ ବଢ଼ିବାକୁ ହେଲେ, ଦୟାକରି ଶିକ୍ଷକ ମୂଲ୍ୟାଙ୍କନ ସମ୍ପୂର୍ଣ୍ଣ କରନ୍ତୁ।',
              [
                {
                  text: 'Cancel',
                  onPress: () => null,
                  style: 'cancel',
                },
                {text: 'Ok', onPress: () => null},
              ],
            );
          }
        },
        err => {
          this.serverDownMsg.presentToast();
        },
      );
    }
  };

  const openMonthlyNew = () => {
    navigation.navigate('monthlytrainingnew', {
      type: 'monthly',
    });
  };

  const openEndline = () => {
    // navigation.navigate('teacherBaseline', {
    //   type: 'endline',
    // });
    API.get(`gettrainingoverallmarks/${user[0].userid}/${language}`).then(
      res => {
        if (res.data.length > 0) {
          // console.log(
          //   'check---->',
          //   res.data[0].training_status,
          //   res.data[0].studentMidlineStatus,
          // );
          //
          if (
            res.data[0].training_status == 'incomplete' &&
            res.data[0].studentMidlineStatus == 'complete'
          ) {
            Alert.alert(
              'ଧ୍ୟାନ ଦିଅନ୍ତୁ! ',
              'ଆଗକୁ ବଢ଼ିବା ପାଇଁ ପ୍ରତ୍ଯେକ ପେଟିକାରେ 60% ରହିବା ଆବଶ୍ୟକ, ଦୟାକରି ସମସ୍ତ ପ୍ରଶିକ୍ଷଣ ପେଟିକା ସମ୍ପୂର୍ଣ୍ଣ କରନ୍ତୁ।',
              [
                {
                  text: 'Cancel',
                  onPress: () => null,
                  style: 'cancel',
                },
                {text: 'Ok', onPress: () => null},
              ],
            );
          } else if (
            res.data[0].training_status == 'complete' &&
            res.data[0].studentMidlineStatus == 'incomplete'
          ) {
            Alert.alert(
              'ଧ୍ୟାନ ଦିଅନ୍ତୁ! ',
              'ଆପଣ ଶିକ୍ଷାର୍ଥୀଙ୍କ ମୂଲ୍ୟାଙ୍କନ -୨ କରିନଥିବାରୁ ଏଣ୍ଡଲାଇନ୍ ଦେଇପାରିବେ ନାହିଁ ।',
              [
                {
                  text: 'Cancel',
                  onPress: () => null,
                  style: 'cancel',
                },
                {text: 'Ok', onPress: () => null},
              ],
            );
          } else if (
            res.data[0].training_status == 'incomplete' &&
            res.data[0].studentMidlineStatus == 'incomplete'
          ) {
            Alert.alert(
              'ଧ୍ୟାନ ଦିଅନ୍ତୁ! ',
              "ଆପଣ ଉଭୟ 'ପ୍ରସ୍ତୁତି ପେଟିକା' ଓ ଶିକ୍ଷାର୍ଥମାନଙ୍କ 'ମୂଲ୍ୟାଙ୍କନ ୨' ସମ୍ପୂର୍ଣ୍ଣ କରିନଥିବାରୁ, ଆପଣ ଏଣ୍ଡଲାଇନ୍ ପରୀକ୍ଷା ଦେଇପାରିବେ ନାହିଁ।",
              [
                {
                  text: 'Cancel',
                  onPress: () => null,
                  style: 'cancel',
                },
                {text: 'Ok', onPress: () => null},
              ],
            );
          } else if (
            res.data[0].training_status == 'complete' &&
            res.data[0].studentMidlineStatus == 'complete'
          ) {
            navigation.navigate('teacherBaseline', {
              type: 'endline',
            });
          }
        }
        err => {
          this.serverDownMsg.presentToast();
        };
      },
    );
  };

  const openExtraModule = () => {
    navigation.navigate('extramodule', {
      type: 'extramodule',
    });
  };

  const getToken = async () => {
    const token = await messaging().getToken();
    // Alert.alert(token);
    const fcm_obj = {
      userid: user[0].userid,
      username: user[0].username,
      token: token,
      refresh_token: token,
    };
    API.get(`getfcmtokenidbyuserid/${user[0].userid}`).then(
      getRes => {
        if (getRes.data.length > 0) {
          //
          const tid = getRes.data[0]._id;
          //
          API.put(`updatefcmtokenid/${tid}`, fcm_obj).then(upGet => {
            //
          });
        }
        // else create new
        else {
          API.post(`createnewfcmtokenid`, fcm_obj).then(res => {
            //
          });
        }
      },
      err => {
        // this.serverDownMsg.presentToast();
      },
    );

    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (enabled) {
      //
    }
  };
  useEffect(() => {
    getToken();
    // axios
    //   .get('https://comms.globalxchange.com/coin/vault/get/all/coins')
    //   .then(response => {
    //     setCoin(response.data.coins);
    //   });
    const d_data = {
      userid: user[0].userid,
      usertype: user[0].usertype,
      language: language,
    };
    dispatch(TrainingSlice.getModuleStart({d_data}));
    dispatch(TrainingSlice.getPPTModuleStart({d_data}));
    // requestUserPermission();
  }, []);
  const onChange = nativeEvent => {
    //
    if (nativeEvent) {
      const slide = Math.ceil(
        nativeEvent.contentOffset.x / nativeEvent.layoutMeasurement.width,
      );
      if (slide != imgActive) {
        setImgActive(slide);
      }
    }
  };
  const _renderItem = ({item, index}) => {
    return <CarouselImage data={item} autoplay />;
  };

  useEffect(() => {
    API.get(
      `checkUserInLeaderboard/${user[0].userid}/${user[0].usertype}`,
    ).then(
      response => {
        //
        setResult(response.data);
        // console.log(response.data, 'leaderboard-------->');
        if (response.data.useridExists == true) {
          setModal(true);
        } else {
          setModal(false);
        }
      },
      err => {
        //
      },
    );
  }, []);
  useEffect(() => {
    API.get(`getappversion/com.nrusingh.teacher_thinkzone1`).then(
      response => {
        //
        //
        setResult(response.data);
        if (app_versions < response?.data[0]?.version) {
          // console.log(
          //   response.data[0].version,
          //   'app_version--------------------->',
          // );

          setVersionModal(true);
        } else {
          setVersionModal(false);
        }
      },
      err => {
        //
      },
    );
    // logOut();
  }, []);
  useEffect(() => {
    API.get(`getAllStatus/${user[0].userid}`).then(
      // API.get(`getUserProgress/jayprakashbehera030@gmail.com`).then(
      response => {
        //
        //
        // console.log(
        //   'status2----->',
        //   response.data.data[0].allStudentsBaselineStatus,
        // );
        setStatus(response.data);
        if (response.data.msg !== '') {
          setStatusModal(true);
        } else {
          (' ');
        }
        // setStatusData(response.data.data);
        // setStatusMsg(response.data);

        // if (response.data.data[0].allStudentsBaselineStatus === 'incomplete') {
        //   setStatusModal(true);
        // } else {
        //   ('');
        // }
      },
      err => {
        //
      },
    );
  }, []);

  const logOut = async () => {
    // console.log('clicked');
    try {
      await GoogleSignin.hasPlayServices();
      // await  GoogleSignin.signOut();
      GoogleSignin.signOut()
        .then(res => {
          // console.log(res);
          setLogOuts(true);
        })
        .catch(err => {
          // console.log(err, 'err');
        });
      dispatch(types.logOutUser());
      Linking.openURL(
        'https://play.google.com/store/apps/details?id=com.nrusingh.teacher_thinkzone1',
      );
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <SafeAreaView style={styles.safeview}>
      <View style={styles.centeredView}>
        <Modal animationType="slide" transparent={true} visible={versionModal}>
          <View style={styles.centeredView}>
            <View
              style={[
                styles.modalView,
                {
                  height: window.WindowHeigth * 1,
                  // marginTop: -0,
                  width: window.WindowWidth * 1.1,
                },
              ]}>
              <Image
                style={{
                  justifyContent: 'center',
                  flex: 1,
                  // marginTop: 15,
                  height: window.WindowHeigth * 0.39,
                  width: window.WindowWidth * 0.75,
                }}
                source={require('../assets/Image/version.gif')}
              />
              <Text style={[styles.username, {marginTop: 50, fontSize: 22}]}>
                ନୂତନ ଅପଡେଟ୍ ଉପଲବ୍ଧ
              </Text>
              <Text style={styles.p}>
                ଉନ୍ନତ କାର୍ଯ୍ୟଦକ୍ଷତା ଏବଂ ବୈଶିଷ୍ଟ୍ୟ ବୃଦ୍ଧି ପାଇଁ ଅପଡେଟ୍ କରନ୍ତୁ।!
              </Text>
              <TouchableOpacity onPress={() => logOut()} style={styles.bu}>
                <Text
                  style={{
                    fontSize: 21,
                    color: Color.white,
                    textAlign: 'center',
                  }}>
                  <FontAwesome
                    name="android"
                    color={Colors.white}
                    size={27}
                    style={{margin: 2}}
                  />{' '}
                  ଅପଡେଟ୍ କରନ୍ତୁ
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
        {/* <Modal animationType="slide" transparent={true} visible={statusModal}>
          <View style={styles.centeredView}>
            <View
              style={[
                styles.modalView,
                {
                
                  marginTop: 50,
                  width: window.WindowWidth * 0.95,
                },
              ]}>
              <TouchableOpacity onPress={() => setStatusModal(false)}>
                <Entypo
                  name="circle-with-cross"
                  color={Color.royalblue}
                  size={30}
                  style={{marginLeft: 210}}
                />
              </TouchableOpacity>
              <Image
                style={{
                  justifyContent: 'center',
                
                  height: 150,
                  width: 150,
                }}
                source={require('../assets/Image/27565-writing-an-exam.png')}
              />
              <Text style={[styles.username, {marginTop: 40, fontSize: 20}]}>
                {user.username}
              </Text>

              <Text style={[styles.p, {marginTop: 20}]}>{status.msg}</Text>

              <TouchableOpacity
             
                onPress={() =>
                  navigation.navigate(
                    status.link,
                    status.type ? {type: status.type} : null,
                  )
                }
                style={[styles.bu, {marginTop: 10}]}>
                <Text
                  style={{
                    fontSize: 21,
                    color: Color.white,
                    textAlign: 'center',
                  }}>
                 
                  Click Me
                  <MaterialCommunityIcons
                    name="cursor-default-click"
                    size={27}
                   
                  />
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal> */}
        <Modal animationType="slide" transparent={true} visible={modal}>
          <View style={styles.centeredView}>
            <View
              style={[
                styles.modalView,
                {
                  // height: window.WindowHeigth * 0.8,
                  // marginTop: -50,
                  width: window.WindowWidth * 0.92,
                },
              ]}>
              {/* <TouchableOpacity onPress={() => setModal(false)}>
                <Entypo
                  name="circle-with-cross"
                  color={Color.royalblue}
                  size={30}
                  style={{marginLeft: 225, marginTop: -30}}
                />
              </TouchableOpacity> */}
              <Image
                source={require('../assets/Image/leader.gif')}
                style={{width: 350, height: 320, top: -20}}
              />
              <Text
                style={[
                  styles.username,
                  {fontSize: 20, top: -30, alignSelf: 'center'},
                ]}>
                Congratulations 🎊
              </Text>
              <Text
                style={[
                  styles.username,
                  {marginTop: -20, fontSize: 16, left: -20, color: '#666666'},
                ]}>
                {user[0].username}
              </Text>
              <Text style={[styles.username, {fontSize: 15, top: 10}]}>
                ଆପଣ ଲିଡରବୋର୍ଡରେ ସ୍ଥାନ ପାଇଛନ୍ତି
              </Text>
              <TouchableOpacity
                onPress={() => navigation.navigate('leaderboard')}
                style={[
                  styles.bu,
                  {
                    marginTop: 30,
                    width: window.WindowWidth * 0.5,
                    // height: window.WindowHeigth * 0.1,
                  },
                ]}>
                <Text
                  style={{
                    fontSize: 12,
                    color: Color.white,
                    fontWeight: '900',
                    textAlign: 'center',
                    fontFamily: FontFamily.poppinsMedium,
                  }}>
                  Check Your Score
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setModal(false)}
                style={[
                  styles.bu,
                  {
                    marginTop: 30,
                    backgroundColor: Color.ghostwhite,
                    width: window.WindowWidth * 0.5,
                    borderWidth: 1,
                    borderColor: Color.royalblue,
                    // height: window.WindowHeigth * 0.1,
                  },
                ]}>
                <Text
                  style={{
                    fontSize: 12,
                    color: Color.royalblue,
                    fontWeight: '900',
                    textAlign: 'center',
                    fontFamily: FontFamily.poppinsMedium,
                  }}>
                  Skip for now
                </Text>
              </TouchableOpacity>
            </View>
          </View>
          {/* </View> */}
        </Modal>
      </View>
      <StatusBar backgroundColor={Color.royalblue} barStyle="white-content" />
      {/* <AppHeader /> */}

      <ScrollView
        style={{marginTop: -25}}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }>
        <Header navigation={navigation} />
        <View style={{marginTop: -660, backgroundColor: Color.ghostwhite}}>
          <View style={styles.view}>
            <View>
              <Text
                style={[
                  {
                    color: '#333333',
                    fontWeight: '600',
                    fontSize: FontSize.size_mid_9,
                    textTransform: 'uppercase',
                    textAlign: 'left',
                    left: '2%',
                    fontFamily: FontFamily.balooBhaina2Medium,
                    paddingTop: 10,
                  },
                ]}>
                {/* 𝐌𝐘 𝐀𝐂𝐇𝐈𝐄𝐕𝐄𝐌𝐄𝐍𝐓 */}
                ମୋ ପ୍ରଗତି
              </Text>
              {/* <Separator height={1} color={Colors.black} /> */}
            </View>
            <View style={{paddingTop: 8, paddingBottom: 20}}>
              {/* <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}> */}
              <View
                style={{
                  marginTop: 16,
                  paddingBottom: 20,
                  paddingTop: 20,
                  marginLeft: 12,
                  marginRight: 12,
                  borderRadius: 8,
                  // backgroundColor: '#87CEEB',
                  // backgroundColor: 'white',
                }}>
                <View style={{marginTop: -25}}>
                  <StepIndicator
                    customStyles={customStyles}
                    // currentPosition={2}
                    currentPosition={checkStatuses()}
                    labels={labels}
                    style={{color: 'black'}}
                  />
                </View>
              </View>
              <TouchableOpacity
                onPress={() =>
                  navigation.navigate('profile', {
                    type: 'Profile',
                  })
                }>
                <View
                  style={{
                    marginLeft: 202,
                    color: Color.royalblue,

                    alignItems: 'center',

                    marginTop: -20,
                    // paddingTop: 2,
                  }}>
                  <Text
                    style={{
                      color: Color.royalblue,
                      fontWeight: '600',
                      fontFamily: FontFamily.poppinsSemibold,
                    }}>
                    Know More
                  </Text>
                </View>
              </TouchableOpacity>
              {/* </ScrollView> */}
            </View>
          </View>

          <View style={[styles.warp, {marginTop: 15}]}>
            <Carousel
              // layout={'stack'}
              // layoutCardOffset={`10`}
              // ref={c => {
              //   this._carousel = c;
              // }}
              // layoutCardOffset={`18`}
              // inactiveSlideOpacity={1}
              // Momentum="false"
              // inactiveSlideScale={1}
              loop={true} // Enable looping of carousel items
              autoplay={true} // Enable auto sliding
              autoplayInterval={2000} // Delay between slides (in milliseconds)
              autoplayDirection={'rtl'} // Autoplay direction: 'rtl' for reverse
              data={image}
              renderItem={_renderItem}
              sliderWidth={window.WindowWidth}
              itemWidth={window.WindowWidth * 0.9}
            />

            <View style={{marginTop: 10}}>
              <View style={styles.view}>
                <Text
                  style={[
                    {
                      color: '#333333',
                      fontWeight: '500',
                      fontSize: FontSize.size_mid_9,
                      textTransform: 'uppercase',
                      textAlign: 'left',
                      left: '2%',
                      fontFamily: FontFamily.balooBhaina2Medium,
                      paddingTop: 10,
                    },
                  ]}>
                  {/* 𝐀𝐂𝐓𝐈𝐕𝐈𝐓𝐘 𝐌𝐎𝐃𝐔𝐋𝐄 */}
                  ଶିକ୍ଷକ ବିଭାଗ
                </Text>

                <View style={{paddingTop: 8, paddingBottom: 20}}>
                  <ScrollView
                    horizontal={true}
                    showsHorizontalScrollIndicator={false}>
                    <TouchableOpacity
                      onPress={() =>
                        navigation.navigate('teacherBaseline', {
                          type: 'baseline',
                        })
                      }>
                      <Image
                        style={styles.tinyLogos}
                        source={require('../assets/Image/iconschoolnote2.png')}
                      />
                      <View
                        style={[styles.text_sign, {flexDirection: 'column'}]}>
                        <Text style={styles.FlngatiText}>
                          ମୂଲ୍ୟାଙ୍କନ
                          {/* <Text
                          style={[
                            styles.FlngatiText,
                            {marginTop: -5, marginLeft: 25},
                          ]}>
                          ମୂଲ୍ୟାଙ୍କନ */}
                          {statusBaseline === 'complete' ? (
                            <AntDesign
                              name="checkcircle"
                              size={10}
                              color={Colors.success}
                            />
                          ) : null}
                        </Text>
                      </View>
                    </TouchableOpacity>
                    {/* <View style={styles.boxitem}>
                      <Image
                        source=
                        style={styles.images}></Image>
                      <Text style={styles.imagestext}>BASELINE</Text>
                    </View> */}
                    {/* <View style={styles.boxitem}>
                      <Image
                        source={require('../assets/Photos/Details.png')}
                        style={styles.images}></Image>
                      <Text style={styles.imagestext}>PPT</Text>
                    </View> */}

                    <TouchableOpacity onPress={openPPT}>
                      <Image
                        style={styles.tinyLogos}
                        source={require('../assets/Image/iconschoolbook.png')}
                      />
                      <View style={styles.text_sign}>
                        <Text style={[styles.FlngatiText, {left: '10%'}]}>
                          ପ୍ରବେଶ
                          {statusPPT ? (
                            // <Ionicons
                            //   name="md-checkmark-done-circle-sharp"
                            //   size={20}
                            //   color={Colors.success}
                            //   // style={{marginLeft: 92, marginTop: -12}}
                            // />
                            <AntDesign
                              name="checkcircle"
                              size={10}
                              style={{marginTop: -5}}
                              color={Colors.success}
                            />
                          ) : null}
                        </Text>
                      </View>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={openMonthly}>
                      <Image
                        style={styles.tinyLogos}
                        source={require('../assets/Image/iconschoolbook1.png')}
                      />
                      <View style={styles.text_sign}>
                        <Text style={[styles.FlngatiText, {left: '10%'}]}>
                          ପ୍ରସ୍ତୁତି
                          {statusMonthly ? (
                            <AntDesign
                              name="checkcircle"
                              size={10}
                              style={{marginTop: -5}}
                              color={Colors.success}
                            />
                          ) : null}
                        </Text>
                      </View>
                    </TouchableOpacity>
                    {/* 
                    <TouchableOpacity onPress={openMonthlyNew}>
                      <Image
                        style={styles.tinyLogos}
                        source={require('../assets/Image/iconschoolbook1.png')}
                      />
                      <View style={styles.text_sign}>
                        <Text style={[styles.FlngatiText, {left: '10%'}]}>
                          ପ୍ରସ୍ତୁତି new
                          {statusMonthly ? (
                            <AntDesign
                              name="checkcircle"
                              size={10}
                              style={{marginTop: -5}}
                              color={Colors.success}
                            />
                          ) : null}
                        </Text>
                      </View>
                    </TouchableOpacity> */}

                    <TouchableOpacity onPress={openEndline}>
                      <Image
                        style={[styles.tinyLogo]}
                        source={require('../assets/Image/iconcontent-editclipboardtick.png')}
                      />

                      <View style={styles.text_sign}>
                        <Text style={[styles.FlngatiText]}>
                          ଏଣ୍ଡ୍ ଲାଇନ୍
                          {statusEndline ? (
                            <AntDesign
                              name="checkcircle"
                              size={10}
                              style={{marginTop: -5}}
                              color={Colors.success}
                            />
                          ) : null}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  </ScrollView>
                </View>
              </View>
              <View style={styles.view}>
                <Text
                  style={[
                    {
                      color: '#333333',
                      fontWeight: '500',
                      fontSize: FontSize.size_mid_9,
                      textTransform: 'uppercase',
                      textAlign: 'left',
                      left: '2%',
                      fontFamily: FontFamily.balooBhaina2Medium,
                      paddingTop: 10,
                    },
                  ]}>
                  {/* 𝐒𝐓𝐔𝐃𝐄𝐍𝐓𝐒 𝐌𝐎𝐃𝐔𝐋𝐄 */}
                  ଶିକ୍ଷାର୍ଥୀ ବିଭାଗ
                </Text>

                <View
                  style={{
                    paddingTop: 8,
                    paddingBottom: 20,
                    // justifyContent: 'space-evenly',
                  }}>
                  <ScrollView
                    horizontal={true}
                    showsHorizontalScrollIndicator={false}>
                    <TouchableOpacity
                      onPress={() => navigation.navigate('studentlist')}>
                      <Image
                        resizeMode="cover"
                        style={[styles.tinyLogos]}
                        source={require('../assets/Image/iconusersprofile2user.png')}
                      />
                      <Text style={styles.FlngatiText}>ଶିକ୍ଷାର୍ଥୀ ସୂଚନା</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      onPress={() => navigation.navigate('studentregister')}>
                      <Image
                        style={styles.tinyLogos}
                        source={require('../assets/Image/iconusersprofileadd.png')}
                      />
                      <Text style={styles.FlngatiText}>ପଞ୍ଜିକରଣ</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      onPress={() =>
                        navigation.navigate('studentAttendance', {
                          type: 'studentAttendance',
                        })
                      }>
                      <Image
                        style={styles.tinyLogos}
                        source={require('../assets/Image/iconcontent-editnotefavorite.png')}
                      />
                      <Text style={styles.FlngatiText}>ଉପସ୍ଥାନ</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      onPress={() =>
                        navigation.navigate('calllist', {
                          type: 'calllist',
                        })
                      }>
                      <Image
                        style={styles.tinyLogos}
                        source={require('../assets/Image/group-8738.png')}
                      />
                      <Text style={styles.FlngatiText}>ପ୍ରତିକ୍ରିୟା</Text>
                    </TouchableOpacity>
                  </ScrollView>
                </View>
              </View>
              <View style={[styles.view, {padding: 0}]}>
                <Text
                  style={[
                    {
                      color: '#333333',
                      fontWeight: '500',
                      fontSize: FontSize.size_mid_9,
                      textTransform: 'uppercase',
                      textAlign: 'left',
                      left: '2%',
                      fontFamily: FontFamily.balooBhaina2Medium,
                      paddingTop: 10,
                    },
                  ]}>
                  {/* 𝐀𝐂𝐓𝐈𝐕𝐈𝐓𝐘 𝐌𝐎𝐃𝐔𝐋𝐄 */}
                  ଗତିବିଧି ବିଭାଗ
                </Text>

                <View style={{paddingTop: 8, paddingBottom: 20}}>
                  <ScrollView
                    horizontal={true}
                    showsHorizontalScrollIndicator={false}>
                    {/* <TouchableOpacity
                      onPress={() => navigation.navigate('studentlist')}>
                      <ModuleComponent
                        imageUrl={require('../assets/Photos/ece.png')}
                        textdata={'Student List'}
                      /> */}
                    <TouchableOpacity
                      onPress={() =>
                        navigation.navigate('ecactivity', {
                          type: 'ecactivity',
                        })
                      }>
                      <Image
                        style={[styles.tinyLogo, {alignSelf: 'center'}]}
                        source={require('../assets/Image/iconcontent-editdocumentnormal.png')}
                      />
                      <Text style={styles.FlngatiText}>ପ୍ରାକ୍ ଗତିବିଧି</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() =>
                        navigation.navigate('pgeactivity', {
                          type: 'pgeactivity',
                        })
                      }>
                      <Image
                        style={[styles.tinyLogo, {alignSelf: 'center'}]}
                        source={require('../assets/Image/iconcontent-editnote.png')}
                      />
                      <Text style={styles.FlngatiText}>ପ୍ରାଥମିକ ଗତିବିଧି</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() =>
                        navigation.navigate('fln', {
                          type: 'fln',
                        })
                      }>
                      <Image
                        style={styles.tinyLogos}
                        source={require('../assets/Image/iconprogramminghierarchy3.png')}
                      />
                      <Text
                        style={[
                          styles.FlngatiText,
                          {
                            fontSize: 12,
                            // color: Color.black,
                            // position: 'absolute',
                            fontFamily: FontFamily.poppinsMedium,
                            textTransform: 'uppercase',
                          },
                        ]}>
                        FLN
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() =>
                        // ToastAndroid.show(
                        //   'This Module is under development .',
                        //   ToastAndroid.SHORT,
                        // )
                        navigation.navigate('audiovideo', {
                          type: 'audiovideo',
                        })
                      }>
                      <Image
                        style={styles.tinyLogos}
                        source={require('../assets/Image/iconvideoaudioimagevideoplay.png')}
                      />
                      <Text
                        style={[
                          styles.FlngatiText,
                          {
                            // textAlign: 'center',
                            // top: '85.02%',
                            // width: '90.57%',
                            // height: '14.98%',
                            // fontWeight: '600',
                            fontSize: 12,
                            // color: Color.black,
                            // position: 'absolute',
                            fontFamily: FontFamily.poppinsMedium,
                          },
                        ]}>
                        Audio
                      </Text>
                      {/* <Text
                        style={[
                          styles.FlngatiText,
                          {textTransform: 'uppercase', marginTop: -5},
                        ]}>
                        Video
                      </Text> */}
                    </TouchableOpacity>
                  </ScrollView>
                </View>
              </View>

              <TouchableOpacity
                onPress={() =>
                  navigation.navigate('ମୋ ସଫଳତା', {
                    type: 'ମୋ ସଫଳତା',
                  })
                }
                style={{marginTop: 15}}>
                <Image
                  source={require('../assets/Image/rewards.png')}
                  resizeMode="cover"
                  style={{
                    height: window.WindowHeigth * 0.2,
                    width: window.WindowWidth * 0.9,
                    borderRadius: 5,
                    marginLeft: 18,
                    // borderWidth: 0.8,
                    borderColor: 'black',
                  }}
                />
              </TouchableOpacity>

              {/* <View
                style={{
                  width: window.WindowWidth * 0.9,
                  backgroundColor: 'white',
                  marginLeft: 20,
                  borderRadius: 5,
                  marginTop: 15,
                  paddingBottom: 20,
                }}>
                <View
                  style={{
                    flexDirection: 'row',
                  }}>
                  <Text
                    style={{
                      width: 155,
                      FontFamily: FontFamily.balooBhaina2Medium,
                      color: '#333333',
                      marginLeft: 10,
                      marginTop: 20,
                    }}>
                    ପରୀକ୍ଷା ଦେବା ପାଇଁ ନିଜର ଯୋଗ୍ୟତା ଦେଖନ୍ତୁ
                  </Text>
                  <Image
                    style={{
                      width: 155,
                      height: 82.98,
                      // left: '2%',
                      top: '5%',
                    }}
                    resizeMode="cover"
                    source={require('../assets/Image/nsdclogo-1.png')}
                  />
                </View>
                <View style={{paddingTop: 10}}>
                  <TouchableOpacity
                    onPress={() =>
                      navigation.navigate('NSDC', {
                        type: 'NSDC',
                      })
                    }
                    style={{
                      backgroundColor: Color.royalblue,
                      marginLeft: 20,
                      borderRadius: 20,
                      width: window.WindowWidth * 0.21,
                      marginTop: 5,
                    }}>
                    <Text
                      style={{
                        FontFamily: FontFamily.balooBhaina2Medium,
                        color: '#333333',
                        textAlign: 'center',
                        color: Color.white,
                        paddingBottom: 4,
                        paddingTop: 4,
                        fontSize: 13,
                      }}>
                      ଯାଞ୍ଚ କରନ୍ତୁ
                    </Text>
                  </TouchableOpacity>
                </View>
              </View> */}
              <View style={[styles.view, {marginBottom: 15}]}>
                <Text
                  style={[
                    {
                      color: '#333333',
                      fontWeight: '500',
                      fontSize: FontSize.size_mid_9,
                      textTransform: 'uppercase',
                      textAlign: 'left',
                      left: '2%',
                      fontFamily: FontFamily.balooBhaina2Medium,
                      paddingTop: 10,
                    },
                  ]}>
                  {/* 𝐀𝐂𝐓𝐈𝐕𝐈𝐓𝐘 𝐌𝐎𝐃𝐔𝐋𝐄 */}
                  ଅନ୍ୟାନ୍ୟ
                </Text>

                <View style={{paddingTop: 8, paddingBottom: 20}}>
                  <ScrollView
                    horizontal={true}
                    showsHorizontalScrollIndicator={false}>
                    <TouchableOpacity
                      onPress={() =>
                        navigation.navigate('payment', {
                          type: 'payment',
                        })
                      }>
                      {/* <ModuleComponent
                        imageUrl={require('../assets/Photos/Details.png')}
                        textdata={'Payment'}
                      /> */}
                      <Image
                        style={styles.tinyLogo}
                        // source={require('../assets/img/hbl/bill.png')}

                        source={require('../assets/Image/iconmoneyemptywallettime.png')}
                      />
                      <Text style={styles.FlngatiText}>ଦେୟ</Text>
                    </TouchableOpacity>
                    {/* <View style={styles.boxitem}>
                      <Image
                        source={require('../assets/Photos/Details.png')}
                        style={styles.images}></Image>
                      <Text style={styles.imagestext}>NSDC</Text>
                    </View> */}
                    {/* <TouchableOpacity
                      onPress={() =>
                        navigation.navigate('NSDC', {
                          type: 'NSDC',
                        })
                      }>
                     
                      <Image
                        style={styles.tinyLogo}
                        source={require('../assets/img/nsdclogo.png')}
                      />
                      <Text style={[styles.FlngatiText, ,]}>N.S.D.C</Text>
                    </TouchableOpacity> */}
                    {/* <View style={styles.boxitem}>
                      <Image
                        source={require('../assets/Photos/Details.png')}
                        style={styles.images}></Image>
                      <Text style={styles.imagestext}>D</Text>
                    </View> */}
                    <TouchableOpacity
                      onPress={() =>
                        navigation.navigate('dictionary', {
                          type: 'dictionary',
                        })
                      }>
                      {/* <ModuleComponent
                        imageUrl={require('../assets/Photos/Details.png')}
                        textdata={'Dictionary'}
                      /> */}
                      <Image
                        style={styles.tinyLogo}
                        source={require('../assets/Image/icondesign-toolscolorswatch.png')}
                      />
                      <Text style={styles.FlngatiText}>ଅଭିଧାନ</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() =>
                        navigation.navigate('books', {
                          type: 'books',
                        })
                      }>
                      <Image
                        style={styles.tinyLogo}
                        source={require('../assets/Image/iconcontent-editarchivebook.png')}
                      />
                      <Text style={styles.FlngatiText}>ଦସ୍ତାବିଜ</Text>
                    </TouchableOpacity>
                    {/* <TouchableOpacity
                      onPress={
                        openExtraModule
                        //() =>
                        // ToastAndroid.show(
                        //   'This Module is under  development. ',
                        //   ToastAndroid.SHORT,
                        // )
                      }>
                      <Image
                        style={styles.tinyLogo}
                        source={require('../assets/Image/icongridelementequal.png')}
                      />
                      <Text style={styles.FlngatiText}>ଅତିରିକ୍ତ</Text>
                    </TouchableOpacity> */}

                    <TouchableOpacity
                      onPress={() =>
                        navigation.navigate('leaderboard', {
                          type: 'leaderboard',
                        })
                      }>
                      {/* <Image
                          style={styles.tinyLogo}
                          source={require('../assets/Photos/payment.png')}
                        /> */}
                      {/* <Text style={styles.FlngatiText}>Fln</Text> */}
                    </TouchableOpacity>
                    {/* <TouchableOpacity
                        onPress={() =>
                          navigation.navigate('demo', {
                            type: 'demo',
                          })
                        }>
                       
                        <Image
                          style={styles.tinyLogo}
                          source={require('../assets/Photos/payment.png')}
                        />
                        <Text style={styles.FlngatiText}>Fln</Text>
                      </TouchableOpacity> */}
                  </ScrollView>
                </View>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
      {/* <View style={styles.botnavigation}>
        <TouchableOpacity>
       
          <Image
            source={require('../assets/Image/home.png')}
            style={{width: 32, height: 32}}
          />
          <Text style={[styles.botnavigationtext, {color: Color.royalblue}]}>
            Home
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={{marginTop: 5}}
          onPress={() =>
            navigation.navigate('profile', {
              type: 'Profile',
            })
          }>
          
          <Image
            source={require('../assets/Image/users.png')}
            style={{left: '20%', width: 28, height: 28}}
          />
          <Text style={[styles.botnavigationtext, {left: '7%'}]}>Profile</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() =>
            navigation.navigate('leaderboard', {
              type: 'Leaderboard',
            })
          }>
         
          <Image
            source={require('../assets/Image/ranking.png')}
            style={{width: 32, height: 32, left: '30%'}}
          />

          <Text style={styles.botnavigationtext}>Leader board</Text>
        </TouchableOpacity>
       
        <TouchableOpacity
          onPress={() =>
            navigation.navigate('ମୋ ସଫଳତା', {
              type: 'ମୋ ସଫଳତା',
            })
          }
        
        >
         
          <Image
            source={require('../assets/Image/cup.png')}
            style={{left: '20%', width: 32, height: 32}}
          />
          <Text style={styles.botnavigationtext}>Rewards</Text>
        </TouchableOpacity>
      </View> */}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeview: {
    // paddingBottom: 73,
    // justifyContent: 'space-evenly',
    // backgroundColor: Color.white,
  },
  homepageheader: {
    height: window.WindowHeigth * 0.3,
    backgroundColor: Color.royalblue,
    borderBottomStartRadius: 40,
    borderBottomEndRadius: 40,
    borderWidth: 2,
    borderColor: Color.royalblue,
    elevation: 0,
  },
  card: {
    width: window.WindowWidth * 0.8,
    height: 150,
    overflow: 'hidden',
  },
  homeimgnm: {
    flexDirection: 'row-reverse',
    // alignItems: 'stretch',
  },
  studentmodule: {
    flexDirection: 'row',
    height: window.WindowHeigth * 0.45,
    width: window.WindowWidth * 0.9,
    backgroundColor: Color.white,
    alignSelf: 'center',
    borderRadius: 20,
    flexWrap: 'wrap',
    shadowColor: '#333333',
    elevation: 10,
    borderWidth: 2,
    borderBottomColor: Color.royalblue,
    borderRightColor: '#13678a',
    borderTopColor: '#13858a',
    borderLeftColor: '#138a71',
  },

  boxitem: {
    marginTop: 12,
    alignSelf: 'center',
    justifyContent: 'space-around',
    // backgroundColor: Color.royalblue,
    margin: '4.5%',
    height: 150,
    width: 95,
    borderRadius: 20,
    // elevation: 10,
  },
  warp: {
    // alignSelf: 'center',
    // elevation: 10,
  },
  warp1: {
    // marginLeft: window.WindowWidth * 0.35,
    // marginRight: window.WindowWidth * 0.15,
    // paddingLeft: window.WindowWidth * 0.1,
    // paddingRight: window.WindowWidth * 0.1,
    alignSelf: 'center',
    borderRadius: 20,
    // height: window.WindowHeigth * 0.25,
    // width: window.WindowWidth,
    // elevation: 10,
  },
  scrollimage: {
    marginLeft: window.WindowWidth * 0.15,
    marginRight: window.WindowWidth * 0.15,
    alignSelf: 'center',
    height: window.WindowHeigth * 0.22,
    width: window.WindowWidth * 0.7,
    borderRadius: 30,
  },
  warpOut: {
    position: 'relative',
    bottom: 0,
    flexDirection: 'row',
    alignSelf: 'center',
  },
  dotActive: {
    margin: 3,
    color: Color.royalblue,
  },
  dotInactive: {
    margin: 3,
    color: 'white',
  },
  top: {
    alignSelf: 'center',
    margin: 20,
  },
  firsttext: {
    color: 'black',
    fontWeight: 'bold',
    fontSize: 25,
    textTransform: 'capitalize',
  },
  secondtext: {
    color: 'black',
    fontSize: 16,
  },
  container: {
    flex: 1,
    padding: 10,
  },
  ScrollView: {},
  box: {
    margin: 8,
    padding: 20,
    height: 100,
    width: 350,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    flexDirection: 'row',
  },
  images: {
    // height: 200,
    // width: 100,
    borderRadius: 20,
    flex: 1,
    width: null,
    height: null,
    resizeMode: 'cover',
  },
  imagestext: {
    color: '#333333',
    fontSize: 10,
  },
  botnavigation: {
    backgroundColor: Color.white,
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 2,
  },
  botnavigationtext: {
    fontSize: 10.5,
    color: '#333333',
    fontFamily: FontFamily.poppinsSemibold,
  },
  name: {
    fontFamily: 'sans-serif-medium',
    fontSize: 18,
    color: 'black',
  },
  coinsymbol: {
    fontFamily: 'sans-serif-medium',

    color: 'black',
  },
  pricesymbol: {
    paddingLeft: 70,
  },
  price: {
    fontFamily: 'sans-serif-medium',

    color: 'black',
  },

  coinsymbol: {
    fontFamily: 'sans-serif-medium',

    color: 'black',
  },
  FlngatiText: {
    marginLeft: 28.2,

    fontSize: 12,
    alignSelf: 'center',
    color: '#000000',
    alignSelf: 'center',

    marginTop: 15,
    // textAlign: 'center',
  },
  // FlngatiTexts: {
  //   fontSize: 10,
  //   textAlign: 'center',
  //   color: 'black',
  //   fontWeight: 'bold',
  //   marginLeft: 35,
  //   // paddingRight: 5,
  // },
  text_sign: {
    flexDirection: 'row',
    // justifyContent: 'space-evenly',
    alignSelf: 'center',
  },
  image: {
    borderRadius: 1000,
    height: 35,
    width: 35,
    shadowOpacity: 30,
  },

  tinyLogos: {
    width: 42,
    height: 42,
    marginLeft: 30,
    alignSelf: 'center',
    marginTop: 10,

    // marginTop: 30,
  },
  tinyLogo: {
    width: 42,
    height: 42,
    marginLeft: 30,
    padding: 15,
    alignSelf: 'center',

    marginTop: 10,
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
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  buttonOpen: {
    // backgroundColor: '#F194FF',
  },
  buttonClose: {
    backgroundColor: '#2196F3',
  },
  // textStyle: {
  //   color: 'white',
  //   fontWeight: 'bold',
  //   textAlign: 'center',
  //   textTransform: 'uppercase',
  // },

  username: {
    fontSize: 18,
    fontFamily: FontFamily.poppinsMedium,
    color: 'black',
    textTransform: 'capitalize',

    textAlign: 'center',
    fontWeight: '900',
  },

  Logo: {
    width: 120,
    height: 120,
    marginLeft: 22,
    marginTop: -30,
  },
  submit: {
    marginRight: 40,
    marginLeft: 40,
    marginTop: 10,
  },
  submitText: {
    paddingTop: 20,
    paddingBottom: 20,
    color: 'white',
    fontWeight: '900',
    textAlign: 'center',
    backgroundColor: '#68a0cf',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#fff',
    fontSize: 15,
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
    padding: 10,
    borderRadius: 15,
  },
  view: {
    backgroundColor: 'white',
    width: window.WindowWidth * 0.9,
    // marginLeft: 20,
    alignSelf: 'center',
    // flex: 1,
    marginTop: 15,
    borderRadius: 5,
    padding: 10,
    margin: 8,
    // borderColor: 'black',
    // borderWidth: 0.9,
    // borderLeftColor: '#85d8ce',
    // borderRightColor: '#85d8ce',
    // borderBottomColor: '#85d8ce',
    // borderTopColor: '#85d8ce',
    justifyContent: 'space-evenly',
  },
  textStyle: {
    color: 'white',
    fontWeight: '700',
    // alignSelf: 'flex-start',
    fontFamily: 'Arial, Helvetica, sans-serif',
    fontSize: 16,
    padding: 20,
    paddingBottom: 4,
    paddingTop: 4,

    textAlign: 'center',
    // marginTop: -20,
    textTransform: 'uppercase',
  },
});

export default Home;
