import * as React from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  BackHandler,
  Alert,
  Modal,
  Image,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import {useFocusEffect} from '@react-navigation/native';

import {FontFamily, Color, FontSize, Border} from '../GlobalStyle';

import {useEffect, useState} from 'react';
import * as types from '../redux/slices/UserSlice';
import {useDispatch, useSelector} from 'react-redux';
import API from '../environment/Api';
import Quiz from '../components/Quiz';
import * as window from '../utils/dimensions';
import Colors from '../utils/Colors';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import LinearGradient from 'react-native-linear-gradient';
import {showMessage} from 'react-native-flash-message';
import QuizSkeleton from '../skeletons/QuizSkeleton';
import Popup from '../components/Popup';
import Entypo from 'react-native-vector-icons/Entypo';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
const TeacherBaseline = ({route, navigation}) => {
  const {type} = route.params;
  const dispatch = useDispatch();
  const user = useSelector(state => state.userdata.user?.resData);
  // console.log(user, 'user======================');
  const [examType, setExamType] = useState(type);
  const [language, setLanguage] = useState('od');
  const [quizStatus, setQuizStatus] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [isLoading, setIsloading] = useState(true);
  const [modal, setModal] = useState(false);
  const [modals, setModals] = useState(false);
  const [quizModal, setQuizModal] = useState(false);
  // const modalHeight = window.WindowHeigth * 0.9;

  const [mark, setMark] = useState([]);
  // console.log(setMark, 'setMark==============>');
  let odia_category = 0;
  let eng_category = 0;
  let technology_category = 0;
  let pedagogy_category = 0;
  let math_category = 0;

  useEffect(() => {
    let isModified = false;
    API.get(
      `getteacherbaselinedata/${examType}/${language}/${user[0].userid}/${user[0].usertype}`,
    ).then(res => {
      if (res.data.length > 0) {
        // console.log(res.data, 'res.data');
        setQuizStatus(false);
        setIsloading(false);
        API.get(`getbaselinemarks/${examType}/${user[0].userid}`).then(res => {
          setMark(res.data.data);

          setIsloading(false);
        });
        // console.log(mark, 'markdata');
      } else {
        setQuizStatus(true);
        setQuizModal(true);
        API.get(
          `getteacherappallassessment/${examType}/${language}/${user[0].usertype}`,
        ).then(res => {
          // console.log(res.data, 'res');
          setModal(true);

          setQuestions(res.data);
          setIsloading(false);
        });
      }
    });

    return () => {
      isModified = true;
    };
  }, []);
  // useEffect(() => {
  //   const backAction = () => {
  //     Alert.alert(
  //       'ଧ୍ୟାନ ଦିଅନ୍ତୁ! ',
  //       'ଆପଣ ନିବେଶ କରିଥିବା ତଥ୍ୟ Save ହେବ ନାହିଁ। ଆପଣ ଏହା ଅବଗତ ଅଛନ୍ତି ତ?',
  //       [
  //         {
  //           text: 'Cancel',
  //           onPress: () => null,
  //           style: 'default',
  //         },
  //         {text: 'Ok', onPress: () => navigation.goBack(), style: 'default'},
  //       ],
  //     );
  //     return true;
  //   };

  //   const backHandler = BackHandler.addEventListener(
  //     'hardwareBackPress',
  //     backAction,
  //   );

  //   return () => backHandler.remove();
  // }, []);
  const onend_quiz = (secured_mark, total_mark, submitedAnswer) => {
    submitedAnswer.map(element => {
      if (element.selectedOption === element.answer) {
        // console.log(element.selectedOption, element.answer);
        if (element.category === 'odia') {
          odia_category += 1;
        } else if (element.category === 'english') {
          eng_category += 1;
        } else if (element.category === 'technology') {
          technology_category += 1;
        } else if (element.category === 'pedagogy') {
          pedagogy_category += 1;
        } else if (element.category === 'math') {
          math_category += 1;
        }
      }
    });
    const data = {
      userid: user[0].userid,
      username: user[0].username,
      usertype: user[0].usertype,

      passcode: user[0].passcode,
      managerid: user[0].managerid,
      managername: user[0].managername,
      centerid: user[0].centerid,
      centername: user[0].centername,
      emailid: user[0].emailid,
      language: language,
      type: type,
      assesmentquestion: submitedAnswer,
      totalmark: total_mark,
      securedmark: secured_mark,
      odia_category: odia_category,
      eng_category: eng_category,
      math_category: math_category,
      pedagogy_category: pedagogy_category,
      technology_category: technology_category,
    };

    // console.log(data, 'baseline---------------------------------->');
    API.post(`saveteacherbaselinedata`, data).then(res => {
      if (res.data.status == 'success') {
        setModals(true);
        dispatch(types.rewardsUserstart(user[0].userid));

        // showMessage({
        //   message: `Successfully Baseline Completed`,
        //   description: 'Successfully Baseline Completed.',
        //   type: 'success',
        //   backgroundColor: Colors.success,
        // });
      } else {
        showMessage({
          message: `Faild to store data.`,
          description: 'Faild to store data.',
          type: 'Error',
          backgroundColor: Colors.danger,
        });
      }
    });
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
  const [userdata, setUserdata] = useState(user);
  useFocusEffect(
    React.useCallback(() => {
      // Do something when the screen is focused
      API.get(`getuserbyuserid/${user[0].userid}`).then(response => {
        // console.log(response.data, 'profileresponse------>');
        setUserdata(response.data);
      });
      // const email = userdatas[0].userid;
      // dispatch(types.loadUserStart(email));
    }, []),
  );
  return (
    <>
      {/* {modal && (
        <Popup
          // style={{width: 500}}
          title={
            'ଦିଆଯାଇଥିବା ସମସ୍ତ ପ୍ରଶ୍ନ ର ଉତ୍ତର  ଦିଅନ୍ତୁ। ଏଥି ମଧ୍ୟରେ କିଛି ଗଣିତ, ଇଂରାଜୀ, ସାହିତ୍ୟ ଏଵଂ ଟେକ୍ନୋଲୋଜି ର ପ୍ରଶ୍ନ ରହିଛି।ଧ୍ୟାନ ରଖିବେ ଯେପରି ପ୍ରଶ୍ନର ଉତ୍ତର ଦେଉଥିବା ସମୟରେ back କରିବେ ନାହିଁ, ନଚେତ୍ ଆପଣ ମୂଳ ପ୍ରଶ୍ନ ଅର୍ଥାତ୍ ୧ନମ୍ବର ପ୍ରଶ୍ନକୁ ଫେରିଆସିବେ। ଆମେ ଆଶା କରୁଛୁ ଆପଣ ସମସ୍ତ ପ୍ରଶ୍ନ ରେ ଭଲ ପ୍ରଦର୍ଶନ କରିବେ।'
          }
        />
      )} */}
      {isLoading ? (
        <QuizSkeleton />
      ) : (
        <>
          {quizStatus ? (
            <Modal
              animationType="slide"
              onRequestClose={() => back()}
              transparent={true}
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
                      examType={type}
                      questions={questions}
                      onend_quiz={onend_quiz}
                      navigation={navigation}
                    />
                  </View>
                </View>
              </View>
              {/* </View> */}
            </Modal>
          ) : (
            <View style={styles.baseline}>
              <View style={[styles.statusBar, styles.statusPosition1]}></View>
              <View style={styles.baselineChild} />
              {userdata[0].image === '' || !userdata[0].image ? (
                <TouchableOpacity
                  onPress={() =>
                    navigation.navigate('profile', {
                      type: 'Profile',
                    })
                  }>
                  <Image
                    // style={{
                    //   width: window.WindowWidth * 0.22,
                    //   height: window.WindowHeigth * 0.121,
                    //   marginTop: 30,
                    //   left: '15%',
                    // }}
                    style={styles.image}
                    source={require('../assets/Photos/userss.png')}
                  />
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  onPress={() =>
                    navigation.navigate('profile', {
                      type: 'Profile',
                    })
                  }>
                  <Image
                    style={styles.image}
                    source={{uri: userdata[0].image}}
                  />
                </TouchableOpacity>
              )}
              {/* <Image
                style={styles.baselineItem}
                resizeMode="cover"
                source={require('../assets/Image/group-35.png')}
              /> */}
              <Text style={styles.ram}>
                {userdata[0].firstname}
                {''} !
              </Text>
              <Text
                style={[
                  styles.youAreDoing,
                  styles.text2Typo,
                ]}>{`You are doing great,
keep studying!`}</Text>
              {/* <Image
                style={[
                  styles.iconnotificationnotification,
                  styles.statusBarBgLayout,
                ]}
                resizeMode="cover"
                source={require('../assets/Image/iconnotificationnotification.png')}
              /> */}

              {/* For Review Quiz Page start */}
              {examType == 'baseline' ? (
                <TouchableOpacity
                  style={{marginTop: 19}}
                  onPress={() =>
                    navigation.navigate('teacherbaselinereviewpage', {
                      examType: examType,
                    })
                  }>
                  <Text
                    style={[
                      {
                        // paddingTop: 20,
                        // paddingBottom: -20,
                        top: 20,
                        fontSize: 15,
                        alignSelf: 'center',
                        // backgroundColor: 'black',
                        color: Color.royalblue,
                        // marginTop: 5,
                        fontFamily: FontFamily.poppinsMedium,
                      },
                    ]}>
                    Review Baseline Quiz --{'>'}
                  </Text>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  style={{top: 59}}
                  onPress={() =>
                    navigation.navigate('teacherbaselinereviewpage', {
                      examType: examType,
                    })
                  }>
                  <Text
                    style={[
                      {
                        // backgroundColor: 'black',

                        top: 30,
                        fontSize: 15,
                        alignSelf: 'center',
                        // backgroundColor: 'black',
                        color: Color.royalblue,
                        // marginTop: 5,
                        fontFamily: FontFamily.poppinsMedium,
                      },
                    ]}>
                    Review Endline Quiz --{'>'}
                  </Text>
                </TouchableOpacity>
              )}

              {/* For Review Quiz Page end */}

              <View style={[styles.baselineInner]} />
              {examType == 'baseline' ? (
                <Text style={styles.odiaText}>
                  ଆପଣ ସଫଳତାର ସହ ବେସଲାଇନ୍ ସଂପୂର୍ଣ୍ଣ କରିଛନ୍ତି ଏବଂ ଏହା ଆପଣଙ୍କର
                  ମାର୍କ ଅଟେ
                </Text>
              ) : (
                <Text style={styles.odiaText}>
                  ଆପଣ ସଫଳତାର ସହ ଏଣ୍ଡଲାଇନ୍ ସଂପୂର୍ଣ୍ଣ କରିଛନ୍ତି ଏବଂ ଏହା ଆପଣଙ୍କର
                  ମାର୍କ ଅଟେ
                </Text>
              )}
              {mark.map(data => (
                <View style={styles.parent}>
                  <Text style={[styles.textLayout, styles.mt19]}>
                    0{data.odia_score}
                    {/* /{data.totalodiaques} */}
                  </Text>
                  <Text style={[styles.textLayout, styles.mt19]}>
                    0{data.math_score}
                    {/* /{data.totalmathques} */}
                  </Text>
                  <Text style={[styles.textLayout, styles.mt19]}>
                    0{data.eng_score}
                    {/* /{data.totalengques} */}
                  </Text>
                  <Text style={[styles.textLayout, styles.mt19]}>
                    0{data.technology_score}
                    {/* /{data.totaltechques} */}
                  </Text>
                  <Text style={[styles.textLayout, styles.mt19]}>
                    0{data.pedagogyscore}
                    {/* /{data.totalpedagogyques} */}
                  </Text>
                  <View style={{flexDirection: 'row'}}>
                    <View style={[styles.frameChild, styles.mt19]} />
                    <View style={[styles.frameChilds, styles.mt19]} />
                  </View>

                  <Text style={[styles.mt19, styles.textLayout]}>
                    {Number(data.technology_score) +
                      Number(data.eng_score) +
                      Number(data.pedagogyscore) +
                      Number(data.odia_score) +
                      Number(data.math_score)}
                  </Text>
                </View>
              ))}

              <View style={styles.group}>
                <Text
                  style={[styles.text8, styles.textLayout]}>{`ଓଡ଼ିଆ `}</Text>
                <Text
                  style={[
                    styles.text8,
                    styles.mt19,
                    styles.textLayout,
                  ]}>{`ଗଣିତ `}</Text>
                <Text
                  style={[
                    styles.text8,
                    styles.mt19,
                    styles.textLayout,
                  ]}>{`ଇଂରାଜୀ `}</Text>
                <Text
                  style={[
                    styles.text8,
                    styles.mt19,
                    styles.textLayout,
                  ]}>{`ଟେକ୍ନୋଲୋଜି `}</Text>
                <Text
                  style={[
                    styles.text8,
                    styles.mt19,
                    styles.textLayout,
                  ]}>{`ଶିଶୁବିକାଶ `}</Text>
                {/* <Divider inset={true} /> */}
                {/* <Image
                  style={[{height: 2, marginTop: 29, width: 139}]}
                  resizeMode="cover"
                  source={require('../assets/Image/line.png')}
                /> */}
                {/* <Image
                  style={[styles.frameItem, styles.mt19]}
                  resizeMode="cover"
                  source={require('../assets/Image/Rectangle 17680.png')}
                /> */}
                <Text
                  style={[
                    styles.text13,
                    // styles.mt19,
                    styles.textLayout,
                    {top: '14.78%'},
                  ]}>
                  {`ମୋଟ`}
                </Text>
              </View>

              {/* <View style={styles.rectangleView} /> */}

              <View>
                <Modal
                  animationType="slide"
                  transparent={true}
                  visible={modals}>
                  <View style={[styles.centeredView]}>
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
                        source={require('../assets/Image/success.gif')}
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
                            width: 200,
                            alignSelf: 'center',
                          },
                        ]}>
                        Congratulations! {''}
                      </Text>
                      {/* <Text
                        style={{
                          color: 'black',
                          fontWeight: '800',
                          color: '#666666',
                          textTransform: 'capitalize',
                        }}>
                        {user[0].username}
                      </Text> */}

                      {type === 'baseline' ? (
                        <Text
                          style={[
                            styles.username,
                            {
                              fontSize: 14,
                              color: 'black',
                              fontWeight: '400',
                              fontFamily: 'serif',
                              marginTop: 10,
                              FontFamily: FontFamily.poppinsMedium,
                            },
                          ]}>
                          {user[0].username} ଆପଣ ମୂଲ୍ୟାଙ୍କନ ବିଭାଗରେ{' '}
                          {mark.map(data => (
                            <>
                              {Number(data.technology_score) +
                                Number(data.eng_score) +
                                Number(data.pedagogyscore) +
                                Number(data.odia_score) +
                                Number(data.math_score)}
                              /{' '}
                              {Number(data.totalpedagogyques) +
                                Number(data.totalodiaques) +
                                Number(data.totalengques) +
                                Number(data.totalmathques) +
                                Number(data.totaltechques)}
                              {''}
                            </>
                          ))}
                          {''} ମାର୍କ ରଖିଛନ୍ତି ଆପଣ ଆପ୍ଲିକେସନ ଭଲ ଭାବରେ ଜାଣିବା ପରେ
                          ନିଶ୍ଚିତ ଭାବେ ପରବର୍ତ୍ତୀ ମୂଲ୍ୟାଙ୍କନ ରେ ଭଲ ପ୍ରଦର୍ଶନ
                          କରିବେ। ବର୍ତ୍ତମାନ ଆପଣ ପ୍ରବେଶ ପେଟିକା ଯାଇପାରିବେ ।
                        </Text>
                      ) : (
                        <Text
                          style={[
                            styles.username,
                            {
                              fontSize: 16,
                              color: 'black',
                              fontWeight: '400',
                              fontFamily: 'serif',
                              marginTop: 10,
                            },
                          ]}>
                          {user[0].username} ଆପଣ ସଫଳତାର ସହ ଏଣ୍ଡଲାଇନ୍ ସମ୍ପୁର୍ଣ୍ଣ
                          କରିଥିବାରୁ ୫ଟି କଏନ୍ ହାସଲ କରିଛନ୍ତି।
                        </Text>
                      )}
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
              </View>
            </View>
          )}
        </>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  mt19: {
    marginTop: 19,
  },
  statusPosition1: {
    left: '0%',
    right: '0%',
    top: '0%',
    position: 'absolute',
    width: '100%',
  },
  statusPosition: {
    bottom: '0%',
    height: '100%',
    left: '0%',
    right: '0%',
    top: '0%',
    width: '100%',
  },

  text2Typo: {
    fontFamily: FontFamily.poppinsMedium,
    // fontWeight: '00',
  },

  baselineBg: {
    backgroundColor: Color.white,
    position: 'absolute',
  },
  textLayout: {
    // height: 17,
    width: 139,
    color: Color.black,
    margin: 5,
    padding: 3,
    fontSize: 14,
    textAlign: 'left',
  },

  text: {
    color: Color.dimgray_100,
    textAlign: 'right',
    fontFamily: FontFamily.poppinsRegular,
    fontSize: 12,
    marginTop: -7.43,
    height: 15,
    top: '50%',
    left: '0%',
    position: 'absolute',
    width: '100%',
  },

  statusBar: {
    height: '2.62%',
    bottom: '97.38%',
  },
  baselineChild: {
    // height: '16%',
    width: '107.22%',
    top: -1,
    right: '-4.44%',
    bottom: '83.75%',
    left: '-2.78%',
    backgroundColor: Color.royalblue,
    position: 'absolute',
  },
  text1: {
    color: Color.white,
    textAlign: 'right',
    fontFamily: FontFamily.poppinsRegular,
    fontSize: 12,
    marginTop: -7.43,
    height: 15,
    top: '50%',
    left: '0%',
    position: 'absolute',
    width: '100%',
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

  baselineItem: {
    height: '12.63%',
    width: '24.44%',
    right: '73.06%',
    bottom: '80.63%',
    left: '1.5%',
    top: '2.75%',
    maxHeight: '100%',
    maxWidth: '100%',
    position: 'absolute',
    overflow: 'hidden',
  },
  ram: {
    // height: '2.38%',
    width: '80.89%',
    // paddingBottom: 30,
    fontSize: FontSize.size_lg,
    textAlign: 'left',
    left: '28.39%',
    fontFamily: FontFamily.poppinsSemibold,
    fontWeight: '600',
    top: '3.75%',
    color: 'white',
    position: 'absolute',
  },
  youAreDoing: {
    // height: '5.25%',
    width: '48.06%',
    top: '7.83%',
    fontSize: FontSize.size_smi,
    fontWeight: '500',
    textAlign: 'left',
    left: '28.39%',
    color: 'white',
    position: 'absolute',
  },
  iconnotificationnotification: {
    height: '4.38%',
    width: '9.72%',
    top: '8.38%',
    right: '9.17%',
    // bottom: '87.25%',
    left: '81.11%',
  },
  baselineInner: {
    height: windowHeight * 0.65,
    width: windowWidth * 0.88,
    top: windowHeight * 0.2463,
    alignSelf: 'center',
    backgroundColor: Color.white,
    position: 'absolute',
    borderRadius: Border.br_7xs,
    borderColor: 'rgba(0, 96, 202, 0.3)',
    borderWidth: 1.5,
  },
  odiaText: {
    width: '77.22%',
    marginTop: 235,
    top: 20,
    // left: '11.11%',
    textAlign: 'center',
    alignSelf: 'center',
    color: Color.black,
    fontSize: FontSize.size_base,
    fontFamily: FontFamily.balooBhaina2Medium,
    fontWeight: '500',
    position: 'absolute',
    // margin: -10,
  },
  frameChild: {
    borderColor: 'rgba(0, 0, 0, 0.2)',
    borderTopWidth: 1,
    width: 30,
    height: 1,
    borderStyle: 'solid',
    top: '1%',
  },
  frameChilds: {
    borderColor: 'rgba(0, 0, 0, 0.2)',
    borderTopWidth: 1,
    width: 139,
    alignSelf: 'flex-start',
    textAlign: 'left',
    height: 1,
    borderStyle: 'solid',
    top: '1%',
    right: '1110%',
  },
  text7: {
    fontFamily: FontFamily.poppinsSemibold,
    // height: 17,
    fontWeight: '600',
  },
  parent: {
    top: 309,
    left: 259,
    position: 'absolute',
  },

  text13: {
    fontFamily: FontFamily.balooBhaina2Semibold,
    fontWeight: '600',
    // marginTop: -30,
    // height: 17,
  },
  group: {
    top: 317,
    left: 60,
    alignItems: 'flex-end',
    position: 'absolute',
  },
  rectangleView: {
    marginTop: 56,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    borderColor: 'rgba(0, 96, 202, 0.3)',
    borderWidth: 1.5,
    width: windowWidth * 0.82,
    height: windowHeight * 0.59,
    borderStyle: 'solid',
    borderRadius: 6,
    // position: 'absolute',
  },

  baseline: {
    backgroundColor: Color.ghostwhite,
    flex: 1,
    height: 800,
    overflow: 'hidden',
    width: '100%',
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
  image: {
    height: 90,
    width: 90,
    borderRadius: 75,
    // alignSelf: 'left',
    marginTop: 10,
    left: '2.4%',
  },
});

export default TeacherBaseline;
