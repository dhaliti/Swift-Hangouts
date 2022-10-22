import React, {useState} from 'react';
import {
  Pressable,
  Alert,
  Button,
  StyleSheet,
  Text,
  TextInput,
  View,
  Image,
  Switch,
} from 'react-native';

import SQLite, {openDatabase} from 'react-native-sqlite-storage';
import {useFocusEffect} from '@react-navigation/native';
import {Translate} from '../../translation/translate';
import Contacts from 'react-native-contacts';
import {Checkbox} from 'react-native-paper';

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

const AddContactScreen = ({navigation, route}) => {
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
  const [theme, setTheme] = useState(route.params.theme);
  const [language, setLanguage] = useState(route.params.language);
  const [checked, setChecked] = React.useState(false);
  const [student, setStudent] = useState(0);

  let contacts: any = [];

  useFocusEffect(
    React.useCallback(() => {
      // getPref();
      setItems();
      // getData();
      return () => console.log('ContactDetailsScreen');
    }, [getPref, setItems, getData]),
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
    } else {
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
  };

  async function getPref() {
    await db.transaction(async tx => {
      tx.executeSql('SELECT * from Preferences', [], (tx, result) => {
        setLanguage(result.rows.item(0).language);
        setTheme(result.rows.item(0).theme);
      });
    });
  }

  async function getData() {
    await db.transaction(async tx => {
      tx.executeSql('SELECT * FROM Contact', [], (tx, result) => {
        for (let i = 0; i < result.rows.length; i++) {
          contacts = [...contacts, result.rows.item(i)];
        }
      });
    });
  }

  function checkData(): number {
    for (let i = 0; i < contacts.length; i++) {
      if (contacts.phone_number == phonenumber) {
        return 1;
      }
    }
    return 0;
  }

  const toggleSwitch = () => {
    setChecked(!checked);
    if (checked) {
      setStudent(1);
    } else {
      setStudent(0);
    }
  };

  async function addContact() {
    if (phonenumber == '') {
      Alert.alert(incompleteForm, missingPhone);
    } else if (name == '') {
      Alert.alert(incompleteForm, missingName);
    } else if (checkData() == 1) {
      Alert.alert(
        language == 'en'
          ? Translate.en.AddContact.contactAlreadyExists
          : Translate.fr.AddContact.contactAlreadyExists,
      );
    } else {
      await db.transaction(async tx => {
        tx.executeSql(
          'INSERT INTO Contact (name, surname, phone_number, email, student ) VALUES ("' +
            name +
            '", "' +
            surname +
            '", "' +
            phonenumber +
            '", "' +
            email +
            '", ' +
            1 +
            ');',
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
          },
        ],
        phoneNumbers: [
          {
            label: 'Hangouts',
            number: phonenumber,
          },
        ],
        familyName: surname,
        givenName: name,
      };
      await Contacts.addContact(newPerson as Contact);
      navigation.goBack();
    }
  }

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
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center',
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
          trackColor={{false: '#767577', true: '#81b0ff'}}
          thumbColor={student ? '#f5dd4b' : '#f4f3f4'}
          ios_backgroundColor="#3e3e3e"
          onValueChange={toggleSwitch}
          value={checked}
        />
      </View>
      <Pressable style={style.addButton} onPress={addContact}>
        <Text style={style.textButton}>{addButton}</Text>
      </Pressable>
    </View>
  );
};

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
    height: 50,
    fontFamily: 'FuturaNewMedium',
    fontSize: 18,
    marginLeft: 40,
    marginRight: 40,
    padding: 10,
    paddingLeft: 15,
  },

  inputLight: {
    color: 'black',
    backgroundColor: 'lightgrey',
    marginBottom: 5,
    height: 50,
    fontFamily: 'FuturaNewMedium',
    fontSize: 18,
    marginLeft: 35,
    marginRight: 35,
    padding: 15,
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
