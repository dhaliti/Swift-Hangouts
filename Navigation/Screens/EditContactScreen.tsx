import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  Pressable,
  Alert,
  Switch,
} from 'react-native';
import SQLite from 'react-native-sqlite-storage';
import {useFocusEffect, useIsFocused} from '@react-navigation/native';
import {Translate} from '../../translation/translate';
import Contacts, {Contact} from 'react-native-contacts';

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
  const [phoneNumberID, setPhoneNumberID] = useState(route.params.phone_number);
  const [theme, setTheme] = useState(route.params.theme);
  const [language, setLanguage] = useState(route.params.language);
  const [student, setStudent] = useState(0);
  const [checked, setChecked] = useState(false);

  const isFocused = useIsFocused();

  useFocusEffect(
    React.useCallback(() => {
      setItems();
      console.log('student: ' + route.params.student);
      return () => console.log('EditScreen');
    }, [isFocused]),
  );

  const setItems = () => {
    if (language == 'en') {
      setNamePlaceholder(Translate.en.EditContact.namePlaceholder);
      setSurnamePlaceholder(Translate.en.EditContact.surnamePlaceholder);
      setPhonenumberPlaceholder(
        Translate.en.EditContact.phone_numberPlaceholder,
      );
      setEmailPlaceholder(Translate.en.EditContact.emailPlaceholder);
      setEditButton(Translate.en.EditContact.editButton);
      setTitle(Translate.en.EditContact.title);

      setIncompleteForm(Translate.en.EditContact.incompleteForm);
      setMissingName(Translate.en.EditContact.missingName);
      setMissingPhone(Translate.en.EditContact.missingPhone);
      setEditedSuccessfully(Translate.en.EditContact.addedSuccessfully);
    } else {
      setNamePlaceholder(Translate.fr.EditContact.namePlaceholder);
      setSurnamePlaceholder(Translate.fr.EditContact.surnamePlaceholder);
      setPhonenumberPlaceholder(
        Translate.fr.EditContact.phone_numberPlaceholder,
      );
      setEmailPlaceholder(Translate.fr.EditContact.emailPlaceholder);
      setEditButton(Translate.fr.EditContact.editButton);

      setTitle(Translate.fr.EditContact.title);
      setMissingName(Translate.fr.EditContact.missingName);
      setMissingPhone(Translate.fr.EditContact.missingPhone);
      setIncompleteForm(Translate.fr.EditContact.incompleteForm);
      setEditedSuccessfully(Translate.fr.EditContact.addedSuccessfully);
    }
    if (route.params.student == 1) {
      setChecked(true);
    } else {
      setChecked(false);
    }
  };

  async function getPref() {
    await db.transaction(async tx => {
      tx.executeSql('SELECT * from Preferences', [], (tx, result) => {
        setLanguage(result.rows.item(0).language);
        setTheme(result.rows.item(0).theme);
      });
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
            '", student="' +
            student +
            '" WHERE id="' +
            contactID +
            '";',
          [],
          (tx, result) => {
            Alert.alert(title, editedSuccessfully);
            console.log('student end: ' + student);
            navigation.navigate('Contacts');
          },
        );
      });
    }
  }

  const toggleSwitch = () => {
    if (checked) {
      setStudent(0);
    } else {
      setStudent(1);
    }
    setChecked(!checked);
    console.log('checked toggle:' + checked);
    console.log('student toggle: ' + student);
  };

  return (
    <View style={theme == 'dark' ? style.generalDark : style.generalLight}>
      <View style={theme == 'dark' ? style.headerDark : style.headerLight}>
        <Text style={theme == 'dark' ? style.titleDark : style.titleLight}>
          {title}
        </Text>
      </View>
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
      <View
        style={{
          marginTop: 30,
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center',
          marginBottom: 20,
        }}>
        <Text
          style={{
            fontFamily: 'FuturaNewMedium',
            color: 'grey',
            fontSize: 18,
          }}>
          42 student
        </Text>
        <Switch
          trackColor={{false: 'red', true: 'blue'}}
          thumbColor={student ? '#f5dd4b' : '#f4f3f4'}
          ios_backgroundColor="#3e3e3e"
          onValueChange={toggleSwitch}
          value={checked}
        />
      </View>
      <Pressable style={style.editButton} onPress={editContact}>
        <Text style={style.editButtonText}>{editButton}</Text>
      </Pressable>
    </View>
  );
};

export default EditContactScreen;

const style = StyleSheet.create({
  generalDark: {
    backgroundColor: 'white',
    flex: 1,
  },

  generalLight: {
    backgroundColor: 'white',
    flex: 1,
  },

  headerDark: {
    display: 'flex',
    flexDirection: 'row',
    height: 90,
    backgroundColor: '#1A1919',
    marginBottom: 20,
    justifyContent: 'space-between',
    elevation: 10,
  },

  headerLight: {
    display: 'flex',
    flexDirection: 'row',
    height: 90,
    backgroundColor: '#00babc',
    marginBottom: 20,
    justifyContent: 'space-between',
    elevation: 10,
  },

  titleDark: {
    fontSize: 30,
    color: 'white',
    fontFamily: 'FuturaNewBold',
    padding: 25,
  },

  titleLight: {
    fontSize: 30,
    color: 'white',
    fontFamily: 'FuturaNewBold',
    padding: 25,
  },

  inputDark: {
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
  },
});
