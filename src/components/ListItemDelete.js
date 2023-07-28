import React from 'react';
import {View, StyleSheet, TouchableWithoutFeedback} from 'react-native';

import TrashIcon from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

import Colors from '../utils/Colors';

function ListItemDelete({onPress, deleteButton, updateButton, bgcolor}) {
  return (
    <TouchableWithoutFeedback onPress={onPress}>
      <View style={[styles.container, {backgroundColor: bgcolor}]}>
        {deleteButton && (
          <TrashIcon name="trash" size={30} color={Colors.white} />
        )}
        {updateButton && (
          <MaterialIcons name="mode-edit" size={30} color={Colors.white} />
        )}
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    // backgroundColor: Colors.danger,
    alignSelf: 'center',
    borderRadius: 1000,
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 10,
    marginHorizontal: 10,
    marginLeft: 14,
  },
});

export default ListItemDelete;
