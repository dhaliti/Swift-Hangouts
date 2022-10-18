import React from 'react';
import {StyleSheet, Text, View, Alert, Pressable, Image} from 'react-native';
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
const ContactDetailsScreen = ({navigation, route}) => {
  const name =
    route.params.name.charAt(0).toUpperCase() + route.params.name.slice(1);
  const surname =
    route.params.surname.charAt(0).toUpperCase() +
    route.params.surname.slice(1);
  const phone_number = route.params.phone_number.replace(/\d{2}(?=.)/g, '$& ');
  const email = route.params.email;

  function remove() {
    Alert.alert('Are you sure?', 'Delete confirmation', [
      {
        text: 'Yes',
        onPress: async () => {
          await db.transaction(async tx => {
            tx.executeSql(
              'DELETE FROM Contact WHERE phone_number="' +
                route.params.phone_number +
                '";',
              [],
              (tx, result) => {
                Alert.alert('Confirmation', 'Contact has been deleted');
                navigation.navigate('Contacts');
              },
            );
          });
        },
      },
      {
        text: 'No',
        onPress: () => {},
      },
    ]);
  }

  const editContact = () => {
    navigation.navigate('EditContactScreen', route.params);
  };

  return (
    <View style={style.general}>
      <Text style={style.initials}>
        {name.charAt(0)} {surname.charAt(0)}
      </Text>
      <Text style={style.name}>
        {name} {surname}
      </Text>
      <Text style={style.phone_number}>{phone_number}</Text>
      <Text style={style.email}>{email}</Text>
      <Pressable onPress={editContact} style={style.editButton}>
        <Text style={style.editButtonText}>EDIT</Text>
      </Pressable>
      <Pressable onPress={remove} style={style.deleteButton}>
        <Text style={style.deleteButtonText}>DELETE</Text>
      </Pressable>
    </View>
  );
};

const style = StyleSheet.create({
  general: {
    //   justifyContent: 'center', //Centered horizontally
    //  alignItems: 'center', //Centered vertically
    flex: 1,
    backgroundColor: '#1A1919',
  },
  name: {
    fontSize: 40,
    color: 'white',
    fontFamily: 'FuturaNewBold',
    textAlign: 'center',
    padding: 5,
  },
  phone_number: {
    fontSize: 30,
    color: 'white',
    fontFamily: 'FuturaNewBook',
    textAlign: 'center',
    padding: 5,
  },
  email: {
    color: 'white',
    textAlign: 'center',
    fontFamily: 'FuturaNewBook',
    fontSize: 18,
    padding: 5,
  },
  editButton: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 5,
    marginLeft: 50,
    marginRight: 50,
    backgroundColor: 'darkgrey',
    marginBottom: 10,
    marginTop: 30,
  },
  editButtonText: {
    color: 'white',
    fontFamily: 'FuturaNewBold',
  },
  deleteButton: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 5,
    //  marginRight: 20,
    marginLeft: 50,
    marginRight: 50,
    backgroundColor: '#E96B60',
  },
  deleteButtonText: {
    color: 'white',
    fontFamily: 'FuturaNewBold',
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
  initials: {
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
});

export default ContactDetailsScreen;
