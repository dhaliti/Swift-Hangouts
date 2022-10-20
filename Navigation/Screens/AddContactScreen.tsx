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
import { useFocusEffect } from "@react-navigation/native";
import { Translate } from "../../translation/translate";
import Contacts, { Contact } from "react-native-contacts";

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

  const [namePlaceholder, setNamePlaceholder] = useState('');
  const [surnamePlaceholder, setSurnamePlaceholder] = useState('');
  const [phonenumberPlaceholder, setPhonenumberPlaceholder] = useState('');
  const [emailPlaceholder, setEmailPlaceholder] = useState('');
  const [addButton, setAddButton] = useState('');
  const [title, setTitle] = useState('');

  const [incompleteForm, setIncompleteForm] = useState('');
  const [missingPhone, setMissingPhone] = useState('');
  const [missingName, setMissingName] = useState('');
  const [addedSuccessfully, setAddedSuccessfully] = useState('');

  const [name, setName] = useState('');
  const [surname, setSurname] = useState('');
  const [phonenumber, setPhonenumber] = useState('');
  const [email, setEmail] = useState('');
  const [theme, setTheme] = useState('');
  const [language, setLanguage] = useState('');


  useFocusEffect(
    React.useCallback(() => {
      getPref();
      setItems();
      return () => console.log('ContactDetailsScreen');
    }, [getPref, setItems]),
  );

  const setItems = () => {
    if (language == 'en') {
      setNamePlaceholder(Translate.en.AddContact.namePlaceholder);
      setSurnamePlaceholder(Translate.en.AddContact.surnamePlaceholder);
      setPhonenumberPlaceholder(Translate.en.AddContact.phonePlaceholder);
      setEmailPlaceholder(Translate.en.AddContact.emailPlaceholder);
      setAddButton(Translate.en.AddContact.addButton);
      setTitle(Translate.en.AddContact.title);
      setIncompleteForm(Translate.en.AddContact.incompleteForm);
      setMissingName(Translate.en.AddContact.missingName);
      setMissingPhone(Translate.en.AddContact.missingPhone);
      setAddedSuccessfully(Translate.en.AddContact.addedSuccessfully);
    }
    else {
      setNamePlaceholder(Translate.fr.AddContact.namePlaceholder);
      setSurnamePlaceholder(Translate.fr.AddContact.surnamePlaceholder);
      setPhonenumberPlaceholder(Translate.fr.AddContact.phonePlaceholder);
      setEmailPlaceholder(Translate.fr.AddContact.emailPlaceholder);
      setAddButton(Translate.fr.AddContact.addButton);
      setTitle(Translate.fr.AddContact.title);
      setMissingName(Translate.fr.AddContact.missingName);
      setMissingPhone(Translate.fr.AddContact.missingPhone);
      setIncompleteForm(Translate.fr.AddContact.incompleteForm);
      setAddedSuccessfully(Translate.fr.AddContact.addedSuccessfully);
    }
  }

  async function getPref() {
    await db.transaction(async tx => {
      tx.executeSql('SELECT * from Preferences', [], (tx, result) => {
        setLanguage(result.rows.item(0).language);
        setTheme(result.rows.item(0).theme);
      });
    });
  }

  async function addContact() {
    if (phonenumber == '') {
      Alert.alert(incompleteForm, missingPhone);
    } else if (name == '') {
      Alert.alert(incompleteForm, missingName);
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
      Alert.alert(title, addedSuccessfully);
      const newPerson = {
        emailAddresses: [
          {
            label: 'work',
            email: email,
          }
        ],
        phoneNumbers: [{
          label: 'Hangouts',
          number: phonenumber,
        }],
        familyName: surname,
        givenName: name,
      };
      await Contacts.addContact(newPerson as Contact);
      navigation.goBack();
    }
  }

  return (
    <View style={theme == 'dark' ? style.generalDark : style.generalLight}>
      <Text style={theme == 'dark' ? style.titleDark : style.titleLight}>{title}</Text>
      <TextInput
        style={theme == 'dark' ? style.inputDark : style.inputLight}
        placeholderTextColor="grey"
        placeholder={namePlaceholder}
        defaultValue={name}
        onChangeText={newName => setName(newName)}
      />
      <TextInput
        style={theme == 'dark' ? style.inputDark : style.inputLight}
        placeholderTextColor="grey"
        placeholder={surnamePlaceholder}
        defaultValue={surname}
        onChangeText={newName => setSurname(newName)}
      />
      <TextInput
        style={theme == 'dark' ? style.inputDark : style.inputLight}
        placeholderTextColor="grey"
        placeholder={phonenumberPlaceholder}
        keyboardType="numeric"
        defaultValue={phonenumber}
        onChangeText={newName => setPhonenumber(newName)}
      />
      <TextInput
        style={theme == 'dark' ? style.inputDark : style.inputLight}
        placeholderTextColor="grey"
        placeholder={emailPlaceholder}
        defaultValue={email}
        onChangeText={newName => setEmail(newName)}
      />
      <Pressable style={style.addButton} onPress={addContact}>
        <Text style={style.textButton}>{addButton}</Text>
      </Pressable>
    </View>
  );
};

const style = StyleSheet.create({
  generalDark: {
    backgroundColor: '#1A1919',
    flex: 1,
  },

  generalLight: {
    backgroundColor: 'white',
    flex: 1,
  },

  titleDark: {
    fontSize: 30,
    color: 'white',
    padding: 30,
    fontFamily: 'FuturaNewBold',
  },

  titleLight: {
    fontSize: 30,
    color: 'black',
    padding: 30,
    fontFamily: 'FuturaNewBold',
  },

  inputDark: {
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

  inputLight: {
    color: 'white',
    backgroundColor: 'lightgrey',
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
    textTransform: 'uppercase',
  },
});

export default AddContactScreen;
