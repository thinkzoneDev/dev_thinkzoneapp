import React, {useEffect, useState} from 'react';
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  FlatList,
  View,
  ActivityIndicator,
  Image,
} from 'react-native';
import API from '../environment/Api';
import QuizReviewHeader from '../components/QuizReviewHeader';
import Colors from '../utils/Colors';
import * as SIZES from '../utils/dimensions';

const ReviewFlnQuestion = ({route, navigation}) => {
  // console.log('route--->', route.params.studentDetails);
  // console.log('route2--->', route.params.examType);
  const data = route.params.studentDetails;
  const type = route.params.examType;
  const [isLoading, setIsLoading] = useState(false);
  // console.log('isLoading----->', isLoading);
  const [reviewQuestions, setReviewQuestions] = useState([]);
  // console.log('reviewQuestions----->', reviewQuestions);
  const [reviewQuestionsMidline, setReviewQuestionMidline] = useState([]);
  const [reviewQuestionEndline, setReviewQuestionEndline] = useState([]);

  // useEffect(() => {
  //   setIsLoading(true);
  //   API.get(
  //     `reviewFlnAssessData/${data.userid}/${data.studentid}/${type}`,
  //   ).then(response => {
  //     console.log('response---->', response.data.baselinedata);
  //     setReviewQuestions(response.data.baselinedata);
  //     // setReviewQuestionMidline(response.data.midlinedata);
  //     // setReviewQuestionEndline(response.data.endlinedata);
  //   });
  // }, []);

  // const getQuizReview = () => {
  //   setIsLoading(true);
  //   API.get(
  //     `reviewFlnAssessData/${data.userid}/${data.studentid}/${type}`,
  //   ).then(response => {
  //     console.log('response---->', response.data.baselinedata);
  //     setReviewQuestions(response.data.baselinedata);
  //   });
  // };

  useEffect(() => {
    setIsLoading(true);
    if (type == 'baseline') {
      API.get(
        `reviewFlnAssessData/${data.userid}/${data.studentid}/${type}`,
      ).then(response => {
        // console.log('response2---->', response.data.baselinedata);
        setReviewQuestions(response.data.baselinedata);
        // setReviewQuestionMidline(response.data.midlinedata);
        // setReviewQuestionEndline(response.data.endlinedata);
      });
    } else if (type == 'midline') {
      API.get(
        `reviewFlnAssessData/${data.userid}/${data.studentid}/${type}`,
      ).then(response => {
        // console.log('response3---->', response.data.midlinedata);
        setReviewQuestionMidline(response.data.midlinedata);
        // setReviewQuestionMidline(response.data.midlinedata);
        // setReviewQuestionEndline(response.data.endlinedata);
      });
    } else if (type == 'endline') {
      API.get(
        `reviewFlnAssessData/${data.userid}/${data.studentid}/${type}`,
      ).then(response => {
        // console.log('response3---->', response.data.endlinedata);
        setReviewQuestionEndline(response.data.endlinedata);
        // setReviewQuestionMidline(response.data.midlinedata);
        // setReviewQuestionEndline(response.data.endlinedata);
      });
    } else {
      // console.log('last index');
    }
  }, []);

  const correctQuiz = reviewQuestions.filter(
    x => x.answer == 'yes' || x.answer == 'Yes',
  );
  // console.log(reviewQuestions, 'correctQuiz-------->', correctQuiz);
  const correctQuizMidline = reviewQuestionsMidline.filter(
    x => x.answer === 'yes' || x.answer === 'Yes',
  );
  const correctQuizEndline = reviewQuestionEndline.filter(
    x => x.answer === 'yes' || x.answer === 'Yes',
  );

  const [selectedModule, setSelectedModule] = React.useState(0);
  const [header, setHeader] = React.useState(0);
  // console.log(
  //   'selectedModule----->',
  //   selectedModule,
  //   reviewQuestions.length,
  //   header,
  // );
  const [selectedItem, setSelectedItem] = React.useState([]);
  // console.log('selectedItem----->', selectedItem);
  const postModuleid = (item, index) => {
    // console.log('check index----->', index);
    setSelectedItem(item);
    setSelectedModule(index);
    setHeader(index);
  };

  const handlePrev = () => {
    if (type == 'baseline') {
      {
        header == 1
          ? console.log(
              header - 1,
              reviewQuestions.length,
              'check________________>1',
            )
          : setSelectedModule(selectedModule - 1);
      }
    } else if (type == 'midline') {
      {
        header == 1
          ? console.log(
              header - 1,
              reviewQuestions.length,
              'check________________>1',
            )
          : setSelectedModule(selectedModule - 1);
      }
    } else if (type == 'endline') {
      {
        header == 1
          ? console.log(
              header - 1,
              reviewQuestions.length,
              'check________________>1',
            )
          : setSelectedModule(selectedModule - 1);
      }
    }

    if (header == 1) {
      console.log(
        header - 1,
        reviewQuestions.length,
        'check________________>1',
      );
    } else {
      setSelectedModule(selectedModule - 1);
    }
    // console.log('check prev________________>3');
  };
  //
  // console.log('selectedModule--->', selectedModule);
  const handleNext = () => {
    // console.log(
    //   'clicked next',
    //   header,
    //   reviewQuestions.length,
    //   reviewQuestionsMidline.length,
    // );
    if (type == 'baseline') {
      {
        selectedModule == reviewQuestions.length
          ? console.log(
              header,
              reviewQuestions.length,
              'check________________>2',
            )
          : setSelectedModule(selectedModule + 1);
      }
    } else if (type == 'midline') {
      {
        selectedModule + 1 == reviewQuestionsMidline.length
          ? console.log(
              header,
              reviewQuestionsMidline.length,
              'check________________>3',
            )
          : setSelectedModule(selectedModule + 1);
      }
    } else if (type == 'endline') {
      {
        selectedModule + 1 == reviewQuestionEndline.length
          ? console.log(
              header,
              reviewQuestionEndline.length,
              'check________________>4',
            )
          : setSelectedModule(selectedModule + 1);
      }
    }
  };

  return (
    <>
      {type == 'baseline' ? (
        <>
          <View
            style={{
              justifyContent: 'flex-start',
              alignItems: 'flex-start',
              marginTop: 12,
              marginLeft: 29,
            }}>
            <Text style={{color: 'black', fontWeight: 'bold', fontSize: 23}}>
              Quiz Review
            </Text>
            {/* <Text style={{color: 'black'}}>
          Total Questions : {reviewQuestions.length}
        </Text> */}

            <Text style={{color: 'grey', fontWeight: 'bold'}}>
              You have scored {correctQuiz.length} out of{' '}
              {reviewQuestions.length}
            </Text>

            {/* <Text style={{color: 'black', paddingLeft: 19}}>
            Incorrect Answer : {incorrectQuiz.length}
          </Text> */}

            <Text style={{color: 'grey', fontWeight: 'bold'}}>
              Click on question number to check answer
            </Text>
          </View>
        </>
      ) : type == 'midline' ? (
        <>
          <View
            style={{
              justifyContent: 'flex-start',
              alignItems: 'flex-start',
              marginTop: 12,
              marginLeft: 29,
            }}>
            <Text style={{color: 'black', fontWeight: 'bold', fontSize: 23}}>
              Quiz Review
            </Text>
            {/* <Text style={{color: 'black'}}>
          Total Questions : {reviewQuestions.length}
        </Text> */}

            <Text style={{color: 'grey', fontWeight: 'bold'}}>
              You have scored {correctQuizMidline.length} out of{' '}
              {reviewQuestionsMidline.length}
            </Text>

            {/* <Text style={{color: 'black', paddingLeft: 19}}>
            Incorrect Answer : {incorrectQuiz.length}
          </Text> */}

            <Text style={{color: 'grey', fontWeight: 'bold'}}>
              Click on question number to check answer
            </Text>
          </View>
        </>
      ) : type == 'endline' ? (
        <>
          <View
            style={{
              justifyContent: 'flex-start',
              alignItems: 'flex-start',
              marginTop: 12,
              marginLeft: 29,
            }}>
            <Text style={{color: 'black', fontWeight: 'bold', fontSize: 23}}>
              Quiz Review
            </Text>
            {/* <Text style={{color: 'black'}}>
          Total Questions : {reviewQuestions.length}
        </Text> */}

            <Text style={{color: 'grey', fontWeight: 'bold'}}>
              You have scored {correctQuizEndline.length} out of{' '}
              {reviewQuestionEndline.length}
            </Text>

            {/* <Text style={{color: 'black', paddingLeft: 19}}>
            Incorrect Answer : {incorrectQuiz.length}
          </Text> */}

            <Text style={{color: 'grey', fontWeight: 'bold'}}>
              Click on question number to check answer
            </Text>
          </View>
        </>
      ) : null}

      {isLoading == false ? (
        <ActivityIndicator
          size="large"
          color={Colors.primary}
          style={{justifyContent: 'center', alignSelf: 'center'}}
        />
      ) : (
        <>
          {type == 'baseline' ? (
            <>
              <ScrollView horizontal={true}>
                {reviewQuestions.map((item, index) => (
                  <TouchableOpacity
                    onPress={() => postModuleid(item, index)}
                    key={index}
                    style={{
                      marginTop: 22,
                      margin: 2,
                      flexDirection: 'row',
                      borderWidth: 2,
                      width: 45.72,
                      height: 46.66,
                      borderRadius: 100,
                      borderColor:
                        index === selectedModule ? Colors.black : Colors.white,
                      backgroundColor:
                        item.answer == 'yes' || item.answer == 'Yes'
                          ? '#A3D735'
                          : '#FF9515',
                      marginLeft: 29,
                      justifyContent: 'space-evenly',
                    }}>
                    <Text style={{color: 'white', padding: 10}}>
                      {index + 1}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
              <View style={styles.container}>
                <>
                  <ScrollView>
                    {/* <View
                      // start={{x: 0, y: 0}}
                      // end={{x: 1, y: 0}}
                      // colors={['#0e7490', '#06b6d4', '#fafafa']}
                      style={styles.linearGradient}> */}
                    {/* <View style={styles.moduleContainer}> */}
                    <Text style={styles.moduleText}>
                      {selectedModule ? (
                        <>
                          <View>
                            <View
                              style={{
                                flexDirection: 'row',
                                flexGrow: 1,
                                marginTop: 19,
                              }}>
                              <Text
                                style={{
                                  flexGrow: 1,
                                  flexShrink: 1,
                                  paddingLeft: 10,
                                  paddingRight: 8,
                                  alignItems: 'center',
                                  color: 'black',
                                  width: 350,
                                  fontSize: 20,
                                }}>
                                {selectedModule + 1}.{' '}
                                {
                                  reviewQuestions[selectedModule]
                                    .assessmentquestion
                                }
                              </Text>
                            </View>

                            {!reviewQuestions[selectedModule].A ? (
                              <View
                                style={{
                                  flexDirection: 'row',
                                  marginTop: 19,
                                }}>
                                <Text
                                  style={[
                                    styles.item,
                                    {
                                      marginLeft: 5,
                                      backgroundColor:
                                        reviewQuestions[selectedModule]
                                          .answer === 'yes' ||
                                        reviewQuestions[selectedModule]
                                          .answer === 'Yes'
                                          ? '#A3D735'
                                          : 'grey',
                                      width: 50,
                                      height: 50,
                                      borderRadius: 39,
                                      paddingLeft: 13,
                                    },
                                  ]}>
                                  {' '}
                                  {reviewQuestions[selectedModule].A
                                    ? 'A'
                                    : 'A'}{' '}
                                </Text>
                                <Text style={styles.item}>ହଁ</Text>
                              </View>
                            ) : null}
                            {!reviewQuestions[selectedModule].B ? (
                              <View
                                style={{
                                  flexDirection: 'row',
                                  marginTop: 19,
                                }}>
                                <Text
                                  style={[
                                    styles.item,
                                    {
                                      marginLeft: 5,
                                      backgroundColor:
                                        reviewQuestions[selectedModule]
                                          .answer === 'no' ||
                                        reviewQuestions[selectedModule]
                                          .answer === 'No'
                                          ? '#FF9515'
                                          : 'grey',
                                      width: 50,
                                      height: 50,
                                      borderRadius: 39,
                                      paddingLeft: 13,
                                    },
                                  ]}>
                                  {' '}
                                  {reviewQuestions[selectedModule].B
                                    ? 'B'
                                    : 'B'}{' '}
                                </Text>
                                <Text style={styles.item}>ନା</Text>
                              </View>
                            ) : null}
                            <View style={{marginTop: 19}}>
                              <Text style={[styles.itemCorrect]}>
                                Marked Answer :{' '}
                                {reviewQuestions[selectedModule].answer}
                              </Text>
                            </View>

                            {/* Previous and next button start*/}
                            <View style={{flexDirection: 'row'}}>
                              {selectedModule + 1 == reviewQuestions.length ? (
                                <TouchableOpacity
                                  onPress={handlePrev}
                                  style={{
                                    marginLeft: 19,
                                  }}>
                                  <Image
                                    style={{
                                      marginTop: 62,
                                      marginLeft: 5,
                                      width: 32,
                                      height: 32,
                                    }}
                                    source={require('../assets/Image/arrow-square-left.png')}
                                  />
                                </TouchableOpacity>
                              ) : selectedModule == 0 ? (
                                <TouchableOpacity
                                  onPress={handleNext}
                                  style={{
                                    marginLeft: 260,
                                  }}>
                                  <Image
                                    style={{
                                      marginTop: 62,
                                      marginLeft: -85,
                                      width: 32,
                                      height: 32,
                                    }}
                                    source={require('../assets/Image/arrow-square-right.png')}
                                  />
                                </TouchableOpacity>
                              ) : (
                                <>
                                  <TouchableOpacity
                                    onPress={handlePrev}
                                    style={{
                                      marginLeft: 19,
                                    }}>
                                    <Image
                                      style={{
                                        marginTop: 62,
                                        marginLeft: 5,
                                        width: 32,
                                        height: 32,
                                      }}
                                      source={require('../assets/Image/arrow-square-left.png')}
                                    />
                                  </TouchableOpacity>
                                  <TouchableOpacity
                                    onPress={handleNext}
                                    style={{
                                      marginLeft: 260,
                                    }}>
                                    <Image
                                      style={{
                                        marginTop: 62,
                                        marginLeft: -85,
                                        width: 32,
                                        height: 32,
                                      }}
                                      source={require('../assets/Image/arrow-square-right.png')}
                                    />
                                  </TouchableOpacity>
                                </>
                              )}
                            </View>

                            {/* Previous and next button end*/}
                          </View>
                        </>
                      ) : reviewQuestions.length > 0 ? (
                        <>
                          <View>
                            <View
                              style={{
                                flexDirection: 'row',
                                flexGrow: 1,
                                marginTop: 19,
                              }}>
                              <Text
                                style={{
                                  flexGrow: 1,
                                  flexShrink: 1,
                                  paddingLeft: 10,
                                  paddingRight: 8,
                                  alignItems: 'center',
                                  color: 'black',
                                  width: 350,
                                  fontSize: 20,
                                }}>
                                {1}. {reviewQuestions[0].assessmentquestion}
                              </Text>
                            </View>

                            {!reviewQuestions[0].A ? (
                              <View
                                style={{
                                  flexDirection: 'row',
                                  marginTop: 19,
                                }}>
                                <Text
                                  style={[
                                    styles.item,
                                    {
                                      marginLeft: 5,
                                      backgroundColor:
                                        reviewQuestions[selectedModule]
                                          .answer === 'yes' ||
                                        reviewQuestions[selectedModule]
                                          .answer === 'Yes'
                                          ? '#A3D735'
                                          : 'grey',
                                      width: 50,
                                      height: 50,
                                      borderRadius: 39,
                                      paddingLeft: 13,
                                    },
                                  ]}>
                                  {' '}
                                  {reviewQuestions[0].A ? 'A' : 'A'}{' '}
                                </Text>
                                <Text style={styles.item}>ହଁ</Text>
                              </View>
                            ) : null}
                            {!reviewQuestions[0].B ? (
                              <View
                                style={{
                                  flexDirection: 'row',
                                  marginTop: 19,
                                }}>
                                <Text
                                  style={[
                                    styles.item,
                                    {
                                      marginLeft: 5,
                                      backgroundColor:
                                        reviewQuestions[selectedModule]
                                          .answer === 'no' ||
                                        reviewQuestions[selectedModule]
                                          .answer === 'No'
                                          ? '#FF9515'
                                          : 'grey',
                                      width: 50,
                                      height: 50,
                                      borderRadius: 39,
                                      paddingLeft: 13,
                                    },
                                  ]}>
                                  {' '}
                                  {reviewQuestions[0].B ? 'B' : 'B'}{' '}
                                </Text>
                                <Text style={styles.item}>ନା</Text>
                              </View>
                            ) : null}

                            <View style={{marginTop: 19}}>
                              <Text style={[styles.itemCorrect]}>
                                Marked Answer : {reviewQuestions[0].answer}
                              </Text>
                            </View>

                            <TouchableOpacity
                              onPress={handleNext}
                              style={{
                                marginLeft: 260,
                              }}>
                              <Image
                                style={{
                                  marginTop: 62,
                                  marginLeft: -85,
                                  width: 32,
                                  height: 32,
                                }}
                                source={require('../assets/Image/arrow-square-right.png')}
                              />
                            </TouchableOpacity>
                            {/* <Text style={styles.item}>
                                  Marked Answer :{' '}
                                  {reviewQuestions[0].selectedOption}
                                </Text> */}
                          </View>
                        </>
                      ) : null}
                    </Text>
                    {/* </View> */}
                    {/* </View> */}
                  </ScrollView>
                </>
              </View>
            </>
          ) : type == 'midline' ? (
            <>
              <ScrollView horizontal={true}>
                {reviewQuestionsMidline.map((item, index) => (
                  <TouchableOpacity
                    onPress={() => postModuleid(item, index)}
                    key={index}
                    style={{
                      marginTop: 22,
                      margin: 2,
                      flexDirection: 'row',
                      borderWidth: 2,
                      width: 45.72,
                      height: 46.66,
                      borderRadius: 100,
                      borderColor:
                        index === selectedModule ? Colors.black : Colors.white,
                      backgroundColor:
                        item.answer === 'yes' || item.answer === 'Yes'
                          ? '#A3D735'
                          : '#FF9515',
                      marginLeft: 29,
                      justifyContent: 'space-evenly',
                    }}>
                    <Text style={{color: 'white', padding: 10}}>
                      {index + 1}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
              <View style={styles.container}>
                <>
                  <ScrollView>
                    <Text style={styles.moduleText}>
                      {selectedModule ? (
                        <>
                          <View>
                            <View
                              style={{
                                flexDirection: 'row',
                                flexGrow: 1,
                                marginTop: 19,
                              }}>
                              <Text
                                style={{
                                  flexGrow: 1,
                                  flexShrink: 1,
                                  paddingLeft: 10,
                                  paddingRight: 8,
                                  alignItems: 'center',
                                  color: 'black',
                                  width: 350,
                                  fontSize: 20,
                                }}>
                                {selectedModule}.{' '}
                                {
                                  reviewQuestionsMidline[selectedModule]
                                    .assessmentquestion
                                }
                              </Text>
                            </View>

                            {!reviewQuestionsMidline[selectedModule].A ? (
                              <View
                                style={{
                                  flexDirection: 'row',
                                  marginTop: 19,
                                }}>
                                <Text
                                  style={[
                                    styles.item,
                                    {
                                      marginLeft: 5,
                                      backgroundColor:
                                        reviewQuestionsMidline[selectedModule]
                                          .answer === 'yes' ||
                                        reviewQuestionsMidline[selectedModule]
                                          .answer === 'Yes'
                                          ? '#A3D735'
                                          : 'grey',
                                      width: 50,
                                      height: 50,
                                      borderRadius: 39,
                                      paddingLeft: 13,
                                    },
                                  ]}>
                                  {' '}
                                  {reviewQuestionsMidline[selectedModule].A
                                    ? 'A'
                                    : 'A'}{' '}
                                </Text>
                                <Text style={styles.item}>ହଁ</Text>
                              </View>
                            ) : null}
                            {!reviewQuestionsMidline[selectedModule].B ? (
                              <View
                                style={{
                                  flexDirection: 'row',
                                  marginTop: 19,
                                }}>
                                <Text
                                  style={[
                                    styles.item,
                                    {
                                      marginLeft: 5,

                                      backgroundColor:
                                        reviewQuestionsMidline[selectedModule]
                                          .answer === 'no' ||
                                        reviewQuestionsMidline[selectedModule]
                                          .answer === 'No'
                                          ? '#FF9515'
                                          : 'grey',
                                      width: 50,
                                      height: 50,
                                      borderRadius: 39,
                                      paddingLeft: 13,
                                    },
                                  ]}>
                                  {' '}
                                  {reviewQuestionsMidline[selectedModule].B
                                    ? 'B'
                                    : 'B'}{' '}
                                </Text>
                                <Text style={styles.item}>ନା</Text>
                              </View>
                            ) : null}

                            <View style={{marginTop: 19}}>
                              <Text style={[styles.itemCorrect]}>
                                Marked Answer :{' '}
                                {reviewQuestionsMidline[selectedModule].answer}
                              </Text>
                            </View>
                            {/* Previous and next button start*/}
                            <View style={{flexDirection: 'row'}}>
                              {selectedModule + 1 ==
                              reviewQuestionsMidline.length ? (
                                <TouchableOpacity
                                  onPress={handlePrev}
                                  style={{
                                    marginLeft: 19,
                                  }}>
                                  <Image
                                    style={{
                                      marginTop: 62,
                                      marginLeft: 5,
                                      width: 32,
                                      height: 32,
                                    }}
                                    source={require('../assets/Image/arrow-square-left.png')}
                                  />
                                </TouchableOpacity>
                              ) : selectedModule == 0 ? (
                                <TouchableOpacity
                                  onPress={handleNext}
                                  style={{
                                    marginLeft: 260,
                                  }}>
                                  <Image
                                    style={{
                                      marginTop: 62,
                                      marginLeft: -85,
                                      width: 32,
                                      height: 32,
                                    }}
                                    source={require('../assets/Image/arrow-square-right.png')}
                                  />
                                </TouchableOpacity>
                              ) : (
                                <>
                                  <TouchableOpacity
                                    onPress={handlePrev}
                                    style={{
                                      marginLeft: 19,
                                    }}>
                                    <Image
                                      style={{
                                        marginTop: 62,
                                        marginLeft: 5,
                                        width: 32,
                                        height: 32,
                                      }}
                                      source={require('../assets/Image/arrow-square-left.png')}
                                    />
                                  </TouchableOpacity>
                                  <TouchableOpacity
                                    onPress={handleNext}
                                    style={{
                                      marginLeft: 260,
                                    }}>
                                    <Image
                                      style={{
                                        marginTop: 62,
                                        marginLeft: -85,
                                        width: 32,
                                        height: 32,
                                      }}
                                      source={require('../assets/Image/arrow-square-right.png')}
                                    />
                                  </TouchableOpacity>
                                </>
                              )}
                            </View>

                            {/* Previous and next button end*/}
                          </View>
                        </>
                      ) : reviewQuestionsMidline.length > 0 ? (
                        <>
                          <View>
                            <View
                              style={{
                                flexDirection: 'row',
                                flexGrow: 1,
                                marginTop: 19,
                              }}>
                              <Text
                                style={{
                                  flexGrow: 1,
                                  flexShrink: 1,
                                  paddingLeft: 10,
                                  paddingRight: 8,
                                  alignItems: 'center',
                                  color: 'black',
                                  width: 350,
                                  fontSize: 20,
                                }}>
                                {1}.{' '}
                                {reviewQuestionsMidline[0].assessmentquestion}
                              </Text>
                            </View>

                            {!reviewQuestionsMidline[0].A ? (
                              <View
                                style={{
                                  flexDirection: 'row',
                                  marginTop: 19,
                                }}>
                                <Text
                                  style={[
                                    styles.item,
                                    {
                                      marginLeft: 5,
                                      backgroundColor:
                                        reviewQuestionsMidline[selectedModule]
                                          .answer === 'yes' ||
                                        reviewQuestionsMidline[selectedModule]
                                          .answer === 'Yes'
                                          ? '#A3D735'
                                          : 'grey',
                                      width: 50,
                                      height: 50,
                                      borderRadius: 39,
                                      paddingLeft: 13,
                                    },
                                  ]}>
                                  {' '}
                                  {reviewQuestionsMidline[0].A ? 'A' : 'A'}{' '}
                                </Text>
                                <Text style={styles.item}>ହଁ</Text>
                              </View>
                            ) : null}
                            {!reviewQuestionsMidline[0].B ? (
                              <View
                                style={{
                                  flexDirection: 'row',
                                  marginTop: 19,
                                }}>
                                <Text
                                  style={[
                                    styles.item,
                                    {
                                      marginLeft: 5,
                                      backgroundColor:
                                        reviewQuestionsMidline[selectedModule]
                                          .answer === 'no' ||
                                        reviewQuestionsMidline[selectedModule]
                                          .answer === 'No'
                                          ? '#FF9515'
                                          : 'grey',
                                      width: 50,
                                      height: 50,
                                      borderRadius: 39,
                                      paddingLeft: 13,
                                    },
                                  ]}>
                                  {' '}
                                  {reviewQuestionsMidline[0].B ? 'B' : 'B'}{' '}
                                </Text>
                                <Text style={styles.item}>ନା</Text>
                              </View>
                            ) : null}

                            <View style={{marginTop: 19}}>
                              <Text style={[styles.itemCorrect]}>
                                Marked Answer :{' '}
                                {reviewQuestionsMidline[0].answer}
                              </Text>
                            </View>
                            <TouchableOpacity
                              onPress={handleNext}
                              style={{
                                marginLeft: 260,
                              }}>
                              <Image
                                style={{
                                  marginTop: 62,
                                  marginLeft: -85,
                                  width: 32,
                                  height: 32,
                                }}
                                source={require('../assets/Image/arrow-square-right.png')}
                              />
                            </TouchableOpacity>
                            {/* <Text style={styles.item}>
                                  Marked Answer :{' '}
                                  {reviewQuestions[0].selectedOption}
                                </Text> */}
                          </View>
                        </>
                      ) : null}
                    </Text>
                  </ScrollView>
                </>
              </View>
            </>
          ) : type == 'endline' ? (
            <>
              <ScrollView horizontal={true}>
                {reviewQuestionEndline.map((item, index) => (
                  <TouchableOpacity
                    onPress={() => postModuleid(item, index)}
                    key={index}
                    style={{
                      marginTop: 22,
                      margin: 2,
                      flexDirection: 'row',
                      borderWidth: 2,
                      width: 45.72,
                      height: 46.66,
                      borderRadius: 100,
                      borderColor:
                        index === selectedModule ? Colors.black : Colors.white,
                      backgroundColor:
                        item.answer === 'yes' || item.answer === 'Yes'
                          ? '#A3D735'
                          : '#FF9515',
                      marginLeft: 29,
                      justifyContent: 'space-evenly',
                    }}>
                    <Text style={{color: 'white', padding: 10}}>
                      {index + 1}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
              <View style={styles.container}>
                <>
                  <ScrollView>
                    <Text style={styles.moduleText}>
                      {selectedModule ? (
                        <>
                          <View>
                            <View
                              style={{
                                flexDirection: 'row',
                                flexGrow: 1,
                                marginTop: 19,
                              }}>
                              <Text
                                style={{
                                  flexGrow: 1,
                                  flexShrink: 1,
                                  paddingLeft: 10,
                                  paddingRight: 8,
                                  alignItems: 'center',
                                  color: 'black',
                                  width: 350,
                                  fontSize: 20,
                                }}>
                                {selectedModule}.{' '}
                                {
                                  reviewQuestionEndline[selectedModule]
                                    .assessmentquestion
                                }
                              </Text>
                            </View>

                            {!reviewQuestionEndline[selectedModule].A ? (
                              <View
                                style={{
                                  flexDirection: 'row',
                                  marginTop: 19,
                                }}>
                                <Text
                                  style={[
                                    styles.item,
                                    {
                                      marginLeft: 5,
                                      backgroundColor:
                                        reviewQuestionEndline[selectedModule]
                                          .answer === 'yes' ||
                                        reviewQuestionEndline[selectedModule]
                                          .answer === 'Yes'
                                          ? '#A3D735'
                                          : 'grey',
                                      width: 50,
                                      height: 50,
                                      borderRadius: 39,
                                      paddingLeft: 13,
                                    },
                                  ]}>
                                  {' '}
                                  {reviewQuestionEndline[selectedModule].A
                                    ? 'A'
                                    : 'A'}{' '}
                                </Text>
                                <Text style={styles.item}>ହଁ</Text>
                              </View>
                            ) : null}
                            {!reviewQuestionEndline[selectedModule].B ? (
                              <View
                                style={{
                                  flexDirection: 'row',
                                  marginTop: 19,
                                }}>
                                <Text
                                  style={[
                                    styles.item,
                                    {
                                      marginLeft: 5,

                                      backgroundColor:
                                        reviewQuestionEndline[selectedModule]
                                          .answer === 'no' ||
                                        reviewQuestionEndline[selectedModule]
                                          .answer === 'No'
                                          ? '#FF9515'
                                          : 'grey',
                                      width: 50,
                                      height: 50,
                                      borderRadius: 39,
                                      paddingLeft: 13,
                                    },
                                  ]}>
                                  {' '}
                                  {reviewQuestionEndline[selectedModule].B
                                    ? 'B'
                                    : 'B'}{' '}
                                </Text>
                                <Text style={styles.item}>ନା</Text>
                              </View>
                            ) : null}

                            <View style={{marginTop: 19}}>
                              <Text style={[styles.itemCorrect]}>
                                Marked Answer :{' '}
                                {reviewQuestionEndline[selectedModule].answer}
                              </Text>
                            </View>
                            {/* Previous and next button start*/}
                            <View style={{flexDirection: 'row'}}>
                              {selectedModule + 1 ==
                              reviewQuestionEndline.length ? (
                                <TouchableOpacity
                                  onPress={handlePrev}
                                  style={{
                                    marginLeft: 19,
                                  }}>
                                  <Image
                                    style={{
                                      marginTop: 62,
                                      marginLeft: 5,
                                      width: 32,
                                      height: 32,
                                    }}
                                    source={require('../assets/Image/arrow-square-left.png')}
                                  />
                                </TouchableOpacity>
                              ) : selectedModule == 0 ? (
                                <TouchableOpacity
                                  onPress={handleNext}
                                  style={{
                                    marginLeft: 260,
                                  }}>
                                  <Image
                                    style={{
                                      marginTop: 62,
                                      marginLeft: -85,
                                      width: 32,
                                      height: 32,
                                    }}
                                    source={require('../assets/Image/arrow-square-right.png')}
                                  />
                                </TouchableOpacity>
                              ) : (
                                <>
                                  <TouchableOpacity
                                    onPress={handlePrev}
                                    style={{
                                      marginLeft: 19,
                                    }}>
                                    <Image
                                      style={{
                                        marginTop: 62,
                                        marginLeft: 5,
                                        width: 32,
                                        height: 32,
                                      }}
                                      source={require('../assets/Image/arrow-square-left.png')}
                                    />
                                  </TouchableOpacity>
                                  <TouchableOpacity
                                    onPress={handleNext}
                                    style={{
                                      marginLeft: 260,
                                    }}>
                                    <Image
                                      style={{
                                        marginTop: 62,
                                        marginLeft: -85,
                                        width: 32,
                                        height: 32,
                                      }}
                                      source={require('../assets/Image/arrow-square-right.png')}
                                    />
                                  </TouchableOpacity>
                                </>
                              )}
                            </View>

                            {/* Previous and next button end*/}
                          </View>
                        </>
                      ) : reviewQuestionEndline.length > 0 ? (
                        <>
                          <View>
                            <View
                              style={{
                                flexDirection: 'row',
                                flexGrow: 1,
                                marginTop: 19,
                              }}>
                              <Text
                                style={{
                                  flexGrow: 1,
                                  flexShrink: 1,
                                  paddingLeft: 10,
                                  paddingRight: 8,
                                  alignItems: 'center',
                                  color: 'black',
                                  width: 350,
                                  fontSize: 20,
                                }}>
                                {1}.{' '}
                                {reviewQuestionEndline[0].assessmentquestion}
                              </Text>
                            </View>

                            {!reviewQuestionEndline[0].A ? (
                              <View
                                style={{
                                  flexDirection: 'row',
                                  marginTop: 19,
                                }}>
                                <Text
                                  style={[
                                    styles.item,
                                    {
                                      marginLeft: 5,
                                      backgroundColor:
                                        reviewQuestionEndline[selectedModule]
                                          .answer === 'yes' ||
                                        reviewQuestionEndline[selectedModule]
                                          .answer === 'Yes'
                                          ? '#A3D735'
                                          : 'grey',
                                      width: 50,
                                      height: 50,
                                      borderRadius: 39,
                                      paddingLeft: 13,
                                    },
                                  ]}>
                                  {' '}
                                  {reviewQuestionEndline[0].A ? 'A' : 'A'}{' '}
                                </Text>
                                <Text style={styles.item}>ହଁ</Text>
                              </View>
                            ) : null}
                            {!reviewQuestionEndline[0].B ? (
                              <View
                                style={{
                                  flexDirection: 'row',
                                  marginTop: 19,
                                }}>
                                <Text
                                  style={[
                                    styles.item,
                                    {
                                      marginLeft: 5,
                                      backgroundColor:
                                        reviewQuestionEndline[selectedModule]
                                          .answer === 'no' ||
                                        reviewQuestionEndline[selectedModule]
                                          .answer === 'No'
                                          ? '#FF9515'
                                          : 'grey',
                                      width: 50,
                                      height: 50,
                                      borderRadius: 39,
                                      paddingLeft: 13,
                                    },
                                  ]}>
                                  {' '}
                                  {reviewQuestionEndline[0].B ? 'B' : 'B'}{' '}
                                </Text>
                                <Text style={styles.item}>ନା</Text>
                              </View>
                            ) : null}

                            <View style={{marginTop: 19}}>
                              <Text style={[styles.itemCorrect]}>
                                Marked Answer :{' '}
                                {reviewQuestionEndline[0].answer}
                              </Text>
                            </View>
                            <TouchableOpacity
                              onPress={handleNext}
                              style={{
                                marginLeft: 260,
                              }}>
                              <Image
                                style={{
                                  marginTop: 62,
                                  marginLeft: -85,
                                  width: 32,
                                  height: 32,
                                }}
                                source={require('../assets/Image/arrow-square-right.png')}
                              />
                            </TouchableOpacity>
                            {/* <Text style={styles.item}>
                                  Marked Answer :{' '}
                                  {reviewQuestions[0].selectedOption}
                                </Text> */}
                          </View>
                        </>
                      ) : null}
                    </Text>
                  </ScrollView>
                </>
              </View>
            </>
          ) : null}
        </>
      )}
    </>
  );
};

export default ReviewFlnQuestion;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: -22,
    marginLeft: 26,
    marginTop: -464,
  },
  container2: {
    backgroundColor: Colors.white,
    width: SIZES.WindowWidth * 0.95,
    borderWidth: 2,
    borderColor: Colors.primary,
    alignSelf: 'center',
    borderRadius: 5,
    elevation: 10,
    marginBottom: 50,
  },
  moduleText: {
    color: Colors.primary,
    textTransform: 'uppercase',
    fontSize: 30,
    fontWeight: '900',
    letterSpacing: -1,
  },
  item: {
    padding: 10,
    fontSize: 18,
    height: 44,
    color: 'black',

    // marginTop: 12,
  },
  item1: {
    color: 'black',
    height: 44,
    fontSize: 18,
  },
  item: {
    padding: 10,
    fontSize: 18,
    height: 44,
    color: 'black',
    // marginTop: 12,
  },
  itemCorrect: {
    color: 'black',
    fontSize: 18,
    padding: 10,
    marginTop: -7,
  },
  itemQuestion: {
    padding: -29,
    fontSize: 18,
    // height: 99,
    color: 'black',
  },
});
