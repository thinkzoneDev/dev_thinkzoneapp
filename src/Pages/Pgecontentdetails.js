import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Alert,
  ImageBackground,
  Image,
  TouchableOpacity,
  Modal,
  TextInput,
  Pressable,
  Share,
  ActivityIndicator,
} from 'react-native';
import axios from 'axios';
import dynamicLinks from '@react-native-firebase/dynamic-links';
import Entypo from 'react-native-vector-icons/Entypo';
import * as window from '../utils/dimensions';
import React, {useState, useEffect} from 'react';
import * as types from '../redux/slices/UserSlice';
import ContentImageDetails from '../components/ContentImageComponent';
import API from '../environment/Api';
import HtmlContentCoponent from '../components/HtmlContentCoponent';
import {useDispatch, useSelector} from 'react-redux';
import PgeContentSkeleton from '../skeletons/PgeContentSkeleton';
import Norecord from '../components/Norecord';
import Colors from '../utils/Colors';
import FabButton from '../components/FabButton';
import {FontFamily, Color} from '../GlobalStyle';

import ReactNativeZoomableView from '@dudigital/react-native-zoomable-view/src/ReactNativeZoomableView';
const Pgecontentdetails = ({route, navigation}) => {
  const data = route.params;
  // console.log('data------>', data);
  const dispatch = useDispatch();
  // console.log(
  //   data.length,
  //   'data------------------------------------------------------------->',
  // );
  //
  // console.log(
  //   data.length,
  //   'data------------------------------------------------------------->',
  // );
  //
  const [completeStatus, setCompleteStatus] = useState(false);
  // console.log(
  //   'completeStatus---------------------------------------------->',
  //   completeStatus,
  // );
  const [language, setLanguage] = useState('od');
  const [isLoading, setIsloading] = useState(true);
  const [modal, setModal] = useState(false);
  const [content_data, setContent_data] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [text, onChangeText] = useState('');
  // console.log('text---->', text);
  // console.log('text2---->', text.length);

  const user = useSelector(state => state.userdata.user?.resData);

  useEffect(() => {
    API.get(
      `getmasterpgeactivitiydetailsnostage/${data.preferedlanguage}/${data.program}/${data.subject}/${data.class}/${data.skillsetid}`,
    ).then(suc => {
      setContent_data(suc.data);
      setIsloading(false);
      err => {
        //
      };
    });
  }, []);

  {
    content_data.length > 0 ? (
      API.get(
        `tchactivitynew_getactivitiydetails/${content_data[0]?.preferedlanguage}/${user[0].userid}/${content_data[0]?.program}/${content_data[0]?.subject}/${content_data[0]?.skillsetid}/${content_data[0]?.skillsetid}/${content_data[0]?.class}`,
      ).then(suc => {
        //
        if (suc.data.length > 0) {
          setCompleteStatus(true);
          setIsloading(false);
        }
        err => {};
      })
    ) : (
      <Norecord />
    );
  }

  //
  const getStatus = () => {
    setModalVisible(true);
  };

  const handleSaveFeedback = () => {
    if (completeStatus) {
      //
    } else {
      if (text.trim().length > 0) {
        let body = {
          preferedlanguage: content_data[0].preferedlanguage,
          passcode: user[0].passcode,
          managerid: user[0].managerid,
          userid: user[0].userid,
          managername: user[0].managername,
          program: content_data[0].program,
          subject: content_data[0].subject,
          month: content_data[0].skillsetid,
          week: content_data[0].skillsetid,
          feedback: text.trim(),
          // skill: this.skill,
          level: content_data[0].class,
          complete: true,
        };

        API.post(`tchactivitynew_saveactivity`, body).then(suc => {
          //
          setIsloading(false);

          err => {};
        });
        setModalVisible(!modalVisible);
        setModal(true);
        dispatch(types.rewardsUserstart(user[0].userid));
      } else {
        Alert.alert('ଦୟାକରି ସଠିକ୍ ମତାମତ ଦିଅନ୍ତୁ ।');
      }
    }
  };
  const buildLink = async () => {
    // const link = await dynamicLinks().buildShortLink({
    //   link: `https://thinkzone.in/=Content?${data.preferedlanguage}?${data.program}?${data.subject}?${data.class}?${data.skillsetid}`,
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
          link: `https://thinkzone.in/=Content?${data.preferedlanguage}?${data.program}?${data.subject}?${data.class}?${data.skillsetid}`,
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
    } catch {}
  };
  // const hdata = data[0].segment[0].value;
  //
  // {data[0].segment[0].value === undefined ? : data[0].segment[0].value}
  const logOutZoomState = (event, gestureState, zoomableViewEventObject) => {
    // console.log(
    //   `Zoomed from ${zoomableViewEventObject.lastZoomLevel} to  ${zoomableViewEventObject.zoomLevel}`,
    // );
  };
  //
  // {data[0].segment[0].value === undefined ? : data[0].segment[0].value}
  return (
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
                  justifyContent: 'center',
                  textTransform: 'capitalize',
                  // width: 200,
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
        {/* </View> */}
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
                {route.params.skillsetname}
                {/* {eceHeading.map(x => x.header)} */}
              </Text>
            </View>
            <ScrollView>
              <View>
                {/* <Norecord /> */}
                {/* <ContentImageDetails
            item={data[0].segment}
            onEnd={getStatus}
            itemContent={'s3_url'}
          /> */}
                {content_data.length > 0 ? (
                  <>
                    <HtmlContentCoponent
                      sourceData={content_data[0].segment[0].value}
                    />
                    <View
                      style={
                        {
                          // marginTop: 20,
                          // paddingTop: 20,
                          // marginLeft: 10,
                        }
                      }>
                      <FabButton
                        image={require('../assets/Image/share.png')}
                        onPress={shareLink}
                      />
                      {completeStatus ? (
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
                        // <TouchableOpacity style={styles.button}>
                        <TouchableOpacity
                          style={styles.button}
                          onPress={getStatus}>
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
              </View>
            </ScrollView>
          </>
        )}
        {/* //Feddback modal starts from here */}
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
                  ଆପଣ ପଢ଼ିଥିବା ବିଷୟ ଆପଣଙ୍କୁ କିପରି ଲାଗିଲା ସେ ସମ୍ବନ୍ଧରେ ନିଜର ମତାମତ
                  ଦିଅନ୍ତୁ ।
                </Text>
                <TextInput
                  underlineColorAndroid="transparent"
                  placeholder="ମତାମତ ଦିଅନ୍ତୁ"
                  placeholderTextColor="grey"
                  numberOfLines={10}
                  multiline={true}
                  keyboardType="ascii-capable"
                  style={styles.input}
                  onChangeText={onChangeText}
                  value={text}
                />
                <Pressable
                  style={[styles.buttonFeedback, styles.buttonClose]}
                  onPress={handleSaveFeedback}>
                  <Text style={styles.textStyle}>SAVE</Text>
                </Pressable>
              </View>
            </View>
          </Modal>
          {/* <Pressable
          style={[styles.buttonFeedback, styles.buttonOpen]}
          onPress={() => setModalVisible(true)}>
          <Text style={styles.textStyle}>Show Modal</Text>
        </Pressable> */}
        </View>
        {/* Feedback modal ends here */}
      </View>
    </ReactNativeZoomableView>
  );
};

export default Pgecontentdetails;

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
