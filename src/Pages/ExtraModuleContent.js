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

const ExtraModuleContent = ({route, navigation}) => {
  const dispatch = useDispatch();

  const data = route.params.data;
  // console.log('data1----->', route.params.data);
  const {topicName, topicId, duration, topicOrder} = route.params.data;

  const [language, setLanguage] = useState('od');
  const [contentData, setContentData] = useState([]);
  // console.log('datacontent----->', contentData);
  const [topicQuiz, setTopicQuiz] = useState([]);
  // console.log('topicQuiz----->', topicQuiz);
  const [isLoading, setIsLoading] = useState(false);
  // console.log('isLoading--->', isLoading);
  const user = useSelector(state => state.userdata.user?.resData);
  //console.log('user----->', user);
  const contentDetails = useSelector(
    state => state.trainingdataNew.contentDetails,
  );

  const [customModal, setCustomModal] = useState(true);

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
  //ExtraModule Content
  useEffect(() => {
    setIsLoading(true);

    API.get(
      `getTchExtraModulesContent/${user[0].userid}/${user[0].usertype}/${topicId}`,
    ).then(res => {
      const data1 = res.data;
      // console.log(data1, 'data1');
      setIsLoading(false);
      //Object to array of object
      setContentData(prevArray => [...prevArray, res.data.resData]);
    });

    API.get(
      `getTchExtraModulesQuiz/${user[0].userid}/${user[0].usertype}/${topicId}`,
    ).then(response => {
      // console.log('responsequiz----->', response.data);
      setTopicQuiz(response.data.resData.quizData);
    });

    // API.get(
    //   `getTchExtraModulesContent/${user[0].userid}/${user[0].usertype}/${topicId}`,
    // )
    //   .then(res1 => {
    //     const datas = res1.data;
    //     if (datas == undefined || datas.length == 0) {
    //       API.get(
    //         `getTchExtraModulesContent/${user[0].userid}/${user[0].usertype}/${topicId}`,
    //       ).then(res => {
    //         const data1 = res.data;
    //         console.log(data1, 'data1');
    //         setIsLoading(false);
    //         setContentData(prevArray => [...prevArray, res1.data.resData]);
    //       });
    //     } else {
    //       setIsLoading(false);
    //       setContentData(prevArray => [...prevArray, res1.data.resData]);
    //     }
    //   })
    //   .catch(err => {});
  }, []);

  const handelContentSubmit = () => {
    const body = {
      userid: user[0].userid,
      topicId,
      contentData: contentData,
      contentFeedback: {
        feedback: 'new feedback functionality to be done',
      },
      contentStatus: 'complete',
    };
    // console.log('extrabodycontent---->', body);
    API.post(`saveTransTchExtraModulesContent`, body).then(response => {
      // console.log('responsecontent------->', response.data);
    });
    navigation.goBack();
  };
  const onend_quiz = (secured_mark, total_mark, questions) => {
    const body = {
      userid: user[0].userid,
      topicId,
      quizData: topicQuiz,
      quizStatus: 'complete',
      securedMarks: secured_mark,
      totalMarks: total_mark,
    };
    // console.log('extrabodyquiz---->', body);
    API.post(`saveTransTchExtraModulesQuiz`, body).then(response => {
      // console.log('responsequiz------->', response.data);
    });
  };

  const closeModal = () => {
    setCustomModal(false);
    navigation.goBack();
  };

  const buildLink = async () => {
    // const link = await dynamicLinks().buildShortLink({
    //   link: `https://thinkzone.in/=contentdetails?${data.moduleid}?${data.submoduleid}?${data.topicId}`,
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
          link: `https://thinkzone.in/=contentdetails?${data.moduleid}?${data.submoduleid}?${data.topicId}`,
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
            {Object.keys(contentData)?.length == 0 &&
            Object.keys(contentData)?.length == 0 ? (
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
                    {topicName}
                  </Text>
                </View>

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
                            {/* <Text
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
                            ) : null} */}
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

                {/* {quiz_status === true && (
                  // wholeData.contentStatus == 'incomplete' &&
                  <Modals
                    visible={customModal}
                    heading={'Please Complete the content.'}
                    backgroundColor={Colors.white}
                    onpressok={closeModal}
                    okstatus={true}
                  />
                )} */}

                {
                  quiz_status === true && (
                    //   wholeData.contentStatus == 'complete' && (
                    <>
                      {topicQuiz.length > 0 ? (
                        <Quiz
                          questions={topicQuiz}
                          onend_quiz={onend_quiz}
                          navigation={navigation}
                        />
                      ) : (
                        <Norecord />
                      )}
                    </>
                  )
                  //   )
                }
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
        </View>
      )}
    </>
  );
};

export default ExtraModuleContent;

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
});
