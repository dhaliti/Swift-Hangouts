import React, { useEffect, useState } from "react";
import { StyleSheet, Text, TextInput, View, Pressable, Alert } from "react-native";

const EditContactScreen = ({navigation, route}) => {

  const [name, setName] = useState(route.params.name);
  const [surname, setSurname] = useState(route.params.surname);
  const [email, setEmail] = useState(route.params.email);
  const [phonenumber, setPhonenumber] = useState(route.params.phone_number);

  function editContact() {

    if (!name && !surname) {
      Alert.alert('Missing information', 'Please enter a name or a surname');
    }
    else if (!phonenumber) {
      Alert.alert('Missing information', 'Phone number is missing');
    }
    else {
      console.log('Edit');
      console.log(name);
      console.log(surname);
      console.log(email);
      console.log(phonenumber);
    }


  }


  return (
    <View style={style.general}>
    <Text style={style.title}>Edit Contact</Text>
      <TextInput
        style={style.input}
        placeholderTextColor="grey"
        placeholder="Prénom"
        defaultValue={name}
        onChangeText={newName => setName(newName)}
      />
      <TextInput
        style={style.input}
        placeholderTextColor="grey"
        placeholder="Nom"
        defaultValue={surname}
        onChangeText={newName => setSurname(newName)}
      />
      <TextInput
        style={style.input}
        placeholderTextColor="grey"
        placeholder="Téléphone"
        keyboardType="numeric"
        defaultValue={phonenumber}
        onChangeText={newName => setPhonenumber(newName)}
      />
      <TextInput
        style={style.input}
        placeholderTextColor="grey"
        placeholder="Email"
        defaultValue={email}
        onChangeText={newName => setEmail(newName)}
      />
      <Pressable style={style.editButton} onPress={editContact}>
        <Text style={{color: 'white'}}>EDIT</Text>
      </Pressable>
    </View>
  );
};

export default EditContactScreen;


const style = StyleSheet.create({
  general: {
    backgroundColor: '#1A1919',
    flex: 1,
  },
  title: {
    fontSize: 40,
    fontWeight: 'bold',
    color: 'white',
    fontFamily: 'GoogleSansMedium',
  },
  input: {
    color: 'white',
    backgroundColor: '#202122',
    marginBottom: 5,
  },
  editButton: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 5,
    marginLeft: 50,
    marginRight: 50,
    backgroundColor: '#00babc',
  },
});
