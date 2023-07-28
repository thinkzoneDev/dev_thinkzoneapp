<ImageBackground source={require('../assets/img/hbl/dark-back.jpg')}>
  <StatusBar backgroundColor={Color.primary} barStyle="white-content" />
  <ButtomSheet modalRef={modalRef} modalHeight={modalHeight}>
    <View style={styles.modalContainer}>
      <TouchableOpacity
        onPress={() => {
          handleSelection('camera');
        }}
        style={styles.modalButtonContainer}>
        <Feather name="camera" size={30} color={Color.primary} />
        <Text style={styles.modalButtonText}>Take Picture</Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => {
          handleSelection('gallery');
        }}
        style={styles.modalButtonContainer}>
        <Feather name="file" size={30} color={Color.info} />
        <Text style={styles.modalButtonText}>chose_gallery</Text>
      </TouchableOpacity>
    </View>
  </ButtomSheet>
  <ScrollView>
    <View style={styles.container}>
      <View>
        {/* 1st card start */}
        <View style={styles.cont1}>
          <View>
            {userdata[0].image === '' || !userdata[0].image ? (
              <View>
                <Image
                  style={styles.image}
                  source={require('../assets/Photos/user.png')}
                />
              </View>
            ) : (
              <View>
                <Image style={styles.image} source={{uri: userdata[0].image}} />
              </View>
            )}

            <TouchableOpacity onPress={displayAlert}>
              <Text
                style={{
                  marginLeft: 200,
                  width: 110,
                  // height: 30,
                  borderRadius: 10,
                  backgroundColor: Colors.primary,
                  color: 'white',
                  borderWidth: 1,
                  fontSize: 14,
                  textAlign: 'center',
                  fontWeight: 'bold',
                  marginTop: -20,
                  justifyContent: 'center',
                }}>
                Edit Profile
              </Text>
            </TouchableOpacity>
          </View>
          <View style={[styles.username]}>
            <Text
              style={{
                color: Color.black,
                fontSize: 20,
                textTransform: 'capitalize',
                marginTop: 10,
                fontFamily: 'Poppins-Light',
              }}>
              {userdata[0].username}
            </Text>
          </View>

          <View style={styles.items}>
            <FontAwesome5
              name="orcid"
              size={25}
              color={'#1bb9ce'}
              style={styles.icon}
            />
            <Text style={[styles.Text, {marginLeft: 8}]}>
              Userid :{userdata[0].userid}
            </Text>
          </View>
          <View style={styles.items}>
            <FontAwesome5
              name="address-book"
              size={25}
              color={'#5F9EA0'}
              style={styles.icon}
            />
            <Text style={styles.Text}>
              Guardian Name:{' '}
              <Text style={[styles.Text, {textTransform: 'capitalize'}]}>
                {userdata[0].guardianname ? userdata[0].guardianname : 'Na'}
              </Text>
            </Text>
          </View>
          <View style={styles.items}>
            <FontAwesome5
              name="user-circle"
              size={25}
              color={'#ff052a'}
              style={styles.icon}
            />
            <Text style={styles.Text}>
              Usertype:{' '}
              <Text style={[styles.Text, {textTransform: 'capitalize'}]}>
                {userdata[0].usertype}
              </Text>{' '}
            </Text>
          </View>
          <View style={styles.items}>
            <FontAwesome5
              name="id-badge"
              size={25}
              color={'#263e77'}
              style={styles.icon}
              s
            />
            <Text style={styles.Text}>Manager ID:{userdata[0].managerid}</Text>
          </View>
        </View>
        {/* 1st card end */}
        {/*2nd card start */}
        <View style={styles.cont2}>
          <View style={styles.items}>
            <Ionicons
              name="man"
              size={25}
              color={'#1bce98'}
              style={styles.icon}
            />
            <Text style={styles.Text}>
              Manager Name:{' '}
              <Text style={[styles.Text, {textTransform: 'capitalize'}]}>
                {userdata[0].managername}
              </Text>
            </Text>
          </View>
          <View style={styles.items}>
            <AntDesign
              name="barcode"
              size={25}
              color={'#1bb9ce'}
              style={styles.icon}
            />
            <Text style={styles.Text}>Passcode:{userdata[0].passcode}</Text>
          </View>
          <View style={styles.items}>
            <AntDesign
              name="mobile1"
              size={25}
              color={'#1bb9ce'}
              style={styles.icon}
            />
            <Text style={styles.Text}>Phone:{userdata[0].contactnumber}</Text>
          </View>
          <View style={styles.items}>
            <AntDesign
              name="idcard"
              size={25}
              color={'red'}
              style={styles.icon}
            />
            <Text style={styles.Text}>
              Aadhar Number: {userdata[0].aadhaar}
            </Text>
          </View>
        </View>
        {/*2nd card end */}
        {/*3rd card start */}
        <ScrollView>
          <View style={[styles.cont3, {paddingTop: -50}]}>
            <View style={styles.items}>
              <FontAwesome5
                name="birthday-cake"
                size={25}
                color={'#1b54ce'}
                style={styles.icon}
              />
              <Text style={styles.Text}>
                {/* DOB: {userdata[0].dob.split('T')[0]} */}
                DOB: {profileDob}
              </Text>
            </View>
            <View style={styles.items}>
              <FontAwesome5
                name="transgender-alt"
                size={25}
                color={'#410093'}
                style={styles.icon}
              />
              <Text style={styles.Text}>
                Gender:{' '}
                <Text style={[styles.Text, {textTransform: 'capitalize'}]}>
                  {userdata[0].gender}
                </Text>
              </Text>
            </View>
            <View style={styles.items}>
              <FontAwesome5
                name="graduation-cap"
                size={25}
                color={'#1bb9ce'}
                style={styles.icon}
              />
              <Text style={[styles.Text]}>
                Qualification:{' '}
                <Text style={[styles.Text]}> {userdata[0].qualification}</Text>
              </Text>
            </View>
            <View style={styles.items}>
              <Entypo
                name="location"
                size={25}
                color={'green'}
                style={styles.icon}
              />
              <Text style={styles.Text}>
                Lives In:
                {/* {(userdata[0].blockname, userdata[0].districtname)} */}
                {userdata[0].blockname}
              </Text>
            </View>
            <View style={styles.items}>
              <FontAwesome5
                name="calendar-alt"
                size={25}
                color={'blue'}
                style={styles.icon}
              />
              <Text style={styles.Text}>Regd.Date: {regDate}</Text>
            </View>
          </View>
        </ScrollView>
        {/*3rd card end*/}
      </View>
    </View>
  </ScrollView>

  {/* <FabButton onPress={displayAlert} /> */}
</ImageBackground>;
