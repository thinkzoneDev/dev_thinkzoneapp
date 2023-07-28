import React from 'react';
import {useEffect, useState} from 'react';
import {
  Text,
  View,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import * as userscall from '../redux/slices/UserCallSlice';
import API from '../environment/Api';
import Colors from '../utils/Colors';
import {ScrollView} from 'react-native-gesture-handler';
import Api from '../environment/Api';
import {Color, FontFamily, FontSize, Border, Padding} from '../GlobalStyle';

export default function CallResponse({navigation, route}) {
  const dispatch = useDispatch();
  const res = useSelector(state => state.userscalllist.callrecords);
  // console.log('res-->', res);
  const [quiz, setQuiz] = useState([]);

  const student = useSelector(state => state.studentdata.students);
  // console.log('students-->', student);
  const [activity, setActivity] = useState([]);
  // console.log('activity-->', activity);
  const dates = new Date();
  // console.log('dates-->', dates);
  const responseDate =
    new Date().getDate() +
    '/' +
    (new Date().getMonth() + 1) +
    '/' +
    new Date().getFullYear();
  // console.log('responseDate-->', responseDate);

  // useEffect(() => {
  //   dispatch(userscall.getCallActivityStart());
  // }, []);

  // useEffect(() => {

  //   API.get(
  //     `getmasterpostcallactivities/od/pge`,

  //   ).then(
  //     response => {
  //       setActivity(response.data);
  //     },
  //     err => {
  //       console.log(err);
  //     },
  //   );

  // }, []);

  // const data = [{
  // calledon: "2023-01-05T13:34:27.897Z",
  // class: "3",
  // date: "5/1/2023",
  // feedback: [{
  // assessment_id: "6113d799741c6e11e86fb107",
  // id: "6113d799741c6e11e86fb107",
  // answer: "yes",
  // question: "ଶିକ୍ଷାର୍ଥୀ ଏବଂ ଅଭିଭାବକ ଟୋଲଫ୍ରି ନମ୍ବରକୁ କଲ କରି ଶିକ୍ଷଣ କାର୍ଯ୍ୟ ଅଭ୍ୟାସ କରିଥିଲେ କି ? "
  // }],
  // passcode: "GURUBBS22",
  // phonenumber: "8765679675",
  // program: "ece",
  // schoolid: "",
  // schoolname: "",
  // studentid: "1655208431905",
  // studentname: "Mona",
  // udisecode: "",
  // userid: "monalisamoharana99@gmail.com",
  // username: "Monalisa Moharana",
  // usertype: "fe llow",
  //   }]
  const [response_data, set_response_data] = useState([]);
  const [response_yes, set_response_yes] = useState(false);
  const alertResponse = () => {
    // dispatch(userscall.getCallActivityStart());
    // setActivity(dispatch(userscall.getCallActivityStart()));
    Api.get(`getmasterpostcallactivities/od/pge`).then(response => {
      // console.log('call response data-->', response.data);
      set_response_data(response.data);
      set_response_yes(true);
    });
  };

  useEffect(() => {
    const quizs = response_data.map(item => {
      return {...item, answer: ''};
    });
    setQuiz(quizs);
  }, [response_data]);
  // useEffect(()=>{
  //   dispatch(userscall.getCallActivityStart());
  // },[alertResponse])
  // console.log('route-->', route.params.item);

  // const [yes, setYes] = useState(true);

  // const [no, setNo] = useState(false);
  let stuyData = [];
  let stuyDataNo = [];
  const [stat, setStat] = useState();
  const callYes = (item, status) => {
    // console.log('item-->', item);
    // console.log(item, status, 'itwe');
    let quizContent = quiz.map(item1 => {
      // console.log(item1, 'item');
      if (item1._id === item._id) {
        // console.log('id match');
        item1.answer = status;
      }
      return item1;
    });
    setQuiz(quizContent);
    setStat(status);
  };
  // console.log(quiz, 'quizjhgjg');
  // console.log('quizjhgjg2-->', quiz);
  // console.log('quizjhgjgCheck-->', stat);

  // console.log(Object.keys(imageData).length, 'Imagedata');
  // console.log('item-->', Object.keys(item).length);
  // setYes(true);
  // const callResponseList = res.map(({_id, question}) => {
  //   return {_id, question};
  // });
  // console.log('callResponseList-->', callResponseList);
  // if (yes === true) {
  //   console.log('answer true-->', yes);
  //   // console.log('answer-->', item);
  //   // stuyData = item
  //   // console.log("answer1-->",stuyData)
  //   let obj = {
  //     assessment_id: item.item._id,
  //     id: item.item._id,
  //     question: item.item.question,
  //     answer: 'yes',
  //   };
  //   stuyData.push(obj);
  //   console.log('answer2-->', stuyData);
  // }
  // if (Object.keys(item).length > 0) {
  // } else {
  // } ;

  // console.log('stuyDatawhole-->', stuyData);

  // const callNo = (item, status) => {

  //   if (no === false) {
  //     console.log('answer false-->', no);
  //     // console.log('answer-->', item);
  //     // stuyData = item
  //     // console.log("answer1-->",stuyData)

  //     let obj = {
  //       assessment_id: item.item._id,
  //       id: item.item._id,
  //       question: item.item.question,
  //       answer: 'no',
  //     };

  //     stuyDataNo.push(obj);
  //     console.log('answerno-->', stuyDataNo);
  //   }
  // };

  // const yu = [...stuyDataNo,...stuyData];

  const saveResponse = data => {
    // const feedBack = data.map(({_id, question}) => {
    //   return {_id, question};
    // });
    // console.log('feedBack-->', feedBack);
    // console.log('response_data--->', response_data.length);

    const optionLength = quiz.filter(x => x.answer).length;
    // console.log('optionLength--->', optionLength);
    const datas = {
      calledon: dates,
      class: route.params.item.class,
      date: responseDate,
      feedback: quiz,
      passcode: route.params.item.passcode,
      phonenumber: route.params.item.phone,
      program: route.params.item.program,
      schoolid: '',
      schoolname: route.params.item.schoolname,
      studentid: route.params.item._id,
      studentname: route.params.item.studentname,
      udisecode: route.params.item.udisecode,
      userid: route.params.item.userid,
      username: route.params.item.username,
      usertype: route.params.item.usertype,
    };
    // console.log('data-->', data);
    {
      response_data.length == optionLength
        ? dispatch(userscall.postCallActivityStart(datas)) &&
          navigation.navigate('home')
        : Alert.alert(
            'ଧ୍ୟାନ ଦିଅନ୍ତୁ! ',
            'Call Response ଅନ୍ତର୍ଗତ ସମସ୍ତ Question ର ଉତ୍ତର ଦିଅନ୍ତୁ।',
            [
              {
                text: 'Cancel',
                onPress: () => null,
                style: 'cancel',
              },
              {text: 'OK', onPress: () => null},
            ],
          );
    }
  };

  // dispatch(userscall.postCallActivityStart(datas));
  // navigation.navigate('home')

  return (
    <View>
      {/* <Text
        style={{
          textAlign: 'center',
          fontSize: 22,
          marginTop: 12,
          fontWeight: 'bold',
        }}>
        Call Response
      </Text> */}
      <ScrollView>
        <FlatList
          data={[{index: 1, key: 'ପିତାମାତା କଲ୍ ର ଉତ୍ତର ଦେଲେ କି ?'}]}
          renderItem={({item}) => (
            // console.log('item select-->', item),
            <View>
              <Text
                style={{
                  marginLeft: 19,
                  fontSize: 20,
                  fontWeight: '600',
                  marginTop: 12,
                  color: Color.black,
                  fontFamily: FontFamily.balooBhaina2Medium,
                }}>
                {item.index}. {item.key}
              </Text>
            </View>
          )}
        />

        <View style={{flexDirection: 'row'}}>
          <TouchableOpacity
            style={{
              backgroundColor: Color.gray_100,
              marginLeft: 62,
              height: 52,
              width: 50,
              marginTop: 12,
              paddingTop: 10,
              paddingBottom: 10,
              paddingLeft: 12,
              paddingRight: 15,
              padding: Padding.p_3xs,
              borderRadius: Border.br_7xs,
              borderColor: Color.royalblue,
              borderWidth: 1,
              backgroundColor: response_yes ? '#0060ca' : '',
              color: response_yes ? '0060ca' : '',
            }}
            onPress={() => alertResponse()}>
            <Text style={{fontSize: 20, color: '#333333', textAlign: 'center'}}>
              ହଁ
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              backgroundColor: Color.ghostwhite,
              marginLeft: 62,
              height: 52,
              width: 50,
              marginTop: 12,
              paddingTop: 10,
              paddingBottom: 10,
              paddingLeft: 9,
              paddingRight: 15,
              padding: Padding.p_3xs,
              borderRadius: Border.br_7xs,
              borderColor: Color.royalblue,
              borderWidth: 1,
            }}
            onPress={() => navigation.navigate('home')}>
            <Text style={{fontSize: 20, textAlign: 'center', color: '#333333'}}>
              ନା
            </Text>
          </TouchableOpacity>
        </View>
        {response_data.length > 0 ? (
          <View>
            <FlatList
              data={quiz}
              renderItem={({item, index}) => (
                // console.log('item check-->', item, index),
                <View>
                  <Text
                    style={{
                      marginLeft: 19,
                      fontSize: 20,
                      fontWeight: '600',
                      marginTop: 12,
                      color: Color.black,
                      fontFamily: FontFamily.balooBhaina2Medium,
                    }}>
                    {index + 2}. {item.question} ?
                  </Text>

                  {/* If quiz.answer == yes then backgroundcolor Change */}

                  <View style={{flexDirection: 'row'}}>
                    <TouchableOpacity
                      onPress={() => {
                        callYes(item, 'yes');
                        // console.log('check answer-->', item.answer);
                      }}>
                      {item.answer === 'yes' ? (
                        <Text
                          style={[
                            styles.buttonGreen,
                            {
                              backgroundColor: Color.royalblue,
                              color: 'white',
                              fontSize: 20,
                              textAlign: 'center',
                            },
                          ]}>
                          ହଁ
                        </Text>
                      ) : (
                        <Text
                          // style={{
                          //   fontSize: 26,
                          //   fontWeight: 'bold',
                          //   color: 'black',

                          style={[
                            styles.buttonGreen,
                            {fontSize: 20, textAlign: 'center', color: 'black'},
                          ]}>
                          ହଁ
                        </Text>
                      )}
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => callYes(item, 'no')}>
                      {item.answer === 'no' ? (
                        <Text
                          style={[
                            styles.buttonRed,
                            {
                              fontSize: 20,
                              // fontWeight: '700',
                              textAlign: 'center',
                              color: 'white',
                              backgroundColor: Color.royalblue,
                            },
                          ]}>
                          ନା
                        </Text>
                      ) : (
                        <Text
                          style={[
                            styles.buttonRed,
                            {fontSize: 20, color: 'black', textAlign: 'center'},
                          ]}>
                          ନା
                        </Text>
                      )}
                    </TouchableOpacity>
                  </View>
                </View>
              )}
            />

            <TouchableOpacity
              onPress={() => saveResponse(res)}
              style={styles.buttonSave}>
              <Text style={{fontSize: 19, fontWeight: 'bold', color: 'white'}}>
                SAVE
              </Text>
            </TouchableOpacity>
          </View>
        ) : (
          // <Text>No length found</Text>
          <Text></Text>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  buttonGreen: {
    // backgroundColor: '#097969',
    backgroundColor: Color.ghostwhite,
    marginLeft: 62,
    height: 52,
    width: 50,
    marginTop: 12,
    paddingTop: 12,
    paddingBottom: 10,
    paddingLeft: 15,
    paddingRight: 15,
    padding: Padding.p_3xs,
    borderRadius: Border.br_7xs,
    borderColor: Color.royalblue,
    borderWidth: 1,
  },
  buttonRed: {
    backgroundColor: Color.ghostwhite,
    marginLeft: 62,
    height: 52,
    width: 50,
    marginTop: 12,
    paddingTop: 10,
    paddingBottom: 10,
    paddingLeft: 11,
    paddingRight: 11,
    padding: Padding.p_3xs,
    borderRadius: Border.br_7xs,
    borderColor: Color.royalblue,
    borderWidth: 1,
  },
  buttonSave: {
    // backgroundColor: Color.royalblue,
    // marginTop: 49,
    // paddingLeft: 162,
    // paddingTop: 12,
    // paddingBottom: 12,
    // marginLeft: 22,
    // marginRight: 22,
    // borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 17,
    borderRadius: 15,
    elevation: 3,
    marginLeft: 30,
    marginTop: 50,
    marginRight: 45,
    // marginBottom: 12,
    // backgroundColor: '#00C0F0',
    backgroundColor: Color.royalblue,
  },
});
