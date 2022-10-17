import React from 'react';
import {StyleSheet, Text, View, Alert, Pressable} from 'react-native';

interface ContactDetailsScreenProps {
  navigation: any;
}

//const ContactDetailsScreen = ({route: {params}}) => {
const ContactDetailsScreen = ({navigation, route}) => {
  const name =
    route.params.name.charAt(0).toUpperCase() + route.params.name.slice(1);
  const surname =
    route.params.surname.charAt(0).toUpperCase() +
    route.params.surname.slice(1);
  const phone_number = route.params.phone_number.replace(/\d{2}(?=.)/g, '$& ');
  const email = route.params.email;

  const remove = () => {
    Alert.alert('Are you sure?', 'Delete confirmation', [
      {
        text: 'Yes',
        onPress: () => {
          Alert.alert('Deletion confirmed', 'Your contact has been deleted', [
            {text: 'ok', onPress: () => navigation.navigate('Home')},
          ]);
        },
      },
      {
        text: 'No',
        onPress: () => {},
      },
    ]);
  };

  const editContact = () => {
    navigation.navigate('EditContactScreen', route.params);
  }

  return (
    <View style={style.general}>
      <Text style={style.name}>
        {name} {surname}
      </Text>
      <Text style={style.phone_number}>{phone_number}</Text>
      <Text style={style.email}>{email}</Text>
      <View
        style={{
          marginTop: 50,
          display: 'flex',
          flexDirection: 'row',
        }}>
        <Pressable onPress={editContact} style={style.editButton}>
          <Text style={style.editButtonText}>EDIT</Text>
        </Pressable>
        <Pressable onPress={remove} style={style.deleteButton}>
          <Text style={style.deleteButtonText}>Delete</Text>
        </Pressable>
      </View>
    </View>
  );
};

const style = StyleSheet.create({
  general: {
    justifyContent: 'center', //Centered horizontally
    alignItems: 'center', //Centered vertically
    flex: 1,
    backgroundColor: '#1A1919',
  },
  name: {
    fontSize: 40,
    fontWeight: 'bold',
    color: 'white',
  },
  phone_number: {
    fontSize: 30,
    color: 'white',
    fontWeight: '200',
  },
  email: {
    color: 'white',
  },
  editButton: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 5,
    marginLeft: 20,
    marginRight: 30,
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: 'white',
  },
  editButtonText: {
    color: 'white',
  },
  deleteButton: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 5,
    marginRight: 20,
    backgroundColor: '#E96B60',
  },
  deleteButtonText: {
    color: 'white',
  },
});

export default ContactDetailsScreen;
