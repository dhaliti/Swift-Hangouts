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
import { useFocusEffect, useIsFocused } from "@react-navigation/native";
import { Translate } from "../../translation/translate";
import Contacts, {Contact} from "react-native-contacts";

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

  const [namePlaceholder, setNamePlaceholder] = useState('');
  const [surnamePlaceholder, setSurnamePlaceholder] = useState('');
  const [phonenumberPlaceholder, setPhonenumberPlaceholder] = useState('');
  const [emailPlaceholder, setEmailPlaceholder] = useState('');
  const [editButton, setEditButton] = useState('');
  const [title, setTitle] = useState('');

  const [incompleteForm, setIncompleteForm] = useState('');
  const [missingPhone, setMissingPhone] = useState('');
  const [missingName, setMissingName] = useState('');
  const [editedSuccessfully, setEditedSuccessfully] = useState('');

  const [name, setName] = useState(route.params.name);
  const [contactID, setContactID] = useState(route.params.id);
  const [surname, setSurname] = useState(route.params.surname);
  const [email, setEmail] = useState(route.params.email);
  const [phonenumber, setPhonenumber] = useState(route.params.phone_number);
  const [id, setId] = useState();
  const [theme, setTheme] = useState('dark');
  const [language, setLanguage] = useState('');
  const [phoneContacts, setPhoneContacts] = useState([Contacts]);

  const isFocused = useIsFocused();

  useFocusEffect(
    React.useCallback(() => {
      getPref();
      getContacts();
      setItems();
      return () => console.log('EditScreen');
    }, [isFocused]),
  );

  const setItems = () => {
    if (language == 'en') {
      setNamePlaceholder(Translate.en.EditContact.namePlaceholder);
      setSurnamePlaceholder(Translate.en.EditContact.surnamePlaceholder);
      setPhonenumberPlaceholder(Translate.en.EditContact.phone_numberPlaceholder);
      setEmailPlaceholder(Translate.en.EditContact.emailPlaceholder);
      setEditButton(Translate.en.EditContact.editButton);
      setTitle(Translate.en.EditContact.title);

      setIncompleteForm(Translate.en.EditContact.incompleteForm);
      setMissingName(Translate.en.EditContact.missingName);
      setMissingPhone(Translate.en.EditContact.missingPhone);
      setEditedSuccessfully(Translate.en.EditContact.addedSuccessfully);
    }
    else {
      setNamePlaceholder(Translate.fr.EditContact.namePlaceholder);
      setSurnamePlaceholder(Translate.fr.EditContact.surnamePlaceholder);
      setPhonenumberPlaceholder(Translate.fr.EditContact.phone_numberPlaceholder);
      setEmailPlaceholder(Translate.fr.EditContact.emailPlaceholder);
      setEditButton(Translate.fr.EditContact.editButton);

      setTitle(Translate.fr.EditContact.title);
      setMissingName(Translate.fr.EditContact.missingName);
      setMissingPhone(Translate.fr.EditContact.missingPhone);
      setIncompleteForm(Translate.fr.EditContact.incompleteForm);
      setEditedSuccessfully(Translate.fr.EditContact.addedSuccessfully);
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

  function getContacts() {
    Contacts.getAll().then(contact => {
      setPhoneContacts(contact);
      console.log(phoneContacts);
    });

  }

  async function editContact() {
    if (!name && !surname) {
      Alert.alert(incompleteForm, missingName);
    } else if (!phonenumber) {
      Alert.alert(incompleteForm, missingPhone);
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
            '" WHERE id="' + contactID + '";',
          [],
          (tx, result) => {
            let editContact;
            // for (let i = 0; i < phoneContacts.length; i++) {
            //   if (phoneContacts[i].givenName)
            // }
            Alert.alert(title, editedSuccessfully);
            navigation.navigate('Contacts');
          },
        );
      });
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
      <Pressable style={style.editButton} onPress={editContact}>
        <Text style={style.editButtonText}>{editButton}</Text>
      </Pressable>
    </View>
  );
};

export default EditContactScreen;

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
    fontSize: 40,
    color: 'white',
    fontFamily: 'FuturaNewBold',
    textAlign: 'center',
    padding: 40,
  },

  titleLight: {
    fontSize: 40,
    color: 'black',
    fontFamily: 'FuturaNewBold',
    textAlign: 'center',
    padding: 40,
  },

  inputDark: {
    color: 'white',
    backgroundColor: '#202122',
    marginBottom: 5,
    fontFamily: 'FuturaNewBook',
    marginLeft: 30,
    marginRight: 30,
    padding: 12,
    paddingLeft: 15,
    fontSize: 18,
  },

  inputLight: {
    color: 'black',
    backgroundColor: 'lightgrey',
    marginBottom: 5,
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
  editButtonText: {
    color: 'white',
    textTransform: 'uppercase',
    fontFamily: 'FuturaNewBold',
  }
});
