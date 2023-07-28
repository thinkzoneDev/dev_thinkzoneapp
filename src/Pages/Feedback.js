import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  Button,
  ImageBackground,
  Image,
  Alert,
} from 'react-native';
import axios from 'axios';
import React, {useEffect, useState} from 'react';
import * as window from '../utils/dimensions';
import LinearGradient from 'react-native-linear-gradient';
import AppTextInput from '../components/TextInput';
import {RadioButton} from 'react-native-paper';
import API from '../environment/Api';

const Feedback = ({route}) => {
  const user = useSelector(state => state.userdata.user?.resData);
  const [feedback, setFeedback] = useState('');
  const [issue, setIssue] = useState('');
  const [type, setType] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('NO_ACTION');
  const [checked, setChecked] = useState('issue');
  const handelContentSubmit = () => {
    const body = {
      userid: user[0].userid,
      username: user[0].username,
      usertype: user[0].usertype,

      type: type,
      description: description,
      status: status,
    };
    // console.log(body, 'body');
    API.post(`createnewuserfeedback/`, body).then(
      response => {
        // console.log(response.data, 'responseData');
      },
      err => {
        // console.log(err);
      },
    );
    navigation.goBack();
  };
  return (
    <View>
      <View>
        <LinearGradient
          colors={['#4286f4', '#373b44']}
          // style={styles.linearGradient}
          style={styles.viewdatas}>
          <View
            style={{
              flexDirection: 'row',
              marginTop: 40,
              marginLeft: 50,
              //   letterSpacing: 20,
            }}>
            <RadioButton
              value="issue"
              uncheckedColor="white"
              color="white"
              status={checked === 'issue' ? 'checked' : 'unchecked'}
              onPress={() => setChecked('issue')}
            />

            <Text style={[styles.Text, {paddingRight: 20}]}>Issue</Text>
            <RadioButton
              uncheckedColor="white"
              size={150}
              color="white"
              value="feedback"
              status={checked === 'feedback' ? 'checked' : 'unchecked'}
              onPress={() => setChecked('feedback')}
            />
            <Text style={styles.Text}>Feedback</Text>
          </View>
          <AppTextInput
            style={styles.Textinput}
            autoCapitalize="none"
            autoCorrect={false}
            keyboardType="email-address"
            name="password"
            placeholder="Enter feedback or issue description here..."
            value={description}
            onChangeText={value => setDescription(value)}
          />
          <TouchableOpacity style={styles.button} onPress={handelContentSubmit}>
            <Text style={styles.buttonText}>Submit</Text>
          </TouchableOpacity>
        </LinearGradient>
      </View>
    </View>
  );
};

export default Feedback;

const styles = StyleSheet.create({
  container: {
    paddingBottom: 100,
  },
  viewdatas: {
    height: 540,
    borderRadius: 10,
    marginLeft: 20,
    overflow: 'hidden',
    marginRight: 10,
    width: window.WindowWidth * 0.9,
    marginTop: 100,
  },
  Text: {
    fontSize: 15,
    textAlign: 'center',
    color: 'black',
    fontFamily: 'serif',
    fontWeight: 'bold',
    // marginTop: 10,
    color: 'white',
  },
  texts: {
    // fontWeight: 'bold',
    flex: 1,
    fontSize: 15,
    color: 'black',

    textAlign: 'center',

    // marginTop: 20,
    paddingBottom: 30,
  },

  Textinput: {
    fontSize: 15,
    textAlign: 'center',
    color: 'white',
    fontFamily: 'serif',
    fontWeight: 'bold',
    marginTop: 20,
    borderColor: 'white',
    width: 320,
    height: 280,
    margin: 12,
    borderWidth: 1,
    padding: 10,
    borderRadius: 10,
    marginLeft: 30,
  },
  buttonText: {
    width: 190,
    height: 50,
    borderRadius: 10,
    backgroundColor: '#137BD4',
    color: 'white',
    borderWidth: 1,
    fontSize: 24,
    textAlign: 'center',
    marginLeft: 80,
    justifyContent: 'center',
    marginTop: 20,
    fontWeight: 'bold',
  },
});
