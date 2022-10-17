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

  let init: any = [];

  function test() {
    console.log(init);
    navigation.navigate('Contacts', {init});
  }

  async function getData() {
    await db.transaction(async tx => {
      tx.executeSql('SELECT * FROM Contact', [], (tx, result) => {
        for (let i = 0; i < result.rows.length; i++) {
          init = [...init, result.rows.item(i)];
        }
        test();
      });
    });
  }
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
            name + '", "' + surname + '", "' + phonenumber + '", "' + email + '")',
          [],
          (tx, result) => {
            console.log('New contact ' + result);
          },
        );
      });
      Alert.alert('New Contact', 'New Contact has been added successfully!');
      getData();
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
    backgroundColor: '#00babc',
  },
  textButton: {
    color: 'white',
  },
});

export default AddContactScreen;
