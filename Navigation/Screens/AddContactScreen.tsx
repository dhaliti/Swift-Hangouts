import React, {useState} from 'react';
import {
  Pressable,
  Alert,
  Button,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import SQLite, {openDatabase} from 'react-native-sqlite-storage';

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

const AddContactScreen = ({navigation}) => {
  /*  addContact = () => {
    db.
  }*/

  const [name, setName] = useState('');
  const [surname, setSurname] = useState('');
  const [phonenumber, setPhonenumber] = useState('');
  const [email, setEmail] = useState('');

  async function addContact() {
    if (phonenumber == '') {
      Alert.alert('Missing element', 'Phone number missing for new contact');
    } else if (name == '') {
      Alert.alert('Missing element', 'Name missing for new contact');
    } else {
      await db.transaction(async tx => {
        tx.executeSql(
          'INSERT INTO Contact (name, surname, phone_number, email ) VALUES ("' +
            name +
            '", "' +
            surname +
            '", "' +
            phonenumber +
            '", "' +
            email +
            '")',
          [],
          (tx, result) => {
            console.log('New contact ' + result);
          },
        );
      });
      Alert.alert('New Contact', 'New Contact has been added successfully!');
      navigation.goBack();
    }
  }

  return (
    <View style={style.general}>
      <Text style={style.title}>New Contact</Text>
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
      <Pressable style={style.addButton} onPress={addContact}>
        <Text style={style.textButton}>ADD</Text>
      </Pressable>
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
    color: 'white',
    padding: 30,
    fontFamily: 'FuturaNewBold',
  },
  input: {
    color: 'white',
    backgroundColor: '#202122',
    marginBottom: 5,
    height: 50,
    fontFamily: 'FuturaNewMedium',
    fontSize: 18,
    marginLeft: 20,
    marginRight: 20,
    padding: 10,
    paddingLeft: 15,
  },
  addButton: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 5,
    marginLeft: 50,
    marginRight: 50,
    backgroundColor: '#00babc',
    marginTop: 20,
  },
  textButton: {
    color: 'white',
    fontFamily: 'FuturaNewBold',


  },
});

export default AddContactScreen;
