import {
  FlatList,
  StyleSheet,
  Text,
  View,
  // TouchableOpacity,
  ScrollView,
  Alert,
  Modal,
  TouchableOpacity,
  Image,
  ImageBackground,
  ActivityIndicator,
  ToastAndroid,
  TextInput,
  Share,
  Pressable,
  StatusBar,
  BackHandler,
} from 'react-native';
import axios from 'axios';
import API from '../environment/Api';
import FabButton from '../components/FabButton';
import React, {useEffect, useState} from 'react';
import dynamicLinks from '@react-native-firebase/dynamic-links';
import Quiz from '../components/Quiz';
import Popup from '../components/Popup';
import Modals from '../components/Modals';
import HtmlContentCoponent from '../components/HtmlContentCoponent';
import Colors from '../utils/Colors';
import {useSelector, useDispatch} from 'react-redux';
import PgeContentSkeleton from '../skeletons/PgeContentSkeleton';
import * as TrainingSlice from '../redux/slices/TrainingSlice';
import Norecord from '../components/Norecord';
import Entypo from 'react-native-vector-icons/Entypo';
import ReactNativeZoomableView from '@dudigital/react-native-zoomable-view/src/ReactNativeZoomableView';
import {Color, FontFamily, FontSize, Border} from '../GlobalStyle';
import * as window from '../utils/dimensions';

const PptContentDetails = ({route, navigation}) => {
  // console.log('pptcontentdetails---->', route);
  // console.log('pptcontentdetails2---->', route.params.data.modulename);
  const dispatch = useDispatch();
  const data_content = route.params.data;

  const [language, setLanguage] = useState('od');
  const user = useSelector(state => state.userdata.user?.resData);
  const [quiz_status, setQuiz_status] = useState(
    route.params.data_type == 'quiz' ? true : false,
  );
  const [content_status, setContent_status] = useState(
    route.params?.data_type == 'content' ? true : false,
  );
  const [contentData, setContentData] = useState([]);
  //
  const [quizModal, setQuizModal] = useState(
    route.params.data_type == 'quiz' ? true : false,
  );

  const [modalVisible, setModalVisible] = useState(false);
  const [text, onChangeText] = useState('');
  const [quizData, setQuizData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [modal, setModal] = useState(false);
  const [customModal, setCustomModal] = useState(true);
  const [quizPupStatus, setQuizPupStatus] = useState(
    quiz_status && contentData[0]?.content_status != true ? true : false,
  );
  useEffect(() => {
    setIsLoading(true);
    API.get(
      `ppt_trans_gettopicdetails/${user[0].userid}/${data_content.moduleid}/${data_content.submoduleid}/${data_content.topicid}`,
    )
      .then(res1 => {
        const data = res1.data;

        if (data == undefined || data.length == 0) {
          API.get(
            `ppt_getallcontents/${data_content.moduleid}/${data_content.submoduleid}/${data_content.topicid}/${language}`,
          ).then(res => {
            setIsLoading(false);
            const data1 = res.data;

            setContentData(res.data);
          });
        } else {
          // setSubModulesData(data);
          setIsLoading(false);
          setContentData(res1.data);
        }
      })
      .catch(err => {});
  }, []);
  const closeModal = () => {
    setCustomModal(false);
    navigation.goBack();
  };
  const handelContentSubmit = () => {
    const {userid, username, usertype} = user[0];
    const body = {
      userid,
      username,
      usertype,
      managerid: user[0].managerid,
      managername: user[0].managername,
      passcode: user[0].passcode,
      moduleid: contentData[0].moduleid,
      modulename: contentData[0].modulename,
      submoduleid: contentData[0].submoduleid,
      submodulename: contentData[0].submodulename,
      content: contentData[0].content,
      content_status: true,
      worksheet: '',
      worksheet_status: true,
      video: '',
      video_status: true,
      quiz_status: false,
      quiz: contentData[0].quiz,
      topicid: contentData[0].topicid,
      topicname: contentData[0].topicname,
      topic_percentage: '50%',
      language: language,
    };

    API.post(`ppt_trans_saverecord/`, body).then(
      response => {
        //
        // setIsloading(false);
        const data1 = {
          userid: user[0].userid,
          usertype: user[0].usertype,
          moduleid: contentData[0].moduleid,
          language: language,
        };
        dispatch(TrainingSlice.getPPTUserTrainingDetailsStart({data1}));
        const d_data = {
          userid: user[0].userid,
          usertype: user[0].usertype,
          language: language,
        };
        dispatch(TrainingSlice.getPPTModuleStart({d_data}));

        if (response.data.status == 'success') {
          // setModal(true);
          dispatch(types.rewardsUserstart(user[0].userid));
          // Alert.alert(
          //   ' Congratulations!  you  Successfully Completed the  Successfully Completed .',
          //   '{data[0].topicname}',
          //   [
          //     {
          //       text: 'OK',
          //       //   onPress: () => Alert.alert("Cancel Pressed"),
          //       // onPress: () => navigation.goBack(),
          //       style: 'cancel',
          //     },
          //   ],
          //   {
          //     cancelable: true,
          //     // onDismiss: () => navigation.goBack(),
          //   },
          // );
        }
      },
      err => {},
    );
    navigation.goBack();
  };
  const onend_quiz = (
    secured_mark,
    total_mark,
    questions,
    currentOptionSelected,
  ) => {
    //
    const data2 = {
      totalmark: total_mark,
      quiz_status: true,
      quiz: questions,
      score: secured_mark,
      topic_percentage: '100%',
      language: language,
      //selectedOption: currentOptionSelected,

      // quiz_completion_time: this.timeTaken,
    };

    const data1 = {
      trainingtype: 'ppt',
      userid: user[0].userid,
      usertype: user[0].usertype,
      username: user[0].username,
      managerid: user[0].managerid,
      managername: user[0].managername,
      passcode: user[0].passcode,
      preferedlanguage: language,
      moduleid: contentData[0].moduleid,
      modulename: contentData[0].modulename,
      submoduleid: contentData[0].submoduleid,
      submodulename: contentData[0].submodulename,
      topicid: contentData[0].topicid,
      topicname: contentData[0].topicname,
      securedmark: secured_mark,
      totalmark: total_mark,
      iscomplete: true,
    };

    API.put(
      `ppt_trans_updaterecord/${user[0].userid}/${contentData[0].moduleid}/${contentData[0].topicid}`,
      data2,
    ).then(
      response2 => {
        //
        setIsLoading(false);
        if (response2.data.status == 'success') {
          API.post(`savetrainingstatusdata/`, data1).then(
            response1 => {
              setIsLoading(false);
              API.get(
                `ppt_trans_getoverallstatus/${user[0].userid}/${language}`,
              ).then(
                response3 => {
                  const data1 = {
                    userid: user[0].userid,
                    usertype: user[0].usertype,
                    moduleid: contentData[0].moduleid,
                    language: language,
                  };
                  dispatch(
                    TrainingSlice.getPPTUserTrainingDetailsStart({data1}),
                  );
                  const d_data = {
                    userid: user[0].userid,
                    usertype: user[0].usertype,
                    language: language,
                  };
                  dispatch(TrainingSlice.getPPTModuleStart({d_data}));
                  //
                },
                err => {},
              );
            },
            err => {},
          );
        }
      },
      err => {},
    );
  };

  const buildLink = async () => {
    // console.log(
    //   data_content.moduleid,
    //   data_content.submoduleid,
    //   data_content.topicid,
    //   'buildlink',
    // );
    // const link = await dynamicLinks().buildShortLink({
    //   link: `https://thinkzone.in/=preprogram_training_content?${data_content.moduleid}?${data_content.submoduleid}?${data_content.topicid}`,
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
          link: `https://thinkzone.in/=preprogram_training_content?${data_content.moduleid}?${data_content.submoduleid}?${data_content.topicid}`,
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
  const handleBackButton = () => {
    if (quizModal) {
      setQuizModal(false);
      return true; // Prevent default back button behavior
    }
    return false; // Allow default back button behavior
  };

  // ...
  const back = async () => {
    Alert.alert(
      'ଧ୍ୟାନ ଦିଅନ୍ତୁ!',
      'ଆପଣ ନିବେଶ କରିଥିବା ତଥ୍ୟ Save ହେବ ନାହିଁ। ଆପଣ ଏହା ଅବଗତ ଅଛନ୍ତି ତ?',
      [
        {
          text: 'Cancel',
          onPress: () => null,
          style: 'default',
        },
        {text: 'Ok', onPress: () => navigation.goBack(), style: 'default'},
      ],
    );
  };

  // Add event listeners when the component mounts
  useEffect(() => {
    BackHandler.addEventListener('hardwareBackPress', handleBackButton);

    // Clean up event listeners when the component unmounts
    return () => {
      BackHandler.removeEventListener('hardwareBackPress', handleBackButton);
    };
  }, []);

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
        <View style={{flex: 1, marginBottom: -12}}>
          <>
            <View>
              <StatusBar backgroundColor="#0060ca" />
              <View
                style={{
                  backgroundColor: '#0060ca',
                  // height: 66,
                  width: window.WindowWidth * 1.2,
                  paddingBottom: 10,
                  // marginTop: -16,

                  // marginLeft: -10,
                  alignSelf: 'center',
                  // paddingLeft: 29,
                  // marginRight: -69,
                }}>
                <Text
                  style={{
                    // paddingLeft: -95,
                    color: 'white',
                    fontSize: 20,
                    marginTop: 15,
                    // marginLeft: 12,
                    // justifyContent: 'center',
                    // alignItems: 'center',
                    textAlign: 'center',
                  }}>
                  {route.params.data.topicname}
                </Text>
              </View>
            </View>
            {content_status && (
              <ScrollView>
                <ImageBackground source={require('../assets/Photos/bg.jpg')}>
                  {/* <View
                      style={{
                        backgroundColor: Colors.primary,
                        height: 56,
                        width: 994,
                        marginLeft: 8,
                      }}>
                      <Text style={{color: 'white'}}>
                        {route.params.data.topicname}
                      </Text>
                    </View> */}
                  <ReactNativeZoomableView
                    maxZoom={1.5}
                    minZoom={0.5}
                    zoomStep={0.5}
                    initialZoom={1}
                    bindToBorders={true}
                    onZoomAfter={logOutZoomState}
                    style={{
                      padding: 10,
                      backgroundColor: Colors.white,
                    }}>
                    <FlatList
                      removeClippedSubviews={true}
                      maxToRenderPerBatch={10}
                      initialNumToRender={10}
                      updateCellsBatchingPeriod={40}
                      data={contentData[0]?.content}
                      renderItem={({item, index}) => (
                        <HtmlContentCoponent sourceData={item.content} />
                      )}
                    />
                  </ReactNativeZoomableView>
                  {/* <FlatList
                removeClippedSubviews={true}
                maxToRenderPerBatch={10}
                initialNumToRender={10}
                updateCellsBatchingPeriod={40}
                data={data[0].content}
                renderItem={({item, index}) => (
                  <HtmlContentCoponent sourceData={item.content} />
                )}
              /> */}
                  {/* <TouchableOpacity
                style={styles.button}
                onPress={handelContentSubmit}>
                <Text
                  style={{
                    textAlign: 'center',
                    fontSize: 20,
                    fontWeight: '900',
                    color: Colors.white,
                  }}>
                  SAVE
                </Text>
              </TouchableOpacity> */}
                  <View
                    style={{
                      paddingBottom: 30,
                      // paddingTop: 20,
                      // marginTop: 20,
                      // paddingTop: 20,
                      // marginLeft: 10,
                    }}>
                    <FabButton
                      image={require('../assets/Image/share.png')}
                      onPress={shareLink}
                    />
                    {contentData[0]?.content_status ? (
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

          {quiz_status === true && contentData[0]?.content_status != true && (
            <Modals
              visible={customModal}
              heading={'Please Complete the content.'}
              backgroundColor={Colors.white}
              onpressok={closeModal}
              okstatus={true}
            />
          )}

          {quiz_status === true &&
            quizModal === true &&
            contentData[0]?.content_status == true && (
              <>
                {contentData[0]?.quiz.length > 0 ? (
                  <Modal
                    animationType="slide"
                    transparent={true}
                    onRequestClose={() => back()}
                    visible={quizModal}>
                    <View style={[styles.centeredView]}>
                      <View
                        style={[
                          styles.modalView,
                          {
                            height: window.WindowHeigth * 1,
                            // marginTop: -0,
                            top: -10,
                            width: window.WindowWidth * 2,
                          },
                        ]}>
                        <View style={{alignSelf: 'center', right: '27%'}}>
                          <Quiz
                            questions={contentData[0].quiz}
                            onend_quiz={onend_quiz}
                            navigation={navigation}
                          />
                        </View>
                      </View>
                    </View>
                    {/* </View> */}
                  </Modal>
                ) : (
                  <Norecord />
                )}
              </>
            )}
               
        </View>
      )}
    </>
    // </ReactNativeZoomableView>
  );
};

export default PptContentDetails;

const styles = StyleSheet.create({
  button: {
    // justifyContent: 'center',
    // backgroundColor: Colors.blue,
    // height: 40,
    // // paddingBottom: 18,
    // marginBottom: 20,
    // marginTop: -20,/
    justifyContent: 'center',
    backgroundColor: '#0060ca',
    height: 40,
    width: window.WindowWidth * 0.5,
    left: '2%',
    borderRadius: 156,
    // paddingBottom: 20,
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
