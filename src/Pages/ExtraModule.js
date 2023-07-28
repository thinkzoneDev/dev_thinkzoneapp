import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  FlatList,
  TouchableOpacity,
  Alert,
  Button,
  Image,
} from 'react-native';
// import ProgressBar from './ProgressBar';
import {useFocusEffect} from '@react-navigation/native';
// import ProgressBar from './ProgressBar';

import FontAwesome from 'react-native-vector-icons/FontAwesome';
import React, {useState, useEffect} from 'react';
import API from '../environment/Api';
import {useDispatch, useSelector} from 'react-redux';
import Colors from '../utils/Colors';
import {Color, FontFamily} from '../GlobalStyle';

import AntDesign from 'react-native-vector-icons/AntDesign';
import ProgressBar from '../components/ProgressBar';
import PgeSkeleton from '../skeletons/PgeSkeleton';
import * as SIZES from '../utils/dimensions';
import LinearGradient from 'react-native-linear-gradient';
import HorizontalScrollView from '../components/HorizontalScrollView';
import AccordianComponent from '../components/AccordianComponent';
import * as TrainingSlice from '../redux/slices/TrainingSlice';
import ServerError from '../components/ServerError';
import Norecord from '../components/Norecord';
const ExtraModule = ({navigation}) => {
  const dispatch = useDispatch();
  const user = useSelector(state => state.userdata.user?.resData);
  const moduleArr = useSelector(state => state.trainingdata.modules);
  const [topicIndex, setTopicIndex] = useState(null);

  const [currentIndex, setCurrentIndex] = React.useState(null);
  const [isLoading, setIsloading] = useState(false);
  const [language, setLanguage] = useState('od');
  const [topics, setTopics] = useState([]);
  const [status, setStatus] = useState('');

  const topicClicked = (item, c_type) => {
    setIsloading(true);

    if (c_type == 'assignment') {
      // console.log('c_type--->', c_type);
      navigation.navigate('extramoduleassignment', {
        data: item,
        data_type: c_type,
      });
    } else {
      navigation.navigate('extramodulecontent', {
        data: item,
        data_type: c_type,
      });
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      setIsloading(false);
      API.get(
        `getAllTchExtraModulesWithStatus/${user[0].userid}/${user[0].usertype}/${language}`,
      ).then(response => {
        // console.log('getapi--->', response.data);
        setTopics(response.data);
      });
    }, []),
  );

  // useEffect(() => {
  //   API.get(
  //     `getAllTchExtraModulesWithStatus/${user[0].userid}/${user[0].usertype}/${language}`,
  //   ).then(response => {
  //     console.log('getapi--->', response.data);
  //     setTopics(response.data);
  //   });
  // }, []);

  const handleRedeemClicked = item => {
    // console.log('item---->', item);
    const data = {
      userid: user[0].userid,
      username: user[0].username,
      usertype: user[0].usertype,
      managerid: user[0].managerid,
      managername: user[0].managername,
      passcode: user[0].passcode,
      topicId: item.topicId,
      topicName: item.topicName,
      topicOrder: item.topicOrder,
      duration: item.duration,
    };
    // console.log('clicked---->', data);
    API.post(`unlockTchExtraModulesTopic`, data).then(response => {
      // console.log('response---->', response.data);
      setStatus(response.status);
      if (response.data.status == 'locked') {
        alert(response.data.msg);
      } else {
        API.get(
          `getAllTchExtraModulesWithStatus/${user[0].userid}/${user[0].usertype}/${language}`,
        ).then(response => {
          // console.log('getapi--->', response.data);
          setTopics(response.data);
        });
        Alert.alert('Topic Unlocked! ', '', [
          {
            // text: 'Cancel',
            // onPress: () => null,
            // style: 'default',
          },
          {text: 'Ok', onPress: () => null, style: 'default'},
        ]);
      }
    });
  };

  const handleQuizPress = item => {
    // console.log('content item---->', item);
    if (item.lockStatus == true) {
      alert('Not Redeem yet!!');
    } else {
      Alert.alert('Reddem Successfully! ', 'No data Available!!!!', [
        {
          // text: 'Cancel',
          // onPress: () => null,
          // style: 'default',
        },
        {text: 'Ok', onPress: () => null, style: 'default'},
      ]);
    }
  };

  return (
    <View>
      {/* <ServerError visible={err} message={'module id not found'} /> */}
      {isLoading ? (
        <View>
          <PgeSkeleton />
        </View>
      ) : (
        <>
          <ScrollView style={styles.container}>
            {/* <LinearGradient
          start={{x: 0, y: 0}}
          end={{x: 1, y: 0}}
          colors={['#0e7490', '#06b6d4', '#fafafa']}
          style={styles.linearGradient}> */}
            {/* <View style={styles.moduleContainer}>
              <Text style={styles.moduleText}>Topics</Text>
            </View> */}
            {/* </LinearGradient> */}

            {topics?.map((item, index) => {
              // console.log('assignitem---->', item);
              return (
                <View style={styles.cardContainer}>
                  <TouchableOpacity
                    key={item._id}
                    onPress={() => {
                      setCurrentIndex(index === currentIndex ? null : index);
                    }}>
                    <View style={styles.card}>
                      <View style={styles.subModuContainer}>
                        <View
                          style={{
                            flexDirection: 'row',
                            justifyContent: 'space-evenly',
                          }}>
                          <View
                            style={{
                              paddingRight: 20,
                              left: -10,
                              backgroundColor: 'white',
                              // borderColor: 'black',
                              // borderWidth: 2,

                              borderRadius: 35,
                              textAlign: 'center',
                            }}>
                            {/* <Text
                              style={{
                                textAlign: 'center',
                                left: 9,
                                fontSize: 17,
                                color: Color.royalblue,
                              }}>
                              {index + 1}
                            </Text> */}
                          </View>
                          <Text style={styles.subModule}>{item.topicName}</Text>
                        </View>
                        <View style={{flexDirection: 'row', marginTop: 10}}>
                          <Image
                            style={{width: 20, height: 20}}
                            source={require('../assets/Image/timer.png')}
                          />
                          <Text style={styles.subModuleTopic}>
                            {/* {item.submoduleDuration} min */}
                            {/* {item.submoduleDuration} */}
                            min
                          </Text>

                          <Image
                            style={{width: 20, height: 20, marginLeft: 10}}
                            source={require('../assets/Image/coin.png')}
                          />
                          <Text style={styles.subModuleTopic}>
                            {/* {item.submoduleDuration} min */}
                            {/* {item.submoduleDuration}  */}2 coins
                          </Text>
                          {/* <ProgressBar
                        total={item?.dat?.length}
                        complete={item.completed_topic}
                      /> */}
                        </View>
                        {/* <ProgressBar total={10} complete={5} /> */}
                      </View>

                      {item.lockStatus == true ? (
                        <>
                          <TouchableOpacity
                            style={{
                              alignSelf: 'flex-end',
                              justifyContent: 'space-between',
                            }}
                            onPress={() => handleRedeemClicked(item)}>
                            <FontAwesome
                              name="lock"
                              color="#eb3875"
                              size={25}
                              style={{
                                marginTop: 10,
                                paddingLeft: 10,
                                marginRight: 5,
                                alignSelf: 'flex-end',
                              }}
                            />
                            <Text
                              style={{
                                color: Color.royalblue,
                                textTransform: 'capitalize',
                                fontSize: 13,
                                fontWeight: '600',
                                letterSpacing: 1,
                              }}>
                              REDEEM
                            </Text>
                          </TouchableOpacity>
                        </>
                      ) : (
                        <>
                          <AntDesign
                            name="circledown"
                            size={22}
                            color={Colors.royalblue}
                          />
                        </>
                      )}
                    </View>
                  </TouchableOpacity>

                  {index === currentIndex && item.lockStatus == false && (
                    <View style={styles.topic}>
                      <View
                        style={{
                          flexDirection: 'column',
                          justifyContent: 'space-around',
                          marginTop: 15,
                          padding: 10,
                          margin: 10,
                        }}>
                        {item.contentStatus === 'complete' ? (
                          <View
                            style={[
                              styles.conquiz,
                              {
                                backgroundColor: Color.royalblue,
                              },
                            ]}>
                            <TouchableOpacity
                              style={{flexDirection: 'row'}}
                              // onPress={() => topicClicked(topic, 'content')}
                            >
                              <Text style={{color: 'white'}}>Content</Text>
                              <Image
                                style={{
                                  marginLeft: 40,
                                  width: 24,
                                  height: 19.8,
                                }}
                                source={require('../assets/Image/done.png')}
                              />
                            </TouchableOpacity>
                          </View>
                        ) : (
                          <View style={styles.conquiz}>
                            <TouchableOpacity
                              onPress={() => topicClicked(item, 'content')}>
                              <Text style={{color: 'black'}}>Content</Text>
                            </TouchableOpacity>
                          </View>
                        )}

                        {item.quizStatus === 'complete' ? (
                          <View
                            style={[
                              styles.conquiz,
                              {
                                backgroundColor: Color.royalblue,
                              },
                            ]}>
                            <TouchableOpacity
                              style={{flexDirection: 'row'}}
                              onPress={() =>
                                navigation.navigate('reviewquiztraining', {
                                  // data: topic,
                                })
                              }>
                              <Text style={{color: 'white'}}>Quiz</Text>
                              <Image
                                style={{
                                  marginLeft: 70,
                                  width: 24,
                                  height: 19.8,
                                }}
                                source={require('../assets/Image/done.png')}
                              />
                            </TouchableOpacity>
                          </View>
                        ) : (
                          <View style={styles.conquiz}>
                            <TouchableOpacity
                              onPress={() => topicClicked(item, 'quiz')}>
                              <Text style={{color: 'black'}}>Quiz</Text>
                            </TouchableOpacity>
                          </View>
                        )}

                        {item.assignmentStatus === 'complete' ? (
                          <View
                            style={[
                              styles.conquiz,
                              {
                                backgroundColor: Color.royalblue,
                              },
                            ]}>
                            <TouchableOpacity
                              style={{flexDirection: 'row'}}
                              onPress={() => null}>
                              <Text style={{color: 'white'}}>Assignment</Text>
                              <Image
                                style={{
                                  marginLeft: 10,
                                  width: 24,
                                  height: 19.8,
                                }}
                                source={require('../assets/Image/done.png')}
                              />
                            </TouchableOpacity>
                          </View>
                        ) : (
                          <View style={styles.conquiz}>
                            <TouchableOpacity
                              onPress={() => topicClicked(item, 'assignment')}>
                              <Text style={{color: 'black'}}>Assignment</Text>
                            </TouchableOpacity>
                          </View>
                        )}
                        {/* <View style={styles.conquiz}>
                                <TouchableOpacity
                                  onPress={() =>
                                    topicClicked(topic, 'assignment')
                                  }>
                                  <Text>Assignment</Text>
                                </TouchableOpacity>
                              </View> */}
                      </View>
                    </View>
                  )}
                </View>
              );
            })}
          </ScrollView>
        </>
      )}
    </View>
  );
};

export default ExtraModule;

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.white,
    width: SIZES.WindowWidth * 0.95,
    // borderWidth: 2,
    // borderColor: Colors.primary,
    // borderWidth: 2,
    // borderColor: Colors.primary,
    alignSelf: 'center',
    borderRadius: 5,
    elevation: 10,
    marginBottom: 50,
    marginTop: 12,
    paddingBottom: 20,
    paddingTop: 10,
  },
  moduleContainer: {
    flexDirection: 'row',
  },

  moduleText: {
    color: Colors.primary,
    textTransform: 'uppercase',
    fontSize: 30,
    fontWeight: '900',
    letterSpacing: -1,
  },

  moduleTextRedeem: {
    color: Colors.primary,
    textTransform: 'uppercase',
    fontSize: 30,
    fontWeight: '900',
    letterSpacing: -1,
    paddingLeft: 39,
  },
  cardContainer: {
    flexGrow: 1,
    // width: '100%',
    margin: 10,
    backgroundColor: Colors.white,
    justifyContent: 'center',
    borderRadius: 10,
    elevation: 10,
  },

  avatarText: {
    color: Colors.white,

    fontSize: 30,
    fontWeight: '900',
    fontFamily: 'sans-serif-medium',
  },
  subModuContainer: {
    padding: 10,

    // height: SIZES.WindowHeigth * 0.06,
  },
  roundView: {
    height: 40,
    width: 40,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    flexGrow: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
  },
  subModule: {
    color: Colors.black,
    // letterSpacing: -1,
    textTransform: 'uppercase',
    fontSize: 16,
    fontWeight: '600',
  },
  subModuleTopic: {
    color: '#a9a9a9',
    letterSpacing: -1,
    textTransform: 'capitalize',
    fontSize: 11,
    fontWeight: '600',
  },
  topic: {
    // flexWrap: 'wrap',
    padding: 10,
    justifyContent: 'space-between',
    // alignItems: 'center',
  },
  tpoicText: {
    color: Colors.black,
    fontSize: 15,
    fontWeight: '800',
  },
  conquiz: {
    borderWidth: 1,
    borderRadius: 5,
    padding: 7,
    paddingBottom: 10,
    margin: 7,
    borderColor: Colors.primary,
  },
});

const usercontentDetails = [
  {value: 1, text: 'Topic-1'},
  {value: 2, text: 'Topic-2'},
  {value: 3, text: 'Topic-3'},
  {value: 4, text: 'Topic-4'},
  {value: 5, text: 'Topic-5'},
];
