import {
  StyleSheet,
  Text,
  View,
  FlatList,
  Image,
  TouchableOpacity,
  Alert,
} from 'react-native';
import React, {useState} from 'react';
import ListItem from '../components/ListItem';
// import Color from '../utils/Colors';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {useEffect} from 'react';
import RNFetchBlob from 'react-native-blob-util';
import GallerySkeleton from '../skeletons/GallerySkeleton';
import Norecord from '../components/Norecord';
import {FontFamily, Color, FontSize, Border} from '../GlobalStyle';

const Booklist = ({route, navigation}) => {
  const [refresh, setRefresh] = useState(false);
  const [isLoading, setIsloading] = useState(true);
  // console.log(route.params, 'route.params---------->');

  // useEffect(() => {
  // const data = route.params.map(item => {
  //   return {...item, downloads: ''};
  // });
  // setDownload(data);
  // console.log("data-->",data)
  // },[]);

  const [downs, setDowns] = useState([]);
  // console.log('downs------->', downs);
  const [downsTrue, setDownsTrue] = useState(true);
  // console.log('downs-->', downs);
  useEffect(() => {
    // console.log('called');
    const downsl = route.params.map(item => {
      return RNFetchBlob.fs
        .readFile(
          `/data/user/0/com.nrusingh.teacher_thinkzone1/cache/${item.displayname}`,
        )
        .then(
          (data, error) => {
            // console.log(item, 'item');
            // handle the data ..
            // console.log('present');
            return {...item, download: true};
          },
          error => {
            // handle the data ..
            // console.log(data);
            // console.log('absent');
            return {...item, download: false};
          },
        );
    });
    // console.log(downsl, 'downls-------->');
    setTimeout(() => {
      setDowns(downsl);
      setIsloading(false);
      // console.log(downsl, 'downls');
    }, 3000);

    const unsubscribe = navigation.addListener('focus', () => {
      setRefresh(true);
    });
    return unsubscribe;
  }, [navigation, downsTrue]);
  // useEffect(() => {
  //   if (refresh) {
  //     // Perform any actions you want to do on refresh here
  //     const downsl = route.params.map(item => {
  //       return RNFetchBlob.fs
  //         .readFile(
  //           `/data/user/0/com.nrusingh.teacher_thinkzone1/cache/${item.displayname}`,
  //         )
  //         .then(
  //           (data, error) => {
  //             // console.log(item, 'item');
  //             // handle the data ..
  //             // console.log('present');
  //             return {...item, download: true};
  //           },
  //           error => {
  //             // handle the data ..
  //             // console.log(data);
  //             // console.log('absent');
  //             return {...item, download: false};
  //           },
  //         );
  //     });
  //     setTimeout(() => {
  //       setDowns(downsl);
  //       setIsloading(false);
  //       // console.log(downsl, 'downls');
  //     }, 3000);
  //     setRefresh(false);
  //   }
  // }, [refresh]);

  const getBookViews = (item, status) => {
    // console.log(item, status, 'item');
    // setDownload(true);
    navigation.navigate('bookview', item);
  };
  const onDelete = item => {
    Alert.alert(
      'ଆପଣ ଡାଉନଲୋଡ୍ କରିଥିବା ଏହି ଡକ୍ୟୁମେଣ୍ଟ କୁ ଡିଲିଟ୍ କରିବାକୁ ନିଶ୍ଚିତ ଅଛନ୍ତି ତ? ?',
      '',
      [
        // {
        //   text: 'Ask me later',
        //   onPress: () => console.log('Ask me later pressed'),
        // },
        {
          text: 'Cancel',
          // onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        {
          text: 'OK',
          onPress: () =>
            RNFetchBlob.fs
              .unlink(
                `/data/user/0/com.nrusingh.teacher_thinkzone1/cache/${item?.displayname}`,
              )
              .then(() => {
                // ...
                setDownsTrue(!downsTrue);
              }),
        },
      ],
    );
  };
  return (
    <View style={{flex: 1}}>
      {isLoading ? (
        <GallerySkeleton />
      ) : (
        <>
          {downs.length > 0 ? (
            <FlatList
              // keyExtractor={message => message._id}
              removeClippedSubviews={true}
              maxToRenderPerBatch={10}
              initialNumToRender={10}
              updateCellsBatchingPeriod={40}
              data={downs}
              renderItem={({item, index}) => (
                // <ListItem
                //   backgroundColor={Color.primary}
                //   onPress={() => {
                //     getBookView(item);
                //   }}
                //   title={item.displayname}
                //   color={styles.color}
                // subTitle={item.class}
                // renderRightActions={() => (
                //   <ListItemDelete
                //     onPress={() => listItemDeletePressed(item)}
                //     deleteButton={true}
                //     bgcolor={Color.danger}
                //   />
                // )}
                // renderLeftActions={() => (
                //   <ListItemDelete
                //     onPress={() => listItemUpdatePressed(item)}
                //     updateButton={true}
                //     bgcolor={Color.success}
                //   />
                // )}
                // IconComponent={
                //   <Pressable
                //     onPress={() => {
                //       Linking.openURL(`tel:${item.phone}`);
                //     }}>
                //     {/* <Ionicons
                //       name="call-sharp"
                //       size={20}
                //       color={Color.white}
                //       style={styles.icon}
                //     /> */}
                //   </Pressable>
                // }
                // />

                <TouchableOpacity
                  onPress={() => {
                    getBookViews(item?._W, 'true');
                  }}
                  style={{}}>
                  <View style={styles.list}>
                    <View
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'space-evenly',
                      }}>
                      <Image
                        style={styles.tinyLogos}
                        source={require('../assets/Image/iconcontent-editarchivebook.png')}
                      />
                      <Text
                        style={{
                          fontSize: 18,
                          fontWeight: 'bold',
                          // paddingLeft: 2,
                          // paddingLeft: 8,
                          // paddingTop: 36,
                          // paddingBottom: 30,
                          color: Color.greyGrey700,
                          // maxLength: 8,
                          top: 5,
                          marginLeft: 10,
                        }}>
                        {item?._W?.displayname?.substring(0, 16)}
                      </Text>
                    </View>
                    <View
                      style={{
                        justifyContent: 'center',
                        // marginRight: 2,
                        // marginLeft: 2,
                        marginRight: 15,
                        // alignItems: 'flex-end',
                        // marginRight: 2,
                        // marginRight: 50,
                        // marginHorizontal: 19,
                        // marginBottom: 25,
                        // marginLeft: 12,
                        // marginTop: 25,
                        // paddingHorizontal: 12,
                      }}>
                      {item?._W?.download ? (
                        <MaterialCommunityIcons
                          name="delete"
                          size={30}
                          color={Color.greyGrey700}
                          style={{marginLeft: 5}}
                          onPress={() => {
                            onDelete(item?._W, 'true');
                          }}
                        />
                      ) : (
                        <FontAwesome
                          name="download"
                          size={30}
                          color={Color.greyGrey700}
                          // style={{paddingRight: 4}}
                          // onPress={() => {
                          //   getBookViews(item, 'true');
                          // }}
                        />
                      )}
                    </View>
                  </View>
                  {/* <FontAwesome
              name="download"
              size={30}
              color={Color.white}
              style={styles.icon}
              onPress={() => {
                getBookViews(item, 'true');
              }}
            /> */}

                  {/* <AntDesign
                name="delete"
                size={40}
                color={Color.white}
                style={styles.icon}
              /> */}

                  {/* <AntDesign
                name="delete"
                size={40}
                color={Color.white}
                style={styles.icon}
               
              /> */}
                </TouchableOpacity>
              )}
            />
          ) : (
            <Norecord />
          )}
        </>
      )}

      {/* <TouchableOpacity
        onPress={() => {
          handleSelection('camera');
        }}
        style={styles.modalButtonContainer}>
        <Feather name="camera" size={30} color={Color.primary} />
        <Text style={styles.modalButtonText}>Books</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => {
          handleSelection('camera');
        }}
        style={styles.modalButtonContainer}>
        <Feather name="camera" size={30} color={Color.primary} />
        <Text style={styles.modalButtonText}>Important Documents</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => {
          handleSelection('camera');
        }}
        style={styles.modalButtonContainer}>
        <Feather name="camera" size={30} color={Color.primary} />
        <Text style={styles.modalButtonText}>Resources</Text>
      </TouchableOpacity> */}
    </View>
  );
};

export default Booklist;

const styles = StyleSheet.create({
  list: {
    backgroundColor: Color.white,
    paddingBottom: 12,
    marginBottom: 8,
    marginTop: 8,
    marginLeft: 12,
    marginRight: 12,
    borderRadius: 12,
    // paddingHorizontal: -7,
    // paddingRight: 114,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  text: {
    fontSize: 18,
    fontWeight: '600',
    // paddingLeft: 8,
    // paddingTop: 36,
    // paddingBottom: 30,
    color: Color.greyGrey700,
  },
  tinyLogos: {
    width: 45,
    height: 45,
    marginLeft: 5,
    // backgroundColor: 'white',
    marginTop: 16,
    borderRadius: 49,
  },
});
