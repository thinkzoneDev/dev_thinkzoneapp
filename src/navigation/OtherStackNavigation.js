import {
  StyleSheet,
  Text,
  View,
  Alert,
  Image,
  Button,
  TouchableOpacity,
  ToastAndroid,
} from 'react-native';
import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import StudentList from '../Pages/StudentList';
import StudentAttendance from '../Pages/StudentAttendance';
import CallList from '../Pages/CallList';
import StudentRegister from '../Pages/StudentRegister';
import TeacherBaseline from '../Pages/TeacherBaseline';
import Home from '../Pages/Home';
import ContentDetails from '../Pages/ContentDetails';
import Preprogramtraining from '../Pages/Preprogramtraining';
import PreprogramtrainingNew from '../Pages/PreprogramtrainingNew';
import MonthlyTraining from '../Pages/MonthlyTraining';
import AttendancemodalList from '../Pages/AttendancemodalList';
import CallResponse from '../Pages/CallResponse';
// import Color from '../utils/Colors';
import Entypo from 'react-native-vector-icons/Entypo';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Ecactivity from '../Pages/Ecactivity';
import Pgeactivity from '../Pages/Pgeactivity';
import Fln from '../Pages/Fln';
import Pgecontentdetails from '../Pages/Pgecontentdetails';
import EcContent from '../Pages/EcContent';
import NSDC from '../Pages/NSDC';
import Books from '../Pages/Books';
import Payment from '../Pages/Payment';
import Dictionary from '../Pages/Dictionary';
import FlnContent from '../Pages/FlnContent';
import About from '../Pages/About';
import FlnContentView from '../Pages/FlnContentView';

import FlnQuiz from '../Pages/FlnQuiz';
import Booklist from '../Pages/Booklist';
import BookView from '../Pages/BookView';
import Demo from '../Pages/Demo';
import Pressable from 'react-native/Libraries/Components/Pressable/Pressable';
import PptContentDetails from '../Pages/PptContentDetails';
import NsdcQuiz from '../Pages/NsdcQuiz';
// import Leaderboard from '../Pages/Leaderboard';
import Profile from '../Pages/Profile';
import EditProfile from '../Pages/EditProfile';
import PptAssignment from '../Pages/PptAssignment';
import AudioVideoAcces from '../Pages/AudioVideoAcces';
import MonthlyAssignment from '../Pages/MonthlyAssignment';
import ReviewQuiz from '../Pages/ReviewQuiz';
import ReviewQuizTraining from '../Pages/ReviewQuizTraining';
import TeacherBaselineReviewPage from '../Pages/TeacherBaselineReviewPage';
import ExtraModule from '../Pages/ExtraModule';
import {Color, FontFamily, FontSize, Border} from '../GlobalStyle';
import Attendancelist from '../Pages/Attendancelist';
import ReviewFlnQuestion from '../Pages/ReviewFlnQuestion';
import PaymentDetails from '../Pages/PaymentDetails';
import Leaderboard from '../Pages/Leaderboard';
import Myachivement from '../Pages/Myachivement';
import PptContentDetailsNew from '../Pages/PptContentDetailsNew';
import MonthlyTrainingNew from '../Pages/MonthlyTrainingNew';
import ContentDetailsNew from '../Pages/ContentDetailsNew';
import MonthlyAssignmentNew from '../Pages/MonthlyAssignmentNew';
import ExtraModuleContent from '../Pages/ExtraModuleContent';
import ExtraModuleAssignment from '../Pages/ExtraModuleAssignment';
import RewardTransaction from '../Pages/RewardTransaction';
const Stack = createStackNavigator();

const OtherStackNavigation = ({navigation, title}) => {
  //console.log('other stack---->', navigation, title);
  return (
    <Stack.Navigator
      screenOptions={{
        // headerShown: false,
        topBar: {
          backButton: {},
        },
        headerStyle: {
          backgroundColor: Color.royalblue,
        },
        headerTintColor: 'white',
        headerTitleStyle: {
          // fontWeight: 'bold',
          fontFamily: FontFamily.poppinsSemibold,
          letterSpacing: 1,
          fontSize: 25,
          alignItems: 'center',
        },
        // headerLeft:()=>(
        //   <AntDesign name="arrowleft" size={23} color="white" />
        // )
      }}>
      <Stack.Screen
        name="home"
        component={Home}
        options={{
          headerShown: false,
          title: 'ThinkZone',
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => {
                navigation.openDrawer();
              }}>
              {/* <Image
                source={require('../assets/Photos/logo1.png')}
                style={styles.logo}
              /> */}
              {/* <Entypo
                style={{marginLeft: 15}}
                name="menu"
                size={25}
                color={Color.white}
                onPress={() => {
                  navigation.openDrawer();
                }}
              /> */}
            </TouchableOpacity>
          ),
          headerRight: () => (
            <Entypo
              name="bell"
              size={25}
              color={Color.white}
              onPress={
                () =>
                  ToastAndroid.show(
                    'This Module is under maintenance. It will be LIVE soon.',
                    ToastAndroid.SHORT,
                  )
                // navigation.navigate('audiovideo', {
                //   type: 'audiovideo',
                // })
              }
            />
          ),
        }}
      />

      {/* Student Module */}
      <Stack.Screen
        name="studentlist"
        component={StudentList}
        options={{
          // headerShown: false,
          title: 'ଶିକ୍ଷାର୍ଥୀ ସୂଚନା',
          headerTitleStyle: {
            // fontWeight: '700',
            fontFamily: FontFamily.poppinsMedium,
            // letterSpacing: 2,
          },
          // headerTitleAlign: 'center',
        }}
      />
      <Stack.Screen
        name="studentregister"
        component={StudentRegister}
        options={{
          // headerShown: false,
          title: 'ଶିକ୍ଷାର୍ଥୀ ପଞ୍ଜିକରଣ',
          // headerLeft: false,
          headerTitleStyle: {
            // fontWeight: '700',
            fontFamily: FontFamily.poppinsMedium,
            // letterSpacing: 2,
          },
          // headerTitleAlign: 'center',
        }}
      />
      <Stack.Screen
        name="studentAttendance"
        component={StudentAttendance}
        options={{
          title: 'ଶିକ୍ଷାର୍ଥୀ ଉପସ୍ଥାନ',
          headerTitleStyle: {
            // fontWeight: '700',
            fontFamily: FontFamily.poppinsMedium,
            // letterSpacing: 2,
          },
          // headerTitleAlign: 'center',
        }}
      />
      <Stack.Screen
        name="attendanceList"
        component={Attendancelist}
        options={{
          title: ' 7 ଦିନର ଉପସ୍ଥାନ',
          headerTitleStyle: {
            // fontWeight: '700',
            fontFamily: FontFamily.poppinsMedium,
            // letterSpacing: 2,
          },
          // headerTitleAlign: 'center',
        }}
      />
      <Stack.Screen
        name="calllist"
        component={CallList}
        options={{
          title: 'Call List',
          headerTitleStyle: {
            // fontWeight: '700',
            fontFamily: FontFamily.poppinsMedium,
            // letterSpacing: 2,
          },
          // headerTitleAlign: 'center',
        }}
      />
      <Stack.Screen
        name="attendancelist"
        component={AttendancemodalList}
        options={{title: 'ଉପସ୍ଥାନ ସୂଚନା'}}
      />
      <Stack.Screen
        name="reviewquiz"
        component={ReviewQuiz}
        options={{title: 'Quiz Review'}}
      />
      <Stack.Screen
        name="reviewquiztraining"
        component={ReviewQuizTraining}
        options={{title: 'Quiz Review'}}
      />
      <Stack.Screen
        name="teacherbaselinereviewpage"
        component={TeacherBaselineReviewPage}
        options={{title: 'Quiz Review'}}
      />
      <Stack.Screen
        name="callresponseList"
        component={CallResponse}
        options={{title: 'Call Response'}}
      />
      {/* Teacher Modules */}

      <Stack.Screen
        name="extramodule"
        component={ExtraModule}
        options={{
          // headerShown: false,
          title: 'ଅତିରିକ୍ତ',
        }}
      />

      <Stack.Screen
        name="teacherBaseline"
        component={TeacherBaseline}
        options={{
          headerShown: false,
          title: 'ଶିକ୍ଷକ ମୂଲ୍ୟାଙ୍କନ',
        }}
      />
      <Stack.Screen
        name="preprogramtraining"
        component={Preprogramtraining}
        options={{
          title: 'ପ୍ରବେଶ',
        }}
      />

      <Stack.Screen
        name="preprogramtrainingnew"
        component={PreprogramtrainingNew}
        options={{
          title: 'ପ୍ରବେଶ(New)',
        }}
      />
      <Stack.Screen
        name="preprogram_training_content"
        component={PptContentDetails}
        options={{
          title: 'ପ୍ରବେଶ',
          headerLeft: false,
          headerShown: false,
          headerTitleAlign: 'center',
        }}
      />
      {/* New PPTContent Details */}
      <Stack.Screen
        name="preprogram_training_content_new"
        component={PptContentDetailsNew}
        options={{
          title: 'ପ୍ରବେଶ(New)',
          headerLeft: false,
          headerShown: false,
          headerTitleAlign: 'center',
        }}
      />
      <Stack.Screen
        name="preprogram_training_assignment"
        component={PptAssignment}
        options={{
          title: 'ପ୍ରବେଶ',
          headerLeft: false,
          headerShown: false,
          headerTitleAlign: 'center',
        }}
      />
      <Stack.Screen
        name="monthlytraining"
        component={MonthlyTraining}
        options={{
          title: 'ପ୍ରସ୍ତୁତି',
        }}
      />
      <Stack.Screen
        name="monthlytrainingnew"
        component={MonthlyTrainingNew}
        options={{
          title: 'ପ୍ରସ୍ତୁତି(New)',
        }}
      />
      <Stack.Screen
        name="contentdetails"
        component={ContentDetails}
        options={{
          title: 'ପ୍ରସ୍ତୁତି',
          headerLeft: false,
          headerShown: false,
          headerTitleAlign: 'center',
        }}
      />
      <Stack.Screen
        name="contentdetailsnew"
        component={ContentDetailsNew}
        options={{
          title: 'ପ୍ରସ୍ତୁତି(New)',
          headerLeft: false,
          headerShown: false,
          headerTitleAlign: 'center',
        }}
      />
      <Stack.Screen
        name="monthlytraining_assignment"
        component={MonthlyAssignment}
        options={{
          title: 'ପ୍ରସ୍ତୁତି',
          headerLeft: false,
          headerShown: false,
          headerTitleAlign: 'center',
          // headerLeft: false,
          // headerTitleAlign: 'center',
        }}
      />

      <Stack.Screen
        name="extramodulecontent"
        component={ExtraModuleContent}
        options={{
          title: 'ExtraModule',
          headerLeft: false,
          headerShown: false,
          headerTitleAlign: 'center',
          // headerLeft: false,
          // headerTitleAlign: 'center',
        }}
      />

      <Stack.Screen
        name="extramoduleassignment"
        component={ExtraModuleAssignment}
        options={{
          title: 'ExtraModule',
          headerLeft: false,
          headerShown: false,
          headerTitleAlign: 'center',
          // headerLeft: false,
          // headerTitleAlign: 'center',
        }}
      />

      <Stack.Screen
        name="monthlytraining_assignment_new"
        component={MonthlyAssignmentNew}
        options={{
          title: 'ପ୍ରସ୍ତୁତି(New)',
          headerLeft: false,
          headerShown: false,
          headerTitleAlign: 'center',
          // headerLeft: false,
          // headerTitleAlign: 'center',
        }}
      />
      {/* <Stack.Screen
        name="leaderboard"
        component={Leaderboard}
        options={{title: 'Leaderboard'}}
      /> */}
      {/* Student Activity */}
      <Stack.Screen
        name="ecactivity"
        component={Ecactivity}
        options={{
          title: 'ପ୍ରାକ୍ ଗତିବିଧି',

          // headerLeft: () => (
          //   <AntDesign
          //     name="arrowleft"
          //     color="white"
          //     size={27}
          //     style={{marginLeft: 15}}
          //     onPress={() => {
          //       Alert.alert('Do you want to leave from this page ', '??', [
          //         {
          //           text: 'No',
          //           onPress: () => null,
          //           style: 'cancel',
          //         },
          //         {
          //           text: 'Yes',
          //           onPress: () => navigation.navigate('home'),
          //           style: 'default',
          //         },
          //       ]);
          //     }}
          //   />
          // ),
        }}
      />
      <Stack.Screen
        name="eccontent"
        component={EcContent}
        options={{
          title: 'ପ୍ରାକ୍ ଗତିବିଧି',
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="pgeactivity"
        component={Pgeactivity}
        options={{title: 'ପ୍ରାଥମିକ ଗତିବିଧି'}}
      />
      <Stack.Screen name="fln" component={Fln} options={{title: 'FLN'}} />
      <Stack.Screen
        name="flncontent"
        component={FlnContent}
        options={{title: 'FLN Documents'}}
      />

      <Stack.Screen
        name="flncontentview"
        component={FlnContentView}
        options={{title: 'FLNContentView'}}
      />
      <Stack.Screen
        name="flnquiz"
        component={FlnQuiz}
        options={{
          title: 'FLN Quiz',
          headerLeft: false,
          headerTitleAlign: 'center',
        }}
      />

      <Stack.Screen
        name="flnquizreview"
        component={ReviewFlnQuestion}
        options={{
          title: 'Quiz Review',
          headerLeft: false,
          headerTitleAlign: 'center',
        }}
      />

      <Stack.Screen
        name="Content"
        component={Pgecontentdetails}
        options={{title: 'ପ୍ରାଥମିକ ଗତିବିଧି', headerShown: false}}
      />
      {/* Other Modules */}
      <Stack.Screen name="NSDC" component={NSDC} options={{title: 'NSDC'}} />
      <Stack.Screen
        name="payment"
        component={Payment}
        options={{title: 'ଦେୟ'}}
      />
      <Stack.Screen
        name="paymentDetails"
        component={PaymentDetails}
        options={{title: 'Payment Details'}}
      />
      <Stack.Screen name="books" component={Books} options={{title: 'Books'}} />
      <Stack.Screen
        name="booklist"
        component={Booklist}
        options={{title: 'BookList'}}
      />
      <Stack.Screen
        name="bookview"
        component={BookView}
        options={{title: 'BookView'}}
      />

      <Stack.Screen
        name="dictionary"
        component={Dictionary}
        options={{title: 'Dictionary'}}
      />
      <Stack.Screen
        name="nsdcquiz"
        component={NsdcQuiz}
        options={{
          title: 'NSDC Quiz',
          // headerLeft: false,
          // headerTitleAlign: 'center',
        }}
      />
      <Stack.Screen name="demo" component={Demo} options={{title: 'demo'}} />
      <Stack.Screen
        name="leaderboard"
        component={Leaderboard}
        options={{title: 'Leaderboard'}}
      />
      <Stack.Screen
        name="profile"
        component={Profile}
        options={{title: 'profile', headerShown: false}}
      />
      <Stack.Screen
        name="editprofile"
        component={EditProfile}
        options={{
          title: 'EditProfile',
          headerLeft: false,
          headerShown: false,
          headerTitleAlign: 'center',
        }}
      />
      <Stack.Screen
        name="audiovideo"
        component={AudioVideoAcces}
        options={{
          title: 'Audio Assessment',
          headerLeft: () => (
            <AntDesign
              name="arrowleft"
              color="white"
              size={27}
              style={{marginLeft: 15}}
              onPress={() => {
                Alert.alert(
                  'ଧ୍ୟାନ ଦିଅନ୍ତୁ! ',
                  'ଆପଣ ନିବେଶ କରିଥିବା ତଥ୍ୟ Save ହେବ ନାହିଁ। ଆପଣ ଏହା ଅବଗତ ଅଛନ୍ତି ତ?  ',
                  [
                    {
                      text: 'Cancel',
                      onPress: () => null,
                      style: 'cancel',
                    },
                    {
                      text: 'Ok',
                      onPress: () => navigation.navigate('home'),
                      style: 'default',
                    },
                  ],
                );
              }}
            />
          ),
        }}
      />
      <Stack.Screen
        name="about"
        component={About}
        options={{title: 'audiovideo', headerShown: false}}
      />
      <Stack.Screen
        name="ମୋ ସଫଳତା"
        component={Myachivement}
        options={{title: 'Rewards'}}
      />
      <Stack.Screen
        name="rewardtransaction"
        component={RewardTransaction}
        options={{title: 'Transaction'}}
      />
    </Stack.Navigator>
  );
};

export default OtherStackNavigation;

const styles = StyleSheet.create({
  logo: {
    width: 55,
    height: 55,
    marginLeft: 5,
  },
});
