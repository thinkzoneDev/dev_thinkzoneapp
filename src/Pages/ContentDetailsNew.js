import {
  FlatList,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ImageBackground,
  ScrollView,
  Modal,
  Alert,
  Pressable,
  Image,
  ActivityIndicator,
  Share,
  StatusBar,
  TextInput,
} from 'react-native';
import * as window from '../utils/dimensions';
import axios from 'axios';
import API from '../environment/Api';
import React, {useState} from 'react';
import Quiz from '../components/Quiz';
import HtmlContentCoponent from '../components/HtmlContentCoponent';
import Colors from '../utils/Colors';
import {useSelector, useDispatch} from 'react-redux';
import Norecord from '../components/Norecord';
import * as TrainingSliceNew from '../redux/slices/TrainingSliceNew';
import * as types from '../redux/slices/UserSlice';
import Popup from '../components/Popup';
import {useEffect} from 'react';
import Modals from '../components/Modals';
import Entypo from 'react-native-vector-icons/Entypo';
import FabButton from '../components/FabButton';
import dynamicLinks from '@react-native-firebase/dynamic-links';
import ReactNativeZoomableView from '@dudigital/react-native-zoomable-view/src/ReactNativeZoomableView';
import {FontFamily, Color} from '../GlobalStyle';
import {showMessage} from 'react-native-flash-message';

const ContentDetailsNew = ({route, navigation}) => {
  const dispatch = useDispatch();

  const data = route.params.data;
  // console.log('data----->', route.params.data);
  const wholeData = route.params.whole_data;
  // console.log('wholeData----->', wholeData);

  const {
    moduleid,
    modulename,
    moduleOrder,
    submoduleid,
    submodulename,
    submoduleOrder,
  } = route.params.data;
  const {topicname, topicid, topicOrder} = route.params.whole_data;
  // console.log('topicname----->', topicname, topicid);

  // console.log('destructure----->', moduleid, submoduleid, topicid);
  // console.log('destructurename----->', modulename, submodulename, topicname);

  // console.log('module---->', moduleid, submoduleid, topicid);
  const [language, setLanguage] = useState('od');
  const [contentData, setContentData] = useState([]);
  // console.log('datacontent----->', contentData);
  // console.log('datacontent2----->', contentData.length);
  const [isLoading, setIsLoading] = useState(false);
  // console.log('isLoading--->', isLoading);
  const user = useSelector(state => state.userdata.user.resData);
  // console.log('user----->', user);
  const contentDetails = useSelector(
    state => state.trainingdataNew.contentDetails,
  );
  // console.log(
  //   'contentDetails check ----->',
  //   // contentDetails,
  //   contentDetails[0].topicData,
  // );

  // console.log(
  //   'check ids------>',
  //   wholeData.topicid.toString(),
  //   contentDetails[0].topicData.filter(item => item.topicid),

  //   contentDetails[0].topicData.filter(item => item.topicid) ==
  //     wholeData.topicid,
  // );

  const [customModal, setCustomModal] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [text, onChangeText] = useState('');

  const [quiz_status, setQuiz_status] = useState(
    route.params.data_type == 'quiz' ? true : false,
  );

  const [content_status, setContent_status] = useState(
    route.params.data_type == 'content' ? true : false,
  );
  // console.log('check contentstatus----->', route.params.data_type);
  const [assignment_status, setAssignment_status] = useState(
    route.params.data_type == 'assignment' ? true : false,
  );
  // console.log(
  //   'check assignment_status----->',
  //   assignment_status,
  //   route.params.data_type,
  // );
  const [textValue, setTextValue] = useState('');
  // console.log('textValue---->', textValue);
  // const [modal, setModal] = useState(true);

  const [modal, setModal] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    API.get(
      // `gettchtrainingdetails/${user[0].usertype}/geetareddy9040@gmail.com/1678707087741/1679462523886/1679462560425`,
      //`gettchtrainingdetails/${user[0].usertype}/${user[0].userid}/${data.moduleid}/${data.submoduleid}/${data.topicid}`,
      //----------new api------------------//
      `getContentQuizAssignment/${user[0].userid}/training/${route.params.data_type}/od/${moduleid}/${submoduleid}/${topicid}`,
      // `getContentQuizAssignment/monalisamoharana99@gmail.com/training/content/od/1682768555649/1682768566362/1682768576842`,
      //----------new api------------------//
    )
      .then(res1 => {
        const datas = res1.data;
        if (datas == undefined || datas.length == 0) {
          API.get(
            `getalltrainingcontents/${user[0].usertype}/${submoduleid}/${submoduleid}/${topicid}/${language}`,
          ).then(res => {
            const data1 = res.data;
            // console.log(data1, 'data1');
            setIsLoading(false);
            setContentData(res.data.data);
          });
        } else {
          setIsLoading(false);
          // setSubModulesData(data);
          // console.log(datas, 'datas');
          // console.log(datas[0].content[0].contentQuestion, 'datascheck');

          setContentData(res1.data.data);
        }
      })
      .catch(err => {});
  }, []);

  // console.log(
  //   'quiz_status1-------->',
  //   quiz_status,
  //   // contentData[0]?.quizData,
  //   // contentData[0]?.contentStatus,
  //   // contentData[0]?.quizData.length,
  //   // contentData[0]?.contentData,
  //   // contentData[0]?.quizData,
  //   // contentData[0],
  //   contentDetails[0].topicData[0].contentStatus,
  // );
  // console.log(
  //   'quiz_status2-------->',
  //   contentData[0]?.quizData.length,
  //   wholeData.contentStatus,
  // );

  const handelContentSubmit = () => {
    setModalVisible(true);
    // const content = [
    //   {
    //     contentid: contentData[0].content[0].contentid,
    //     content: contentData[0].content[0].content,
    //     contentQuestion: contentData[0].content[0].contentQuestion,
    //     contentAnswer:
    //       contentData[0].content[0].contentAnswer == ''
    //         ? textValue
    //         : contentData[0].content[0].contentAnswer,
    //     type: contentData[0].content[0].type,
    //   },
    // ];
    // const body = {
    //   trainingType: 'training',
    //   saveType: 'content',
    //   userid: user[0].userid,
    //   username: user[0].username,
    //   usertype: user[0].usertype,
    //   managerid: user[0].managerid,
    //   managername: user[0].managername,
    //   passcode: user[0].passcode,
    //   language: language,
    //   moduleid: moduleid,
    //   modulename: modulename,
    //   moduleOrder: moduleOrder,
    //   submoduleid: submoduleid,

    //   submoduleOrder: submoduleOrder,
    //   topicOrder: topicOrder,

    //   submodulename: submodulename,
    //   topicid: topicid,
    //   topicname: wholeData.topicname,
    //   contentData: contentData[0].contentData,
    //   contentQuestion: contentData[0].contentQuestion,
    //   contentAnswer: contentData[0].contentAnswer
    //     ? contentData[0].contentAnswer
    //     : '',
    //   timeTaken: '',
    //   topicDuration: '',
    //   textFeedback: '',
    //   topicPercentage: 25,
    //   // contentFeedback: text,
    //   // content_status: true,
    //   // worksheet: '',
    //   // worksheet_status: true,
    //   // video: '',
    //   // video_status: true,
    //   // quiz_status: false,
    //   quizData: contentData[0].quizData,
    //   assignmentQuestion: contentData[0].assignmentQuestion,
    //   // topic_percentage: '50%',
    // };
    // // console.log(
    // //   body,
    // //   'body training--------------------------------------------------------------------->',
    // // );

    // if (
    //   !contentData[0]?.contentAnswer ||
    //   contentData[0]?.contentAnswer?.length > 0
    // ) {
    //   // API.post(`savetchtraining/`, body).then(
    //   API.post(`saveTransContentQuizAssignment/`, body).then(
    //     response => {
    //       // console.log(
    //       //   response.data,
    //       //   'response.data.--------------------------------------------------------------------->',
    //       // );
    //       if (response.data.status == 'success') {
    //         const data = {
    //           userid: user[0].userid,
    //           usertype: user[0].usertype,
    //           trainingType: 'training',
    //           moduleid: moduleid,
    //           language: language,
    //         };
    //         // Do something when the screen is focused

    //         // console.log('datamonthly--->', data);
    //         dispatch(TrainingSliceNew.getContentDetailsstart({data}));
    //       }
    //       // if (response.data.status == 'success') {
    //       //   const d_data = {
    //       //     userid: user[0].userid,
    //       //     usertype: user[0].usertype,
    //       //     trainingType: 'training',
    //       //     moduleid: moduleid,
    //       //     language: language,
    //       //   };
    //       //   // console.log('data content--->', d_data);
    //       //   dispatch(TrainingSlice.getContentDetailsstart({d_data}));
    //       // }
    //       // const data1 = {
    //       //   userid: user[0].userid,
    //       //   usertype: user[0].usertype,
    //       //   moduleid: contentData[0].moduleid,
    //       //   language: language,
    //       //   passcode: user[0].passcode,
    //       //   managerid: user[0].managerid,
    //       //   userid: user[0].userid,
    //       //   managername: user[0].managername,
    //       // };
    //       // dispatch(TrainingSlice.getUserTrainingDetailsStart({data1}));
    //       // console.log('save response------->', response.data);
    //       // const data = {
    //       //   userid: user[0].userid,
    //       //   usertype: user[0].usertype,
    //       //   language: language,
    //       // };
    //       // dispatch(TrainingSlice.getModuleStart({data}));
    //       // if (response.data.status == 'success') {
    //       //   const data1 = {
    //       //     userid: user[0].userid,
    //       //     usertype: user[0].usertype,
    //       //     moduleid: contentData[0].moduleid,
    //       //     language: language,
    //       //     passcode: user[0].passcode,
    //       //     managerid: user[0].managerid,
    //       //     managername: user[0].managername,
    //       //   };
    //       //   dispatch(TrainingSlice.getUserTrainingDetailsStart({data1}));
    //       // }
    //     },
    //     err => {
    //       //
    //     },
    //   );
    //   navigation.goBack();
    //   // console.log('api call', content[0]?.contentAnswer);
    // } else if (contentData[0]?.contentAnswer == '') {
    //   Alert.alert(
    //     'Complete the Question and Answer Section.',
    //     '',
    //     [
    //       {
    //         text: 'OK',
    //         //   onPress: () => Alert.alert("Cancel Pressed"),
    //         // onPress: () => navigation.goBack(),
    //         style: 'cancel',
    //       },
    //     ],
    //     {
    //       cancelable: true,
    //       // onDismiss: () => navigation.goBack(),
    //     },
    //   );

    //   // console.log('alert call', content[0]?.contentAnswer);
    // } else {
    //   // console.log('cancel call', contentData[0]);
    // }
  };
  const onend_quiz = (secured_mark, total_mark, questions) => {
    const body = {
      trainingType: 'training',
      saveType: 'quiz',
      moduleid: moduleid,
      moduleOrder: moduleOrder,
      submoduleid: submoduleid,
      submoduleOrder: submoduleOrder,
      topicOrder: topicOrder,
      topicid: topicid,
      userid: user[0].userid,
      contentData: contentData[0].contentData,
      quizData: contentData[0].quizData,
      assignmentQuestion: contentData[0].assignmentQuestion,
      securedMarks: secured_mark,
      totalMarks: total_mark,
      timeTaken: 12,
      topicPercentage: 50,
    };
    // console.log('quizdata--->', body);
    API.post(`saveTransContentQuizAssignment/`, body).then(
      response => {
        if (response.data.status == 'success') {
          const data = {
            userid: user[0].userid,
            usertype: user[0].usertype,
            trainingType: 'training',
            moduleid: moduleid,
            language: language,
          };
          // Do something when the screen is focused

          // console.log('datamonthly--->', data);
          dispatch(TrainingSliceNew.getContentDetailsstart({data}));
        }
      },
      err => {
        //
      },
    );

    //
    // const data2 = {
    //   totalmark: total_mark,
    //   quiz: questions,
    //   quiz_status: true,
    //   score: secured_mark,
    //   topic_percentage: '100%',
    //   language: language,
    //   passcode: user[0].passcode,
    //   managerid: user[0].managerid,
    //   userid: user[0].userid,
    //   managername: user[0].managername,
    //   // quiz_completion_time: this.timeTaken,
    // };
    // const data1 = {
    //   trainingtype: 'training',
    //   userid: user[0].userid,
    //   usertype: user[0].usertype,
    //   username: user[0].username,
    //   managerid: user[0].managerid,
    //   managername: user[0].managername,
    //   passcode: user[0].passcode,
    //   preferedlanguage: language,
    //   moduleid: contentData[0].moduleid,
    //   modulename: contentData[0].modulename,
    //   submoduleid: contentData[0].submoduleid,
    //   submodulename: contentData[0].submodulename,
    //   topicid: contentData[0].topicid,
    //   topicname: contentData[0].topicname,
    //   securedmark: secured_mark,
    //   totalmark: total_mark,
    //   iscomplete: true,
    // };
    // //
    // API.put(
    //   `updatetchtraining/${user[0].userid}/${contentData[0].moduleid}/${contentData[0].topicid}`,
    //   data2,
    // ).then(
    //   response => {
    //     //
    //     if (response.data.status == 'success') {
    //       API.post(`savetrainingstatusdata/`, data1).then(
    //         response1 => {
    //           //
    //           API.get(
    //             `gettrainingoverallmarks/${user[0].userid}/${language}`,
    //           ).then(
    //             response2 => {
    //               const data1 = {
    //                 userid: user[0].userid,
    //                 usertype: user[0].usertype,
    //                 moduleid: contentData[0].moduleid,
    //                 language: language,
    //                 passcode: user[0].passcode,
    //                 managerid: user[0].managerid,
    //                 managername: user[0].managername,
    //               };
    //               dispatch(TrainingSlice.getUserTrainingDetailsStart({data1}));
    //               const d_data = {
    //                 userid: user[0].userid,
    //                 usertype: user[0].usertype,
    //                 language: language,
    //               };
    //               dispatch(TrainingSlice.getModuleStart({d_data}));
    //               // if (response1.data.status == 'success') {
    //               //   const data1 = {
    //               //     userid: user[0].userid,
    //               //     usertype: user[0].usertype,
    //               //     moduleid: data[0].moduleid,
    //               //     language: language,
    //               //   };
    //               //   dispatch(
    //               //     TrainingSlice.getUserTrainingDetailsStart({data1}),
    //               //   );
    //               // }
    //             },
    //             err => {
    //               //
    //             },
    //           );
    //         },
    //         err => {
    //           //
    //         },
    //       );
    //     }
    //   },
    //   err => {
    //     //
    //   },
    // );
  };

  const closeModal = () => {
    setCustomModal(false);
    navigation.goBack();
  };

  const buildLink = async () => {
    // const link = await dynamicLinks().buildShortLink({
    //   link: `https://thinkzone.in/=contentdetails?${data.moduleid}?${data.submoduleid}?${data.topicid}`,
    //   // domainUriPrefix is created in your Firebase console
    //   domainUriPrefix: `https://thinkzoneapp.page.link`,
    //   // optional setup which updates Firebase analytics campaign
    //   // "banner". This also needs setting up before hand
    //   analytics: {
    //     campaign: 'banner',
    //   },
    // });

    // return link;

    let link = await axios({
      method: 'POST',
      url: `https://firebasedynamiclinks.googleapis.com/v1/shortLinks?key=AIzaSyC_mMwlba3Rgb_Sgjh-pjK_9eWPw_z1cqw`,
      Headers: {
        'Content-Type': 'application/json',
      },
      data: {
        dynamicLinkInfo: {
          domainUriPrefix: 'https://thinkzoneapp.page.link',
          link: `https://thinkzone.in/=contentdetails?${data.moduleid}?${data.submoduleid}?${data.topicid}`,
          androidInfo: {
            androidPackageName: 'com.nrusingh.teacher_thinkzone1',
          },
          // iosInfo: {
          //   iosBundleId: 'com.example.ios',
          // },
        },
      },
    });

    if (link.status === 200) {
      return link.data.shortLink;
    }
  };
  const shareLink = async () => {
    let shareUrl;
    try {
      shareUrl = await buildLink();
      // dynamicLinks()
      //   .resolveLink(shareUrl)
      //   .then(link => {
      //
      //   });

      //
    } catch (error) {}
    try {
      if (shareUrl !== '') {
        const result = await Share.share({
          message: `Share your link ${shareUrl}`,
        });
      }
    } catch (error) {}
  };

  const logOutZoomState = (event, gestureState, zoomableViewEventObject) => {
    // console.log(
    //   `Zoomed from ${zoomableViewEventObject.lastZoomLevel} to  ${zoomableViewEventObject.zoomLevel}`,
    // );
  };

  const handleSaveFeedback = () => {
    const data = {
      trainingType: 'training',
      saveType: 'content',
      userid: user[0].userid,
      username: user[0].username,
      usertype: user[0].usertype,
      managerid: user[0].managerid,
      managername: user[0].managername,
      passcode: user[0].passcode,
      language: language,
      moduleid: moduleid,
      modulename: modulename,
      moduleOrder: moduleOrder,
      submoduleid: submoduleid,
      // contentStatus : "complete",
      submoduleOrder: submoduleOrder,
      topicOrder: topicOrder,
      submodulename: submodulename,
      topicid: topicid,
      topicname: wholeData.topicname,
      contentData: contentData[0].contentData,
      contentQuestion: contentData[0].contentQuestion,
      contentAnswer: contentData[0].contentAnswer
        ? contentData[0].contentAnswer
        : '',
      timeTaken: '',
      topicDuration: '',
      textFeedback: '',
      topicPercentage: 25,
      quizData: contentData[0].quizData,
      assignmentQuestion: contentData[0].assignmentQuestion,
      contentFeedback: text,
    };

    if (text.trim().length > 0) {
      API.post(`saveTransContentQuizAssignment`, data).then(suc => {
        API.get(
          // `ppt_getallcontents/${data_content.moduleid}/${data_content.submoduleid}/${data_content.topicid}/${language}`,
          //  `getalltrainingcontents/${user[0].usertype}/${submoduleid}/${submoduleid}/${topicid}/${language}`,
          `getContentQuizAssignment/${user[0].userid}/training/${route.params.data_type}/od/${moduleid}/${submoduleid}/${topicid}`,
        ).then(suc1 => {
          // console.log(
          //   suc1.data,
          //   'suc5---------------------------------------------->',
          // );
          if (suc1.data.length > 0) {
            setIsComplete(true);
          }
          err => {};
        });
        // console.log(
        //   suc.data,
        //   'datas--------------------------------------------------------------------------->',
        // );
        // setIsComplete(true);

        showMessage({
          message: `Successfully Completed`,
          description: 'Successfully topic completed.',
          type: 'success',
          backgroundColor: Colors.success,
        });
        err => {};
      });
      setModalVisible(!modalVisible);
      setModal(true);
      // dispatch(types.rewardsUserstart(user[0].userid));
    } else {
      Alert.alert('ଦୟାକରି ସଠିକ୍ ମତାମତ ଦିଅନ୍ତୁ ।');
    }
  };

  // const onChangeTextValue = event => {
  //   console.log('e---->', event);
  //   console.log('e---->', event.target.value);
  //   setTextValue(event.target.value);
  // };

  return (
    <>
      <Modal animationType="slide" transparent={true} visible={modal}>
        <View style={[styles.centeredView]}>
          {/* <View
                style={[
                  styles.modalView,
                  {
                    height: window.WindowHeigth * 0.25,
                    marginTop: -0,
                    width: window.WindowWidth * 0.5,
                  },
                ]}> */}
          <View
            style={[
              styles.modalView,
              {
                // height: window.WindowHeigth * 0.7,

                width: window.WindowWidth * 0.92,
                borderRadius: 20,
              },
            ]}>
            <Image
              style={[
                styles.tinyLogos,
                {
                  width: 250,
                  height: 220,
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginTop: -40,
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
                  // width: 200,`
                  alignSelf: 'center',
                },
              ]}>
              Congratulations! {''}
            </Text>
            <Text
              style={{
                color: 'black',
                fontWeight: '800',
                color: '#666666',
                textTransform: 'capitalize',
              }}>
              {user[0].username}
            </Text>

            <Text
              style={[
                styles.username,
                {
                  fontSize: 16,
                  color: '#666666',
                  fontWeight: '400',
                  fontFamily: 'serif',
                  marginTop: 10,
                },
              ]}>
              ଆପଣ ସଫଳତାର ସହ ଏହି ବିଷୟ ସମ୍ପୁର୍ଣ୍ଣ କରିଥିବାରୁ ୫ଟି
              କଏନ୍ ହାସଲ କରିଛନ୍ତି।
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
                  width: window.WindowWidth * 0.5,
                },
              ]}>
              <Text
                style={{
                  fontSize: 15,
                  // color: Color.white,
                  fontWeight: '900',
                  textAlign: 'center',
                  fontFamily: FontFamily.poppinsMedium,
                  color: 'white',
                }}>
                Check Reward
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => navigation.goBack()}
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
                  fontWeight: '900',
                  textAlign: 'center',
                  fontFamily: FontFamily.poppinsMedium,
                  color: Color.royalblue,
                }}>
                Skip for now
              </Text>
            </TouchableOpacity>
          </View>
        </View>
        {/* </View> */}
      </Modal>
      {isLoading ? (
        // <View>
        //   <PgeContentSkeleton />
        // </View>
        <ActivityIndicator
          size="large"
          color={Colors.primary}
          style={{justifyContent: 'center', alignSelf: 'center'}}
        />
      ) : (
        <View style={{flex: 1, marginBottom: 6}}>
          <>
            {contentData[0]?.contentData?.length == 0 &&
            contentData[0]?.quizData?.length == 0 ? (
              <Norecord />
            ) : (
              <>
                <View
                  style={{
                    backgroundColor: '#0060ca',
                    height: 66,
                    width: window.WindowWidth * 1.1,
                    marginTop: -16,
                    marginLeft: -1,
                  }}>
                  <Text
                    style={{
                      color: 'white',
                      fontSize: 20,
                      marginTop: 15,
                      textAlign: 'center',
                    }}>
                    {topicname}
                  </Text>
                </View>

                {/* <View>
              <StatusBar backgroundColor="#0060ca" />
              <View
                style={{
                  backgroundColor: '#0060ca',
                  height: 66,
                  width: window.WindowWidth * 1.1,
                  marginTop: -16,
                  marginLeft: -1,
                }}>
                <Text
                  style={{
                    color: 'white',
                    fontSize: 30,
                    marginTop: 15,
                    textAlign: 'center',
                  }}>
                  {route.params.data.topicname}
                </Text>
              </View>
            </View> */}
                {content_status && (
                  <ScrollView>
                    <ImageBackground
                      source={require('../assets/Photos/bg.jpg')}>
                      <FlatList
                        removeClippedSubviews={true}
                        maxToRenderPerBatch={10}
                        initialNumToRender={10}
                        updateCellsBatchingPeriod={40}
                        data={contentData}
                        renderItem={({item, index}) => (
                          // console.log('checkcontent------>', item),
                          <ReactNativeZoomableView
                            maxZoom={1.5}
                            minZoom={0.5}
                            zoomStep={0.5}
                            initialZoom={1}
                            bindToBorders={true}
                            onZoomAfter={logOutZoomState}
                            style={{
                              padding: 47,
                              paddingBottom: 53,
                              backgroundColor: Colors.white,
                            }}>
                            <HtmlContentCoponent
                              sourceData={item.contentData}
                            />
                            <Text
                              style={{
                                fontSize: 20,
                                fontWeight: 'bold',
                                color: 'black',
                                marginLeft: 8,
                              }}>
                              {item.contentQuestion ? (
                                <>
                                  <Text>1.</Text>{' '}
                                  <Text>{item.contentQuestion}</Text>
                                </>
                              ) : null}
                            </Text>

                            {item.contentAnswer?.length > 0 ? (
                              <View
                                style={{
                                  marginTop: 12,
                                  marginLeft: 12,
                                }}>
                                <Text
                                  style={{fontSize: 20, fontWeight: 'bold'}}>
                                  Answer : {item.contentAnswer}
                                </Text>
                              </View>
                            ) : item.contentAnswer?.length == 0 ? (
                              <TextInput
                                style={styles.input}
                                // onChangeText={onChangeTextValue}
                                // onChangeText={setTextValue}
                                onChangeText={textValue =>
                                  setTextValue(textValue)
                                }
                                // value={value}
                                value={textValue}
                              />
                            ) : null}

                            {/* {item.contentAnswer == '' ||
                          !item.contentAnswer ? (
                            <TextInput
                              style={styles.input}
                              // onChangeText={onChangeTextValue}
                              // onChangeText={setTextValue}
                              onChangeText={textValue =>
                                setTextValue(textValue)
                              }
                              // value={value}
                              value={textValue}
                            />
                          ) : (
                            item.contentAnswer
                          )} */}
                          </ReactNativeZoomableView>
                        )}
                      />
                      <View
                        style={
                          {
                            // marginTop: -20,
                            // paddingTop: 20,
                            // marginLeft: 10,
                          }
                        }>
                        <FabButton
                          image={require('../assets/Image/share.png')}
                          onPress={shareLink}
                        />
                        {contentData[0]?.contentStatus == 'complete' ? (
                          <TouchableOpacity
                            style={styles.button}
                            onPress={() => navigation.goBack()}>
                            <Text
                              style={{
                                textAlign: 'center',
                                fontSize: 15,
                                fontWeight: '700',
                                color: Colors.white,
                                fontFamily: FontFamily.poppinsMedium,
                              }}>
                              GO BACK
                            </Text>
                          </TouchableOpacity>
                        ) : (
                          <TouchableOpacity
                            style={styles.button}
                            onPress={handelContentSubmit}>
                            <Text
                              style={{
                                textAlign: 'center',
                                fontSize: 15,
                                fontWeight: '700',
                                color: Colors.white,
                                fontFamily: FontFamily.poppinsMedium,
                              }}>
                              Mark As Complete
                            </Text>
                          </TouchableOpacity>
                        )}
                      </View>
                    </ImageBackground>
                  </ScrollView>
                )}

                {quiz_status === true &&
                  // contentDetails[0].topicData[0].contentStatus ==
                  wholeData.contentStatus == 'incomplete' && (
                    <Modals
                      visible={customModal}
                      heading={'Please Complete the content.'}
                      backgroundColor={Colors.white}
                      onpressok={closeModal}
                      okstatus={true}
                    />
                  )}

                {quiz_status === true &&
                  wholeData.contentStatus == 'complete' && (
                    <>
                      {contentData[0]?.quizData.length > 0 ? (
                        <Quiz
                          questions={contentData[0].quizData}
                          onend_quiz={onend_quiz}
                          navigation={navigation}
                        />
                      ) : (
                        <Norecord />
                      )}
                    </>
                  )}
              </>
            )}
          </>

          {/* {modal && quiz_status && (
        <Popup
          style={{width: 500}}
          title={'Instruction'}
          subTitle={
            ' ଦିଆଯାଇଥିବା ସମସ୍ତ କୁଇଜ୍ ର ଉତ୍ତର ଦିଅନ୍ତୁ । ଧ୍ୟାନ ରଖିବେ ଦିଆଯାଇଥିବା ପାଞ୍ଚୋଟି କୁଇଜ୍ ମଧ୍ୟରୁ ଆପଣ ଅନ୍ଯୁନ ତିନୋଟି କୁଇଜ୍ ର ସଠିକ୍ ଉତ୍ତର ଦେବା ବାଧ୍ୟତାମୂଳକ, ନଚେତ୍ ଆପଣ ପରବର୍ତ୍ତୀ ମଡ୍ୟୁଲ୍ କୁ ଯାଇପାରିବେ ନାହିଁ। ଆମେ ଆଶା କରୁଛୁ ଆପଣ ସମସ୍ତ କୁଇଜ୍ ରେ ଭଲ ପ୍ରଦର୍ଶନ କରିବେ ।'
          }
        />
      )} */}

          {/* {quiz_status && (
        <>
          {data ? (
            <Quiz
              questions={data[0].quiz}
              onend_quiz={onend_quiz}
              navigation={navigation}
            />
          ) : (
            <Norecord />
          )}
        </>
      )} */}
          {/* {assignment_status && (
        
      )} */}
          <View style={styles.centeredViewFeedback}>
            <Modal
              animationType="slide"
              transparent={true}
              visible={modalVisible}
              // onRequestClose={() => {
              //   Alert.alert('Modal has been closed.');
              //   setModalVisible(!modalVisible);
              // }}
            >
              <View style={styles.centeredView}>
                <View style={styles.modalViewFeedback}>
                  <Text style={styles.modalText}>
                    ଆପଣ ପଢ଼ିଥିବା ବିଷୟ ଆପଣଙ୍କୁ କିପରି ଲାଗିଲା ସେ ସମ୍ବନ୍ଧରେ ନିଜର
                    ମତାମତ ଦିଅନ୍ତୁ ।
                  </Text>
                  <TextInput
                    underlineColorAndroid="transparent"
                    placeholder="ମତାମତ ଦିଅନ୍ତୁ"
                    placeholderTextColor="black"
                    numberOfLines={40}
                    multiline={true}
                    keyboardType="ascii-capable"
                    style={styles.input}
                    onChangeText={onChangeText}
                    value={text}
                  />
                  <Pressable
                    style={[
                      styles.buttonFeedback,
                      styles.buttonClose,
                      {marginTop: 20, marginLeft: -10},
                    ]}
                    onPress={handleSaveFeedback}>
                    <Text style={styles.textStyle}>SAVE</Text>
                  </Pressable>
                </View>
              </View>
            </Modal>
          </View>
        </View>
      )}
    </>
  );
};

export default ContentDetailsNew;

const styles = StyleSheet.create({
  button: {
    // justifyContent: 'center',
    // backgroundColor: Colors.blue,
    // height: 40,
    justifyContent: 'center',
    backgroundColor: '#0060ca',
    height: 40,
    width: window.WindowWidth * 0.5,
    left: '2%',
    borderRadius: 156,
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
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
  },
  //feedback modal style
  centeredViewFeedback: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  input: {
    height: window.WindowHeigth * 0.15,
    width: window.WindowWidth * 0.7,
    justifyContent: 'flex-start',
    borderWidth: 1,
    borderRadius: 12,
    textAlign: 'center',
    // height: 40,
    // margin: 12,
    // borderWidth: 1,
    // padding: 10,
    // paddingLeft: 56,
    // paddingRight: 56,
    // borderRadius: 12,
  },
  modalViewFeedback: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    // paddingLeft: 93,
    // paddingRight: 93,
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
  buttonFeedback: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
    marginTop: 12,
  },
  buttonOpen: {
    backgroundColor: '#F194FF',
  },
  buttonClose: {
    backgroundColor: '#2196F3',
  },
  textStyle: {
    color: 'white',
    width: 85,
    height: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    marginBottom: 15,
    color: 'black',
    fontWeight: '700',
    textAlign: 'center',
  },
});
