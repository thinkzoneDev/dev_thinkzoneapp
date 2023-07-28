import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Pressable,
  Modal,
  Image,
  ScrollView,
} from 'react-native';

// import AppTextInput from '../components/TextInput';
import DatePicker from 'react-native-datepicker';

// import Color from '../utils/Colors';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import React from 'react';
import {useEffect, useState, useCallback, useRef} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import * as studentstypes from '../redux/slices/StudentSlice';
import * as types from '../redux/slices/UserSlice';
import Colors from '../utils/Colors';
import API from '../environment/Api';
import ButtomSheet from '../components/BottomSheet';
import AppTextInput from '../components/TextInput';
import * as window from '../utils/dimensions';
import LinearGradient from 'react-native-linear-gradient';
import Norecord from '../components/Norecord';
import Modals from '../components/Modals';
import PaymentAccordion from '../components/PaymentAccordian';
import {FontFamily, Color, FontSize, Border} from '../GlobalStyle';
import {log} from 'console';

const PaymentDetails = ({route, navigation}) => {
  const paymentDetails = route.params.paymentDetails;

  const dispatch = useDispatch();
  const modalRef = useRef(null);
  const [selectedStudent, setSlectedStudent] = useState({});
  const [modalStatus, setModalStatus] = useState(false);
  const [totalAmount, setTotalAmount] = useState(0);
  const [inputTotalAmount, setInputTotalAmount] = useState(0);
  const [inputPaidAmount, setInputPaidAmount] = useState(0);
  const [paidAmount, setPayedAmount] = useState(0);
  const [paindingAmount, setPaindingAmount] = useState('');
  const isLoading = useSelector(state => state.studentdata.isLoading);
  const paymentStatus = useSelector(state => state.userdata.payments);
  // console.log('paymentStatus---->', paymentStatus);

  const [customModal, setCustomModal] = useState(true);
  const [inputAmount, setInputAmount] = useState(0);
  const [paymentRecord, setPaymentRecord] = useState([]);
  const studentData = useSelector(state => state.studentdata.students);
  const teacherdata = useSelector(state => state.userdata.user?.resData);
  const modalHeight = window.WindowHeigth * 0.9;
  const [modal, setModal] = useState(false);
  const [updateModal, setUpdateModal] = useState(false);

  useEffect(() => {
    dispatch(studentstypes.getStudentStart(teacherdata[0].userid));
  }, []);

  // Get Payments Deatils.
  const getPayDetails = item => {
    setSlectedStudent(item);
    setPayedAmount(0);
    setTotalAmount(0);
    setPaymentRecord([]);
    setModalStatus(false);
    handleOpenBottomSheet();
    API.get(`getalltchpaymentdetailsbystudentid/${item.studentid}`).then(
      response => {
        //
        setPaymentRecord(response.data);
        const paidAmount = response.data.reduce(
          (preValue, curValue) => preValue + curValue.amount,
          0,
        );
        const totalAmount = response.data ? response.data[0].total_amount : 0;
        setPayedAmount(paidAmount);
        setTotalAmount(totalAmount);
        //
      },
      err => {
        //
      },
    );
  };

  // Post payment details.
  const postPaymentDetails = item => {
    setSlectedStudent(item);
    setPayedAmount(0);
    setTotalAmount(0);
    setPaindingAmount(0);
    setPaymentRecord([]);
    setModalStatus(true);
    API.get(`getalltchpaymentdetailsbystudentid/${item.studentid}`).then(
      response => {
        //
        setPaymentRecord(response.data);
        const paidAmount = response.data.reduce(
          (preValue, curValue) => preValue + curValue.amount,
          0,
        );
        const totalAmount = response.data ? response.data[0].total_amount : 0;
        setPayedAmount(paidAmount);
        setTotalAmount(totalAmount);
        setPaindingAmount(totalAmount - paidAmount);

        //
      },
      err => {
        //
      },
    );
    //
    handleOpenBottomSheet();
  };
  const handleOpenBottomSheet = useCallback(() => {
    modalRef.current?.open();
  }, []);
  //
  const savePayment = () => {
    // console.log(
    //   'data------>',
    //   paymentDetails,
    //   paymentDetails.totalpayment.totalpaid + parseInt(inputPaidAmount),
    //   paymentDetails.totalpayment.totalamount,
    // );
    if (inputTotalAmount == 0 && inputPaidAmount == 0) {
      Alert.alert('info', 'Please add your amount!!!');
    } else {
      if (paymentDetails.totalpayment.totalamount == 0) {
        if (inputPaidAmount >= inputTotalAmount) {
          Alert.alert(
            'info',
            'Paid amount should not be greater than total amount.',
          );
        } else {
          let data = {
            userid: paymentDetails.userid,
            username: paymentDetails.username,
            studentid: paymentDetails.studentid,
            studentname: paymentDetails.studentname,
            program: paymentDetails.program,
            class: paymentDetails.class,
            registration_date: paymentDetails.registration_date,
            //payment_type : this.payment_type,
            total_amount: inputTotalAmount,
            amount: inputPaidAmount,
            status: '',
          };

          //
          dispatch(types.paymentsUserstart(data));
          dispatch(types.getallpaymentsstart(data.userid));

          setInputPaidAmount(0);
          setInputTotalAmount(0);
          navigation.navigate('home');
        }
      } else {
        if (
          paymentDetails.totalpayment.totalpaid + parseInt(inputPaidAmount) >
          paymentDetails.totalpayment.totalamount
        ) {
          console.log(
            'paymentDetails.totalpayment.totalpaid + parseInt(inputPaidAmount)',
            paymentDetails.totalpayment.totalpaid + parseInt(inputPaidAmount),
          );
          Alert.alert(
            'info',
            'Paid amount should not be greater than total amount.',
          );
        } else {
          let data1 = {
            userid: paymentDetails.userid,
            username: paymentDetails.username,
            studentid: paymentDetails.studentid,
            studentname: paymentDetails.studentname,
            program: paymentDetails.program,
            class: paymentDetails.class,
            registration_date: paymentDetails.registration_date,
            //payment_type : this.payment_type,
            total_amount: paymentDetails.totalpayment.totalamount,
            amount: inputPaidAmount,
            status: '',
          };
          // console.log('data1------>', data1);
          //

          dispatch(types.paymentsUserstart(data1));
          dispatch(types.getallpaymentsstart(data1.userid));
          setInputPaidAmount(0);
          setInputTotalAmount(0);
          // navigation.navigate('home');
          navigation.goBack();
        }
      }
    
    }
    
  };

  const closeModal = () => {
    setCustomModal(false);
    navigation.goBack();
  };
  return (
    <>
      {isLoading ? (
        <ActivityIndicator
          size="large"
          color={Color.primary}
          style={{justifyContent: 'center', alignSelf: 'center'}}
        />
      ) : (
        <>
          {studentData.length === 0 ? (
            <Modals
              visible={customModal}
              heading={'No Student Available'}
              backgroundColor={Colors.white}
              // onpressyes={closeModal}
              // onpressno={closeModal}
              onpressok={closeModal}
              okstatus={true}
            />
          ) : (
            <>
              <Modal animationType="slide" transparent={true} visible={modal}>
                <View style={styles.centeredView}>
                  <View
                    style={[
                      styles.modalView,
                      {
                        // height: window.WindowHeigth * 0.7,
                        marginTop: 50,
                        width: window.WindowWidth * 0.95,
                        justifyContent: 'space-around',
                      },
                    ]}>
                    <View style={{flexDirection: 'row'}}>
                      <Text
                        style={[
                          styles.username,
                          {marginTop: 40, fontSize: 14},
                        ]}>
                        Fixed Monthly Payment
                      </Text>
                      <TouchableOpacity onPress={() => setModal(false)}>
                        <Image
                          source={require('../assets/Image/close-circle.png')}
                        />
                      </TouchableOpacity>
                    </View>
                    <Text style={[styles.p, {marginTop: 20}]}>
                      Are you sure you want to change the fixed monthly payment
                      for this student? Please note that the old amount will no
                      longer be fixed, and the new monthly payment will be
                      calculated based on the amount entered.
                    </Text>
                    <View style={{flexDirection: 'row', marginTop: 20}}>
                      <Text
                        style={{
                          fontSize: 13,
                          fontFamily: FontFamily.poppinsMedium,
                          marginRight: 120,
                        }}>
                        Old Fixed Amount
                      </Text>
                      <Text
                        style={{
                          fontSize: 13,
                          fontFamily: FontFamily.poppinsMedium,
                          marginRight: 50,
                        }}>
                        200
                      </Text>
                    </View>
                    <View style={{flexDirection: 'row', marginTop: 20}}>
                      <Text
                        style={{
                          fontSize: 13,
                          fontFamily: FontFamily.poppinsMedium,
                          marginRight: 120,
                        }}>
                        New Fixed Amount
                      </Text>
                      <AppTextInput
                        style={[styles.Textinput, {right: 50}]}
                        autoCapitalize="none"
                        autoCorrect={false}
                        keyboardType="numeric"
                        name="aadhaar"
                        // maxLength={12}
                        // placeholder="Enter Aadhar Number"
                        value={200}
                        // onChangeText={value => setAadhaar(value)}
                      />
                    </View>
                    <View style={{flexDirection: 'row', marginTop: 20}}>
                      <TouchableOpacity
                        onPress={() => setModal(false)}
                        style={{
                          width: 100,
                          height: 48,
                          borderRadius: 20,
                          //   marginLeft: 20,
                          backgroundColor: Color.royalblue,
                          marginRight: 50,
                          marginTop: 20,
                        }}>
                        <Text
                          style={{
                            fontSize: 15,
                            marginTop: 10,
                            fontFamily: FontFamily.poppinsMedium,
                            color: 'white',
                            // marginLeft: 15,
                            textAlign: 'center',
                          }}>
                          Cancel
                        </Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={{
                          width: 100,

                          height: 48,
                          borderRadius: 20,
                          marginLeft: 20,
                          backgroundColor: Color.royalblue,
                          marginTop: 20,
                        }}>
                        <Text style={styles.buttonOpen}>Save</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              </Modal>
              <Modal
                animationType="slide"
                transparent={true}
                visible={updateModal}>
                <View style={styles.centeredView}>
                  <View
                    style={[
                      styles.modalView,
                      {
                        // height: window.WindowHeigth * 0.7,
                        marginTop: 50,
                        width: window.WindowWidth * 0.95,
                        justifyContent: 'space-around',
                      },
                    ]}>
                    <View style={{flexDirection: 'row'}}>
                      <Text
                        style={[
                          styles.username,
                          {marginTop: 20, fontSize: 15},
                        ]}>
                        Update New Payment
                      </Text>
                      <TouchableOpacity onPress={() => setUpdateModal(false)}>
                        <Image
                          source={require('../assets/Image/close-circle.png')}
                        />
                      </TouchableOpacity>
                    </View>
                    <Text style={[styles.p, {marginTop: 10}]}>
                      Once the new amount record entered, this will also updated
                      everywhere.
                    </Text>
                    <View
                      style={{
                        flexDirection: 'row',
                        marginTop: 20,
                        justifyContent: 'space-between',
                      }}>
                 
                    </View>
                    <View
                      style={{
                        flexDirection: 'row',
                        marginTop: 10,
                        justifyContent: 'space-around',
                      }}>
                      <Text
                        style={{
                          fontSize: 13,
                          fontFamily: FontFamily.poppinsMedium,
                          marginRight: 140,
                          top: '5%',
                        }}>
                        Total Pay
                      </Text>
                      {paymentDetails.totalpayment.totalamount > 0 ? (
                        <Text
                          style={{
                            fontSize: 13,
                            fontFamily: FontFamily.poppinsMedium,
                            marginRight: 50,
                          }}>
                          {paymentDetails.totalpayment.totalamount}
                        </Text>
                      ) : (
                        <AppTextInput
                          style={[
                            styles.Textinput,
                            {right: 0, marginRight: 20, left: 20},
                          ]}
                          autoCapitalize="none"
                          autoCorrect={false}
                          keyboardType="numeric"
                          name="aadhaar"
                          // maxLength={12}
                          // placeholder="Enter Aadhar Number"
                          value={inputTotalAmount}
                          onChangeText={value => setInputTotalAmount(value)}
                        />
                      )}
                    </View>
                    <View style={{flexDirection: 'row', marginTop: 20}}>
                      <Text
                        style={{
                          fontSize: 13,
                          fontFamily: FontFamily.poppinsMedium,
                          marginRight: 100,
                          top: '5%',
                        }}>
                        Enter Amount
                      </Text>
                      <AppTextInput
                        style={[styles.Textinput, {right: 0, marginRight: 20}]}
                        autoCapitalize="none"
                        autoCorrect={false}
                        keyboardType="numeric"
                        name="aadhaar"
                        // maxLength={12}
                        // placeholder="Enter Aadhar Number"
                        value={inputPaidAmount}
                        onChangeText={value => setInputPaidAmount(value)}
                      />
                    </View>
                    <View style={{flexDirection: 'row', marginTop: 20}}>
                      <TouchableOpacity
                        onPress={() => setUpdateModal(false)}
                        style={{
                          width: 100,
                          height: 48,
                          borderRadius: 20,
                          //   marginLeft: 20,
                          backgroundColor: Color.royalblue,
                          marginRight: 50,
                          marginTop: 20,
                        }}>
                        <Text
                          style={{
                            fontSize: 17,
                            marginTop: 12,
                            fontFamily: FontFamily.poppinsMedium,
                            color: 'white',
                            // marginLeft: 15,
                            textAlign: 'center',
                          }}>
                          Cancel
                        </Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={savePayment}
                        style={{
                          width: 100,
                          height: 48,
                          borderRadius: 20,
                          marginLeft: 20,
                          backgroundColor: Color.royalblue,
                          marginTop: 20,
                        }}>
                        <Text style={styles.buttonOpen}>Save</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              </Modal>
              <ScrollView>
                <View
                  style={{
                    // backgroundColor: Color.ghostwhite,
                    backgroundColor: 'white',
                    width: window.WindowWidth * 0.92,
                    // height: window.WindowHeigth * 0.15,
                    paddingBottom: 30,
                    marginLeft: 15,
                    marginTop: 20,
                    borderRadius: 5,
                  }}>
                  <View style={{flexDirection: 'row'}}>
                    <Text
                      style={{
                        textAlign: 'left',
                        marginTop: 10,
                        fontFamily: FontFamily.poppinsMedium,
                        color: '#333333',
                        marginLeft: 10,
                      }}>
                      Student Detail
                    </Text>
                    {/* <TouchableOpacity
                      onPress={() => navigation.navigate('studentlist')}>
                      <Text style={styles.update}>Update</Text>
                    </TouchableOpacity> */}
                  </View>
                  <View style={{flexDirection: 'row'}}>
                    <Text style={styles.textStyle}>Name:</Text>
                    <Text style={styles.name}>
                      {paymentDetails.studentname}
                    </Text>
                  </View>
                  <View style={{flexDirection: 'row'}}>
                    <Text style={styles.textStyle}>Class:</Text>
                    <Text style={styles.class}>{paymentDetails.class}</Text>
                  </View>
                </View>
                <View>
                  <View
                    style={{
                      flexDirection: 'row',
                      flexWrap: 'wrap',
                      justifyContent: 'space-evenly',
                    }}>
                    <TouchableOpacity
                      style={{
                        width: 105,
                        height: 136,
                        backgroundColor: 'white',
                        marginTop: 20,
                        justifyContent: 'space-around',
                        // marginLeft: 12,
                      }}>
                      <Text
                        style={{
                          fontFamily: FontFamily.poppinsMedium,
                          color: Color.royalblue,
                          // marginLeft: 10,
                          marginTop: 20,
                          fontWeight: '800',
                          fontSize: 23,
                          textAlign: 'center',
                        }}>
                        ₹ {paymentDetails.totalpayment.totalamount}
                      </Text>
                      <Text
                        style={{
                          // width: 90,
                          textAlign: 'center',
                          // height: 26,
                          fontFamily: FontFamily.poppinsMedium,
                          fontSize: 16,
                          marginTop: 10,
                          paddingBottom: 8,
                          // left: '1%',
                          color: '#333333',
                          textAlign: 'center',
                        }}>
                        Total
                      </Text>
                      {/* <Text
                        style={{
                          color: '#666666',
                          fontSize: 10,
                          // marginLeft: 18,
                          textAlign: 'center',
                        }}>
                        (Feb-Aug)
                      </Text> */}
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={{
                        width: 105,
                        height: 136,
                        backgroundColor: 'white',
                        marginTop: 20,
                        justifyContent: 'space-around',

                        // marginLeft: 12,
                      }}>
                      <Text
                        style={{
                          fontFamily: FontFamily.poppinsMedium,
                          color: Color.royalblue,
                          // marginLeft: 10,
                          textAlign: 'center',
                          marginTop: 20,
                          fontWeight: '800',
                          fontSize: 23,
                        }}>
                        ₹ {paymentDetails.totalpayment.totalpaid}
                      </Text>
                      <Text
                        style={{
                          // width: 90,
                          textAlign: 'center',
                          // height: 26,
                          fontFamily: FontFamily.poppinsMedium,
                          fontSize: 16,
                          marginTop: 10,
                          paddingBottom: 8,
                          // left: '1%',
                          color: '#333333',
                          textAlign: 'center',
                        }}>
                        Paid
                      </Text>
                      {/* <Text
                        style={{
                          color: '#666666',
                          fontSize: 10,
                          textAlign: 'center',
                        }}>
                        (Feb-Aug)
                      </Text> */}
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={{
                        width: 105,
                        height: 136,
                        backgroundColor: 'white',
                        marginTop: 20,
                        justifyContent: 'space-around',

                        // marginLeft: 12,
                      }}>
                      {/* <Text
                        onPress={() => setModal(true)}
                        style={{
                          fontFamily: FontFamily.poppinsMedium,
                          color: Color.royalblue,
                          textAlign: 'right',
                          marginRight: 10,
                          marginTop: 10,

                          fontSize: 10,
                        }}>
                        Edit
                      </Text> */}
                      <Text
                        style={{
                          fontFamily: FontFamily.poppinsMedium,
                          color: Color.royalblue,
                          // marginLeft: 10,
                          marginTop: 22,
                          fontWeight: '800',
                          fontSize: 23,
                          textAlign: 'center',
                        }}>
                        ₹{' '}
                        {paymentDetails.totalpayment.totalamount -
                          paymentDetails.totalpayment.totalpaid}
                      </Text>
                      <Text
                        style={{
                          // width: 90,

                          // height: 26,
                          fontFamily: FontFamily.poppinsMedium,
                          fontSize: 16,
                          marginTop: 10,
                          paddingBottom: 8,
                          // left: '1%',
                          color: '#333333',
                          textAlign: 'center',
                        }}>
                        Pending
                      </Text>
                      {/* <Text
                        style={{
                          color: '#666666',
                          fontSize: 10,
                          // marginLeft: 15,
                          textAlign: 'center',
                          marginTop: -10,
                        }}>
                        Tuition Fee
                      </Text> */}
                    </TouchableOpacity>
                  </View>
                </View>
                <View>
                  <View
                    style={{
                      backgroundColor: Color.royalblue,
                      width: window.WindowWidth * 0.93,
                      height: window.WindowHeigth * 0.2,
                      marginLeft: 15,
                      borderRadius: 10,
                      marginTop: 20,
                    }}>
                    <Text
                      style={{
                        color: 'white',
                        fontFamily: FontFamily.poppinsMedium,
                        fontSize: 16,
                        marginLeft: 20,
                        marginTop: 20,
                        fontWeight: '600',
                      }}>
                      Add Payment
                    </Text>
                    <Text
                      style={{
                        fontSize: 10,
                        fontFamily: FontFamily.poppinsMedium,
                        color: 'white',
                        marginLeft: 20,
                        width: 186,
                        height: 48,
                        marginTop: 10,
                      }}>
                      Update your recent payment details
                    </Text>
                    <View style={{flexDirection: 'row'}}>
                      <View>
                        <TouchableOpacity
                          // onPress={() => navigation.navigate('attendanceList')}
                          onPress={() => setUpdateModal(true)}
                          style={{
                            backgroundColor: Color.white,
                            marginLeft: 20,
                            borderRadius: 20,
                            width: window.WindowWidth * 0.21,
                            heightgg: 30,
                            marginTop: 5,
                          }}>
                          <Text
                            style={{
                              // width: 155,
                              FontFamily: FontFamily.balooBhaina2Medium,
                              color: '#333333',
                              textAlign: 'center',
                              // marginLeft: 10,
                              color: Color.royalblue,
                              // marginTop: 40,
                              paddingBottom: 4,
                              paddingTop: 4,
                              fontSize: 11,
                            }}>
                            Click Here
                          </Text>
                        </TouchableOpacity>
                      </View>
                      <View>
                        <Image
                          style={{
                            width: 100,
                            height: 95,
                            marginTop: -70,
                            left: '80%',
                            marginLeft: 20,
                          }}
                          source={require('../assets/Image/https___lottiefiles.com_42404-add-document.gif')}
                        />
                      </View>
                    </View>
                  </View>
                </View>
                <ScrollView
                  style={{
                    backgroundColor: 'white',
                    marginTop: 20,
                    borderRadius: 5,
                    width: window.WindowWidth * 0.96,
                    paddingBottom: 40,
                    marginLeft: 9,
                  }}>
                  <View style={{flexDirection: 'row'}}>
                    <Text
                      style={{
                        color: '#333333',
                        fontSize: 16,
                        marginTop: 5,
                        marginLeft: 10,
                      }}>
                      Payment History
                    </Text>
                    <Text
                      style={{
                        color: '#13538A',
                        fontSize: 13,
                        marginTop: 8,
                        marginLeft: 140,
                      }}>
                      Check all
                    </Text>
                  </View>
                  {paymentDetails.paymenthistory.map(item => (
                    <View
                      style={{
                        flexDirection: 'row',
                        borderBottomWidth: 0.181,
                        borderBottomColor: '#666666',
                      }}>
                      <Text
                        style={{
                          color: '#666666',
                          fontSize: 13,
                          marginTop: 5,
                          marginLeft: 15,
                          paddingBottom: 15,
                        }}>
                        {item.createdon.split('T')[0]}
                      </Text>
                      <Text
                        style={{
                          color: '#666666',
                          fontSize: 13,
                          marginTop: 8,
                          marginLeft: 210,
                          paddingBottom: 15,
                        }}>
                        {item.amount}
                      </Text>
                    </View>
                  ))}
                </ScrollView>
              </ScrollView>
              {/* {modalStatus ? (
                <ButtomSheet modalRef={modalRef} modalHeight={modalHeight}>
                  <LinearGradient
                    colors={['#4286f4', '#373b44']}
                    // style={styles.linearGradient}
                    style={styles.viewdatas}>
                    <View style={styles.modalContainer}>
                      <Text style={styles.Text}>
                        Total Amount :{totalAmount}
                      </Text>
                      <Text style={styles.Text}>Paid Amount :{paidAmount}</Text>
                      <Text style={styles.Text}>
                        Pending Amount :{paindingAmount}
                      </Text>

                      {totalAmount == 0 && (
                        <AppTextInput
                          style={styles.Textinput}
                          autoCapitalize="none"
                          autoCorrect={false}
                          keyboardType="number-pad"
                          name="name"
                          placeholder="Total Amount"
                          value={inputTotalAmount}
                          onChangeText={value => setInputTotalAmount(value)}
                        />
                      )}
                    </View>

                    <View style={styles.modalContainer}>
                      <AppTextInput
                        style={styles.Textinput}
                        autoCapitalize="none"
                        autoCorrect={false}
                        keyboardType="number-pad"
                        name="name"
                        placeholder="Pay Amount"
                        value={inputPaidAmount}
                        onChangeText={value => setInputPaidAmount(value)}
                      />
                      <TouchableOpacity
                        onPress={() => {
                          savePayment();
                        }}
                        style={styles.submit}>
                        <Text style={styles.submitText}>SAVE</Text>
                      </TouchableOpacity>
                    </View>
                  </LinearGradient>
                </ButtomSheet>
              ) : (
                <ButtomSheet modalRef={modalRef} modalHeight={modalHeight}>
                  {paymentRecord ? (
                    <LinearGradient
                      colors={['#4286f4', '#373b44']}
                      // style={styles.linearGradient}
                      style={styles.viewdata}>
                      <Text style={styles.Text}>
                        Total Amount: {totalAmount}
                      </Text>
                      <Text style={styles.Text}>Paid Amount: {paidAmount}</Text>

                      <FlatList
                        data={paymentRecord}
                        renderItem={({item, index}) => (
                          <View>
                            <Text style={styles.Text}> {item.amount}</Text>
                          </View>
                        )}
                      />
                    </LinearGradient>
                  ) : (
                    <Text style={[styles.Text, {color: 'red'}]}>
                      No Data Available
                    </Text>
                  )}
                </ButtomSheet>
              )} */}
              {/* <View>
                <FlatList
                  // keyExtractor={message => message._id}
                  removeClippedSubviews={true}
                  maxToRenderPerBatch={10}
                  initialNumToRender={10}
                  updateCellsBatchingPeriod={40}
                  data={studentData}
                  renderItem={({item, index}) => (
                    <PaymentAccordion
                      studentName={item.studentname}
                      className={item.class}
                    />
                    // <View style={styles.Flngati}>
                    //   <View>
                    //     <Text style={styles.FlngatiText}>
                    //       {item.studentname}
                    //     </Text>
                    //   </View>
                    //   <View style={styles.payment}>
                    //     <View>
                    //       <Pressable onPress={() => getPayDetails(item)}>
                    //         <Text style={styles.view}>View</Text>
                    //       </Pressable>
                    //     </View>
                    //     <View>
                    //       <Pressable onPress={() => postPaymentDetails(item)}>
                    //         <Text style={styles.pay}>Pay</Text>
                    //       </Pressable>
                    //     </View>
                    //   </View>
                    // </View>
                  )}
                />
              </View> */}
            </>
          )}
        </>
      )}
    </>
  );
};

export default PaymentDetails;

const styles = StyleSheet.create({
  button: {
    height: 30,
    width: 30,
  },
  Flngati: {
    alignItems: 'center',
    // flexDirection: 'row',
    // padding: 15,
    width: window.WindowWidth * 0.9,
    height: 150,
    // width: '100%',
    backgroundColor: 'white',
    borderRadius: 10,
    marginBottom: 10,
    // textAlign: 'center',
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
    width: 155,
    height: 112,
    marginRight: 60,
  },
  payment: {
    flexDirection: 'row',
    // paddingBottom: 40,
    paddingTop: 20,
  },
  view: {
    width: 110,
    // height: 40,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Colors.primary,

    backgroundColor: 'white',
    color: Colors.primary,
    fontSize: 17,
    textAlign: 'center',
    justifyContent: 'center',

    marginRight: 30,
    fontWeight: 'bold',
    // 137BD4, 7897B2
  },
  pay: {
    width: 110,
    // height: 40,
    borderRadius: 10,
    backgroundColor: Colors.primary,
    color: 'white',
    borderWidth: 1,
    fontSize: 17,
    textAlign: 'center',

    justifyContent: 'center',

    fontWeight: 'bold',
  },
  viewdata: {
    alignItems: 'center',
    // flexDirection: 'row',
    // padding: 15,
    width: window.WindowWidth * 0.9,

    // height: 190,
    // width: '100%',
    backgroundColor: 'gray',
    borderRadius: 10,
    marginBottom: 10,
    textAlign: 'center',
    marginLeft: 20,
    overflow: 'hidden',
    marginRight: 10,
    marginTop: 90,
    boxShadow: 20,
  },
  viewdatas: {
    alignItems: 'center',
    // flexDirection: 'row',
    // padding: 15,
    width: window.WindowWidth * 0.9,

    height: 550,
    // width: '100%',
    backgroundColor: 'gray',
    borderRadius: 10,
    marginBottom: 10,
    textAlign: 'center',
    marginLeft: 20,
    overflow: 'hidden',
    marginRight: 10,
    marginTop: 90,
    boxShadow: 20,
  },
  Text: {
    fontSize: 22,
    textAlign: 'center',
    color: 'black',
    fontFamily: 'Cochin',
    fontWeight: 'bold',
    marginTop: 20,
    color: 'white',
  },
  submit: {
    marginRight: 40,
    marginLeft: 40,
    marginTop: 10,
  },
  submitText: {
    paddingTop: 20,
    paddingBottom: 20,
    color: 'black',
    fontWeight: 'bold',
    textAlign: 'center',
    backgroundColor: '#68a0cf',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#fff',
    fontSize: 16,
  },
  Textinput: {
    fontSize: 17,
    textAlign: 'center',
    color: 'white',
    fontFamily: 'Cochin',
    fontWeight: 'bold',
    marginTop: 20,
    borderColor: 'white',
    width: 320,
    height: 60,
    margin: 12,
    borderWidth: 1,
    padding: 10,
    // marginLeft: 30,
    // marginRight: -50,
    borderRadius: 10,
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
    borderRadius: 24,
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
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  buttonOpen: {
    fontSize: 17,
    marginTop: 12,

    fontFamily: FontFamily.poppinsMedium,
    color: 'white',
    // marginLeft: 15,
    textAlign: 'center',
  },
  update: {
    textAlign: 'right',
    marginLeft: 140,
    marginTop: 10,
    fontFamily: FontFamily.poppinsMedium,
    color: '#13538A',
  },
  buttonClose: {
    backgroundColor: '#2196F3',
  },
  textStyle: {
    textAlign: 'left',
    marginTop: 10,
    fontFamily: FontFamily.poppinsMedium,
    color: '#666666',
    marginLeft: 10,
  },
  name: {
    textAlign: 'right',
    marginLeft: 50,
    marginTop: 10,
    // width: 200,
    textTransform: 'capitalize',
    fontFamily: FontFamily.poppinsMedium,
    color: '#666666',
  },
  class: {
    // textAlign: 'left',
    marginLeft: 50,
    marginTop: 10,
    fontFamily: FontFamily.poppinsMedium,
    color: '#666666',
  },
  username: {
    fontFamily: FontFamily.poppinsMedium,
    color: '#333333',
    textAlign: 'left',
    marginRight: 90,
  },

  Logo: {
    width: 120,
    height: 120,
    marginLeft: 22,
    marginTop: -30,
  },
  submit: {
    marginRight: 40,
    marginLeft: 40,
    marginTop: 10,
  },
  submitText: {
    paddingTop: 20,
    paddingBottom: 20,
    color: 'white',
    fontWeight: '900',
    textAlign: 'center',
    backgroundColor: '#68a0cf',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#fff',
    fontSize: 15,
  },
  p: {
    fontFamily: FontFamily.poppinsMedium,

    fontSize: 12,
    marginRight: 40,

    color: '#333333',
    width: 264,
  },

  bu: {
    marginTop: 60,
    width: window.WindowWidth * 0.5,
    backgroundColor: Color.royalblue,
    padding: 10,
    borderRadius: 15,
  },
  view: {
    backgroundColor: 'white',
    width: window.WindowWidth * 0.9,
    marginLeft: 20,
    flex: 1,
    marginTop: 15,
    borderRadius: 5,
    padding: 10,
    // borderColor: 'black',
    // borderWidth: 0.9,
    // borderLeftColor: '#85d8ce',
    // borderRightColor: '#85d8ce',
    // borderBottomColor: '#85d8ce',
    // borderTopColor: '#85d8ce',
    justifyContent: 'space-evenly',
  },
  Textinput: {
    fontSize: 13,
    textAlign: 'center',
    color: 'black',

    fontWeight: 'bold',
    // marginTop: 20,
    borderColor: Color.ghostwhite,
    width: window.WindowWidth * 0.18,
    backgroundColor: Color.ghostwhite,
    height: 40,
    // margin: 12,
    borderWidth: 2,
    // padding: 10,
    // borderRadius: 20,
    // justifyContent: 'center',

    // marginLeft: 20,
  },
});
