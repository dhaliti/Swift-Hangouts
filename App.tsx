import React, { useEffect } from "react";
import AppNavigator from './Navigation/Navigator';
import 'react-native-gesture-handler';
import { StyleSheet, View } from "react-native";
import {useColorScheme} from 'react-native';
import {DarkTheme,DefaultTheme,NavigationContainer} from '@react-navigation/native';


const App = () => {

  return <AppNavigator />;

};

const style = StyleSheet.create( {
  general: {
    backgroundColor: '#dcdcdc'
  }
})
export default App;
