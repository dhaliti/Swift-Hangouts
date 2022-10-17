import React from "react";
import {Pressable, Alert, Button, StyleSheet, Text, TextInput, View } from "react-native";

import { openDatabase } from 'react-native-sqlite-storage';

const AddContactScreen = () => {

/*  addContact = () => {
    db.
  }*/

  function test() {
    Alert.alert(
      "Alert Title",
      "My Alert Msg",
      [
        {
          text: "Cancel",
          onPress: () => Alert.alert("Cancel Pressed"),
          style: "cancel",
        },
      ],
      {
        cancelable: true,
        onDismiss: () =>
          Alert.alert(
            "This alert was dismissed by tapping outside of the alert dialog."
          ),
      }
    )};

  return (
    <View style={style.general}>
        <Text style={style.title}>New Contact</Text>
      <TextInput
        style={style.input}
        placeholderTextColor="grey"
        placeholder="Nom"
      />
      <TextInput
        style={style.input}
        placeholderTextColor="grey"
        placeholder="Prénom"
      />
      <TextInput
        style={style.input}
        placeholderTextColor="grey"
        placeholder="Téléphone"
        keyboardType="numeric"
      />
      <TextInput
        style={style.input}
        placeholderTextColor="grey"
        placeholder="Email"
      />
      <Pressable style={style.addButton} onPress={test}><Text style={style.textButton}>ADD</Text></Pressable>
    </View>
  );
};

const style = StyleSheet.create({
  general: {
    backgroundColor: '#1A1919',
    flex: 1,
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    color: 'white',
  },
  input: {
    color: 'white',
    backgroundColor: '#202122',
    marginBottom: 5,
  },
  addButton: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 5,
    marginLeft: 50,
    marginRight: 50,
    backgroundColor: '#00babc'
  },
  textButton: {
    color: 'white',
  },
});

export default AddContactScreen;
