// import {
//   StyleSheet,
//   Text,
//   View,
//   ScrollView,
//   Dimensions,
//   TouchableOpacity,
//   ImageBackground,
//   Button,
//   StatusBar,
//   BackHandler,
//   PermissionsAndroid,
//   Alert,
//   Modal,
//   Image,
// } from 'react-native';
// import DatePicker from 'react-native-datepicker';
// import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
// import ImagePicker from 'react-native-image-crop-picker';
// import {GoogleSignin} from '@react-native-google-signin/google-signin';

// import React, {
//   useState,
//   useEffect,
//   useRef,
//   useCallback,
//   useLayoutEffect,
// } from 'react';
// import Cameraicon from 'react-native-vector-icons/Feather';
// import ButtomSheet from '../components/BottomSheet';
// import Colors from '../utils/Colors';
// import {useTranslation} from 'react-i18next';
// import AppTextInput from '../components/TextInput';
// import ErrorMessage from '../components/ErrorMessage';
// import Gender from 'react-native-vector-icons/Foundation';
// import {Picker} from '@react-native-picker/picker';
// import Entypo from 'react-native-vector-icons/Entypo';
// import {useDispatch, useSelector} from 'react-redux';
// import * as types from '../redux/slices/UserSlice';
// import {useMemo} from 'react';
// import {passcodevalidate} from '../redux/api/UserApi';
// import * as window from '../utils/dimensions';
// import {log} from 'console';
// import {Adder} from 'd3';

// const WIDTH = Dimensions.get('window').width;
// const HEIGHT = Dimensions.get('window').height;
// const Register = () => {
//   const dispatch = useDispatch();

//   const districtlist = useSelector(state => state.userdata.district);
//   const blocklist = useSelector(state => state.userdata.block);
//   const user = useSelector(state => state.userdata.newuser);
//   console.log(user, 'user google sign in.');
//   const {t} = useTranslation();

//   const modalRef = useRef(null);

//   const modalHeight = HEIGHT * 1;
//   const [name, setName] = useState(user.wa_name ? user.wa_name : '');
//   const [guardianName, setGuardianName] = useState('');
//   const [imageUrl, setImageUrl] = useState('');
//   const [imageData, setImageData] = useState({});
//   const [phone, setPhone] = useState(
//     user.wa_number ? user.wa_number.slice(2, 12) : '',
//   );
//   const [passcode, setPasscode] = useState('');
//   const [managertype, setManagertype] = useState('');
//   const [dob, setDob] = useState('');

//   //console.log("dob---->",dob)

//   const [email, setEmail] = useState(user ? user : '');
//   const [district, setDistrict] = useState('');
//   const [block, setBlock] = useState('');
//   const [state, setState] = useState('');
//   const [districtId, setDistrictId] = useState('');
//   const [blockId, setBlockId] = useState('');
//   const [gender, setGender] = useState('');
//   const [aadhaar, setAadhaar] = useState('');
//   console.log('qualification-->', qualification);
//   const [usertype, setUsertype] = useState('');
//   const [managername, setManagername] = useState('');
//   const [managerId, setManagerId] = useState('');
//   //States for Error
//   const [nameError, setNameError] = useState(false);
//   const [guardianNameError, setGuardianNameError] = useState(false);
//   const [emailError, setEmailError] = useState(false);
//   const [phoneError, setPhoneError] = useState(false);
//   const [dobError, setDobError] = useState(false);
//   const [qualificationError, setQualificationError] = useState(false);
//   const [genderError, setGenderError] = useState(false);
//   const [passcodeError, setPasscodeError] = useState(false);
//   const [qualification, setQualification] = useState();
//   const [districtError, setDistrictError] = useState(false);
//   const [blockError, setBlockError] = useState(false);
//   const [stateError, setStateError] = useState(false);

//   const [aadhaarError, setAadhaarError] = useState(false);
//   const [modal, setModal] = useState(false);

//   //State to handle error in image error
//   const [error, setError] = useState(false);

//   //Handle the opening of message
//   const handleOpenBottomSheet = useCallback(() => {
//     modalRef.current?.open();
//   }, []);

//   useMemo(() => {
//     dispatch(types.getalldistrictstart());
//   }, [state]);

//   //Function to set district
//   const handleDistrictChange = (itemValue, itemIndex) => {
//     // console.log(itemValue, itemIndex, '');
//     setDistrict(itemValue);
//     setDistrictId(districtlist[itemIndex - 1]._id);
//     setBlock('');
//     dispatch(types.getallblockstart(districtlist[itemIndex - 1]._id));
//   };

//   const handleQualificationChange = (itemValue, itemIndex) => {
//     // console.log(itemValue, itemIndex, '');
//     setQualification(itemValue);
//   };

//   //Function to set block
//   const handleBlockChange = (itemValue, itemIndex) => {
//     setBlock(itemValue);
//     setBlockId(blocklist[itemIndex - 1]._id);
//   };

//   const handlePasscodeChange = async item => {
//     setPasscode(item);
//     const res = await passcodevalidate(item);
//     // console.log("res passcode--->",res.data)
//     // console.log(res.data, 'resdfjhdgf');
//     if (res.data.count == 1) {
//       setPasscodeError(false);
//       if (res.data.managertype == 'manager') {
//         setUsertype('fellow');
//         setManagertype(res.data.managertype);
//         setManagerId(res.data.managerid);
//         setManagername(res.data.managername);
//       } else if (res.data.managertype == 'crc') {
//         setUsertype('school');
//         setManagerId(res.data.managerid);
//         setManagertype(res.data.managertype);
//         setManagername(res.data.managername);
//       } else {
//         setPasscodeError(true);
//       }
//     } else {
//       setPasscodeError(true);
//     }
//   };
//   // console.log(passcode, usertype, managername, 'passcode');
//   //Function to handle selection of modal items
//   const handleSelection = async flag => {
//     modalRef.current?.close();
//     if (flag === 'camera') {
//       if (Platform.OS === 'ios') {
//         return;
//       } else {
//         try {
//           const granted = await PermissionsAndroid.request(
//             PermissionsAndroid.PERMISSIONS.CAMERA,
//             {
//               title: 'Support App Camera Permission',
//               message:
//                 'Support App needs access to your camera' +
//                 'so you can take pictures.',
//               buttonNeutral: 'Ask Me Later',
//               buttonNegative: 'Cancel',
//               buttonPositive: 'OK',
//             },
//           );

//           if (granted === PermissionsAndroid.RESULTS.GRANTED) {
//             ImagePicker.openCamera({
//               width: 300,
//               height: 400,
//               cropping: true,
//               compressImageMaxWidth: 300,
//               compressImageMaxHeight: 300,
//             })
//               .then(image => {
//                 setError(false);
//                 setImageUrl(image.path);
//                 setImageData(image);
//               })
//               .catch(err => console.error('Captchuring image error', err));
//           } else {
//             Alert.alert('Error', 'Camera Permission Not Granted');
//           }
//         } catch (err) {
//           console.error('Permision related error', err);
//         }
//       }
//     } else if (flag === 'gallery') {
//       ImagePicker.openPicker({
//         width: 300,
//         height: 400,
//         cropping: true,
//         compressImageMaxWidth: 300,
//         compressImageMaxHeight: 300,
//       })
//         .then(image => {
//           setError(false);
//           setImageUrl(image.path);
//           setImageData(image);
//         })
//         .catch(err => console.error('Selection from gallery error', err));
//     } else {
//     }
//   };
//   const handleSubmit = e => {
//     e.preventDefault();
//     if (passcodeError) {
//       Alert.alert(
//         'Please enter a valid passcode.',
//         '',
//         [
//           {
//             text: 'Cancel',
//             // onPress: () => Alert.alert('Cancel Pressed'),
//             style: 'destructive',
//           },
//           {
//             text: 'OK',
//             // onPress: () => submitFun(),
//             style: 'destructive',
//           },
//         ],
//         {cancelable: false},
//       );
//     } else {
//       const phoneRegExp = /^[6-9]\d{9}$/;
//       // const name_pattern = /^[a-z ]+$/;

//       if (name === undefined || name === null || name.trim() === '') {
//         setNameError(true);
//       } else if (
//         guardianName === undefined ||
//         guardianName === null ||
//         guardianName === ''
//       ) {
//         setNameError(false);
//         setGuardianNameError(true);
//       } else if (email === undefined || email === null || email === '') {
//         setNameError(false);
//         setGuardianNameError(false);
//         setEmailError(true);
//       } else if (!phoneRegExp.test('' + phone)) {
//         setNameError(false);
//         setGuardianNameError(false);
//         setEmailError(false);
//         setPhoneError(true);
//       } else if (dob === undefined || dob === null || dob === '') {
//         setNameError(false);
//         setGuardianNameError(false);
//         setEmailError(false);
//         setPhoneError(false);
//         setDobError(true);
//       } else if (
//         qualification === undefined ||
//         qualification === null ||
//         qualification === ''
//       ) {
//         setNameError(false);
//         setGuardianNameError(false);
//         setEmailError(false);
//         setPhoneError(false);
//         setDobError(false);
//         setQualificationError(true);
//       } else if (gender === undefined || gender === null || gender === '') {
//         setNameError(false);
//         setGuardianNameError(false);
//         setEmailError(false);
//         setPhoneError(false);
//         setDobError(false);
//         setQualificationError(false);
//         setGenderError(true);
//       } else if (
//         passcode === undefined ||
//         passcode === null ||
//         passcode === ''
//       ) {
//         setNameError(false);
//         setGuardianNameError(false);
//         setEmailError(false);
//         setPhoneError(false);
//         setDobError(false);
//         setQualificationError(false);
//         setGenderError(false);
//         setPasscodeError(true);
//       } else if (state === undefined || state === null || state === '') {
//         setNameError(false);
//         setGuardianNameError(false);
//         setEmailError(false);
//         setPhoneError(false);
//         setDobError(false);
//         setQualificationError(false);
//         setGenderError(false);
//         setPasscodeError(false);

//         setStateError(true);
//       } else if (
//         district === undefined ||
//         district === null ||
//         district === ''
//       ) {
//         setNameError(false);
//         setGuardianNameError(false);
//         setEmailError(false);
//         setPhoneError(false);
//         setDobError(false);
//         setQualificationError(false);
//         setGenderError(false);
//         setPasscodeError(false);

//         setStateError(false);
//         setDistrictError(true);
//       } else if (block === undefined || block === null || block === '') {
//         setNameError(false);
//         setGuardianNameError(false);
//         setEmailError(false);
//         setPhoneError(false);
//         setDobError(false);
//         setQualificationError(false);
//         setGenderError(false);
//         setPasscodeError(false);

//         setStateError(false);
//         setDistrictError(false);
//         setBlockError(true);
//       } else if (block === undefined || block === null || block === '') {
//         setNameError(false);
//         setGuardianNameError(false);
//         setEmailError(false);
//         setPhoneError(false);
//         setDobError(false);
//         setQualificationError(false);
//         setGenderError(false);
//         setPasscodeError(false);

//         setStateError(false);
//         setDistrictError(false);
//         setBlockError(true);
//       } else if (aadhaar.length > 0 && aadhaar.length != 12) {
//         console.log('aadhaar----->');
//         setNameError(false);
//         setGuardianNameError(false);
//         setEmailError(false);
//         setPhoneError(false);
//         setDobError(false);
//         setQualificationError(false);
//         setGenderError(false);
//         setPasscodeError(false);
//         setStateError(false);
//         setDistrictError(false);
//         setBlockError(false);
//         setAadhaarError(true);
//       } else {
//         setNameError(false);
//         setGuardianNameError(false);
//         setEmailError(false);
//         setPhoneError(false);
//         setDobError(false);
//         setQualificationError(false);
//         setGenderError(false);
//         setPasscodeError(false);

//         setStateError(false);
//         setDistrictError(false);
//         setBlockError(false);
//         setAadhaarError(false);

//         const userDetails = {
//           username: name,
//           guardianname: guardianName,
//           contactnumber: phone,
//           status: 'active',
//           userpolicy: 'agreed',
//           statename: state,
//           districtname: district,
//           blockname: block,
//           districtid: districtId,
//           stateid: 20,
//           blockid: blockId,
//           qualification: qualification,
//           gender: gender,
//           usertype: usertype,
//           userid: email,
//           passcode: passcode,
//           managerid: managerId,
//           managertype: managertype,
//           managername: managername,
//           qualification: qualification,
//           managertype: managertype,
//           dob: dob.split('-').reverse().join('-'),
//           aadhaar: aadhaar,
//           // image: profileDetails.image,
//         };
//         setModal(true);
//         // console.log(
//         //   'userDetails--------------------------------------------->',
//         //   userDetails,
//         // );
//         // dispatch(createmanager(imageData, userDetails));
//         // dispatch(googleSignIn({email}));
//         dispatch(types.createUserstart(userDetails));
//         // dispatch(types.rewardsUserstart(user[0].userid));
//       }
//     }
//   };
//   // useLayoutEffect(() => {
//   //   return async () => {
//   //     try {
//   //       await GoogleSignin.signOut();
//   //       dispatch(types.loadUserStart());
//   //     } catch (error) {
//   //       console.error(error);
//   //     }
//   //   };
//   // }, []);

//   useEffect(() => {
//     const backAction = () => {
//       Alert.alert(
//         'ଧ୍ୟାନ ଦିଅନ୍ତୁ! ',
//         'ଆପଣ ନିବେଶ କରିଥିବା ତଥ୍ୟ Save ହେବ ନାହିଁ। ଆପଣ ଏହା ଅବଗତ ଅଛନ୍ତି ତ?',
//         [
//           {text: 'Cancel', onPress: () => null},
//           {
//             text: 'Ok',
//             onPress: () => signOut(),
//             style: 'cancel',
//           },
//         ],
//       );
//       return true;
//     };

//     const backHandler = BackHandler.addEventListener(
//       'hardwareBackPress',
//       backAction,
//     );

//     return () => backHandler.remove();
//   }, []);

//   const signOut = async () => {
//     try {
//       await GoogleSignin.signOut();
//       dispatch(types.logOutUser());
//     } catch (error) {
//       console.error(error, error);
//     }
//   };

//   return (
//     <>
//       <StatusBar hidden />
//       {/* <Modal animationType="slide" transparent={true} visible={modal}>
//         <View style={[styles.centeredView]}> */}
//       {/* <View
//               style={[
//                 styles.modalView,
//                 {
//                   height: window.WindowHeigth * 0.25,
//                   marginTop: -0,
//                   width: window.WindowWidth * 0.5,
//                 },
//               ]}>
//           <View
//             style={[
//               styles.modalView,
//               {
//                 height: window.WindowHeigth * 0.7,

//                 width: window.WindowWidth * 0.8,
//                 borderRadius: 20,
//                 backgroundColor: '#00A3BF',
//                 // backgroundColor: '#74C5F4',
//               },
//             ]}>
//             <TouchableOpacity onPress={() => setModal(false)}>
//               <Entypo
//                 name="circle-with-cross"
//                 // color={Color.primary}
//                 size={30}
//                 style={{marginLeft: 255, marginTop: -25}}
//               />
//             </TouchableOpacity>
//             <Image
//               style={[
//                 styles.tinyLogos,
//                 {
//                   width: 150,
//                   height: 150,
//                   justifyContent: 'center',
//                   alignItems: 'center',
//                   marginTop: -40,
//                 },
//               ]}
//               source={require('../assets/Photos/reward.png')}
//             />

//             <Text
//               style={[
//                 styles.username,
//                 {
//                   fontSize: 18,
//                   color: 'white',
//                   fontWeight: 'bold',
//                   fontFamily: 'serif',
//                   justifyContent: 'center',
//                   textTransform: 'capitalize',
//                 },
//               ]}>
//               Congratulations! {''}
//               <Text style={{color: 'black', fontWeight: '800', marginTop: 20}}>
//                 {name}
//               </Text>
//             </Text>
//             <View style={{flexDirection: 'row'}}>
//               <Text
//                 style={[
//                   styles.username,
//                   {
//                     fontSize: 16,
//                     color: 'white',
//                     fontWeight: '400',
//                     fontFamily: 'serif',
//                     marginTop: 40,
//                   },
//                 ]}>
//                 You have earned 2
//               </Text>
//               <Image
//                 style={{
//                   width: 20,
//                   height: 20,
//                   marginTop: 42,
//                 }}
//                 source={require('../assets/Photos/star.png')}
//               />
//               {/* <FontAwesome5
//                   name="coins"
//                   size={27}
//                   color={'#FFD700'}
//                   style={[styles.icon, {marginRight: -40}]}
//                 /> */}
//       {/* <Text
//                 style={[
//                   styles.username,
//                   {
//                     fontSize: 16,
//                     color: 'white',
//                     fontWeight: '400',
//                     fontFamily: 'serif',
//                     marginTop: 40,
//                   },
//                 ]}>
//                 Coins
//               </Text>
//             </View>
//             <Text
//               style={[
//                 styles.username,
//                 {
//                   fontSize: 16,
//                   color: 'white',
//                   fontWeight: '400',
//                   fontFamily: 'serif',
//                   // marginTop: 10,
//                 },
//               ]}>
//               for Successfully Register The App 🎉
//             </Text>
//             <TouchableOpacity
//               onPress={() =>
//                 navigation.navigate('ମୋ ସଫଳତା', {
//                   type: 'ମୋ ସଫଳତା',
//                 })
//               }
//               style={[
//                 styles.bu,
//                 {
//                   marginTop: 40,
//                   width: window.WindowWidth * 0.5,
//                   // height: window.WindowHeigth * 0.1,
//                 },
//               ]}>
//               <Text
//                 style={{
//                   fontSize: 15,
//                   // color: Color.white,
//                   fontWeight: '900',
//                   textAlign: 'center',
//                   fontFamily: 'serif',
//                   color: 'white',
//                 }}>
//                 Check Reward
//               </Text>
//             </TouchableOpacity>
//             <TouchableOpacity onPress={() => navigation.navigate('home')}>
//               <Image
//                 style={{width: 130, height: 130, marginTop: -10}}
//                 source={require('../assets/Photos/backs.png')}
//               />
//             </TouchableOpacity>
//           </View>
//         </View>
//         {/* </View> */}
//       {/* </Modal>  */}

//       <ImageBackground
//         style={styles.backgroundImg}
//         source={require('../assets/Photos/register-bg.png')}>
//         {/* {loding ? <Loader /> : null} */}
//         <ScrollView style={[styles.constainer, {height: 100}]}>
//           {/* Bottomsheet code */}
//           <ButtomSheet modalRef={modalRef} modalHeight={modalHeight}>
//             <View style={styles.modalContainer}>
//               <TouchableOpacity
//                 onPress={() => {
//                   handleSelection('camera');
//                 }}
//                 style={styles.modalButtonContainer}>
//                 <Cameraicon name="camera" size={30} color={Colors.primary} />
//                 <Text style={styles.modalButtonText}>Take Picture</Text>
//               </TouchableOpacity>

//               <TouchableOpacity
//                 onPress={() => {
//                   handleSelection('gallery');
//                 }}
//                 style={styles.modalButtonContainer}>
//                 <Cameraicon name="file" size={30} color={Colors.info} />
//                 <Text style={styles.modalButtonText}>chose_gallery</Text>
//               </TouchableOpacity>
//             </View>
//           </ButtomSheet>

//           <View style={styles.editFormContainer}>
//             {/* Profile image code */}
//             <View style={styles.editImageContainer}>
//               <ImageBackground
//                 style={styles.imageContainer}
//                 source={
//                   error
//                     ? require('../assets/Photos/user.png')
//                     : imageUrl
//                     ? {uri: imageUrl}
//                     : require('../assets/Photos/user.png')
//                 }
//                 imageStyle={{borderRadius: 60}}
//                 onError={() => {
//                   setError(true);
//                 }}>
//                 <TouchableOpacity
//                   style={styles.editImageIconContainer}
//                   onPress={() => handleOpenBottomSheet()}>
//                   <Cameraicon name="camera" color={Colors.white} size={22} />
//                 </TouchableOpacity>
//               </ImageBackground>
//             </View>

//             <View style={{paddingHorizontal: 10, paddingVertical: 20}}>
//               {/*Name text inpute */}
//               <AppTextInput
//                 autoCapitalize="none"
//                 autoCorrect={false}
//                 iconFirst="rename-box"
//                 keyboardType="email-address"
//                 name="name"
//                 placeholder="Name"
//                 value={name}
//                 onChangeText={value => setName(value)}
//               />
//               <ErrorMessage visible={nameError} error={t('name_error')} />
//               <AppTextInput
//                 autoCapitalize="none"
//                 autoCorrect={false}
//                 iconFirst="rename-box"
//                 keyboardType="email-address"
//                 name=" guardianname"
//                 placeholder="Guardian Name"
//                 value={guardianName}
//                 onChangeText={value => setGuardianName(value)}
//               />
//               <ErrorMessage
//                 visible={guardianNameError}
//                 error={t('parentname_error')}
//               />
//               {/*Email text inpute*/}
//               <AppTextInput
//                 autoCapitalize="none"
//                 autoCorrect={false}
//                 iconFirst="email"
//                 name="name"
//                 placeholder="Email"
//                 value={email}
//                 // editable={false}
//                 onChangeText={value => setEmail(value)}
//               />
//               <ErrorMessage visible={emailError} error={t('email_error')} />

//               {/*Phone text inpute*/}
//               <AppTextInput
//                 autoCapitalize="none"
//                 autoCorrect={false}
//                 iconFirst="phone"
//                 maxLength={10}
//                 keyboardType="number-pad"
//                 name="name"
//                 placeholder="Phone"
//                 value={phone}
//                 onChangeText={value => setPhone(value)}
//               />
//               <ErrorMessage visible={phoneError} error={t('phone_error')} />

//               <View
//                 style={{
//                   marginVertical: 5,
//                   flexDirection: 'row',
//                   borderBottomWidth: 1,
//                   paddingBottom: 15,
//                   marginBottom: 17,
//                   borderWidth: 0.5,
//                   marginHorizontal: -1,
//                   paddingHorizontal: 11,
//                   marginLeft: -22,
//                 }}>
//                 <View>
//                   <MaterialCommunityIcons
//                     name="calendar"
//                     size={26}
//                     color={Colors.blue}
//                     style={styles.icon}
//                   />
//                 </View>

//                 <View>
//                   <DatePicker
//                     style={{
//                       width: 363,
//                       marginLeft: -15,
//                     }}
//                     date={dob}
//                     mode="date"
//                     placeholder={` date of birth`}
//                     dateFormat="DD-MM-YYYY"
//                     //format="YYYY-MM-DD"
//                     format="DD-MM-YYYY"
//                     minDate="01-01-1990"
//                     maxDate="01-01-2020"
//                     confirmBtnText="Confirm"
//                     cancelBtnText="Cancel"
//                     customStyles={{
//                       // dateIcon: {
//                       //   position: 'absolute',
//                       //   right: 184,
//                       //   top: 8,
//                       //   marginLeft: 0,
//                       // },
//                       dateInput: {
//                         marginLeft: -200,
//                         // borderColor: 'white',
//                         // borderStyle: 'dotted',
//                         marginRight: -12,
//                         borderWidth: -1,
//                         // borderRadius: 1,
//                         position: 'relative',
//                         flex: 1,

//                         height: 50,
//                         marginBottom: -10,
//                         borderRadius: 12,
//                       },
//                       // ... You can check the source to find the other keys.
//                     }}
//                     onDateChange={date => {
//                       setDob(date);
//                     }}
//                   />
//                 </View>
//               </View>
//               <ErrorMessage visible={dobError} error={t('dob_error')} />
//               {/*Picker for Qualification */}
//               <View style={styles.wrapper}>
//                 <Entypo
//                   name="graduation-cap"
//                   size={22}
//                   color={Colors.primary}
//                   style={styles.icon}
//                 />
//                 <Picker
//                   dropdownIconColor={Colors.primary}
//                   selectedValue={qualification}
//                   onValueChange={(itemValue, itemIndex) =>
//                     handleQualificationChange(itemValue, itemIndex)
//                   }
//                   style={styles.picker}
//                   name="qualification">
//                   <Picker.Item
//                     label="Select Qualification"
//                     value="0"
//                     enabled={false}
//                     style={styles.placeHolder}
//                   />
//                   {qualificationList.map(item => (
//                     <Picker.Item
//                       label={item}
//                       value={item}
//                       //  key={item._id}
//                       style={styles.pickerSelectItem}
//                     />
//                   ))}
//                 </Picker>
//               </View>
//               <ErrorMessage
//                 visible={qualificationError}
//                 error={t('qualification_error')}
//               />

//               {/*Picker for gender */}
//               <View style={styles.wrapper}>
//                 <Gender
//                   name="male-female"
//                   size={20}
//                   color={Colors.primary}
//                   style={styles.icon}
//                 />
//                 <Picker
//                   dropdownIconColor={Colors.primary}
//                   selectedValue={gender}
//                   onValueChange={itemValue => setGender(itemValue)}
//                   style={styles.picker}
//                   name="district">
//                   <Picker.Item
//                     label="Select Gender"
//                     value="0"
//                     enabled={false}
//                     style={styles.placeHolder}
//                   />
//                   <Picker.Item
//                     label="Male"
//                     value="male"
//                     style={styles.pickerSelectItem}
//                   />
//                   <Picker.Item
//                     label="Female"
//                     value="female"
//                     style={styles.pickerSelectItem}
//                   />
//                 </Picker>
//               </View>
//               <ErrorMessage visible={genderError} error={t('gender_error')} />

//               {/* Passcode */}
//               <AppTextInput
//                 autoCapitalize="characters"
//                 autoCorrect={false}
//                 iconFirst="barcode"
//                 keyboardType="email-address"
//                 name="passcode"
//                 placeholder="Passcode"
//                 value={passcode}
//                 onChangeText={value => handlePasscodeChange(value)}
//               />
//               <ErrorMessage
//                 visible={passcodeError}
//                 error={t('Passcode_error')}
//               />

//               {/*Picker for state */}
//               <View style={styles.wrapper}>
//                 <Entypo
//                   name="location-pin"
//                   size={20}
//                   color={Colors.primary}
//                   style={styles.icon}
//                 />
//                 <Picker
//                   dropdownIconColor={Colors.primary}
//                   selectedValue={state}
//                   onValueChange={itemValue => setState(itemValue)}
//                   style={styles.picker}
//                   name="district">
//                   <Picker.Item
//                     label="Select state"
//                     value="0"
//                     enabled={false}
//                     style={styles.placeHolder}
//                   />

//                   <Picker.Item
//                     label="Odisha"
//                     value="Odisha"
//                     key={1}
//                     style={styles.pickerSelectItem}
//                   />
//                 </Picker>
//               </View>
//               <ErrorMessage visible={stateError} error={t('state_error')} />
//               {/*Picker for district */}
//               <View style={styles.wrapper}>
//                 <Entypo
//                   name="location-pin"
//                   size={20}
//                   color={Colors.primary}
//                   style={styles.icon}
//                 />
//                 <Picker
//                   dropdownIconColor={Colors.primary}
//                   selectedValue={district}
//                   onValueChange={(itemValue, itemIndex) =>
//                     handleDistrictChange(itemValue, itemIndex)
//                   }
//                   style={styles.picker}
//                   name="district">
//                   <Picker.Item
//                     label="Select District"
//                     value="0"
//                     enabled={false}
//                     style={styles.placeHolder}
//                   />
//                   {districtlist.map(item => (
//                     <Picker.Item
//                       label={item.districtname}
//                       value={item.districtname}
//                       key={item._id}
//                       style={styles.pickerSelectItem}
//                     />
//                   ))}
//                 </Picker>
//               </View>
//               <ErrorMessage
//                 visible={districtError}
//                 error={t('district_error')}
//               />

//               {/*Picker for block */}
//               <View style={styles.wrapper}>
//                 <Entypo
//                   name="location-pin"
//                   size={20}
//                   color={Colors.primary}
//                   style={styles.icon}
//                 />
//                 <Picker
//                   dropdownIconColor={Colors.primary}
//                   selectedValue={block}
//                   onValueChange={(itemValue, itemIndex) =>
//                     handleBlockChange(itemValue, itemIndex)
//                   }
//                   style={styles.picker}
//                   name="district">
//                   <Picker.Item
//                     label="Select block"
//                     value="0"
//                     enabled={false}
//                     style={styles.placeHolder}
//                   />
//                   {blocklist.map(item => (
//                     <Picker.Item
//                       label={item.blockname}
//                       value={item.blockname}
//                       key={item._id}
//                       style={styles.pickerSelectItem}
//                     />
//                   ))}
//                 </Picker>
//               </View>
//               <ErrorMessage visible={blockError} error={t('block_error')} />

//               <AppTextInput
//                 autoCapitalize="none"
//                 autoCorrect={false}
//                 keyboardType="numeric"
//                 iconFirst="file"
//                 name="aadhaar"
//                 maxLength={12}
//                 // minLength={12}
//                 placeholder="Enter Aadhar Number"
//                 // value={aadhaar}
//                 // onChangeText={value => setAadhaar(value)}
//                 value={aadhaar}
//                 onChangeText={value => setAadhaar(value)}
//               />
//               <ErrorMessage visible={aadhaarError} error={t('aadhar_error')} />

//               <Button title="Register" onPress={handleSubmit} />
//             </View>
//           </View>
//         </ScrollView>
//       </ImageBackground>
//     </>
//   );
// };

// export default Register;

// const qualificationList = [
//   'Matriculation',
//   'Intermediate',
//   'Bachelor of Arts',
//   'Bachelor of Commerce',
//   'Bachelor of Science',
//   'Bachelor of Technology',
//   'Master of Arts',
//   'Master of Commerce',
//   'Master of Science',
//   'Master of Computer Application',
//   'Master of Social Work',
//   'Post Graduation',
// ];

// const styles = StyleSheet.create({
//   backgroundImg: {
//     height: window.WindowHeigth,
//     width: window.WindowWidth,
//     zIndex: 1,
//   },
//   button: {
//     backgroundColor: 'red',
//   },
//   constainer: {
//     alignSelf: 'center',

//     width: window.WindowWidth * 0.9,
//     // height: 5000,
//     marginTop: 29,
//     //  borderTopLeftRadius: 70,
//     marginBottom: 20,

//     backgroundColor: Colors.white,
//     borderRadius: 8,
//     shadowColor: Colors.black,
//     shadowOffset: {
//       width: 0,
//       height: 14,
//     },
//     shadowRadius: 9,
//     shadowOpacity: 0.1,
//     elevation: 1,
//     overflow: 'scroll',
//   },
//   editFormContainer: {
//     marginHorizontal: 13,
//     marginVertical: 59,
//     borderRadius: 8,
//     // backgroundColor: Colors.white,

//     marginLeft: 39,
//     //  borderTopLeftRadius: 70,
//   },
//   button: {
//     alignItems: 'center',
//     justifyContent: 'center',
//     paddingVertical: 12,
//     paddingHorizontal: 37,
//     borderRadius: 4,
//     elevation: 3,
//     marginLeft: 30,

//     marginRight: 45,
//     marginBottom: 12,
//     backgroundColor: '#00C0F0',
//   },
//   text: {
//     fontSize: 16,
//     lineHeight: 21,
//     fontWeight: 'bold',
//     letterSpacing: 0.25,
//     color: 'white',
//   },

//   editImageContainer: {
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginVertical: 20,
//   },

//   imageContainer: {
//     height: 120,
//     width: 120,
//     marginTop: -30,
//     marginRight: 20,
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   inputBorder: {
//     backgroundColor: '#cacaca',
//     color: Colors.black,
//     width: '25%',
//     height: 35,
//     borderRadius: 8,
//     borderColor: '#cacaca',
//     borderWidth: 1,
//     placeholderTextColor: Colors.black,
//   },
//   dob: {
//     marginVertical: 5,
//     flexDirection: 'row',
//     borderBottomWidth: 1,
//     paddingBottom: 10,
//     marginBottom: 17,
//     borderWidth: 0.5,
//     marginHorizontal: -1,
//     paddingHorizontal: 11,
//     marginLeft: -22,
//   },

//   editImageIconContainer: {
//     position: 'absolute',
//     bottom: 0,
//     right: 0,
//     backgroundColor: Colors.success,
//     width: 36,
//     height: 36,
//     borderRadius: 18,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   centeredView: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     marginTop: 22,
//   },
//   modalView: {
//     margin: 20,
//     backgroundColor: 'white',
//     borderRadius: 20,
//     padding: 35,
//     alignItems: 'center',
//     shadowColor: '#000',
//     shadowOffset: {
//       width: 0,
//       height: 2,
//     },
//     shadowOpacity: 0.25,
//     shadowRadius: 4,
//     elevation: 5,
//   },

//   modalContainer: {
//     height: window.WindowHeigth * 0.1,
//     backgroundColor: Colors.white,
//     elevation: 5,
//     width: '100%',
//     flex: 1,
//     justifyContent: 'space-evenly',
//     alignItems: 'center',
//     flexDirection: 'row',
//   },

//   modalButtonContainer: {
//     justifyContent: 'space-between',
//     alignItems: 'center',

//     height: 60,
//   },

//   modalButtonText: {
//     fontSize: 13,
//   },

//   wrapper: {
//     // flexDirection: 'row',
//     // justifyContent: 'space-evenly',
//     // alignItems: 'center',
//     // borderBottomWidth: 1,
//     // borderBottomColor: Colors.white,
//     // paddingBottom: 5,
//     // marginVertical: 5,
//     // minHeight: 35,
//     marginVertical: 5,
//     flexDirection: 'row',
//     borderBottomWidth: 1,
//     paddingBottom: 3,
//     marginBottom: 17,
//     borderWidth: 0.5,
//     marginHorizontal: -1,
//     paddingHorizontal: 11,
//     marginLeft: -22,
//   },

//   icon: {
//     marginHorizontal: 5,
//     marginVertical: 5,
//     marginTop: 15,
//   },

//   picker: {
//     flex: 1,
//     color: Colors.black,
//   },

//   placeHolder: {
//     color: Colors.greyPrimary,
//     fontSize: 18,
//     letterSpacing: 0.5,
//   },

//   pickerSelectItem: {
//     color: Colors.greyPrimary,
//     fontSize: 18,
//     letterSpacing: 0.5,
//     textTransform: 'uppercase',
//   },
//   p: {
//     fontFamily: 'Arial, Helvetica, sans-serif',
//     letterSpacing: 1,
//     fontWeight: '700',
//     textAlign: 'center',
//     textTransform: 'capitalize',

//     fontSize: 18,

//     color: 'black',

//     marginBottom: 25,
//     marginTop: 40,
//     textAlign: 'center',
//   },

//   bu: {
//     marginTop: 50,
//     width: '100%',
//     backgroundColor: Colors.primary,
//     padding: 20,
//     borderRadius: 5,
//   },
// });

import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Dimensions,
  TouchableOpacity,
  ImageBackground,
  Button,
  Pressable,
  StatusBar,
  BackHandler,
  PermissionsAndroid,
  Alert,
  Modal,
  ActivityIndicator,
  Image,
} from 'react-native';
import {ToastAndroid} from 'react-native';
import DatePicker from 'react-native-datepicker';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import ImagePicker from 'react-native-image-crop-picker';
import {GoogleSignin} from '@react-native-google-signin/google-signin';
import Api from '../environment/Api';
import {useNavigation} from '@react-navigation/native';
import {Color, Border, FontSize, FontFamily} from '../GlobalStyle';

import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  useLayoutEffect,
} from 'react';
import Cameraicon from 'react-native-vector-icons/Feather';
import ButtomSheet from '../components/BottomSheet';
import Colors from '../utils/Colors';
import {useTranslation} from 'react-i18next';
import AppTextInput from '../components/TextInput';
import ErrorMessage from '../components/ErrorMessage';
import Gender from 'react-native-vector-icons/Foundation';
import {Picker} from '@react-native-picker/picker';
import Entypo from 'react-native-vector-icons/Entypo';
import {useDispatch, useSelector} from 'react-redux';
import * as types from '../redux/slices/UserSlice';
import {useMemo} from 'react';
import {passcodevalidate} from '../redux/api/UserApi';
import * as window from '../utils/dimensions';
import {log} from 'console';
import {Adder} from 'd3';

const WIDTH = Dimensions.get('window').width;
const HEIGHT = Dimensions.get('window').height;
const Register = () => {
  const dispatch = useDispatch();

  const districtlist = useSelector(state => state.userdata.district);
  const blocklist = useSelector(state => state.userdata.block);
  const user = useSelector(state => state.userdata.newuser);
  // console.log(user, 'new user------------->');

  const {t} = useTranslation();

  const modalRef = useRef(null);
  const [successmodal, setSuccessmodal] = useState(false);
  const modalHeight = HEIGHT * 1;
  // const [name, setName] = useState(user.wa_name ? user.wa_name : '');
  const [name, setName] = useState('');

  const [guardianName, setGuardianName] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [imageData, setImageData] = useState({});
  const [phone, setPhone] = useState(
    // user?.wa_number ? user?.wa_number.slice(2, 12) : '',
    user?.contactnumber ? user?.contactnumber : '',
  );
  // console.log('phonenumber----->', phone);
  const [passcode, setPasscode] = useState('');
  const [managertype, setManagertype] = useState('');
  const [dob, setDob] = useState('');
  const [email, setEmail] = useState(
    // user?.contactnumber ? user?.contactnumber : user.emailid,
    user?.emailid ? user?.emailid : '',
  );

  console.log('email--->', email);
  const [district, setDistrict] = useState('');
  const [block, setBlock] = useState('');
  const [state, setState] = useState('');
  const [districtId, setDistrictId] = useState('');
  const [blockId, setBlockId] = useState('');
  const [gender, setGender] = useState('');
  const [aadhaar, setAadhaar] = useState('');

  const [mname, setMname] = useState('');
  const [lname, setLname] = useState('');
  // console.log('lname---->', lname.trim().toLowerCase().split(/\s+/)[0]);
  const [usertype, setUsertype] = useState('');
  const [managername, setManagername] = useState('');
  const [managerId, setManagerId] = useState('');
  //States for Error
  const [nameError, setNameError] = useState(false);
  const [guardianNameError, setGuardianNameError] = useState(false);
  const [emailError, setEmailError] = useState(false);
  const [phoneError, setPhoneError] = useState(false);
  const [numberExists, setNumberExists] = useState(false);
  const [emailExists, setEmailExists] = useState(false);
  // console.log('numberExists---->', numberExists);
  const [dobError, setDobError] = useState(false);
  const [qualificationError, setQualificationError] = useState(false);
  const [genderError, setGenderError] = useState(false);
  const [passcodeError, setPasscodeError] = useState(false);
  const [qualification, setQualification] = useState();
  const [districtError, setDistrictError] = useState(false);
  const [blockError, setBlockError] = useState(false);
  const [stateError, setStateError] = useState(false);
  const [toggleState, setToggleState] = useState(false);
  const [aadhaarError, setAadhaarError] = useState(false);
  const [modal, setModal] = useState(false);
  const [gifModal, setGifModal] = useState(false);
  const [lnameError, setLnameError] = useState(false);
  const [isLoading, setIsloading] = useState(false);
  //State to handle error in image error
  const [error, setError] = useState(false);

  //Handle the opening of message
  const handleOpenBottomSheet = useCallback(() => {
    modalRef.current?.open();
  }, []);

  useMemo(() => {
    dispatch(types.getalldistrictstart());
  }, [state]);

  //Function to set district
  const handleDistrictChange = (itemValue, itemIndex) => {
    //
    setDistrict(itemValue);
    setDistrictId(districtlist[itemIndex - 1]._id);
    setBlock('');
    dispatch(types.getallblockstart(districtlist[itemIndex - 1]._id));
  };

  const handleQualificationChange = (itemValue, itemIndex) => {
    //
    setQualification(itemValue);
  };

  //Function to set block
  const handleBlockChange = (itemValue, itemIndex) => {
    setBlock(itemValue);
    setBlockId(blocklist[itemIndex - 1]._id);
  };

  const handlePhone = (itemValue, itemIndex) => {
    setPhone(itemValue);
    // console.log('check length--->', itemValue.length);
    if (itemValue.length === 10) {
      const body = {
        contactnumber: itemValue,
      };
      Api.post(`checkCredentialAvailability`, body).then(response => {
        // console.log('numberresponse------>', response.data);
        if (
          response.data.status === 'success' &&
          response.data.unique === true
        ) {
          setPhoneError(false);
          setNumberExists(false);
          ToastAndroid.show(
            'Number successfully verified !',
            ToastAndroid.SHORT,
          );
        } else {
          // setPhoneError(true);
          setNumberExists(true);
          ToastAndroid.show(response.data.msg, ToastAndroid.SHORT);
        }
      });
    }
  };

  const handlePasscodeChange = async item => {
    setPasscode(item.toUpperCase());
    const res = await passcodevalidate(item.toUpperCase());
    //
    //
    if (res.data.count == 1) {
      setPasscodeError(false);
      if (res.data.managertype == 'manager') {
        setUsertype('fellow');
        setManagertype(res.data.managertype);
        setManagerId(res.data.managerid);
        setManagername(res.data.managername);
      } else if (res.data.managertype == 'crc') {
        setUsertype('school');
        setManagerId(res.data.managerid);
        setManagertype(res.data.managertype);
        setManagername(res.data.managername);
      } else {
        setPasscodeError(true);
      }
    } else {
      setPasscodeError(true);
    }
  };
  //
  //Function to handle selection of modal items
  const handleSelection = async flag => {
    modalRef.current?.close();
    if (flag === 'camera') {
      if (Platform.OS === 'ios') {
        return;
      } else {
        try {
          const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.CAMERA,
            {
              title: 'ThinkZone App Camera Permission',
              message:
                'ThinkZone App needs access to your camera' +
                'so you can take pictures.',
              buttonNeutral: 'Ask Me Later',
              buttonNegative: 'Cancel',
              buttonPositive: 'OK',
            },
          );

          if (granted === PermissionsAndroid.RESULTS.GRANTED) {
            ImagePicker.openCamera({
              width: 300,
              height: 400,
              cropping: true,
              compressImageMaxWidth: 300,
              compressImageMaxHeight: 300,
            })
              .then(image => {
                setError(false);
                setImageUrl(image.path);
                setImageData(image);
              })
              .catch(err => {});
          } else {
            Alert.alert('Error', 'Camera Permission Not Granted');
          }
        } catch (err) {}
      }
    } else if (flag === 'gallery') {
      ImagePicker.openPicker({
        width: 300,
        height: 400,
        cropping: true,
        compressImageMaxWidth: 300,
        compressImageMaxHeight: 300,
      })
        .then(image => {
          setError(false);
          setImageUrl(image.path);
          setImageData(image);
        })
        .catch(err => {});
    } else {
    }
  };

  const handleToggle = async value => {
    setToggleState(value);
    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      checkemailavailability(userInfo.user.email);
      // this.setState({userInfo});
    } catch (error) {
      // console.log('err--->', error);
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        // user cancelled the login flow
        // console.log('SIGN_IN_CANCELLED');
      } else if (error.code === statusCodes.IN_PROGRESS) {
        // operation (e.g. sign in) is in progress already
        // console.log('IN_PROGRESS');
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        // play services not available or outdated
        // console.log('PLAY_SERVICES_NOT_AVAILABLE');
      } else {
        // some other error happened
        // console.log('error 4', error);
      }
    }
  };

  const checkemailavailability = async email => {
    const body = {
      emailid: email,
    };

    Api.post(`checkCredentialAvailability`, body).then(response => {
      console.log('emailresponse------>', response.data);
      if (response.data.status === 'success' && response.data.unique === true) {
        //setPhoneError(false);
        // setNumberExists(false);
        setEmailExists(true);
        setEmail(email);

        ToastAndroid.show('Email successfully verified !', ToastAndroid.SHORT);
      } else if (
        response.data.status === 'fail' &&
        response.data.unique === false
      ) {
        handleClearCachedToken();
        ToastAndroid.show(response.data.msg, ToastAndroid.SHORT);
      } else {
        setEmail(email);
      }
    });
  };

  const [isSignedIn, setIsSignedIn] = useState(false);
  const handleClearCachedToken = async () => {
    try {
      await GoogleSignin.signOut();
      setIsSignedIn(false);

      // Additional logic for opening the Google SDK or navigating to another page
      // ...
    } catch (error) {
      console.error('Error clearing cached access token:', error);
    }
  };

  const handleSubmit = e => {
    e.preventDefault();
    if (passcodeError) {
      Alert.alert(
        'Please enter a valid passcode.',
        '',
        [
          {
            text: 'Cancel',
            // onPress: () => Alert.alert('Cancel Pressed'),
            style: 'destructive',
          },
          {
            text: 'OK',
            // onPress: () => submitFun(),
            style: 'destructive',
          },
        ],
        {cancelable: false},
      );
    } else if (numberExists === true) {
      Alert.alert(
        'Number is already in Use.Retry with another number',
        '',
        [
          {
            text: 'Cancel',
            // onPress: () => Alert.alert('Cancel Pressed'),
            style: 'destructive',
          },
          {
            text: 'OK',
            // onPress: () => submitFun(),
            style: 'destructive',
          },
        ],
        {cancelable: false},
      );
    } else if (emailExists === false && email.length === 0) {
      Alert.alert(
        'Verify Your Emailid ',
        '',
        [
          {
            text: 'Cancel',
            // onPress: () => Alert.alert('Cancel Pressed'),
            style: 'destructive',
          },
          {
            text: 'OK',
            // onPress: () => submitFun(),
            style: 'destructive',
          },
        ],
        {cancelable: false},
      );
    } else {
      const phoneRegExp = /^[6-9]\d{9}$/;
      // const regex = /^[^\s]+/;
      // const regex = sentence.trim().split(/\s+/);
      // const name_pattern = /^[a-z ]+$/;
      const patternRegExp = /^[a-zA-Z]+$/;

      if (
        name === undefined ||
        name === null ||
        name.trim() === '' ||
        !patternRegExp.test('' + name)
      ) {
        setNameError(true);
      } else if (lname === undefined || lname === null || lname.trim() === '') {
        setNameError(false);
        setLnameError(true);
      } else if (
        guardianName === undefined ||
        guardianName === null ||
        guardianName.trim() === ''
      ) {
        setNameError(false);
        setLnameError(false);

        setGuardianNameError(true);
      } else if (email === undefined || email === null || email === '') {
        setNameError(false);
        setLnameError(false);
        setGuardianNameError(false);
        setEmailError(true);
      } else if (!phoneRegExp.test('' + phone)) {
        setNameError(false);
        setLnameError(false);
        setGuardianNameError(false);
        setEmailError(false);
        setPhoneError(true);
      } else if (dob === undefined || dob === null || dob === '') {
        setNameError(false);
        setLnameError(false);
        setGuardianNameError(false);
        setEmailError(false);
        setPhoneError(false);
        setDobError(true);
      } else if (
        qualification === undefined ||
        qualification === null ||
        qualification === ''
      ) {
        setNameError(false);
        setLnameError(false);
        setGuardianNameError(false);
        setEmailError(false);
        setPhoneError(false);
        setDobError(false);
        setQualificationError(true);
      } else if (gender === undefined || gender === null || gender === '') {
        setNameError(false);
        setLnameError(false);
        setGuardianNameError(false);
        setEmailError(false);
        setPhoneError(false);
        setDobError(false);
        setQualificationError(false);
        setGenderError(true);
      } else if (
        passcode === undefined ||
        passcode === null ||
        passcode === ''
      ) {
        setNameError(false);
        setLnameError(false);
        setGuardianNameError(false);
        setEmailError(false);
        setPhoneError(false);
        setDobError(false);
        setQualificationError(false);
        setGenderError(false);
        setPasscodeError(true);
      } else if (state === undefined || state === null || state === '') {
        setNameError(false);
        setLnameError(false);
        setGuardianNameError(false);
        setEmailError(false);
        setPhoneError(false);
        setDobError(false);
        setQualificationError(false);
        setGenderError(false);
        setPasscodeError(false);

        setStateError(true);
      } else if (
        district === undefined ||
        district === null ||
        district === ''
      ) {
        setNameError(false);
        setLnameError(false);
        setGuardianNameError(false);
        setEmailError(false);
        setPhoneError(false);
        setDobError(false);
        setQualificationError(false);
        setGenderError(false);
        setPasscodeError(false);

        setStateError(false);
        setDistrictError(true);
      } else if (block === undefined || block === null || block === '') {
        setNameError(false);
        setLnameError(false);
        setGuardianNameError(false);
        setEmailError(false);
        setPhoneError(false);
        setDobError(false);
        setQualificationError(false);
        setGenderError(false);
        setPasscodeError(false);

        setStateError(false);
        setDistrictError(false);
        setBlockError(true);
      } else if (block === undefined || block === null || block === '') {
        setNameError(false);
        setLnameError(false);
        setGuardianNameError(false);
        setEmailError(false);
        setPhoneError(false);
        setDobError(false);
        setQualificationError(false);
        setGenderError(false);
        setPasscodeError(false);

        setStateError(false);
        setDistrictError(false);
        setBlockError(true);
      } else if (aadhaar.length > 0 && aadhaar.length != 12) {
        setNameError(false);
        setLnameError(false);
        setGuardianNameError(false);
        setEmailError(false);
        setPhoneError(false);
        setDobError(false);
        setQualificationError(false);
        setGenderError(false);
        setPasscodeError(false);
        setStateError(false);
        setDistrictError(false);
        setBlockError(false);
        setAadhaarError(true);
      } else {
        setNameError(false);
        setLnameError(false);
        setGuardianNameError(false);
        setEmailError(false);
        setPhoneError(false);
        setDobError(false);
        setQualificationError(false);
        setGenderError(false);
        setPasscodeError(false);

        setStateError(false);
        setDistrictError(false);
        setBlockError(false);
        setAadhaarError(false);
        // setGifModal(true);
        // setTimeout(() => {
        //   setSuccessmodal(true);
        // }, 2000);
        setSuccessmodal(true);
        const userDetails = {
          userid: email,
          emailid: email,
          emailidVerified: true,
          // username: name.trim().toLowerCase(),
          username: name + ' ' + mname + ' ' + lname,
          firstname: name.trim().toLowerCase().split(/\s+/)[0],
          middlename: mname.trim().toLowerCase(),
          lastname: lname.trim().toLowerCase().split(/\s+/)[0],
          usertype: usertype,
          guardianname: guardianName.trim().toLowerCase(),
          contactnumber: phone,
          phoneNumberVerified: true,
          qualification: qualification,
          gender: gender,
          dob: dob.split('-').reverse().join('-'),
          aadhaar: aadhaar,
          aadhaarUpdated:
            aadhaar.length > 0 && aadhaar.length === 12 ? true : false,
          loginType: user.loginType,
          userpolicy: 'agreed',
          managerid: managerId,
          managername: managername,
          passcode: passcode,
          status: 'active',
          stateid: 20,
          statename: state,
          districtid: districtId,
          districtname: district,
          blockid: blockId,
          blockname: block,
          // image: profileDeta
        };
        setModal(true);
        // console.log('userDetails----------->', userDetails);
        const data = {
          user: userDetails,
          image: '',
          userid: email,
        };
        dispatch(types.createUserstart(data));
        // console.log(
        //   'userDetails--------------------------------------------->',
        //   data,
        // );
        // dispatch(createmanager(imageData, userDetails));
        // dispatch(googleSignIn({email}));

        // dispatch(types.rewardsUserstart(user[0].userid));
      }
    }
  };
  // useLayoutEffect(() => {
  //   return async () => {
  //     try {
  //       await GoogleSignin.signOut();
  //       dispatch(types.loadUserStart());
  //     } catch (error) {
  //
  //     }
  //   };
  // }, []);

  useEffect(() => {
    const backAction = () => {
      Alert.alert(
        'ଧ୍ୟାନ ଦିଅନ୍ତୁ! ',
        'ଆପଣ ନିବେଶ କରିଥିବା ତଥ୍ୟ Save ହେବ ନାହିଁ। ଆପଣ ଏହା ଅବଗତ ଅଛନ୍ତି ତ?',
        [
          {text: 'Cancel', onPress: () => null},
          {
            text: 'Ok',
            onPress: () => signOut(),
            style: 'cancel',
          },
        ],
      );
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );

    return () => backHandler.remove();
  }, []);

  const signOut = async () => {
    try {
      await GoogleSignin.signOut();
      dispatch(types.logOutUser());
    } catch (error) {}
  };

  return (
    <View style={styles.userRegister}>
      <Modal animationType="slide" transparent={true} visible={successmodal}>
        <TouchableOpacity
          // onPress={() => setSuccessmodal(false)}
          style={[styles.centeredView]}>
          <View
            style={[
              styles.modalView,
              {
                height: window.WindowHeigth * 1.1,

                width: window.WindowWidth * 1,
                borderRadius: 20,
                // backgroundColor: Color.ghostwhite,
                backgroundColor: 'white',
              },
            ]}>
            {/* <Pressable onPress={() => setModal(false)}>
              <Entypo
                name="circle-with-cross"
                // color={Color.primary}
                size={30}
                style={{marginLeft: 255, marginTop: -25}}
              />
            </Pressable> */}
            {/* <Image
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
            /> */}
            <Image
              style={[
                {
                  justifyContent: 'center',
                  alignItems: 'center',
                },
              ]}
              source={require('../assets/Image/https___lottiefiles.com_121018-done.gif')}
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
                },
              ]}>
              Congratulations ! {name} ସଫଳତାର ସହ ଆପଣଙ୍କ ପ୍ରୋଫାଇଲ୍ ପ୍ରସ୍ତୁତ ହୋଇ
              ସାରିଛି ଏବଂ ଆପଣ ୨ଟି କଏନ ହାସଲ କରିଛନ୍ତି । ଆପଣ ଶିକ୍ଷକ ବିଭାଗରେ ଥିବା
              ମୂଲ୍ୟାଙ୍କନ ଦେଇପାରିବେ ।
            </Text>
          </View>
        </TouchableOpacity>
      </Modal>
      <ScrollView>
        <ButtomSheet modalRef={modalRef} modalHeight={modalHeight}>
          <View style={styles.modalContainer}>
            <TouchableOpacity
              onPress={() => {
                handleSelection('camera');
              }}
              style={styles.modalButtonContainer}>
              <Cameraicon name="camera" size={30} color={Colors.primary} />
              <Text style={styles.modalButtonText}>Take Picture</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => {
                handleSelection('gallery');
              }}
              style={styles.modalButtonContainer}>
              <Cameraicon name="file" size={30} color={Colors.info} />
              <Text style={styles.modalButtonText}>chose_gallery</Text>
            </TouchableOpacity>
          </View>
        </ButtomSheet>
        <View
          style={{
            paddingHorizontal: 19,
            paddingVertical: 130,
            marginLeft: 20,

            paddingBottom: 50,
          }}>
          <ImageBackground
            style={[
              styles.userRegisterChild,
              styles.statusBarBgLayout,
              {paddingTop: 50},
            ]}
            resizeMode="cover"
            source={
              error
                ? require('../assets/Photos/userss.png')
                : imageUrl
                ? {uri: imageUrl}
                : require('../assets/Photos/userss.png')
            }
            imageStyle={{borderRadius: 60}}
            onError={() => {
              setError(true);
            }}
            // source={require('../assets/Image/group-35.png')}
          >
            <TouchableOpacity
              style={styles.editImageIconContainer}
              onPress={() => handleOpenBottomSheet()}>
              <Cameraicon name="camera" color={Colors.white} size={22} />
            </TouchableOpacity>
          </ImageBackground>
          {/* <Image
              resizeMode="cover"
              source={require('../assets/Image/camera.png')}
            /> */}
          <TouchableOpacity
            style={styles.iconmessagesmessageEdit}
            onPress={() => {
              handleSelection('camera');
            }}></TouchableOpacity>
          <View style={{marginTop: 50}}>
            {/*Email text inpute*/}

            {email.length > 0 ? (
              <AppTextInput
                autoCapitalize="none"
                autoCorrect={false}
                iconFirst="account-box"
                editable={false}
                name="name"
                placeholder="Email"
                placeholderTextColor="black"
                value={email}
                // editable={false}
                onChangeText={value => setEmail(value)}
              />
            ) : (
              <TouchableOpacity
                style={{
                  top: 15,
                  margin: 8,
                  paddingLeft: 20,
                  paddingRight: 20,
                  paddingTop: 5,
                  paddingBottom: 5,
                  height: 55,
                  width: window.WindowWidth * 0.9,
                  justifyContent: isLoading ? 'center' : 'flex-start',
                  alignItems: 'center',
                  alignSelf: 'center',
                  marginTop: -20,
                  backgroundColor: Color.ghostwhite,
                  flexDirection: 'row',
                  // justifyContent: 'space-between',
                  // marginRight: 10,
                  // marginLeft: 50,
                  borderRadius: 22,
                }}
                onPress={handleToggle}>
                <>
                  <Image
                    source={require('../assets/Photos/googles.png')}
                    style={{
                      width: 24,
                      height: 24,
                      // marginTop: -1,

                      // justifyContent: 'center',
                      marginRight: 15,
                    }}
                  />
                  <Text
                    style={{
                      width: '100%',

                      textAlign: 'left',

                      fontSize: 13,
                      width: 250,
                      fontWeight: '500',
                      color: '#333333',
                      fontFamily: FontFamily.poppinsMedium,
                    }}>
                    Verify Emailid With Google
                  </Text>
                </>
              </TouchableOpacity>
            )}
            <View style={{paddingTop: 20}}>
              {/* <ErrorMessage visible={emailError} error={t('email_error')} /> */}
              {/*Name text inpute*/}
              <AppTextInput
                autoCapitalize="none"
                autoCorrect={false}
                iconFirst="rename-box"
                keyboardType="email-address"
                name="name"
                placeholder="First Name*"
                placeholderTextColor="black"
                value={name}
                onChangeText={value => setName(value)}
              />

              <ErrorMessage visible={nameError} error={t('fname_error')} />

              <AppTextInput
                autoCapitalize="none"
                autoCorrect={false}
                iconFirst="rename-box"
                keyboardType="email-address"
                name="name"
                placeholder="Middle Name"
                placeholderTextColor="black"
                value={mname}
                onChangeText={value => setMname(value)}
              />

              {/* <ErrorMessage visible={nameError} error={t('name_error')} /> */}

              <AppTextInput
                autoCapitalize="none"
                autoCorrect={false}
                iconFirst="rename-box"
                keyboardType="email-address"
                name="name"
                placeholder="Last Name*"
                placeholderTextColor="black"
                value={lname}
                onChangeText={value => setLname(value)}
              />

              <ErrorMessage visible={lnameError} error={t('lame_error')} />
              <AppTextInput
                autoCapitalize="none"
                autoCorrect={false}
                iconFirst="human-child"
                keyboardType="email-address"
                name=" guardianname"
                placeholder="Guardian Name"
                placeholderTextColor="black"
                value={guardianName}
                onChangeText={value => setGuardianName(value)}
              />
              <ErrorMessage
                visible={guardianNameError}
                error={t('parentname_error')}
              />

              {/*Phone text inpute*/}
              <AppTextInput
                autoCapitalize="none"
                autoCorrect={false}
                iconFirst="phone"
                maxLength={10}
                keyboardType="number-pad"
                name="name"
                placeholder="Phone Number"
                placeholderTextColor="black"
                value={phone}
                // onChangeText={() => handlePhone()}
                onChangeText={(itemValue, itemIndex) =>
                  handlePhone(itemValue, itemIndex)
                }
              />
              <ErrorMessage visible={phoneError} error={t('phone_error')} />
              <View
                style={{
                  marginVertical: 5,
                  flexDirection: 'row',
                  // borderBottomWidth: 1,
                  paddingBottom: 15,
                  marginBottom: 17,
                  // borderWidth: 0.5,
                  marginHorizontal: -1,
                  paddingHorizontal: 11,
                  marginLeft: -22,
                  borderRadius: 15,
                  backgroundColor: '#f3f2ff',
                }}>
                <View>
                  <MaterialCommunityIcons
                    name="calendar"
                    size={26}
                    color={Colors.greyPrimary}
                    style={styles.icon}
                  />
                </View>

                <View>
                  <DatePicker
                    style={{
                      // width: 363,g
                      // marginLeft: 3,
                      placeholderTextColor: 'black',
                    }}
                    date={dob}
                    mode="date"
                    placeholder={`DD/MM/YYYY`}
                    placeholderTextColor={'black'}
                    dateFormat="DD-MM-YYYY"
                    //format="YYYY-MM-DD"
                    format="DD-MM-YYYY"
                    minDate="01-01-1900"
                    maxDate="01-01-2020"
                    confirmBtnText="Confirm"
                    cancelBtnText="Cancel"
                    customStyles={{
                      // placeholderTextColor: 'black',
                      dateIcon: {
                        display: 'none',
                      },
                      placeHolder: {
                        placeholderTextColor: 'black',
                      },
                      dateInput: {
                        // marginLeft: -200,
                        placeholderTextColor: 'black',
                        // borderColor: 'white',
                        // borderStyle: 'dotted',
                        // marginRight: -12,
                        borderWidth: -1,
                        // borderRadius: 1,
                        color: 'black',
                        position: 'relative',
                        flex: 1,

                        height: 50,
                        marginBottom: -10,
                        borderRadius: 12,
                      },
                      // ... You can check the source to find the other keys.
                    }}
                    onDateChange={date => {
                      setDob(date);
                    }}
                  />
                </View>
              </View>
              <ErrorMessage visible={dobError} error={t('dob_error')} />
              {/*Picker for Qualification */}
              <View style={styles.wrapper}>
                <Entypo
                  name="graduation-cap"
                  size={22}
                  color={Colors.greyPrimary}
                  style={styles.icon}
                />
                <Picker
                  dropdownIconColor={Colors.primary}
                  selectedValue={qualification}
                  onValueChange={(itemValue, itemIndex) =>
                    handleQualificationChange(itemValue, itemIndex)
                  }
                  style={styles.picker}
                  name="qualification">
                  <Picker.Item
                    label="Select Qualification*"
                    value="0"
                    enabled={false}
                    style={styles.placeHolder}
                  />
                  {qualificationList.map(item => (
                    <Picker.Item
                      label={item}
                      value={item}
                      //  key={item._id}
                      style={styles.pickerSelectItem}
                    />
                  ))}
                </Picker>
              </View>
              <ErrorMessage
                visible={qualificationError}
                error={t('qualification_error')}
              />
              {/*Picker for gender */}
              <View style={styles.wrapper}>
                <Gender
                  name="male-female"
                  size={20}
                  color={Colors.greyPrimary}
                  style={styles.icon}
                />
                <Picker
                  dropdownIconColor={Colors.primary}
                  selectedValue={gender}
                  onValueChange={itemValue => setGender(itemValue)}
                  style={styles.picker}
                  name="district">
                  <Picker.Item
                    label="Select Gender*"
                    value="0"
                    enabled={false}
                    style={styles.placeHolder}
                  />
                  <Picker.Item
                    label="Male"
                    value="male"
                    style={styles.pickerSelectItem}
                  />
                  <Picker.Item
                    label="Female"
                    value="female"
                    style={styles.pickerSelectItem}
                  />
                  <Picker.Item
                    label="Others"
                    value="others"
                    style={styles.pickerSelectItem}
                  />
                </Picker>
              </View>
              <ErrorMessage visible={genderError} error={t('gender_error')} />

              {/* Passcode */}

              <AppTextInput
                autoCapitalize="characters"
                autoCorrect={false}
                iconFirst="barcode"
                keyboardType="email-address"
                name="passcode"
                placeholder="Passcode*"
                placeholderTextColor="black"
                value={passcode}
                onChangeText={value => handlePasscodeChange(value)}
              />
              <ErrorMessage
                visible={passcodeError}
                error={t('Passcode_error')}
              />
              {/*Picker for state */}
              <View style={styles.wrapper}>
                <Entypo
                  name="location-pin"
                  size={20}
                  color={Colors.greyPrimary}
                  style={styles.icon}
                />
                <Picker
                  dropdownIconColor={Colors.primary}
                  selectedValue={state}
                  onValueChange={itemValue => setState(itemValue)}
                  style={styles.picker}
                  name="district">
                  <Picker.Item
                    label="Select state*"
                    value="0"
                    enabled={false}
                    style={styles.placeHolder}
                  />

                  <Picker.Item
                    label="Odisha"
                    value="Odisha"
                    key={1}
                    style={styles.pickerSelectItem}
                  />
                </Picker>
              </View>
              <ErrorMessage visible={stateError} error={t('state_error')} />
              {/*Picker for district */}
              <View style={styles.wrapper}>
                <Entypo
                  name="location-pin"
                  size={20}
                  color={Colors.greyPrimary}
                  style={styles.icon}
                />
                <Picker
                  dropdownIconColor={Colors.primary}
                  selectedValue={district}
                  onValueChange={(itemValue, itemIndex) =>
                    handleDistrictChange(itemValue, itemIndex)
                  }
                  style={styles.picker}
                  name="district">
                  <Picker.Item
                    label="Select District*"
                    value="0"
                    enabled={false}
                    style={styles.placeHolder}
                  />
                  {districtlist.map(item => (
                    <Picker.Item
                      label={item.districtname}
                      value={item.districtname}
                      key={item._id}
                      style={styles.pickerSelectItem}
                    />
                  ))}
                </Picker>
              </View>
              <ErrorMessage
                visible={districtError}
                error={t('district_error')}
              />
              {/*Picker for block */}
              <View style={styles.wrapper}>
                <Entypo
                  name="location-pin"
                  size={20}
                  color={Colors.greyPrimary}
                  style={styles.icon}
                />
                <Picker
                  dropdownIconColor={Colors.primary}
                  selectedValue={block}
                  onValueChange={(itemValue, itemIndex) =>
                    handleBlockChange(itemValue, itemIndex)
                  }
                  style={styles.picker}
                  name="district">
                  <Picker.Item
                    label="Select block*"
                    value="0"
                    enabled={false}
                    style={styles.placeHolder}
                  />
                  {blocklist.map(item => (
                    <Picker.Item
                      label={item.blockname}
                      value={item.blockname}
                      key={item._id}
                      style={styles.pickerSelectItem}
                    />
                  ))}
                </Picker>
              </View>
              <ErrorMessage visible={blockError} error={t('block_error')} />
              <AppTextInput
                autoCapitalize="none"
                autoCorrect={false}
                keyboardType="numeric"
                iconFirst="file"
                name="aadhaar"
                maxLength={12}
                // minLength={12}
                placeholder="Enter Aadhar Number"
                placeholderTextColor="black"
                // value={aadhaar}
                // onChangeText={value => setAadhaar(value)}
                value={aadhaar}
                onChangeText={value => setAadhaar(value)}
              />
              <ErrorMessage visible={aadhaarError} error={t('aadhar_error')} />
              {/* <View style={styles.reg}>
            <Text style={styles.reg} title="Register" onPress={handleSubmit}>
              Register
            </Text>
          </View> */}
            </View>
          </View>
          <TouchableOpacity
            onPress={handleSubmit}
            style={{
              margin: 8,
              paddingLeft: 20,
              paddingRight: 20,
              paddingTop: 5,
              paddingBottom: 5,
              height: 45,
              borderRadius: Border.br_xl,
              backgroundColor: Color.royalblue,
              width: 209,
              height: 48,

              // position: 'absolute',
              // width: window.WindowWidth * 0.75,
              // justifyContent: 'center',
              alignItems: 'center',

              flexDirection: 'row',
              // justifyContent: 'space-between',
              marginRight: 10,
              marginLeft: 40,
              marginTop: 60,
            }}>
            <Text
              style={{
                width: '100%',

                justifyContent: 'center',
                letterSpacing: 1,
                textAlign: 'center',
                fontFamily: FontFamily.poppinsMedium,
                fontWeight: '500',

                // marginLeft: 50,
                // fontSize: 14,
                fontWeight: '500',
                fontSize: FontSize.size_5xl,
                color: Color.primaryContrast,

                marginTop: -5,
              }}>
              Register
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};
const qualificationList = [
  'Matriculation',
  'Intermediate',
  'Bachelor of Arts',
  'Bachelor of Commerce',
  'Bachelor of Science',
  'Bachelor of Technology',
  'Master of Arts',
  'Master of Commerce',
  'Master of Science',
  'Master of Computer Application',
  'Master of Social Work',
  'Post Graduation',
];
const styles = StyleSheet.create({
  backgroundImg: {
    height: window.WindowHeigth,
    width: window.WindowWidth,
    zIndex: 1,
  },
  button: {
    backgroundColor: 'red',
  },
  constainer: {
    alignSelf: 'center',

    width: window.WindowWidth * 0.9,
    // height: 5000,
    marginTop: 29,
    //  borderTopLeftRadius: 70,
    marginBottom: 20,

    backgroundColor: Colors.white,
    borderRadius: 8,
    shadowColor: Colors.black,
    shadowOffset: {
      width: 0,
      height: 14,
    },
    shadowRadius: 9,
    shadowOpacity: 0.1,
    elevation: 1,
    overflow: 'scroll',
  },
  editFormContainer: {
    marginHorizontal: 13,
    marginVertical: 59,
    borderRadius: 8,
    // backgroundColor: Colors.white,

    marginLeft: 39,
    //  borderTopLeftRadius: 70,
  },
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 37,
    borderRadius: 4,
    elevation: 3,
    marginLeft: 30,

    marginRight: 45,
    marginBottom: 12,
    backgroundColor: '#00C0F0',
  },
  text: {
    fontSize: 16,
    lineHeight: 21,
    fontWeight: 'bold',
    letterSpacing: 0.25,
    color: 'white',
  },

  editImageContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 20,
  },

  imageContainer: {
    height: 120,
    width: 120,
    marginTop: -30,
    marginRight: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputBorder: {
    backgroundColor: '#cacaca',
    color: Colors.black,
    width: '25%',
    height: 35,
    borderRadius: 8,
    borderColor: '#cacaca',
    borderWidth: 1,
    placeholderTextColor: Colors.black,
  },
  dob: {
    marginVertical: 5,
    flexDirection: 'row',
    // borderBottomWidth: 1,
    paddingBottom: 10,
    marginBottom: 17,
    // borderWidth: 0.5,
    marginHorizontal: -1,
    paddingHorizontal: 11,
    marginLeft: -22,
  },

  editImageIconContainer: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: 'gray',
    width: 36,
    height: 36,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
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

  modalButtonContainer: {
    justifyContent: 'space-between',
    alignItems: 'center',

    height: 60,
  },

  modalButtonText: {
    fontSize: 13,
  },

  wrapper: {
    // flexDirection: 'row',
    // justifyContent: 'space-evenly',
    // alignItems: 'center',
    // borderBottomWidth: 1,
    // borderBottomColor: Colors.white,
    // paddingBottom: 5,
    // marginVertical: 5,
    // minHeight: 35,
    marginVertical: 5,
    flexDirection: 'row',
    // borderBottomWidth: 1,
    // color: 'black',
    paddingBottom: 3,
    marginBottom: 17,
    borderRadius: 15,
    backgroundColor: '#f3f2ff',
    // borderWidth: 0.5,
    marginHorizontal: -1,
    paddingHorizontal: 11,
    marginLeft: -22,
  },

  icon: {
    marginHorizontal: 5,
    marginVertical: 5,
    marginTop: 15,
  },

  picker: {
    flex: 1,
    color: Colors.black,
  },

  placeHolder: {
    color: Colors.greyPrimary,
    fontSize: 18,
    letterSpacing: 0.5,
  },

  pickerSelectItem: {
    color: Colors.greyPrimary,
    fontSize: 18,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
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

  iconLayout: {
    width: 13,
    height: 13,
    marginTop: -6.12,
  },
  statusBarBgLayout: {
    maxHeight: '100%',
    maxWidth: '100%',
    position: 'absolute',
    overflow: 'hidden',
  },

  groupChildPosition: {
    backgroundColor: Color.ghostwhite,
    borderRadius: Border.br_7xs,
    left: '0%',
    top: '0%',
    position: 'absolute',
  },

  userRegisterChild: {
    height: 200,
    width: 130,
    top: '7.15%',
    // top: 50,
    right: '33.33%',
    // bottom: '50.94%',
    left: '33.61%',
    marginTop: -70,
  },
  iconmessagesmessageEdit: {
    top: 143,
    left: 220,
    width: 30,
    height: 30,
    marginTop: -10,
    position: 'absolute',
  },

  userRegister: {
    backgroundColor: Color.primaryContrast,
    flex: 1,
    height: 800,
    overflow: 'visible',
    width: '100%',
  },
  reg: {
    backgroundColor: Color.primaryContrast,
    width: window.WindowWidth * 0.8,
  },
});

export default Register;
