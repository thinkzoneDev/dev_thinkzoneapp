import React, {useState} from 'react';
import {Modal, TextInput, Button, StyleSheet, View, Text} from 'react-native';
import {WindowWidth} from '../utils/dimensions';
import {Title} from 'react-native-paper';
import {FontFamily, Color} from '../GlobalStyle';

const InputModal = ({
  visible,
  maxLength,
  onClose,
  onSubmit,
  Title,
  description,
  onChangeText,
  onEdit,
}) => {
  const [text, setText] = useState('');

  const handleTextChange = value => {
    setText(value);
    onChangeText();
  };

  const handleSave = () => {
    // Perform save action with text value
    onSubmit(text);
    console.log('Saved text:', text);
    onClose();
  };
  const handelEdit = () => {
    onEdit(text);
    console.log('Saved text:', text);
    onClose();
  };

  return (
    <Modal animationType="slide" transparent={true} visible={visible}>
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text
            style={{
              paddingTop: 10,
              paddingBottom: 10,
              fontFamily: FontFamily.poppinsSemibold,
              fontSize: 16,
              color: '#333333',
            }}>
            {Title}
          </Text>
          <Text
            style={{
              paddingTop: 10,
              paddingBottom: 10,

              fontFamily: FontFamily.poppinsSemibold,
              fontSize: 11,
              fontWeight: '600',
              color: '#000',
            }}>
            {description}
          </Text>
          <TextInput
            style={styles.textInput}
            maxLength={maxLength}
            placeholder="Enter roll no.."
            autoCapitalize="characters"
            onChangeText={handleTextChange}
            value={text}
          />
          <Text
            style={{
              fontSize: 10,
              color: '#000000',
              fontFamily: FontFamily.poppinsMedium,
              marginLeft: 10,
              paddingBottom: 20,
            }}>
            Have not received yet ?{' '}
            <Text
              onPress={handelEdit}
              style={{
                fontSize: 13,
                color: Color.royalblue,
                fontFamily: FontFamily.poppinsMedium,
              }}>
              Send again
            </Text>
          </Text>
          <View style={styles.buttonsContainer}>
            <Button title="Cancel" onPress={onClose} />
            <Button title="Submit" onPress={handleSave} />
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
    width: WindowWidth * 0.8,
  },
  textInput: {
    height: 40,
    width: '100%',
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 20,
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
});

export default InputModal;
