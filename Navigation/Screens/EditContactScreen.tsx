import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  Pressable,
  Alert,
} from 'react-native';
import SQLite from 'react-native-sqlite-storage';

const db = SQLite.openDatabase(
  {
    name: 'ContactDatabase.db',
    location: 'default',
  },
  () => {},
  error => {
    console.log(error);
  },
);

const EditContactScreen = ({navigation, route}) => {
  const [name, setName] = useState(route.params.name);
  const [surname, setSurname] = useState(route.params.surname);
  const [email, setEmail] = useState(route.params.email);
  const [phonenumber, setPhonenumber] = useState(route.params.phone_number);

  async function editContact() {
    if (!name && !surname) {
      Alert.alert('Missing information', 'Please enter a name or a surname');
    } else if (!phonenumber) {
      Alert.alert('Missing information', 'Phone number is missing');
    } else {
      await db.transaction(async tx => {
        tx.executeSql(
          'UPDATE Contact SET name="' +
            name +
            '", surname="' +
            surname +
            '", email="' +
            email +
            '", phone_number="' +
            phonenumber +
            '" WHERE phone_number="' + phonenumber + '";',
          [],
          (tx, result) => {
            Alert.alert('Confirmation', 'Contact gas been edited');
            navigation.navigate('Contacts');
          },
        );
      });
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
    color: 'white',
    fontFamily: 'FuturaNewBold',
    textAlign: 'center',
    padding: 40,
  },
  input: {
    color: 'white',
    backgroundColor: '#202122',
    marginBottom: 5,
    //height: 50,
    fontFamily: 'FuturaNewBook',
    marginLeft: 30,
    marginRight: 30,
    padding: 12,
    paddingLeft: 15,
    fontSize: 18,
  },
  editButton: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 5,
    marginTop: 20,
    marginLeft: 50,
    marginRight: 50,
    backgroundColor: '#00babc',
  },
});
