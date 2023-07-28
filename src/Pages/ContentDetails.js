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
  BackHandler,
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
import * as TrainingSlice from '../redux/slices/TrainingSlice';
import * as types from '../redux/slices/UserSlice';
import Popup from '../components/Popup';
import {useEffect} from 'react';
import Modals from '../components/Modals';
import Entypo from 'react-native-vector-icons/Entypo';
import FabButton from '../components/FabButton';
import dynamicLinks from '@react-native-firebase/dynamic-links';
import ReactNativeZoomableView from '@dudigital/react-native-zoomable-view/src/ReactNativeZoomableView';
import {FontFamily, Color} from '../GlobalStyle';

const ContentDetails = ({route, navigation}) => {
  const dispatch = useDispatch();

  const data = route.params.data;
  // console.log('datacontent----->', data);
  const [language, setLanguage] = useState('od');
  const [contentData, setContentData] = useState([]);
  // console.log('content------->', contentData[0]?.content);
  const [isLoading, setIsLoading] = useState(false);
  const user = useSelector(state => state.userdata.user?.resData);
  const [customModal, setCustomModal] = useState(true);
  const [quizModal, setQuizModal] = useState(
    route.params.data_type == 'quiz' ? true : false,
  );

  const [quiz_status, setQuiz_status] = useState(
    route.params.data_type == 'quiz' ? true : false,
  );
  const [content_status, setContent_status] = useState(
    route.params.data_type == 'content' ? true : false,
  );
  const [assignment_status, setAssignment_status] = useState(
    route.params.data_type == 'assignment' ? true : false,
  );
  const [textValue, setTextValue] = useState('');
  // console.log('textValue---->', textValue);
  // const [modal, setModal] = useState(true);

  const [modal, setModal] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    API.get(
      // `gettchtrainingdetails/${user[0].usertype}/geetareddy9040@gmail.com/1678707087741/1678707099565/1678707108985`,
      `gettchtrainingdetails/${user[0].usertype}/${user[0].userid}/${data.moduleid}/${data.submoduleid}/${data.topicid}`,
    )
      .then(res1 => {
        const datas = res1.data;
        if (datas == undefined || datas.length == 0) {
          API.get(
            `getalltrainingcontents/${user[0].usertype}/${data.moduleid}/${data.submoduleid}/${data.topicid}/${language}`,
          ).then(res => {
            const data1 = res.data;
            // console.log(data1, 'data1');
            setIsLoading(false);
            setContentData(res.data);
          });
        } else {
          setIsLoading(false);

          setContentData(res1.data);
        }
      })
      .catch(err => {});
  }, []);

  const handelContentSubmit = () => {
    const content = [
      {
        contentid: contentData[0].content[0].contentid,
        content: contentData[0].content[0].content,
        contentQuestion: contentData[0].content[0].contentQuestion,
        contentAnswer:
          contentData[0].content[0].contentAnswer == ''
            ? textValue
            : contentData[0].content[0].contentAnswer,
        type: contentData[0].content[0].type,
      },
    ];
    const body = {
      userid: user[0].userid,
      username: user[0].username,
      usertype: user[0].usertype,
      managerid: user[0].managerid,
      managername: user[0].managername,
      passcode: user[0].passcode,
      moduleid: contentData[0].moduleid,
      modulename: contentData[0].modulename,
      submoduleid: contentData[0].submoduleid,
      submodulename: contentData[0].submodulename,
      content: content,
      content_status: true,
      worksheet: '',
      worksheet_status: true,
      video: '',
      video_status: true,
      quiz_status: false,
      quiz: contentData[0].quiz,
      assignmentQuestion: contentData[0].assignmentQuestion,
      topicid: contentData[0].topicid,
      topicname: contentData[0]?.topicname,
      topic_percentage: '25%',
      language: language,
    };

    if (
      content[0]?.contentAnswer == undefined ||
      content[0].contentAnswer?.length > 0
    ) {
      API.post(`savetchtraining/`, body).then(
        response => {
          const data1 = {
            userid: user[0].userid,
            usertype: user[0].usertype,
            moduleid: contentData[0].moduleid,
            language: language,
            passcode: user[0].passcode,
            managerid: user[0].managerid,
            userid: user[0].userid,
            managername: user[0].managername,
          };
          dispatch(TrainingSlice.getUserTrainingDetailsStart({data1}));
          const d_data = {
            userid: user[0].userid,
            usertype: user[0].usertype,
            language: language,
          };
          dispatch(TrainingSlice.getModuleStart({d_data}));
          if (response.data.status == 'success') {
            const data1 = {
              userid: user[0].userid,
              usertype: user[0].usertype,
              moduleid: contentData[0].moduleid,
              language: language,
              passcode: user[0].passcode,
              managerid: user[0].managerid,
              managername: user[0].managername,
            };
            dispatch(TrainingSlice.getUserTrainingDetailsStart({data1}));
          }
        },
        err => {
          //
        },
      );
      navigation.goBack();
      // console.log('api call', content[0]?.contentAnswer);
    } else if (content[0]?.contentAnswer == '') {
      Alert.alert(
        'Complete the Question and Answer Section.',
        '',
        [
          {
            text: 'OK',
            //   onPress: () => Alert.alert("Cancel Pressed"),
            // onPress: () => navigation.goBack(),
            style: 'cancel',
          },
        ],
        {
          cancelable: true,
          // onDismiss: () => navigation.goBack(),
        },
      );

      // console.log('alert call', content[0]?.contentAnswer);
    } else {
      // console.log('cancel call', content[0]?.contentAnswer);
    }
  };
  const onend_quiz = (secured_mark, total_mark, questions) => {
    //
    const data2 = {
      totalmark: total_mark,
      quiz: questions,
      quiz_status: true,
      score: secured_mark,
      topic_percentage: '50%',
      language: language,
      passcode: user[0].passcode,
      managerid: user[0].managerid,
      userid: user[0].userid,
      managername: user[0].managername,
      // quiz_completion_time: this.timeTaken,
    };
    const data1 = {
      trainingtype: 'training',
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
    //
    API.put(
      `updatetchtraining/${user[0].userid}/${contentData[0].moduleid}/${contentData[0].topicid}`,
      data2,
    ).then(
      response => {
        if (response.data.status == 'success') {
          const data1 = {
            userid: user[0].userid,
            usertype: user[0].usertype,
            moduleid: contentData[0].moduleid,
            language: language,
            passcode: user[0].passcode,
            managerid: user[0].managerid,
            managername: user[0].managername,
          };
          dispatch(TrainingSlice.getUserTrainingDetailsStart({data1}));
        }
      },
      err => {
        //
      },
    );
  };

  const closeModal = () => {
    setCustomModal(false);
    navigation.goBack();
  };

  const buildLink = async () => {
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

  // const onChangeTextValue = event => {
  //   console.log('e---->', event);
  //   console.log('e---->', event.target.value);
  //   setTextValue(event.target.value);
  // };
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
                height: window.WindowHeigth * 0.7,

                width: window.WindowWidth * 0.8,
                borderRadius: 20,
                backgroundColor: '#00A3BF',
                // backgroundColor: '#74C5F4',
              },
            ]}>
            <Image
              style={[
                styles.tinyLogos,
                {
                  width: 150,
                  height: 150,
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginTop: -40,
                },
              ]}
              source={require('../assets/Photos/reward.png')}
            />

            <Text
              style={[
                styles.username,
                {
                  fontSize: 18,
                  color: 'white',
                  fontWeight: 'bold',
                  fontFamily: 'serif',

                  textTransform: 'capitalize',
                  alignSelf: 'center',
                },
              ]}>
              Congratulations! {''}
              <Text style={{color: 'black', fontWeight: '800', marginTop: 20}}>
                {user[0].username}
              </Text>
            </Text>
            <View style={{flexDirection: 'row'}}>
              <Text
                style={[
                  styles.username,
                  {
                    fontSize: 16,
                    color: 'white',
                    fontWeight: '400',
                    fontFamily: 'serif',
                    marginTop: 40,
                  },
                ]}>
                You have earned 5
              </Text>
              <Image
                style={{
                  width: 20,
                  height: 20,
                  marginTop: 42,
                }}
                source={require('../assets/Photos/star.png')}
              />
              {/* <FontAwesome5	
                  name="coins"	
                  size={27}	
                  color={'#FFD700'}	
                  style={[styles.icon, {marginRight: -40}]}	
                /> */}
              <Text
                style={[
                  styles.username,
                  {
                    fontSize: 16,
                    color: 'white',
                    fontWeight: '400',
                    fontFamily: 'serif',
                    marginTop: 40,
                  },
                ]}>
                Coins
              </Text>
            </View>

            <Text
              style={[
                styles.username,
                {
                  fontSize: 14,
                  color: 'white',
                  fontWeight: '400',
                  fontFamily: 'serif',
                  // marginTop: 10,
                },
              ]}>
              for Successfully Completed The Topic 🎉
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
                  // height: window.WindowHeigth * 0.1,
                },
              ]}>
              <Text
                style={{
                  fontSize: 15,
                  // color: Color.white,
                  fontWeight: '900',
                  textAlign: 'center',
                  fontFamily: 'serif',
                  color: 'white',
                }}>
                Check Reward
              </Text>
            </TouchableOpacity>
            <Pressable onPress={() => navigation.navigate('home')}>
              <Entypo
                name="circle-with-cross"
                size={55}
                color={Colors.white}
                style={{marginTop: 30}}
              />
            </Pressable>
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
            {contentData.length > 0 ? (
              <>
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
                      color: 'white',
                      fontSize: 20,
                      marginTop: 15,
                      textAlign: 'center',
                    }}>
                    {route.params.data.topicname}
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
                        data={contentData[0]?.content}
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
                              padding: 10,
                              paddingBottom: 53,
                              backgroundColor: Colors.white,
                            }}>
                            <HtmlContentCoponent sourceData={item.content} />
                            <Text
                              style={{
                                fontSize: 20,
                                fontWeight: 'bold',
                                color: 'black',
                                textAlign: 'center',
                              }}>
                              {item.contentHeading}
                            </Text>
                            <Text
                              style={{
                                fontSize: 20,
                                // fontWeight: 'bold',
                                color: 'black',
                                marginLeft: 8,
                              }}>
                              {item.contentQuestion ? (
                                <>
                                  {/* <Text>Q.</Text>{' '} */}
                                  <Text style={{fontSize: 17}}>
                                    {item.contentQuestion}
                                  </Text>
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
            ) : (
              <Norecord />
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
                          {/* <View
                            style={{
                              flex: 1,
                              alignItems: 'flex-end',
                              justifyContent: 'flex-start',
                            }}> */}

                          {/* </View> */}
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
        </View>
      )}
    </>
  );
};

export default ContentDetails;

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
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
});
