import {
  FlatList,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
  Pressable,
  Alert,
  AppState,
  PanResponder,
} from 'react-native';
import API from '../environment/Api';
import React, {useState, useEffect, useRef} from 'react';
import DropdownComponent from '../components/DropdownComponent';
import {useDispatch, useSelector} from 'react-redux';
import ListColomItem from '../components/ListColomItem';
import Separator from '../components/Separator';
import * as window from '../utils/dimensions';
// import Color from '../utils/Colors';
import * as FcmSlice from '../redux/slices/FcmSlice';
import {Color, FontFamily, FontSize, Border} from '../GlobalStyle';
const Ecactivity = ({navigation}) => {
  const appState = useRef(AppState.currentState);
  const [appStateVisible, setAppStateVisible] = useState(appState.current);
  let stTime = new Date().getTime();
  const [studentClass, setStudentClass] = useState(0);
  const [data, setData] = useState([]);
  const user = useSelector(state => state.userdata.user?.resData);

  const dispatch = useDispatch();

  // useEffect(() => {
  //   const stTime = new Date().getTime();
  //   return () => {
  //     const clTime = new Date().getTime();
  //     const timeSpent = (clTime - stTime) / 1000;
  //
  //   };
  // }, []);

  useEffect(() => {
    dispatch(FcmSlice.clearfcmMessage({}));
    const subscription = AppState.addEventListener('change', nextAppState => {
      if (nextAppState == 'background') {
        // subscription.remove();
        const clTime = new Date().getTime();
        const timeSpent = (clTime - stTime) / 1000;
        const duration = Math.floor(timeSpent);
        const year = new Date().getFullYear();
        const month = new Date().getMonth() + 1;
        const data = {
          userid: user[0].userid,
          username: user[0].username,
          usertype: user[0].usertype,
          managerid: user[0].managerid,
          passcode: user[0].passcode,
          modulename: 'fln',
          duration: duration,
          month: month,
          year: year,
        };

        API.post(`savetimespentrecord/`, data).then(response => {});
      } else {
        stTime = new Date().getTime();
      }
      appState.current = nextAppState;
      setAppStateVisible(appState.current);
    });

    return () => {
      subscription.remove();

      const clTime = new Date().getTime();
      const timeSpent = (clTime - stTime) / 1000;
      const duration = Math.floor(timeSpent);
      const year = new Date().getFullYear();
      const month = new Date().getMonth() + 1;

      //

      const data = {
        userid: user[0].userid,
        username: user[0].username,
        usertype: user[0].usertype,
        managerid: user[0].managerid,
        managername: user[0].managername,
        passcode: user[0].passcode,
        modulename: 'eceactivity',
        duration: duration,
        month: month,
        year: year,
      };
      API.post(
        `savetimespentrecord/`,
        data,
        // ,
      ).then(response => {});
    };
  }, []);

  useEffect(() => {
    API.get(`/getAllEceSkills/${studentClass}`).then(suc => {
      //
      err => {
        //
      };
    });
  }, [studentClass]);
  const getStudent = item => {
    setStudentClass(item.id);
  };
  const sikllSelected = item => {
    //
    if (studentClass == 0) {
      Alert.alert('Please select level');
    } else {
      navigation.navigate('eccontent', {
        contentDetails: item,
        class: studentClass,
      });
    }

    // API.get(
    //   `getmasterpgeactivitiydetails/od/ece/na/${studentClass}/${item}/null`,
    //   // `/getEceActivities/${user[0].userid}/${studentClass}/${item} `,
    // ).then(suc => {
    //   //
    //   navigation.navigate('eccontent', {
    //     contentDetails: suc.data,
    //     class: studentClass,
    //   });
    //   setData(suc.data);
    //   err => {
    //     //
    //   };
    // });
  };
  const numColumns = 2;
  // const onPressFunction = () => {

  // }
  const timerId = useRef(false);
  const [timeForInactivityInSecond, setTimeForInactivityInSecond] =
    useState(600);
  useEffect(() => {
    resetInactivityTimeout();
  }, []);

  const panResponder = React.useRef(
    PanResponder.create({
      onStartShouldSetPanResponderCapture: () => {
        resetInactivityTimeout();
      },
    }),
  ).current;

  const resetInactivityTimeout = () => {
    clearTimeout(timerId.current);
    timerId.current = setTimeout(() => {
      // action after user has been detected idle
      //
      navigation.navigate('home');
    }, timeForInactivityInSecond * 1000);
  };

  return (
    <View
      style={{flex: 1, backgroundColor: Color.ghostwhite}}
      {...panResponder.panHandlers}>
      <ScrollView style={styles.scrollView}>
        <View>
          <DropdownComponent
            data={classArr}
            onChange={getStudent}
            image={require('../assets/Image/bookmark-2.png')}
            label={'class'}
          />

          <View style={styles.Logo}>
            <TouchableOpacity
              onPress={() => sikllSelected('meAndMyFamily')}
              style={styles.View}>
              <Image
                style={styles.tinyLogo}
                // styles={{marginRight: 50}}
                source={require('../assets/Photos/family.png')}
              />
              <Text style={styles.name}>ମୁଁ ଓ ମୋ ପରିବାର</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => sikllSelected('myHome')}
              style={styles.View}>
              <Image
                style={styles.tinyLogo}
                source={require('../assets/Photos/home.png')}
              />
              <Text style={styles.name}>ମୋ ଘର</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => sikllSelected('occupations')}
              style={styles.View}>
              <Image
                style={styles.tinyLogo}
                source={require('../assets/Photos/worker.png')}
              />
              <Text style={styles.name}>ବୃତ୍ତି/ବେଉସା</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.Logo}>
            <TouchableOpacity
              onPress={() => sikllSelected('animalsAndBirds')}
              style={styles.View}>
              <Image
                style={styles.tinyLogo}
                source={require('../assets/Photos/animal.png')}
              />
              <Text style={styles.name}>ପଶୁପକ୍ଷୀ</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => sikllSelected('plants,trees,flowers,fruits')}
              style={styles.View}>
              <Image
                style={styles.tinyLogo}
                source={require('../assets/Photos/tree.png')}
              />
              <Text style={styles.name}>ଗଛ,ପତ୍ର,ଫୁଲ,ଫଳ</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => sikllSelected('seasons')}
              style={styles.View}>
              <Image
                style={styles.tinyLogo}
                source={require('../assets/Photos/sky.png')}
              />
              <Text style={styles.name}>ବିଭିନ୍ନ ଋତୁ</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.Logo}>
            <TouchableOpacity
              onPress={() => sikllSelected('transportation')}
              style={styles.View}>
              <Image
                style={styles.tinyLogo}
                source={require('../assets/Photos/transport.png')}
              />
              <Text style={styles.name}>ଯାନବାହନ</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => sikllSelected('myPhysicalEnvironment')}
              style={styles.View}>
              <Image
                style={styles.tinyLogo}
                source={require('../assets/Photos/insect.png')}
              />
              <Text style={styles.name}>ମୋ ପ୍ରାକୃତିକ ପରିବେଶ</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => sikllSelected('mySocialEnvironment')}
              style={styles.View}>
              <Image
                style={styles.tinyLogo}
                source={require('../assets/Photos/env.png')}
              />
              <Text style={styles.name}>ମୋ ସାମାଜିକ ପରିବେଶ</Text>
            </TouchableOpacity>
          </View>
          <View style={[styles.Logo, {paddingBottom: 25}]}>
            <TouchableOpacity
              onPress={() => sikllSelected('myHealthAndHygiene')}
              style={styles.View}>
              <Image
                style={styles.tinyLogo}
                source={require('../assets/Photos/body.png')}
              />
              <Text style={styles.name}>ମୋ ସ୍ୱାସ୍ଥ୍ୟ ଓ ସୁରକ୍ଷା</Text>
            </TouchableOpacity>
            {/* <TouchableOpacity
            style={{
              width: 110,
              height: 136,
              backgroundColor: 'white',
              marginTop: 20,
              marginLeft: 16,
            }}></TouchableOpacity>
          <TouchableOpacity
            style={{
              width: 110,
              height: 136,
              backgroundColor: 'white',
              marginTop: 20,
              marginLeft: 16,
            }}></TouchableOpacity> */}
          </View>
          {/* <View style={styles.Logo}>
            <View>
              <Pressable
                style={styles.cont}
                // onPress={() => sikllSelected('meAndMyFamily')}>
                onPress={() => sikllSelected('meAndMyFamily')}>
                <Image
                  style={styles.tinyLogo}
                  // styles={{marginRight: 50}}
                  source={require('../assets/Photos/family.png')}
                />
              </Pressable>

              <Text
                style={styles.text}
                onPress={() => sikllSelected('meAndMyFamily')}>
                ମୁଁ ଓ ମୋ
              </Text>
              <Text
                style={[styles.text, {marginTop: 0}]}
                onPress={() => sikllSelected('meAndMyFamily')}>
                ପରିବାର
              </Text>
            </View>
            <View>
              <Pressable onPress={() => sikllSelected('myHome')}>
                <Image
                  style={styles.tinyLogo}
                  
                  source={require('../assets/Photos/home.png')}
                />
              </Pressable>

              <Text
                style={[styles.text]}
                onPress={() => sikllSelected('myHome')}>
                ମୋ ଘର
              </Text>
            </View>
            <View>
              <Pressable
                style={styles.cont}
                onPress={() => sikllSelected('occupations')}>
                <Image
                  style={styles.tinyLogo}
             
                  source={require('../assets/Photos/worker.png')}
                />
              </Pressable>

              <Text
                style={styles.text}
                onPress={() => sikllSelected('occupations')}>
                ବୃତ୍ତି/ବେଉସା
              </Text>
            </View>
          </View>
          <View style={styles.Logo}>
            <View>
              <Pressable onPress={() => sikllSelected('animalsAndBirds')}>
                <Image
                  style={styles.tinyLogo}
                
                  source={require('../assets/Photos/animal.png')}
                />
              </Pressable>

              <Text
                style={styles.text}
                onPress={() => sikllSelected('animalsAndBirds')}>
                ପଶୁପକ୍ଷୀ
              </Text>
            </View>
            <View>
              <Pressable
                onPress={() => sikllSelected('plants,trees,flowers,fruits')}>
                <Image
                  style={styles.tinyLogo}
                  
                  source={require('../assets/Photos/tree.png')}
                />
              </Pressable>

              <Text
                style={styles.text}
                onPress={() => sikllSelected('plants,trees,flowers,fruits')}>
                ଗଛ, ପତ୍ର,
              </Text>
              <Text
                style={[styles.text, {marginTop: 0}]}
                onPress={() => sikllSelected('plants,trees,flowers,fruits')}>
                ଫୁଲ, ଫଳ
              </Text>
            </View>
            <View>
              <Pressable onPress={() => sikllSelected('seasons')}>
                <Image
                  style={styles.tinyLogo}
                 
                  source={require('../assets/Photos/sky.png')}
                />
              </Pressable>

              <Text
                style={styles.text}
                onPress={() => sikllSelected('seasons')}>
                ବିଭିନ୍ନ ଋତୁ
              </Text>
            </View>
          </View>
          <View style={styles.Logo}>
            <View>
              <Pressable onPress={() => sikllSelected('transportation')}>
                <Image
                  style={styles.tinyLogo}
                  
                  source={require('../assets/Photos/transport.png')}
                />
              </Pressable>

              <Text
                style={styles.text}
                onPress={() => sikllSelected('transportation')}>
                ଯାନବାହନ
              </Text>
            </View>
            <View>
              <Pressable onPress={() => sikllSelected('myPhysicalEnvironment')}>
                <Image
                  style={styles.tinyLogo}
                 
                  source={require('../assets/Photos/insect.png')}
                />
              </Pressable>

              <Text
                style={styles.text}
                onPress={() => sikllSelected('myPhysicalEnvironment')}>
                ମୋ ପ୍ରାକୃତିକ
              </Text>
              <Text
                style={[styles.text, {marginTop: 0}]}
                onPress={() => sikllSelected('myPhysicalEnvironment')}>
                ପରିବେଶ
              </Text>
            </View>
            <View>
              <Pressable onPress={() => sikllSelected('mySocialEnvironment')}>
                <Image
                  style={styles.tinyLogo}
                  
                  source={require('../assets/Photos/env.png')}
                />
              </Pressable>

              <Text
                onPress={() => sikllSelected('mySocialEnvironment')}
                style={styles.text}>
                ମୋ ସାମାଜିକ
              </Text>
              <Text
                onPress={() => sikllSelected('mySocialEnvironment')}
                style={[styles.text, {marginTop: 0}]}>
                ପରିବେଶ
              </Text>
            </View>
          </View>
          <View>
            <View>
              <Pressable
                style={styles.cont}
                onPress={() => sikllSelected('myHealthAndHygiene')}>
                <Image
                  style={styles.tinyLogo}
                  
                  source={require('../assets/Photos/body.png')}
                />
              </Pressable>

              <Text
                style={styles.text}
                onPress={() => sikllSelected('myHealthAndHygiene')}>
                ମୋ ସ୍ୱାସ୍ଥ୍ୟ ଓ
              </Text>
              <Text
                style={[styles.text, {marginTop: 0}]}
                onPress={() => sikllSelected('myHealthAndHygiene')}>
                ସୁରକ୍ଷା
              </Text>
            </View>
          </View> */}
        </View>
      </ScrollView>
    </View>
  );
};

export default Ecactivity;

const styles = StyleSheet.create({
  tinyLogo: {
    width: window.WindowWidth * 0.22,
    height: window.WindowHeigth * 0.22,
    marginLeft: 15,
    marginTop: -10,

    // marginLeft: -24,
    // marginRight: -50,
  },
  // cont: {
  //   width: 195,
  //   height: 100,
  // },
  Logo: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-evenly',
  },
  text: {
    color: 'black',
    fontWeight: 'bold',
    fontSize: 13,
    justifyContent: 'space-evenly',
    // marginLeft: 42,
    marginTop: -30,
  },
  View: {
    width: 112,
    // height: 136,
    paddingBottom: 5,
    backgroundColor: 'white',
    marginTop: 20,
    borderRadius: 6,
    // marginLeft: 15,
  },
  name: {
    // width: 100,

    // height: 26,
    fontFamily: FontFamily.balooBhaina2Medium,
    fontSize: 13,
    marginTop: -40,
    paddingBottom: 10,
    textAlign: 'center',
    color: Color.black,
    // textAlign: 'center',
  },
});
const classArr = [
  {id: 0, class: 'ସ୍ତର ଚୟନ କରନ୍ତୁ '},

  {id: 1, class: 'ସ୍ତର ୧'},
  {id: 2, class: 'ସ୍ତର ୨'},
  {id: 3, class: 'ସ୍ତର ୩'},
];
