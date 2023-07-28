// import React from 'react';
// import {
//   SafeAreaView,
//   StyleSheet,
//   View,
//   Text,
//   ScrollView,
//   Image,
//   TouchableOpacity,
//   ImageBackground,
//   Dimensions,
//   StatusBar,
//   Linking,
//   Alert,
//   Modal,
//   useWindowDimensions,
//   ToastAndroid,
//   RefreshControl,
// } from 'react-native';
// import {Color, FontFamily, FontSize, Border} from '../GlobalStyle';

// export default function BottomNav({navigation}) {
//   return (
//     <View style={styles.botnavigation}>
//       <TouchableOpacity>
//         <Image source={require('../assets/Image/home.png')} />
//         <Text style={[styles.botnavigationtext, {color: Color.royalblue}]}>
//           Home
//         </Text>
//       </TouchableOpacity>

//       <TouchableOpacity
//         style={{marginTop: 5}}
//         onPress={() =>
//           navigation.navigate('profile', {
//             type: 'Profile',
//           })
//         }>
//         <Image
//           source={require('../assets/Image/users.png')}
//           style={{width: 30, height: 30, alignSelf: 'center'}}
//         />
//         {/* <Entypo
//           name="user"
//           color={Color.royalblue}
//           size={25}
//           style={{left: '20%'}}
//         /> */}
//         <Text style={[styles.botnavigationtext, {left: '7%'}]}>Profile</Text>
//       </TouchableOpacity>
//       <TouchableOpacity
//         onPress={() =>
//           navigation.navigate('leaderboard', {
//             type: 'Leaderboard',
//           })
//         }>
//         <Image
//           source={require('../assets/Image/ranking.png')}
//           style={{left: '30%'}}
//         />

//         <Text style={styles.botnavigationtext}>Leader board</Text>
//       </TouchableOpacity>

//       <TouchableOpacity
//         onPress={() =>
//           navigation.navigate('ମୋ ସଫଳତା', {
//             type: 'ମୋ ସଫଳତା',
//           })
//         }>
//         <Image
//           source={require('../assets/Image/cup.png')}
//           style={{left: '20%'}}
//         />
//         <Text style={styles.botnavigationtext}>Rewards</Text>
//       </TouchableOpacity>
//     </View>
//   );
// }
// const styles = StyleSheet.create({
//   botnavigation: {
//     backgroundColor: Color.white,
//     flexDirection: 'row',
//     justifyContent: 'space-around',
//     padding: 2,
//   },
//   botnavigationtext: {
//     fontSize: 10.5,
//     color: '#333333',
//     fontFamily: FontFamily.poppinsSemibold,
//   },
//   name: {
//     fontFamily: 'sans-serif-medium',
//     fontSize: 18,
//     color: 'black',
//   },
// });
