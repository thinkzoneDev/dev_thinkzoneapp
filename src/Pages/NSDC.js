import {
  Alert,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  BackHandler,
  Modal,
  TextInput,
} from 'react-native';
// import * as window from '../utils/dimensions';
import {Color, FontFamily, FontSize, Border} from '../GlobalStyle';
import React from 'react';
import {useEffect, useRef, useCallback, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import API from '../environment/Api';
import {useTranslation} from 'react-i18next';
import ErrorMessage from '../components/ErrorMessage';
import ButtomSheet from '../components/BottomSheet';
import AppTextInput from '../components/TextInput';
import LinearGradient from 'react-native-linear-gradient';
import * as window from '../utils/dimensions';
import Colors from '../utils/Colors';
import Entypo from 'react-native-vector-icons/Entypo';

import FlnScreenSkeleton from '../skeletons/FlnScreenSkeleton';
import * as types from '../redux/slices/UserSlice';
import {useMemo} from 'react';
import {ScrollView} from 'react-native-gesture-handler';
// import { Stopwatch, Timer } from 'react-native-stopwatch-timer';

const NSDC = ({route, navigation}) => {
  const dispatch = useDispatch();
  const user = useSelector(state => state.userdata.user?.resData);
  const {userdata} = route.params;
  const {t} = useTranslation();
  const modalRef = useRef();
  const modalHeight = window.WindowHeigth * 1.5;
  const teacherdata = useSelector(state => state.userdata.user?.resData);
  const [password, setPassword] = useState('');
  const [aadhaar, setAadhaar] = useState(user[0].aadhaar);
  const [name, setName] = useState('');
  const [guardianname, setGuardianName] = useState(user[0].guardianname);

  const [quizstatus, setQuizstatus] = useState(false);
  const [nsdcMark, setNsdcMark] = useState('');
  const [nsdcMarkStatus, setNsdcMarkStatus] = useState(true);
  const [nsdcQualified, setNsdcQualified] = useState(false);
  const [certAvailable, setCertAvailable] = useState(false);
  const [certificate, setCertificate] = useState('');
  const [isLoading, setIsloading] = useState(false);
  const [state, setState] = useState('');
  const [aadhaarError, setAadhaarError] = useState(false);
  const [error, setError] = useState(false);
  const [modal, setModal] = useState(false);
  const [passwordModal, setPasswordModal] = useState(false);
  useMemo(() => {
    dispatch(types.getalldistrictstart());
  }, [state]);
  useEffect(() => {
    const backAction = () => {
      // setModal(true);

      Alert.alert(
        'ଧ୍ୟାନ ଦିଅନ୍ତୁ! ',
        'ଆପଣ ନିବେଶ କରିଥିବା ତଥ୍ୟ Save ହୋଇଯିବ। ଆପଣ ଏହା ଅବଗତ ଅଛନ୍ତି ତ?',
        [
          {
            text: 'Cancel',
            onPress: () => null,
            style: 'default',
          },
          {
            text: 'SUBMIT',
            onPress: () => navigation.goBack(),
            style: 'default',
          },
        ],
      );
      return true;
    };
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );
    // console.log(backHandler, 'dhan');

    return () => backHandler.remove();
  }, []);

  useEffect(() => {
    API.get(`checknsdceligibility/${teacherdata[0].userid}`).then(
      response => {
        if (response.data.status == 'nsdc complete') {
          API.get(`getuserstatus/${teacherdata[0].userid}`).then(
            res => {
              if (res.data.length > 0) {
                if (res.data[0].evaluate === 'pending') {
                  setNsdcMarkStatus(true);
                  setModal(true);
                  dispatch(types.rewardsUserstart(user[0].userid));
                  // Alert.alert(
                  //   'Congratulations !ଆପଣ ସଫଳତା ର ସହ ଏହି ବିଷୟ ଟି କୁ ସଂପୂର୍ଣ୍ଣ କରିଛନ୍ତି ।',
                  //   'ଖୁବ୍ ଶୀଘ୍ର ଆପଣଙ୍କ NSDC ଫଳାଫଳ ପ୍ରକାଶିତ ହେବ...',
                  //   [
                  //     {
                  //       text: 'Cancel',
                  //       onPress: () => navigation.navigate('home'),
                  //       style: 'destructive',
                  //     },
                  //     {
                  //       text: 'OK',
                  //       onPress: () => navigation.navigate('home'),
                  //       style: 'destructive',
                  //     },
                  //   ],
                  //   {cancelable: false},
                  // );
                } else {
                  setNsdcMarkStatus(false);
                  setNsdcMark(res.data[0].score);
                  if (res.data[0].score < 60) {
                    setNsdcQualified(false);
                  } else {
                    setNsdcQualified(true);
                    setIsloading(false);

                    API.get(`getnsdccertificate/${teacherdata[0].userid}`).then(
                      res => {
                        if (res.status == 'pending') {
                          setCertAvailable(false);
                        } else {
                          setCertAvailable(true);
                          setCertificate(res.data.data);
                          setIsloading(false);
                        }
                      },
                      err => this.serverDownMsg.presentToast(),
                    );
                  }
                }
              } else {
              }
            },
            err => {
              console.log(err);
            },
          );
        } else if (response.data.status == 'not eligible') {
          Alert.alert(
            'Your not eligible for NSDC exam.',
            'Not Eligible.',
            [
              {
                text: 'Cancel',

                style: 'destructive',
              },
              {
                text: 'OK',

                style: 'destructive',
              },
            ],
            {cancelable: false},
          );
        } else if (response.data.status == 'eligible') {
          setPasswordModal(true);
        } else if (response.data.status == 'endline incomplete') {
          Alert.alert(
            'ଆପଣ ଏନ୍.ଏସ୍.ଡି.ସି ପରୀକ୍ଷା ଦେବା ପାଇଁ ପ୍ରଥମେ ନିଜର ଏଣ୍ଡଲାଇନ୍ ମୂଲ୍ୟାଙ୍କନ ଦିଅନ୍ତୁ .',
            'ଏବଂ ଏଣ୍ଡଲାଇନ୍ ପରୀକ୍ଷାରେ ଅନ୍ୟୁନ ୬୦% ମାର୍କ ରଖିବା ବାଧ୍ୟତା ମୂଳକ, ତେବେହିଁ ଆପଣ ଏନ୍.ଏସ୍.ଡି.ସି ପରୀକ୍ଷା ଦେଇପାରିବେ।',
            [
              {
                text: 'Cancel',
                onPress: () => navigation.navigate('home'),
                style: 'destructive',
              },
              {
                text: 'OK',
                onPress: () => navigation.navigate('home'),
                style: 'destructive',
              },
            ],
            {cancelable: false},
          );
        } else {
          Alert.alert(
            'Error Happened.',
            'Error',
            [
              {
                text: 'Cancel',

                style: 'destructive',
              },
              {
                text: 'OK',

                style: 'destructive',
              },
            ],
            {cancelable: false},
          );
        }
      },
      err => {
        console.log(err);
      },
    );
  }, []);
  const handleOpenBottomSheet = useCallback(() => {
    modalRef.current?.open();
  }, []);

  // const [isTimerStart, setIsTimerStart] = useState(false);
  // const [timerDuration, setTimerDuration] = useState(10000);
  const checkPassword = e => {
    if (
      aadhaar === undefined ||
      aadhaar === null ||
      aadhaar.trim() === '' ||
      aadhaar.length < 12
    ) {
      Alert.alert(
        'Please enter a valid aadhaar.',
        '',
        [
          {
            text: 'Cancel',

            style: 'destructive',
          },
          {
            text: 'OK',

            style: 'destructive',
          },
        ],
        {cancelable: false},
      );
    } else if (
      password === undefined ||
      password === null ||
      password.trim() === '' ||
      password.length < 0
    ) {
      Alert.alert(
        'Please enter the Password.',
        '',
        [
          {
            text: 'Cancel',

            style: 'destructive',
          },
          {
            text: 'OK',

            style: 'destructive',
          },
        ],
        {cancelable: false},
      );
    } else {
      setAadhaarError(false);

      const userDetails = {
        userid: user[0].userid,
        aadhaar: aadhaar,
        guardianname: guardianname,
      };
      const data = {
        image: {},
        user: userDetails,
        userid: user[0]._id,
      };

      dispatch(types.updateUserstart(data));
      API.get(`checkpassword/${password}`).then(
        response => {
          // console.log('response nsdc--->', response);
          if (response.data.status == 'password not found') {
            // setQuizstatus(true);
            Alert.alert(
              'info',
              'Wrong Password!!',

              [
                {
                  text: 'Cancel',

                  style: 'destructive',
                },
                {
                  text: 'OK',

                  style: 'destructive',
                },
              ],
              {cancelable: false},
            );
          } else if (response.data.status == 'password expired') {
            Alert.alert(
              'password expired.',
              'Error',
              [
                {
                  text: 'Cancel',

                  style: 'destructive',
                },
                {
                  text: 'OK',
                  style: 'destructive',
                },
              ],
              {cancelable: false},
            );
          } else if (response.data.status == 'password active') {
            setQuizstatus(true);
            setIsloading(false);

            navigation.navigate('nsdcquiz');
          } else {
          }
        },
        err => {
          console.log(err);
        },
      );
    }
  };

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
                  // marginLeft:60,
                  // width: 200,
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
            <View style={{flexDirection: 'row'}}>
              <Text
                style={[
                  styles.username,
                  {
                    fontSize: 16,
                    color: 'black',
                    fontWeight: '400',
                    fontFamily: 'serif',
                    marginLeft: 10,
                    marginTop: 10,
                  },
                ]}>
                ଆପଣ ଏନ୍.ଏସ୍.ଡି.ସି. ପରୀକ୍ଷା ସମାପ୍ତ କରିଥିବାରୁ ୧୦ଟି କଏନ୍ ହାସଲ
                କରିଛନ୍ତି। 'ଆପଣଙ୍କ NSDC ପରୀକ୍ଷା ଫଳ ଆସନ୍ତା ୩ ସପ୍ତାହ ମଧ୍ୟରେ
                ପ୍ରକାଶିତ ହେବ...' 🎉🎉
              </Text>

              {/* <FontAwesome5	
                  name="coins"	
                  size={27}	
                  color={'#FFD700'}	
                  style={[styles.icon, {marginRight: -40}]}	
                /> */}
            </View>

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
      <>
        <Modal animationType="slide" transparent={true} visible={passwordModal}>
          <View style={[styles.centeredView]}>
            {/* <LinearGradient
              // colors={['#4286f4', '#373b44']}
              colors={['#137BD4', 'black']}
              style={styles.viewdatas}> */}
            <View style={styles.viewdatas}>
              <ScrollView>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                  <Entypo
                    name="circle-with-cross"
                    color={'#666666'}
                    size={40}
                    style={{
                      // marginLeft: 260,
                      alignSelf: 'flex-end',
                      // marginTop: -20,
                      paddingRight: 10,
                      paddingTop: 30,
                      paddingBottom: 30,
                    }}
                  />
                </TouchableOpacity>
                <Text style={styles.Text}>Aadhaar card number ଦିଅନ୍ତୁ</Text>
                <View>
                  <TextInput
                    style={styles.Textinput}
                    autoCapitalize="none"
                    autoCorrect={false}
                    keyboardType="numeric"
                    name="aadhaar"
                    maxLength={12}
                    placeholder="Enter Aadhar Number"
                    value={aadhaar}
                    onChangeText={value => setAadhaar(value)}
                  />
                  <ErrorMessage
                    visible={aadhaarError}
                    error={t('aadhar_error')}
                  />
                </View>
                <Text style={styles.Text}>GuardianName</Text>
                <View>
                  <TextInput
                    style={styles.Textinput}
                    autoCapitalize="none"
                    autoCorrect={false}
                    keyboardType="email-address"
                    name=" guardianname"
                    placeholder="Guardian Name"
                    value={guardianname}
                    onChangeText={value => setGuardianName(value)}
                  />
                </View>
                {/* <Text style={styles.Text}>Password ଦିଅନ୍ତୁ</Text> */}
                <Text
                  style={[styles.Text, {paddingLeft: 10, paddingRight: 10}]}>
                  ଆଗକୁ ଯିବା ପାଇଁ ଆପଣଙ୍କ Manager ଙ୍କ ଦ୍ଵାରା ଦିଆ ଯାଇଥିବା Password
                  ଦିଅନ୍ତୁ
                </Text>
                <TextInput
                  style={styles.Textinput}
                  autoCapitalize="none"
                  autoCorrect={false}
                  keyboardType="email-address"
                  name="password"
                  placeholder="Password"
                  value={password}
                  onChangeText={value => setPassword(value)}
                />

                <TouchableOpacity
                  onPress={() => {
                    checkPassword();
                    //  <Timer>
                    //    start={isTimerStart}
                    //  </Timer>;
                    //   <Text>
                    //   {!isTimerStart ? 'START' : 'STOP'}
                    // </Text>
                  }}>
                  <Text style={styles.buttonText}>Submit</Text>
                </TouchableOpacity>
              </ScrollView>
            </View>
            {/* </LinearGradient> */}
          </View>
          {/* </View> */}
        </Modal>
        {/* <View animationType="slide" transparent={true} visible={passwordModal}>
          <LinearGradient
            colors={['#4286f4', '#373b44']}
            style={styles.viewdatas}>
            <Text style={styles.Text}>Aadhaar card number ଦିଅନ୍ତୁ</Text>
            <View>
              <AppTextInput
                style={styles.Textinput}
                autoCapitalize="none"
                autoCorrect={false}
                keyboardType="numeric"
                name="aadhaar"
                maxLength={12}
                placeholder="Enter Aadhar Number"
                value={aadhaar}
                onChangeText={value => setAadhaar(value)}
              />
              <ErrorMessage visible={aadhaarError} error={t('aadhar_error')} />
            </View>
            <Text style={styles.Text}>GuardianName</Text>
            <View>
              <AppTextInput
                style={styles.Textinput}
                autoCapitalize="none"
                autoCorrect={false}
                keyboardType="email-address"
                name=" guardianname"
                placeholder="Guardian Name"
                value={guardianname}
                onChangeText={value => setGuardianName(value)}
              />
            
            </View>
            <Text style={styles.Text}>Password ଦିଅନ୍ତୁ</Text>
            <Text style={[styles.Text, {paddingLeft: 10, paddingRight: 10}]}>
              ଆଗକୁ ଯିବା ପାଇଁ ଆପଣଙ୍କ Manager ଙ୍କ ଦ୍ଵାରା ଦିଆ ଯାଇଥିବା Password
              ଦିଅନ୍ତୁ
            </Text>
            <AppTextInput
              style={styles.Textinput}
              autoCapitalize="none"
              autoCorrect={false}
              keyboardType="email-address"
              name="password"
              placeholder="Password"
              value={password}
              onChangeText={value => setPassword(value)}
            />

            <TouchableOpacity
              onPress={() => {
                checkPassword();
              }}>
              <Text style={styles.buttonText}>Submit</Text>
            </TouchableOpacity>
          </LinearGradient>
        </View> */}
      </>
      {isLoading ? (
        <View>
          <FlnScreenSkeleton />
        </View>
      ) : (
        <>
          {quizstatus ? (
            <View>{/* <Text>Nsdc Quiz</Text> */}</View>
          ) : (
            <View>
              {nsdcMarkStatus ? (
                <></>
              ) : (
                <>
                  {nsdcQualified ? (
                    <View style={styles.Flngati}>
                      <Text style={styles.FlngatiText}> Congratulation 🎉</Text>

                      <Text style={styles.FlngatiText}> You are Qualified</Text>

                      <View style={styles.submit}>
                        <Text style={styles.text}>Your Mark</Text>
                        <View style={{flexDirection: 'row'}}>
                          <Text style={styles.mark}>{nsdcMark}%</Text>
                        </View>
                      </View>
                      {/* <Image
                  style={styles.tinyLogo}
                  source={require('../assets/Photos/certificate.jpg')}
                /> */}
                      <Image
                        style={styles.tinyLogo}
                        source={{
                          uri: `${certificate}`,
                        }}
                      />
                    </View>
                  ) : (
                    <View style={styles.Flngati}>
                      <Text style={[styles.FlngatiText, {marginTop: 40}]}>
                        {' '}
                        You are Not Qualified
                      </Text>

                      <View style={[styles.submit, {marginTop: 40}]}>
                        <Text style={styles.text}>Your Mark</Text>
                        <View style={{flexDirection: 'row'}}>
                          <Text style={styles.mark}>{nsdcMark}%</Text>
                        </View>
                      </View>
                      <View style={styles.submitText}>
                        <Text style={[styles.Text, {marginTop: 40}]}>
                          ଆମେ ଦୁଃଖିତ ☹ !{' '}
                        </Text>
                        <Text style={[styles.Text, {marginTop: 40}]}>
                          ଆପଣ ଏନ୍.ଏସ୍.ଡି.ସି ପରୀକ୍ଷାରେ କୃତକାର୍ଯ୍ୟ ହୋଇନଥିବାରୁ
                          ଏନ୍.ଏସ୍.ଡି.ସି Certificate ପାଇଁ ମନୋନୀତ ହୋଇନାହାନ୍ତି।
                        </Text>
                      </View>
                    </View>
                  )}
                </>
              )}
            </View>
          )}
        </>
      )}
    </>
  );
};

export default NSDC;

const styles = StyleSheet.create({
  button: {
    height: 30,
    width: 30,
  },
  Flngati: {
    alignItems: 'center',

    width: window.WindowWidth * 0.9,
    height: 550,

    backgroundColor: 'white',
    borderRadius: 10,
    marginTop: 90,

    marginLeft: 20,
    overflow: 'hidden',
    marginRight: 10,
  },
  FlngatiText: {
    fontSize: 22,
    textAlign: 'center',
    color: 'black',
    fontFamily: 'Cochin',
    fontWeight: 'bold',
    marginTop: 20,
  },

  tinyLogo: {
    width: window.WindowWidth * 0.8,
    marginTop: 40,
    marginLeft: 60,

    height: 220,
    marginRight: 60,
  },
  mark: {
    fontSize: 18,
    fontWeight: 'bold',
    justifyContent: 'center',
    letterSpacing: 1,
    fontFamily: 'Arial, Helvetica, sans-serif',
    color: 'white',

    marginRight: 5,

    textAlign: 'right',
  },

  text: {
    fontSize: 18,
    textAlign: 'center',
    color: 'white',
    textTransform: 'capitalize',

    textAlign: 'left',
    flex: 1,
    fontWeight: 'bold',
  },
  Text: {
    fontSize: 15,
    textAlign: 'center',
    color: '#666666',
    fontFamily: FontFamily.poppinsMedium,
    fontWeight: '600',
    // marginTop: 10,
    // color: 'white',
  },
  submit: {
    alignItems: 'center',
    flexDirection: 'row',
    padding: 15,
    width: window.WindowWidth * 0.8,

    backgroundColor: '#1C5C72',
    borderRadius: 10,
    // marginTop: 40,
    textAlign: 'center',
    shadowColor: 'black',
  },
  submitText: {
    alignItems: 'center',

    padding: 15,
    width: window.WindowWidth * 0.8,

    // backgroundColor: '#1C5C72',
    // borderRadius: 10,
    marginTop: 40,
    textAlign: 'center',
    // shadowColor: 'black',
  },
  Textinput: {
    fontSize: 15,
    textAlign: 'center',
    color: '#666666',
    fontFamily: FontFamily.poppinsMedium,
    fontWeight: 'bold',
    // marginTop: 20,
    borderColor: Color.ghostwhite,
    width: window.WindowWidth * 0.8,
    height: 60,
    margin: 12,
    borderWidth: 1,
    padding: 10,
    borderRadius: 10,
    backgroundColor: Color.ghostwhite,
    justifyContent: 'center',

    marginLeft: 20,
  },
  viewdatas: {
    borderRadius: 10,
    // marginLeft: 20,
    overflow: 'hidden',
    // marginRight: 10,
    width: window.WindowWidth * 0.9,
    // marginTop: 50,
    paddingBottom: 30,
    backgroundColor: 'white',
  },
  buttonText: {
    width: 190,
    height: 50,
    paddingTop: 5,
    paddingBottom: 5,
    borderRadius: 10,
    backgroundColor: '#137BD4',
    color: 'white',
    borderWidth: 1,
    fontSize: 24,
    textAlign: 'center',
    marginLeft: 70,
    justifyContent: 'center',
    marginTop: 20,
    fontWeight: 'bold',
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
});
