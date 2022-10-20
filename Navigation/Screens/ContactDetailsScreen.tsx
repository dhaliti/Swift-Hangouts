import React, {useCallback, useEffect, useState} from 'react';
import {
  Linking,
  StyleSheet,
  Text,
  View,
  Alert,
  Pressable,
  Image, PermissionsAndroid,
} from "react-native";
import SQLite from 'react-native-sqlite-storage';
import {Translate} from '../../translation/translate';
import {useFocusEffect, useIsFocused} from '@react-navigation/native';
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
const ContactDetailsScreen = ({navigation, route}) => {
  const name =
    route.params.name.charAt(0).toUpperCase() + route.params.name.slice(1);
  const surname =
    route.params.surname.charAt(0).toUpperCase() +
    route.params.surname.slice(1);
  const phone_number = route.params.phone_number.replace(/\d{2}(?=.)/g, '$& ');
  const email = route.params.email;
  const [alertConfirmationTitle, setAlertConfirmationTitle] = useState('');
  const [alertConfirmationText, setAlertConfirmationText] = useState('');
  const [editButton, setEditButton] = useState('');
  const [deleteButton, setDeleteButton] = useState('');
  const [language, setLanguage] = useState('');
  const [theme, setTheme] = useState('');

  const isFocused = useIsFocused();

  useFocusEffect(
    React.useCallback(() => {
      getPref();
      setItems();
      return () => console.log('ContactDetailsScreen');
    }, [getPref, setItems]),
  );

  async function getPref() {
    await db.transaction(async tx => {
      tx.executeSql('SELECT * from Preferences', [], (tx, result) => {
        setLanguage(result.rows.item(0).language);
        setTheme(result.rows.item(0).theme);
      });
    });
  }

  function call() {
    Linking.openURL('tel:' + phone_number);
  }

  function sendMessage() {
    Linking.openURL('sms:' + phone_number + '?body=');
  }

  const setItems = () => {
    if (language == 'en') {
      setAlertConfirmationTitle(
        Translate.en.ContactDetails.alertConfirmationTitle,
      );
      setAlertConfirmationText(
        Translate.en.ContactDetails.alertConfirmationText,
      );
      setEditButton(Translate.en.ContactDetails.editButton);
      setDeleteButton(Translate.en.ContactDetails.deleteButton);
    }
    if (language == 'fr') {
      setAlertConfirmationTitle(
        Translate.fr.ContactDetails.alertConfirmationTitle,
      );
      setAlertConfirmationText(
        Translate.fr.ContactDetails.alertConfirmationText,
      );
      setEditButton(Translate.fr.ContactDetails.editButton);
      setDeleteButton(Translate.fr.ContactDetails.deleteButton);
    }
  };

  const EmailButton = () => {
    if (email) {
      return (
        <Pressable
          onPress={sendEmail}
          style={
            theme == 'dark' ? style.EmailButtonDark : style.EmailButtonLight
          }>
          <Text
            style={
              theme == 'dark'
                ? style.EmailButtonTextDark
                : style.EmailButtonTextLight
            }>
            {language == 'en'
              ? Translate.en.Contacts.emailButton
              : Translate.fr.Contacts.emailButton}
          </Text>
        </Pressable>
      );
    }
  };

  const SMSButton = () => {
    return (
      <Pressable
        onPress={sendMessage}
        style={theme == 'dark' ? style.SMSButtonDark : style.SMSButtonLight}>
        <Text
          style={
            theme == 'dark' ? style.SMSButtonTextDark : style.SMSButtonTextLight
          }>
          {language == 'en'
            ? Translate.en.Contacts.SMSButton
            : Translate.fr.Contacts.SMSButton}
        </Text>
      </Pressable>
    );
  };

  const CallButton = () => {
    return (
      <Pressable
        onPress={call}
        style={theme == 'dark' ? style.callButtonDark : style.callButtonLight}>
        <Text
          style={
            theme == 'dark'
              ? style.callButtonTextDark
              : style.callButtonTextLight
          }>
          {language == 'en'
            ? Translate.en.Contacts.callButton
            : Translate.fr.Contacts.callButton}
        </Text>
      </Pressable>
    );
  };

  function sendEmail() {
    Linking.openURL('mailto:' + email);
  }

  async function requestContactsPermission() {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.READ_CONTACTS,
        {
          title: 'Contacts permissions',
          message: 'This application needs to get access to your contacts',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log('You can use the contacts');
      } else {
        console.log('Contacts permission denied');
      }
    } catch (err) {
      console.warn(err);
    }
  }

  function remove() {
    Alert.alert(alertConfirmationTitle, alertConfirmationText, [
      {
        text: language == 'en' ? 'Yes' : 'Oui',
        onPress: async () => {
          await db.transaction(async tx => {
            tx.executeSql(
              'DELETE FROM Contact WHERE phone_number="' +
                route.params.phone_number +
                '";',
              [],
              async () => {
                const newPerson = {
                  emailAddresses: [
                    {
                      label: 'personnal',
                      email: email,
                    },
                  ],
                  phoneNumbers: [
                    {
                      label: 'Hangouts',
                      number: phone_number,
                    },
                  ],
                  familyName: surname,
                  givenName: name,
                };
                await requestContactsPermission();
                await Contacts.deleteContact(newPerson as Contact);
                Alert.alert('Confirmation', 'Contact has been deleted');
                navigation.navigate('Contacts');
              },
            );
          });
        },
      },
      {
        text: language == 'en' ? 'No' : 'Non',
        onPress: () => {},
      },
    ]);
  }

  const editContact = () => {
    navigation.navigate('EditContactScreen', route.params);
  };

  return (
    <View style={theme == 'dark' ? style.generalDark : style.generalLight}>
      <Text style={theme == 'dark' ? style.initialsDark : style.initialsLight}>
        {name.charAt(0)} {surname.charAt(0)}
      </Text>
      <Text style={theme == 'dark' ? style.nameDark : style.nameLight}>
        {name} {surname}
      </Text>
      <Text
        style={
          theme == 'dark' ? style.phone_numberDark : style.phone_numberLight
        }>
        {phone_number}
      </Text>
      <Text style={theme == 'dark' ? style.emailDark : style.emailLight}>
        {email}
      </Text>
      <Pressable
        onPress={editContact}
        style={theme == 'dark' ? style.editButtonDark : style.editButtonLight}>
        <Text
          style={
            theme == 'dark'
              ? style.editButtonTextDark
              : style.editButtonTextLight
          }>
          {editButton}
        </Text>
      </Pressable>
      <Pressable
        onPress={remove}
        style={
          theme == 'dark' ? style.deleteButtonDark : style.deleteButtonLight
        }>
        <Text
          style={
            theme == 'dark'
              ? style.deleteButtonTextDark
              : style.deleteButtonTextLight
          }>
          {deleteButton}
        </Text>
      </Pressable>
      <CallButton />
      <SMSButton />
      <EmailButton />
    </View>
  );
};

const style = StyleSheet.create({
  generalDark: {
    flex: 1,
    backgroundColor: '#1A1919',
  },

  generalLight: {
    flex: 1,
    backgroundColor: '#F1F1F1',
  },

  nameDark: {
    fontSize: 40,
    color: 'white',
    fontFamily: 'FuturaNewBold',
    textAlign: 'center',
    padding: 5,
    marginLeft: 30,
    marginRight: 30,
  },

  nameLight: {
    fontSize: 40,
    color: 'black',
    fontFamily: 'FuturaNewBold',
    textAlign: 'center',
    padding: 5,
  },

  phone_numberDark: {
    fontSize: 30,
    color: 'white',
    fontFamily: 'FuturaNewBook',
    textAlign: 'center',
    padding: 5,
  },

  phone_numberLight: {
    fontSize: 30,
    color: 'black',
    fontFamily: 'FuturaNewBook',
    textAlign: 'center',
    padding: 5,
  },

  emailDark: {
    color: 'white',
    textAlign: 'center',
    fontFamily: 'FuturaNewBook',
    fontSize: 18,
    padding: 5,
  },

  emailLight: {
    color: 'black',
    textAlign: 'center',
    fontFamily: 'FuturaNewBook',
    fontSize: 18,
    padding: 5,
  },

  editButtonDark: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 5,
    marginLeft: 80,
    marginRight: 80,
    backgroundColor: 'darkgrey',
    marginBottom: 10,
    marginTop: 30,
  },

  editButtonLight: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 5,
    marginLeft: 80,
    marginRight: 80,
    backgroundColor: 'darkgrey',
    marginBottom: 10,
    marginTop: 30,
  },

  editButtonTextDark: {
    color: 'white',
    fontFamily: 'FuturaNewBold',
    textTransform: 'uppercase',
  },

  editButtonTextLight: {
    color: 'white',
    fontFamily: 'FuturaNewBold',
    textTransform: 'uppercase',
  },

  deleteButtonDark: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 5,
    marginLeft: 80,
    marginRight: 80,
    marginBottom: 10,
    backgroundColor: '#E96B60',
  },

  deleteButtonLight: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 5,
    marginLeft: 80,
    marginRight: 80,
    marginBottom: 10,
    backgroundColor: '#E96B60',
  },

  deleteButtonTextDark: {
    color: 'white',
    fontFamily: 'FuturaNewBold',
    textTransform: 'uppercase',
  },

  deleteButtonTextLight: {
    color: 'white',
    fontFamily: 'FuturaNewBold',
    textTransform: 'uppercase',
  },

  callButtonDark: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 5,
    marginLeft: 80,
    marginRight: 80,
    marginBottom: 10,
    backgroundColor: '#00babc',
  },

  callButtonLight: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 5,
    marginLeft: 80,
    marginRight: 80,
    marginBottom: 10,
    backgroundColor: '#00babc',
  },

  callButtonTextDark: {
    color: 'white',
    fontFamily: 'FuturaNewBold',
    textTransform: 'uppercase',
  },

  callButtonTextLight: {
    color: 'white',
    fontFamily: 'FuturaNewBold',
    textTransform: 'uppercase',
  },

  SMSButtonDark: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 5,
    marginLeft: 80,
    marginRight: 80,
    marginBottom: 10,
    backgroundColor: '#04809F',
  },

  SMSButtonLight: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 5,
    marginLeft: 80,
    marginRight: 80,
    marginBottom: 10,
    backgroundColor: '#04809F',
  },

  SMSButtonTextDark: {
    color: 'white',
    fontFamily: 'FuturaNewBold',
    textTransform: 'uppercase',
  },

  SMSButtonTextLight: {
    color: 'white',
    fontFamily: 'FuturaNewBold',
    textTransform: 'uppercase',
  },

  EmailButtonDark: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 5,
    marginLeft: 80,
    marginRight: 80,
    marginBottom: 10,
    backgroundColor: '#65646B',
  },

  EmailButtonLight: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 5,
    marginLeft: 80,
    marginRight: 80,
    marginBottom: 10,
    backgroundColor: '#65646B',
  },

  EmailButtonTextDark: {
    color: 'white',
    fontFamily: 'FuturaNewBold',
    textTransform: 'uppercase',
  },

  EmailButtonTextLight: {
    color: 'white',
    fontFamily: 'FuturaNewBold',
    textTransform: 'uppercase',
  },

  profile: {
    marginTop: 100,
    width: 150,
    height: 150,
    borderRadius: 100,
    borderWidth: 1,
    borderColor: 'white',
    marginBottom: 30,
  },
  initialsDark: {
    width: 75,
    height: 75,
    textAlign: 'center',
    textAlignVertical: 'center',
    alignSelf: 'center',
    fontSize: 30,
    fontFamily: 'FuturaNewBold',
    borderRadius: 100,
    color: 'white',
    borderColor: 'white',
    borderWidth: 2,
    marginTop: 100,
    marginBottom: 20,
  },

  initialsLight: {
    width: 75,
    height: 75,
    textAlign: 'center',
    textAlignVertical: 'center',
    alignSelf: 'center',
    fontSize: 30,
    fontFamily: 'FuturaNewBold',
    borderRadius: 100,
    color: 'black',
    borderColor: 'black',
    borderWidth: 2,
    marginTop: 100,
    marginBottom: 20,
  },
});

export default ContactDetailsScreen;
