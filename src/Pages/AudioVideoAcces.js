import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  PermissionsAndroid,
  Image,
  ScrollView,
  BackHandler,
  Platform,
  ActivityIndicator,
  Alert,
  Modal,
  ToastAndroid,
} from "react-native";
import { check, request, PERMISSIONS, RESULTS } from "react-native-permissions";
import { S3_BUCKET, REGION, ACCESS_KEY, SECRET_ACCESS_KEY } from "@env";
import { Buffer } from "buffer";
import RNFS from "react-native-fs";
import { S3 } from "aws-sdk";
import * as window from "../utils/dimensions";
import { useDispatch, useSelector } from "react-redux";
import React, { useEffect, useState } from "react";
import API from "../environment/Api";
import DropdownComponent from "../components/DropdownComponent";
import * as studentstypes from "../redux/slices/StudentSlice";
import RNFetchBlob from "react-native-blob-util";
import Norecord from "../components/Norecord";
import Colors from "../utils/Colors";
import AntDesign from "react-native-vector-icons/AntDesign";
import { useFocusEffect } from "@react-navigation/native";
import Ionicons from "react-native-vector-icons/Ionicons";
import DocumentPicker from "react-native-document-picker";
import AudioRecorderPlayer from "react-native-audio-recorder-player";
import { Color, FontFamily } from "../GlobalStyle";
import Api from "../environment/Api";
import { SafeAreaView } from "react-native-safe-area-context";
import { log } from "react-native-reanimated";

const audioRecorderPlayer = new AudioRecorderPlayer();

const AudioVideoAcces = ({ route, navigation }) => {
  // const teacherdata = useSelector(state => state.userdata.user);
  // console.log("teacherdata------->",teacherdata)
  // console.log('S3BUCKET---------->', S3, S3_BUCKET);
  let [securedMark, setSecuredMark] = useState(0);
  const [language, setLanguage] = useState("od");
  const [refresh, setRefreshList] = useState(new Date());
  const [quizs, setQuizs] = useState([]);
  const [isLoading, setIsloading] = useState(true);

  const [singleFile, setSingleFile] = useState({});
  const [isPlaying, setIsPlaying] = useState(false);
  const [studentList, setStudentList] = useState([]);
  const [startRecording, setStartRecording] = useState(false);
  const [perStudentdata, setPerStudentData] = useState();
  const [stopRecording, setStopRecording] = useState(false);
  const [firstCard, setFirstCard] = useState(true);
  const [recordSubmit, setRecordSubmit] = useState(false);
  const [showModal, setShowModal] = useState(0);
  const [saveAudioStatus, setSaveAudioStatus] = useState();
  // console.log('startRecording---->', startRecording);
  // console.log('stopRecording---->', stopRecording);
  // console.log('recordSubmit---->', recordSubmit);
  const [data, setData] = useState();
  const teacherdata = useSelector((state) => state.userdata.user?.resData);
  const dispatch = useDispatch();
  const studentData = useSelector((state) => state.studentdata.students);
  const { studentDetails, type, quizId } = route.params;
  const { userid, username, usertype, managerid, managername, passcode } =
    teacherdata[0];

  // const {studentid, studentname} = studentData[0];

  useEffect(() => {
    dispatch(studentstypes.getStudentStart(teacherdata[0].userid));
    // console.log('called xxxxxxxxxxxxxxxx 1: ');
  }, []);
  useEffect(() => {
    const students = [{ studentname: "Select Student", id: 1 }, ...studentData];
    // console.log('1: ', students);
    setStudentList(students);
    // studentData ? setStudentList(studentData) : null;
  }, []);

  // const question = [
  //   {id: 1, que: 'ନିଜକୁ ପ୍ରକାଶ କରିବା ପାଇଁ ଛୋଟ ବାକ୍ୟ ଲେଖିପାରୁଛି କି'},
  //   {id: 2, que: 'ଲେଖାରେ କ୍ରିୟା ପଦ, ବିଶେଷ୍ୟ ପଦ ବ୍ୟବହାର କରିପାରୁଛି କି'},
  //   {id: 3, que: 'ଲେଖାରେ ସଠିକ୍ ବିରାମ ଚିହ୍ନ ବ୍ୟବହାର କରିପାରୁଛି କି'},
  //   {id: 4, que: 'ନିଜେ ଏକ କ୍ଷୁଦ୍ର ଗପ କିମ୍ବା ଅନୁଚ୍ଛେଦ ଲେଖିପାରୁଛି କି'},
  //   {id: 5, que: 'ବ୍ୟାକରଣଗତ ଭାବେ ସଠିକ୍ ବାକ୍ୟ ଲେଖିପାରୁଛି କି'},
  // ];
  const [questions, setQuestion] = useState([]);
  // console.log('questions---->', questions);
  const [selectedQuestion, setSelectedQuestion] = useState([]);
  // console.log('selectedQuestion---->', selectedQuestion);

  const [state, setState] = useState({});
  const [myArray, setMyArray] = useState([]);
  // console.log('questions filter-------->', myArray);
  // const dat = questions.map(ele => ele.que);

  const [showCrd, setShowCrd] = useState("");
  // console.log('showCrd--->', showCrd);

  const getStudentAudio = (item) => {
    console.log("item--->", item);

    if (item.id === 1) {
      setPerStudentData();
      setSelectedQuestion([]);
    } else {
      setFirstCard(true);
      setStartRecording(false);
      setPerStudentData(item);

      // console.log('item--->', item);
      Api.get(
        `getStudAudioAssessQuesWidStatus/${item.userid}/${item.usertype}/${item.studentid}/${item.program}/${item.class}`
      ).then((response) => {
        console.log("response.data--->", response.data);
        if (response.data[0]?.assessmentStatus === "complete") {
          // setQuestion(response?.data);

          Alert.alert("", "Audio Successfully Submitted।", [
            {
              text: "Cancel",
              onPress: () => null,
              style: "cancel",
            },
            { text: "OK", onPress: () => null },
          ]);

          setSelectedQuestion([]);
        } else {
          // console.log('rsdata---->', response.data);
          let data = response.data?.assessmentData.map((element) => {
            return { ...element, active: "" };
          });

          setQuestion(response?.data);
          setSelectedQuestion(data);
        }
      });
    }
  };

  const [activeModal, setActiveModal] = useState(null);
  // console.log('activeModal--->', activeModal);
  const [activeModalData, setActiveModalData] = useState([]);
  // console.log('activeModalData--->', activeModalData);

  const [selectedItem, setSelectedItem] = useState(null);
  // console.log('selectedItem---->', selectedItem);
  const [myArraySet, setMyArraySet] = useState([]);
  const [openRecordModal, setOpenRecordModal] = useState(false);
  // console.log('check length------->', selectedItem?.answer.length);
  const [openIndex, setOpenIndex] = useState(null);
  // console.log('openIndex---->', openIndex);

  useFocusEffect(
    React.useCallback(() => {
      // Do something when the screen is focused
      const backAction = () => {
        // setModal(true);

        Alert.alert(
          "ଧ୍ୟାନ ଦିଅନ୍ତୁ! ",
          "ଆପଣ ଏହି ମଡ୍ୟୁଲ୍ ଛାଡିବାକୁ ଚାହୁଁଛନ୍ତି କି?",
          [
            {
              text: "Cancel",
              onPress: () => null,
              style: "default",
            },
            {
              text: "Ok",
              onPress: () => navigation.goBack(),
              style: "default",
            },
          ]
        );
        return true;
      };

      const backHandler = BackHandler.addEventListener(
        "hardwareBackPress",
        backAction
      );

      return () => backHandler.remove();
    }, [])
  );

  const openModal = (i, ele, atdStatus) => {
    // console.log('adStatus----->', atdStatus);
    // setMyArraySet(prevArray => [...prevArray, ele]);

    // if (atdStatus == 'yes') {
    //   ele.active = 'yes';
    // } else {
    //   ele.active = 'no';
    // }

    // const modifiedButton = selectedQuestion.map(element => {
    //   // console.log('quiz-->', quizs);

    //   if (element.questionId === ele.questionId) {
    //     if (atdStatus == 'yes') {
    //       element.active = 'yes';
    //     } else {
    //       element.active = 'no';
    //     }
    //   }
    //   return element;
    // });
    // setSelectedQuestion(modifiedButton);

    setOpenIndex(i);
    setOpenRecordModal(true);
    setSelectedItem(ele);
  };

  const closeModal = (body) => {
    // console.log('selectedItemclose---->', body);
    setOpenRecordModal(false);

    setShowCard1(true);
    setShowCard2(false);
    setShowCard3(false);
  };

  const [showCard1, setShowCard1] = useState(true);
  const [showCard2, setShowCard2] = useState(false);
  const [showCard3, setShowCard3] = useState(false);

  useEffect(() => {
    const requestPermissions = async () => {
      try {
        const granted = await PermissionsAndroid.requestMultiple([
          PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        ]);

        if (
          granted[PermissionsAndroid.PERMISSIONS.RECORD_AUDIO] ===
            PermissionsAndroid.RESULTS.GRANTED &&
          granted[PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE] ===
            PermissionsAndroid.RESULTS.GRANTED
        ) {
          console.log("Recording permissions granted.");
        } else {
          console.log("Recording permissions denied.");
        }
      } catch (err) {
        console.warn(err);
      }
    };
    requestPermissions();
  }, []);

  // const generateFilename = async () => {
  //   // const timestamp = Date.now();
  //   // const filename = `recording_${timestamp}.wav`;
  //   // return filename;
  //   const directoryPath = `${RNFS.DocumentDirectoryPath}/recordings`;

  //   await RNFS.mkdir(directoryPath); // Create the directory if it doesn't exist
  //   const fileName = `recording_${Date.now()}.wav`;
  //   // console.log('directoryPath------------->', directoryPath);
  //   // console.log('directoryPath------------->', fileName);
  //   return `${directoryPath}/${fileName}`;
  // };

  const onStartRecord = async () => {
    try {
      // let devicePath = '';
      // devicePath = RNFS.ExternalStorageDirectoryPath;

      // const fileName = generateFilename();
      // console.log('fileName------------->', fileName);
      // const recordingPath = `${devicePath}/${fileName}`;
      // console.log('recordingPath------------->', recordingPath);
      const directoryPath = `${RNFS.DocumentDirectoryPath}/recordings`;

      await RNFS.mkdir(directoryPath); // Create the directory if it doesn't exist
      const fileName = `recording_${Date.now()}.wav`;
      // console.log('directoryPath1------------->', directoryPath);
      // console.log('directoryPath2------------->', fileName);

      const recordingPath = `${directoryPath}/${fileName}`;
      // console.log('recordingPath------------->', recordingPath);
      const result = await audioRecorderPlayer.startRecorder(recordingPath);

      setShowCard1(false);
      setShowCard2(true);
      setShowCard3(false);
      ToastAndroid.show("Recording started", ToastAndroid.SHORT);
      audioRecorderPlayer.addRecordBackListener((e) => {
        console.log(e?.current_position);
        console.log(e);
        return;
      });
    } catch (error) {
      setShowCard1(true);
      setShowCard2(false);
      setShowCard3(false);
      console.error("Failed to start recording:", error);
      ToastAndroid.show(
        "Failed to start recording: " + error,
        ToastAndroid.SHORT
      );
    }

    // if (Platform.OS === 'android') {
    //   const granted = await PermissionsAndroid.request(
    //     PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
    //     {
    //       title: 'ThinkZone App Audio_Record Permission',
    //       message:
    //         'ThinkZone App needs access to your Audio_Record' +
    //         'so you can Record Audio.',
    //       buttonNeutral: 'Ask Me Later',
    //       buttonNegative: 'Cancel',
    //       buttonPositive: 'OK',
    //     },
    //   );
    //   console.log(granted);
    //   if (granted === PermissionsAndroid.RESULTS.GRANTED) {
    //     console.log(granted, PermissionsAndroid.RESULTS.GRANTED);

    //   }
    // } else {
    //   console.log('error---->');
    // }
  };

  const onStopRecord = async () => {
    try {
      const result = await audioRecorderPlayer.stopRecorder();
      setShowCard1(false);
      setShowCard2(false);
      setShowCard3(true);
      // console.log('Recording stopped:', result);

      setData(result);
      audioRecorderPlayer.removeRecordBackListener();
    } catch (error) {
      // console.log('catch stop------------->');
      setShowCard1(false);
      setShowCard2(true);
      setShowCard3(false);
    }
  };

  const startPlayback = async () => {
    try {
      // console.log('resultplay----->', data);

      await audioRecorderPlayer.startPlayer(data);
      setIsPlaying(true);
    } catch (error) {
      // console.log('Error occurred during playback:', error);
    }
  };

  const onStartReRecord = () => {
    setShowCard1(true);
    setShowCard2(false);
    setShowCard3(false);
  };

  const onSave = (selectedItem, atdStatus) => {
    console.log("save ele------>", atdStatus);

    if (atdStatus == "yes") {
      selectedItem.active = "yes";
    } else {
      selectedItem.active = "no";
    }

    const modifiedButton = selectedQuestion.map((element) => {
      // console.log('quiz-->', quizs);

      if (element.questionId === selectedItem.questionId) {
        if (atdStatus == "yes") {
          element.active = "yes";
        } else {
          element.active = "no";
        }
      }
      return element;
    });
    setSelectedQuestion(modifiedButton);
    setRecordSubmit(true);

    // Set the S3 bucket name and the desired filename for the uploaded file
    const bucketName = S3_BUCKET;
    const filename = "file";

    const fileUri = data; // The path of the audio file recorded or obtained from the player
    // console.log('fileUri--->', fileUri);
    RNFetchBlob.fs
      .readFile(fileUri, "base64")
      .then((data) => {
        // console.log('data--->', data);
        const params = {
          Bucket: bucketName,
          Key: "" + new Date().getTime(),
          Body: new Buffer(data, "base64"),
          ACL: "public-read",
          ContentType: "audio/aac", // Set the appropriate content type based on your file format
        };

        // console.log(params);

        s3.putObject(params, (err, data) => {
          if (err) {
            // console.log('Error uploading file to S3:', err);
          } else {
            // console.log('File uploaded successfully:', data);
            const url = `https://${params.Bucket}.${s3.endpoint.hostname}/${params.Key}`;
            // console.log('url--------->', url);
            let body = {
              subject: selectedItem.subject,
              questionId: selectedItem.questionId,
              question: selectedItem.question,
              questionImage: selectedItem.questionImage,
              questionAudio: selectedItem.questionAudio,
              questionVideo: selectedItem.questionVideo,
              questionWiseMarks: selectedItem.questionWiseMarks,
              answerId: new Date().getTime(),
              answer: url,
            };
            // console.log('body----->', body);
            // console.log('myArray2---->', myArray);
            {
              url ? (
                myArray.push(body) &&
                Alert.alert("ସଫଳତାର ସହ ଅପଲୋଡ୍ ହୋଇଅଛି ।", "", [
                  {
                    text: "Cancel",
                    onPress: () => null,
                    style: "cancel",
                  },
                  { text: "OK", onPress: () => closeModal(body) },
                ])
              ) : (
                <ActivityIndicator
                  size="large"
                  color={Colors.primary}
                  style={{ justifyContent: "center", alignSelf: "center" }}
                />
              );
            }
          }
        });
      })
      .catch((error) => {
        // console.log('Error reading file:', error);
      });

    // -----------------------------------------------------------//

    // let findData = new Buffer('base64', audioData);
    // console.log(typeof findData, 'hhy---->');
    // var formData = new FormData();
    // formData.append('file', findData);
    // console.log('FormData-->', formData);
    //   Api.post('s3api/uploadroot/123', formData).then(
    //   // response => {
    //   response => {
    //     console.log('response uplooad-->', response.data);
    //     // if (response.data.s3path.length > 0) {
    //     //   alert("uploded successfully!!");
    //     //   set_get_s3name(response.data);
    //     // }
    //   },
    //   err => {
    //     console.log(err);
    //   },
    // );
  };

  const saveAllData = () => {
    const body = {
      userid,
      username,
      usertype,
      managerid,
      managername,
      passcode,
      studentid: perStudentdata.studentid,
      studentname: perStudentdata.studentname,
      language: "od",
      program: perStudentdata.program,
      class: perStudentdata.class,
      assessmentData: myArray,
    };
    console.log("bodyall--->", body);
    console.log("check length---->", selectedQuestion.length, myArray.length);
    {
      selectedQuestion.length === myArray.length
        ? Api.post(`saveTransStudentAudioAssessmentData`, body).then(
            (response) => {
              console.log("check  1---->", response.data);
              if (response.data.status === "success") {
                console.log("check---->", response.data);
                if (response.data.status === "success") {
                  setSaveAudioStatus(response.data?.status);
                  Alert.alert(
                    "ଧ୍ୟାନ ଦିଅ ",
                    "Audio ଅନ୍ତର୍ଗତ ସମସ୍ତ କୁଇଜ୍ ର ଉତ୍ତର ସଫଳତାର ସହ ସମ୍ପୂର୍ଣ୍ଣ ହୋଇଛି।",
                    [
                      {
                        text: "Cancel",
                        onPress: () => null,
                        style: "cancel",
                      },
                      {
                        text: "OK",
                        onPress: () => navigation.navigate("home"),
                      },
                    ]
                  );
                } else {
                  Alert.alert(" ", "Check ! Something Went Wrong", [
                    { text: "OK", onPress: () => navigation.navigate("home") },
                  ]);
                }
              }
            }
          )
        : Alert.alert(
            "ଧ୍ୟାନ ଦିଅନ୍ତୁ! ",
            "Audio ଅନ୍ତର୍ଗତ ସମସ୍ତ କୁଇଜ୍ ର ଉତ୍ତର ଦିଅନ୍ତୁ।",
            [
              // {
              //   text: 'Cancel',
              //   onPress: () => null,
              //   style: 'cancel',
              // },
              { text: "OK", onPress: () => null },
            ]
          );
    }
  };

  return (
    <SafeAreaView>
      <DropdownComponent
        data={studentList}
        onChange={getStudentAudio}
        image={require("../assets/Image/profile-2user.png")}
        label={"studentname"}
        label2={"class"}
        Dropdownlabel={"Student List"}
      />
      <ScrollView>
        {selectedQuestion?.length == 0 ? (
          <Norecord />
        ) : (
          <View style={styles.container}>
            {selectedQuestion.length > 0
              ? selectedQuestion?.map((ele, i) => (
                  // <ScrollView>
                  <View style={styles.Flngati}>
                    <View style={{ marginTop: 20 }}>
                      <Text style={styles.text}>
                        {i + 1} . {ele.question}
                      </Text>
                    </View>
                    <>
                      <View
                        style={{
                          width: window.WindowWidth * 0.9,
                          paddingBottom: 20,
                          backgroundColor: "white",
                          alignSelf: "center",
                          borderRadius: 12,
                          top: "10%",
                          paddingBottom: 30,
                          elevation: 10,
                        }}
                      >
                        <Text
                          style={{
                            fontSize: 13,
                            color: "#333333",
                            alignSelf: "center",
                            flexWrap: "wrap",
                            paddingTop: 10,
                          }}
                        >
                          ଭଲ ଭାବରେ ଦିଆଯାଇଥିବା ପ୍ରଶ୍ନ ପଢ଼ି ସାରିବା ପରେ ରେକର୍ଡ ବଟନ୍
                          ଉପରେ କ୍ଲିକ୍ କରି ନିଜର ଉତ୍ତର ରେକର୍ଡ କରନ୍ତୁ ।
                        </Text>

                        {ele.active === "yes" ? (
                          <TouchableOpacity
                            // onPress={() => onStartRecord(ele, i, 1)}
                            key={i}
                            onPress={() => openModal(i, ele, "yes")}
                            style={{
                              backgroundColor: "green",
                              // backgroundColor: myArray?.filter(x =>
                              //   x.active === 'yes' ? 'green' : Color.royalblue,
                              // ),
                              borderRadius: 30,
                              width: "50%",
                              paddingBottom: 20,
                              flexDirection: "row",
                              alignSelf: "center",
                              // alignItems: 'center',
                              justifyContent: "center",
                              top: "5%",
                              flexGrow: 1,
                            }}
                          >
                            <Text style={styles.textss}>Give Your Answer</Text>
                          </TouchableOpacity>
                        ) : (
                          <TouchableOpacity
                            // onPress={() => onStartRecord(ele, i, 1)}
                            key={i}
                            onPress={() => openModal(i, ele, "yes")}
                            style={{
                              backgroundColor: Color.royalblue,
                              // backgroundColor: myArray?.filter(x =>
                              //   x.active === 'yes' ? 'green' : Color.royalblue,
                              // ),
                              borderRadius: 30,
                              width: "50%",
                              paddingBottom: 20,
                              flexDirection: "row",
                              alignSelf: "center",
                              // alignItems: 'center',
                              justifyContent: "center",
                              top: "5%",
                              flexGrow: 1,
                            }}
                          >
                            <Text style={styles.textss}>Give Your Answer</Text>
                          </TouchableOpacity>
                        )}

                        {/* {i === openIndex ? (
                          <TouchableOpacity
                            // onPress={() => onStartRecord(ele, i, 1)}
                            key={i}
                            onPress={() => openModal(i, ele)}
                            style={{
                              backgroundColor: 'green',
                              // backgroundColor: myArray?.filter(x =>
                              //   x.active === 'yes' ? 'green' : Color.royalblue,
                              // ),
                              borderRadius: 30,
                              width: '50%',
                              paddingBottom: 20,
                              flexDirection: 'row',
                              alignSelf: 'center',
                              // alignItems: 'center',
                              justifyContent: 'center',
                              top: '5%',
                              flexGrow: 1,
                            }}>
                            <Text style={styles.textss}>Give Your Answer</Text>
                          </TouchableOpacity>
                        ) : (
                          <TouchableOpacity
                            // onPress={() => onStartRecord(ele, i, 1)}
                            key={i}
                            onPress={() => openModal(i, ele)}
                            style={{
                              backgroundColor: Color.royalblue,
                              borderRadius: 30,
                              width: '50%',
                              paddingBottom: 20,
                              flexDirection: 'row',
                              alignSelf: 'center',
                              // alignItems: 'center',
                              justifyContent: 'center',
                              top: '5%',
                              flexGrow: 1,
                            }}>
                            <Text style={styles.textss}>Give Your Answer</Text>
                          </TouchableOpacity>
                        )} */}
                      </View>
                    </>
                  </View>

                  // </ScrollView>
                ))
              : questions[0]?.assessmentStatus === "complete"
              ? Alert.alert("", "SuccessFully Audio Submit !", [
                  { text: "OK", onPress: () => navigation.goBack() },
                ])
              : null}

            {/* modal start */}

            <Modal
              visible={openRecordModal}
              // animationType="slide"
              // transparent={true}
              onRequestClose={closeModal}
            >
              <View style={styles.centeredView}>
                <View
                  style={[
                    styles.modalView,
                    {
                      // height: window.WindowHeigth * 0.7,

                      width: window.WindowWidth * 0.95,
                      // height: window.WindowHeigth * 0.7,
                      borderRadius: 20,
                      paddingBottom: 150,
                    },
                  ]}
                >
                  <Text
                    style={{
                      fontSize: 18,
                      fontFamily: FontFamily.poppinsMedium,
                      // textAlign: 'left',
                      color: "black",
                      alignSelf: "flex-start",
                    }}
                  >
                    Q. {""} {selectedItem?.question}
                  </Text>

                  {showCard1 && (
                    <View
                      style={{
                        width: window.WindowWidth * 0.85,
                        paddingBottom: 20,
                        backgroundColor: "white",
                        alignSelf: "center",
                        borderRadius: 12,
                        top: "10%",
                        paddingBottom: 30,
                        elevation: 10,
                      }}
                    >
                      <Text
                        style={{
                          fontSize: 13,
                          color: "#333333",
                          alignSelf: "center",
                          flexWrap: "wrap",
                          paddingTop: 20,
                          paddingLeft: 20,
                          paddingRight: 20,
                        }}
                      >
                        ଭଲ ଭାବରେ ଦିଆଯାଇଥିବା ପ୍ରଶ୍ନ ପଢ଼ି ସାରିବା ପରେ ରେକର୍ଡ ବଟନ୍
                        ଉପରେ କ୍ଲିକ୍ କରି ନିଜର ଉତ୍ତର ରେକର୍ଡ କରନ୍ତୁ ।
                      </Text>

                      <TouchableOpacity
                        onPress={() => onStartRecord()}
                        style={{
                          backgroundColor: Color.royalblue,
                          borderRadius: 30,
                          width: 126,
                          paddingBottom: 20,
                          flexDirection: "row",
                          alignSelf: "center",
                          // alignItems: 'center',
                          justifyContent: "center",
                          top: "5%",
                          flexGrow: 1,
                        }}
                      >
                        <Image
                          style={{
                            width: 24,
                            height: 24,
                            top: "9%",
                          }}
                          source={require("../assets/Image/microphone.png")}
                        />
                        <Text style={[styles.textss, { top: "8%" }]}>
                          Record
                        </Text>
                      </TouchableOpacity>
                    </View>
                  )}

                  {showCard2 && (
                    <View
                      style={{
                        width: window.WindowWidth * 0.85,
                        paddingBottom: 20,
                        backgroundColor: "white",
                        alignSelf: "center",
                        borderRadius: 12,
                        top: "10%",
                        paddingBottom: 30,
                        elevation: 10,
                      }}
                    >
                      <Text
                        style={{
                          fontSize: 13,
                          color: "#333333",
                          alignSelf: "center",
                          flexWrap: "wrap",
                          paddingTop: 10,
                        }}
                      >
                        ଭଲ ଭାବରେ ଦିଆଯାଇଥିବା ପ୍ରଶ୍ନ ପଢ଼ି ସାରିବା ପରେ ରେକର୍ଡ ବଟନ୍
                        ଉପରେ କ୍ଲିକ୍ କରି ନିଜର ଉତ୍ତର ରେକର୍ଡ କରନ୍ତୁ ।
                      </Text>

                      <TouchableOpacity
                        onPress={() => onStopRecord()}
                        style={styles.record}
                      >
                        <Ionicons
                          name="stop-circle-outline"
                          size={21}
                          style={{ top: "8%" }}
                          color="white"
                        />
                        <Text style={styles.textss}>Stop</Text>
                      </TouchableOpacity>
                    </View>
                  )}

                  {showCard3 && (
                    <View
                      style={{
                        width: window.WindowWidth * 0.85,

                        paddingBottom: 20,
                        backgroundColor: "white",
                        alignSelf: "center",
                        borderRadius: 12,
                        top: "10%",
                        paddingBottom: 30,

                        elevation: 10,
                      }}
                    >
                      <TouchableOpacity
                        onPress={() => startPlayback(selectedItem, "play")}
                        style={{ top: "8%" }}
                      >
                        <Image
                          style={{
                            width: 35,
                            height: 35,

                            paddingBottom: 10,
                            alignSelf: "center",
                          }}
                          source={require("../assets/Image/Player.png")}
                        />
                      </TouchableOpacity>

                      <Text
                        style={{
                          fontSize: 12,
                          color: "#333333",
                          alignSelf: "center",
                          flexWrap: "wrap",
                          paddingTop: 20,
                          flexWrap: "wrap",
                          paddingLeft: 15,
                          paddingRight: 15,
                        }}
                      >
                        ଆପଣଙ୍କ ଉତ୍ତର ରେକର୍ଡ ହୋଇଯାଇଛି ।ଯଦି ନିଶ୍ଚିତ ଅଛନ୍ତି ତେବେ
                        submit ବଟନ୍ ଉପରେ କ୍ଲିକ୍ କରନ୍ତୁ ଅଥବା re-record ବଟନ୍ ଉପରେ
                        କ୍ଲିକ୍ କରି ଆଉଥରେ ରେକର୍ଡ କରନ୍ତୁ।
                      </Text>
                      <View
                        style={{
                          justifyContent: "space-evenly",
                          flexDirection: "row",
                        }}
                      >
                        <TouchableOpacity
                          onPress={onStartReRecord}
                          style={styles.records}
                        >
                          <Text style={styles.textss}>Re-record</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                          onPress={() => onSave(selectedItem, "yes")}
                          style={styles.records}
                        >
                          <Text style={styles.textss}>Submit</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  )}

                  {/* <View
        style={{
          width: window.WindowWidth * 0.9,
          paddingBottom: 20,
          backgroundColor: 'white',
          alignSelf: 'center',
          borderRadius: 12,
          top: '10%',
          paddingBottom: 30,
          elevation: 10,
        }}>
        <Text
          style={{
            fontSize: 13,
            color: '#333333',
            alignSelf: 'center',
            flexWrap: 'wrap',
            paddingTop: 10,
          }}>
          Please click the Record button to record your response after
          carefully reading the question
        </Text>

        <TouchableOpacity
          onPress={() => onStopRecord(selectedItem, 'inActive')}
          style={styles.record}>
          <Ionicons
            name="stop-circle-outline"
            size={21}
            style={{top: '8%'}}
            color="white"
          />
          <Text style={styles.textss}>Stop</Text>
        </TouchableOpacity>
      </View> */}

                  {/* <View
        style={{
          width: window.WindowWidth * 0.9,
          paddingBottom: 20,
          backgroundColor: 'white',
          alignSelf: 'center',
          borderRadius: 12,
          top: '10%',
          paddingBottom: 30,

          elevation: 10,
        }}>
        <TouchableOpacity
          onPress={() => startPlayback(selectedItem, 'play')}
          style={{top: '8%'}}>
          <Image
            style={{
              width: 35,
              height: 35,

              paddingBottom: 10,
              alignSelf: 'center',
            }}
            source={require('../assets/Image/Player.png')}
          />
        </TouchableOpacity>

        <Text
          style={{
            fontSize: 12,
            color: '#333333',
            alignSelf: 'center',
            flexWrap: 'wrap',
            paddingTop: 20,
            flexWrap: 'wrap',
            paddingLeft: 15,
            paddingRight: 15,
          }}>
          Your recorded answer has been successfully saved. Submit if
          satisfied or rerecord for changes
        </Text>
        <View
          style={{
            justifyContent: 'space-evenly',
            flexDirection: 'row',
          }}>
          <TouchableOpacity
            onPress={onStartReRecord}
            style={styles.records}>
            <Text style={styles.textss}>Re-record</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => onSave(ele)}
            style={styles.records}>
            <Text style={styles.textss}>Submit</Text>
          </TouchableOpacity>
        </View>
      </View> */}

                  {/* <TouchableOpacity onPress={closeModal}>
          <Text>Close Modal</Text>
        </TouchableOpacity> */}
                </View>
              </View>
            </Modal>

            {/* 
modal end */}
            {selectedQuestion.length > 0 ? (
              <TouchableOpacity
                onPress={() => saveAllData()}
                style={[styles.submit]}
              >
                <Text
                  style={{
                    fontSize: 20,
                    textAlign: "center",
                    fontWeight: "600",
                    color: "white",
                    marginTop: 10,
                    paddingBottom: 10,
                    fontFamily: FontFamily.poppinsMedium,
                  }}
                >
                  SUBMIT
                </Text>
              </TouchableOpacity>
            ) : null}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default AudioVideoAcces;

const styles = StyleSheet.create({
  container: {
    paddingBottom: 100,
    backgroundColor: "white",
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
  },
  Flngati: {
    width: window.WindowWidth * 0.96,
    // hright: 550,
    marginVertical: 8,
    backgroundColor: "white",
    alignSelf: "center",
    borderRadius: 10,

    textAlign: "center",
    paddingBottom: 50,
    // marginLeft: 20,
    // borderColor: 'black',
    // borderWidth: 0.5,
    // marginTop: 10,
    // marginRight: 90,
  },
  submit: {
    width: window.WindowWidth * 0.4,

    // height: 60,
    marginLeft: 120,
    borderRadius: 30,
    backgroundColor: Color.royalblue,
    color: "white",
    // borderWidth: 1,

    marginTop: 30,
  },
  texts: {
    justifyContent: "center",
    textAlign: "center",
    fontSize: 18,
    color: "black",
    letterSpacing: 1,
    fontWeight: "600",
    paddingTop: 10,
    paddingBottom: 10,
  },
  buttons: {
    width: 75,
    // height: 40,
    marginLeft: 70,

    borderRadius: 10,
    // backgroundColor: '#137BD4',
    color: "white",
    borderWidth: 1.5,
    fontSize: 17,
    textAlign: "center",
    fontWeight: "bold",
    marginTop: 30,
  },
  button: {
    width: 75,
    // height: 40,
    marginLeft: 70,
    borderRadius: 10,
    // backgroundColor: '#137BD4',
    color: "white",
    borderWidth: 1.5,
    fontSize: 17,
    textAlign: "center",
    marginBottom: 20,
    fontWeight: "bold",
    marginTop: 30,
  },
  submit: {
    width: 140,
    height: 60,
    marginLeft: 120,
    borderRadius: 10,
    backgroundColor: "#137BD4",
    color: "white",
    borderWidth: 1,

    marginTop: 40,
  },
  Fln: {
    alignItems: "center",
    flexDirection: "row",
    padding: 15,
    width: window.WindowWidth * 0.9,
    hright: "100%",
    color: "black",
    fontSize: 20,
    fontFamily: "serif",
    fontWeight: "bold",
    backgroundColor: "white",
    borderRadius: 10,
    marginBottom: 10,
    textAlign: "center",
    marginLeft: 20,
    marginTop: 120,
    // paddingRight: 10,
  },

  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 2,
      height: 5,
    },
    shadowOpacity: 0.25,
    shadowRadius: 5,
    elevation: 15,
  },
  username: {
    fontSize: 18,
    fontFamily: "serif",
    color: "#01507B",
    textTransform: "capitalize",
    marginTop: 15,
    textAlign: "center",
    fontWeight: "900",
  },
  text: {
    fontSize: 14,
    // width: 400,
    color: "black",

    // lineHeight: 21,
    fontWeight: "600",
    // letterSpacing: 0.25,
    color: "black",
    paddingLeft: 15,
    paddingRight: 7,
  },
  record: {
    backgroundColor: Color.royalblue,
    borderRadius: 30,
    width: 126,
    paddingBottom: 20,
    flexDirection: "row",
    alignSelf: "center",
    // alignItems: 'center',
    justifyContent: "center",
    top: "5%",
    flexGrow: 1,
  },
  records: {
    backgroundColor: Color.royalblue,
    borderRadius: 30,
    width: 116,
    paddingBottom: 20,
    top: "20%",
    flexDirection: "row",
    alignSelf: "center",
    // alignItems: 'center',
    justifyContent: "center",
    top: "5%",
    // flexGrow: 1,
  },
  textss: {
    color: "white",
    fontSize: 13,
    fontFamily: FontFamily.poppinsMedium,
    alignSelf: "center",
    top: "6%",
    left: 2,
  },
});
