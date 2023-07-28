import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Alert,
  ImageBackground,
  Image,
  TouchableOpacity,
  Pressable,
  TextInput,
  Modal,
  ActivityIndicator,
  Share,
} from 'react-native';
import axios from 'axios';
import dynamicLinks from '@react-native-firebase/dynamic-links';
import FabButton from '../components/FabButton';
import Entypo from 'react-native-vector-icons/Entypo';
import * as window from '../utils/dimensions';
import * as types from '../redux/slices/UserSlice';
import React, {useState, useEffect} from 'react';
import {useRef} from 'react';
import HtmlContentCoponent from '../components/HtmlContentCoponent';
import {useDispatch, useSelector} from 'react-redux';
import API from '../environment/Api';
import {showMessage} from 'react-native-flash-message';
import Colors from '../utils/Colors';
import Norecord from '../components/Norecord';
import {useTranslation} from 'react-i18next';
import {Color, FontSize, FontFamily, Border} from '../GlobalStyle';

import ReactNativeZoomableView from '@dudigital/react-native-zoomable-view/src/ReactNativeZoomableView';

const EcContent = ({route, navigation}) => {
  const {t} = useTranslation();
  const dispatch = useDispatch();
  const user = useSelector(state => state.userdata.user?.resData);
  const dataEce = route.params;

  // console.log(
  //   dataEce.contentDetails.length,
  //   'dataEce length-------------------------------------->',
  // );
  // console.log(
  //   dataEce.contentDetails[0].segment,
  //   'dataEce-------------------------------------->',
  // );
  // const {class, contentDetails}=route.params
  const scrollViewRef = useRef(null);
  const [data, setData] = useState('');
  const [isComplete, setIsComplete] = useState(false);
  const [modal, setModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [content_data, setContent_data] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [text, onChangeText] = useState('');

  const isCloseToBottom = ({layoutMeasurement, contentOffset, contentSize}) => {
    const paddingToBottom = 20;
    return (
      layoutMeasurement.height + contentOffset.y >=
      contentSize.height - paddingToBottom
    );
  };
  useEffect(() => {
    //
    API.get(
      `getmasterpgeactivitiydetails/od/ece/na/${route.params.class}/${route.params.contentDetails}/null`,
      // `/getEceActivities/${user[0].userid}/${studentClass}/${item} `,
    ).then(suc => {
      //
      setContent_data(suc.data);
      setIsLoading(false);
      API.get(
        // `getmasterpgeactivitiydetailsnostage/od/ece/${dataEce.contentDetails[0].themeid}/${dataEce.contentDetails[0].class}/null`,
        `tchactivitynew_getactivitiydetails/od/${user[0].userid}/ece/na/${
          route.params.contentDetails
        }/${null}/${route.params.class}`,
      ).then(suc => {
        // console.log(
        //   suc.data,
        //   'suc5---------------------------------------------->',
        // );
        if (suc.data.length > 0) {
          setIsComplete(true);
        }
        err => {};
      });
      err => {
        //
      };
    });
  }, []);
  // data.length > 0 ? (
  //   API.get(
  //     `tchactivitynew_getactivitiydetails/${dataEce[0].preferedlanguage}/${
  //       user[0].userid
  //     }/${dataEce[0].program}/${'na'}/${
  //       route.params.contentDetails[0].skillid
  //     }/${null}/${dataEce[0].class}`,
  //   ).then(suc => {
  //     console.log(
  //       suc.data,
  //       'suc5---------------------------------------------->',
  //     );
  //     if (suc.data.length > 0) {
  //       setIsComplete(true);
  //     }
  //     err => {
  //
  //     };
  //   })
  // ) : (
  //   <Norecord />
  // );

  const submitFun = () => {
    //

    setModalVisible(true);
  };

  const handleSaveFeedback = () => {
    const data = {
      userid: user[0].userid,
      username: user[0].username,
      usertype: user[0].usertype,
      managerid: user[0].managerid,
      passcode: user[0].passcode,
      complete: true,
      level: route.params.class,
      month: content_data[0].themeid,
      preferedlanguage: 'od',
      program: 'ece',
      subject: 'na',
      week: null,
      feedback: text,
    };

    if (text.trim().length > 0) {
      API.post(`tchactivitynew_saveactivity`, data).then(suc => {
        API.get(
          // `getmasterpgeactivitiydetailsnostage/od/ece/${dataEce.contentDetails[0].themeid}/${dataEce.contentDetails[0].class}/null`,
          `tchactivitynew_getactivitiydetails/od/${user[0].userid}/ece/na/${
            dataEce.contentDetails
          }/${null}/${dataEce.class}`,
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
      dispatch(types.rewardsUserstart(user[0].userid));
    } else {
      Alert.alert('ଦୟାକରି ସଠିକ୍ ମତାମତ ଦିଅନ୍ତୁ ।');
    }
  };
  const logOutZoomState = (event, gestureState, zoomableViewEventObject) => {
    // console.log(
    //   `Zoomed from ${zoomableViewEventObject.lastZoomLevel} to  ${zoomableViewEventObject.zoomLevel}`,
    // );
  };

  const buildLink = async () => {
    // const link = await dynamicLinks().buildShortLink({
    //   link: `https://thinkzone.in/=eccontent?${dataEce.contentDetails}?${dataEce.studentClass}`,
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
          link: `https://thinkzone.in/=eccontent?${dataEce.contentDetails}?${dataEce.class}`,
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

  return (
    <>
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
        <Modal animationType="slide" transparent={true} visible={modal}>
          <View style={styles.centeredView}>
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
                    // justifyContent: 'center',
                    textTransform: 'capitalize',
                    textAlign: 'center',
                    // width: 200,
                    alignSelf: 'center',
                  },
                ]}>
                Congratulations!
              </Text>

              <Text
                style={{
                  color: 'black',
                  fontWeight: '800',
                  color: '#666666',
                  textTransform: 'capitalize',
                  alignSelf: 'center',
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
                ଆପଣ ସଫଳତାର ସହ ଏହି ବିଷୟ ସମ୍ପୁର୍ଣ୍ଣ କରିଥିବାରୁ ୨ଟି
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
        </Modal>
        <View style={{flex: 1, marginBottom: 6}}>
          {isLoading ? (
            <ActivityIndicator
              size="large"
              color={Colors.primary}
              style={{justifyContent: 'center', alignSelf: 'center'}}
            />
          ) : (
            <>
              {data.contents == null ? (
                <>
                  <View
                    style={{
                      backgroundColor: '#0060ca',
                      height: 66,
                      width: window.WindowWidth * 1.1,
                      marginTop: -16,
                      marginLeft: -20,
                    }}>
                    <Text
                      style={{
                        color: 'white',
                        fontSize: 20,
                        marginTop: 15,
                        textAlign: 'center',
                      }}>
                      {t(`${route.params.contentDetails}`)}
                      {/* {eceHeading.map(x => x.header)} */}
                    </Text>
                  </View>
                  <ScrollView
                    // onScroll={({nativeEvent}) => {
                    //   if (isCloseToBottom(nativeEvent)) {
                    //     Alert.alert(
                    //       'Successfully Complete.',
                    //       'Continue to Quiz',
                    //       [
                    //         {
                    //           text: 'Cancel',
                    //           // onPress: () => Alert.alert('Cancel Pressed'),
                    //           style: 'destructive',
                    //         },
                    //         {
                    //           text: 'OK',
                    //           onPress: () => submitFun(),
                    //           style: 'destructive',
                    //         },
                    //       ],
                    //       {cancelable: false},
                    //     );
                    //   }
                    // }}
                    scrollEventThrottle={400}>
                    {/* <HtmlContentCoponent
            sourceData={route.params.contentDetails[0].segment[0].value}
          /> */}
                    <ImageBackground
                      source={require('../assets/Photos/bg.jpg')}>
                      {content_data?.length > 0 ? (
                        <>
                          <HtmlContentCoponent
                            sourceData={content_data[0].segment[0].value}
                          />
                          <View
                            style={
                              {
                                // marginTop: 40,
                                // paddingTop: 50,
                                // marginLeft: 10,
                              }
                            }>
                            <FabButton
                              image={require('../assets/Image/share.png')}
                              onPress={shareLink}
                            />
                            {isComplete ? (
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
                                onPress={submitFun}>
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
                        </>
                      ) : (
                        <Norecord />
                      )}
                    </ImageBackground>
                  </ScrollView>
                </>
              ) : (
                <Norecord />
              )}
            </>
          )}

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
      </ReactNativeZoomableView>
    </>
  );
};

export default EcContent;

const styles = StyleSheet.create({
  button: {
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

const eceHeading = [
  {key: 1, header: 'ମୁଁ ଓ ମୋ ପରିବାର'},
  {key: 2, header: 'ମୋ ଘର'},
  {key: 3, header: 'ବୃତ୍ତି/ବେଉସା'},
  {key: 4, header: 'ପଶୁପକ୍ଷୀ'},
  {key: 4, header: 'ଗଛ,ପତ୍ର, ଫୁଲ, ଫଳ'},
  {key: 5, header: 'ବିଭିନ୍ନ ଋତୁ'},
  {key: 6, header: 'ଯାନବାହନ'},
  {key: 7, header: 'ମୋ ପ୍ରାକୃତିକ ପରିବେଶ'},
  {key: 8, header: 'ମୋ ସାମାଜିକ ପରିବେଶ'},
  {key: 9, header: 'ମୋ ସ୍ୱାସ୍ଥ୍ୟ ଓ ସୁରକ୍ଷା'},
];
