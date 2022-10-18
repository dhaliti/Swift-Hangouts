import React from 'react';

import {NavigationContainer, DefaultTheme, DarkTheme,} from '@react-navigation/native';
import HomeScreen from './Screens/HomeScreen';
import AddContactScreen from './Screens/AddContactScreen';
import ContactDetailsScreen from './Screens/ContactDetailsScreen';
import SettingsScreen from './Screens/SettingsScreen';
import EditContactScreen from './Screens/EditContactScreen';
import ContactScreen from './Screens/ContactScreen';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import { View, Text, StyleSheet } from "react-native";

const {Navigator, Screen} = createNativeStackNavigator();

const AppNavigator = () => {
  return (
      <NavigationContainer theme={DarkTheme} >
        <Navigator screenOptions={{headerShown: false}} initialRouteName={"Contacts"}>
          <Screen name="Home" component={HomeScreen} />
          <Screen name="Contacts" component={ContactScreen} />
          <Screen name="Settings" component={SettingsScreen} />
          <Screen name="ContactDetails" component={ContactDetailsScreen} />
          <Screen name="AddContactScreen" component={AddContactScreen} />
          <Screen name="EditContactScreen" component={EditContactScreen} />
        </Navigator>
      </NavigationContainer>
  );
};


export default AppNavigator;
