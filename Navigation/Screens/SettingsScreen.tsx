import React, {useEffect, useState} from 'react';
import { StyleSheet, Text, View, Switch, Pressable } from "react-native";
import SQLite from 'react-native-sqlite-storage';
import {transform} from '@babel/core';

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


const SettingsScreen = ({navigation, route}) => {
  const [theme, setTheme] = useState('');
  const [language, setLanguage] = useState('');
  const [lightThemeOn, setLightThemeOn] = useState(false);

  useEffect(() => {
    return () => {
      setLanguage(route.params.language);
      setTheme(route.params.theme);
      setLightThemeOn(route.params.theme == 'dark' ? false : true);
      console.log(route.params.language);
      console.log(route.params.theme);
    };

  }, []);

  const changeTheme = () => {
    setLightThemeOn(!lightThemeOn);
  };

  const changeLanguage = () => {
    setLanguage('fr');
  };


  if (language == 'en') {
    return (
      <View style={theme == 'dark' ? style.generalDark : style.generalLight}>
        <Text style={theme == 'dark' ? style.titleDark : style.titleLight}>
          Settings
        </Text>
        <View
          style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
          <Text
            style={theme == 'dark' ? style.sectionDark : style.sectionLight}>
            Language
          </Text>
          <Pressable style={style.changeLanguageDark} onPress={changeLanguage}>
            <Text style={{
              color: 'white',
              fontFamily: 'FuturaNewMedium',
              fontSize: 16,
            }}>Switch to French</Text>
          </Pressable>

         {/* <View
            style={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              marginRight: 30,
            }}>
            <Text style={style.optionsDark}>Fr</Text>
            <Switch
              style={style.switchDark}
              value={lightThemeOn}
              onValueChange={changeTheme}
            />
            <Text style={style.optionsDark}>En</Text>
          </View>*/}
        </View>
        <View
          style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
          <Text
            style={theme == 'dark' ? style.sectionDark : style.sectionLight}>
            Language
          </Text>
          <Pressable style={style.changeLanguageDark} onPress={changeLanguage}>
            <Text style={{
              color: 'white',
              fontFamily: 'FuturaNewMedium',
              fontSize: 16,
            }}>Switch to French</Text>
          </Pressable>
          <View/>
      </View>
      </View>
    );
  } else {
    return (
      <View style={style.generalLight}>
        <Text style={style.titleLight}>Paramètres</Text>
        <Text style={style.sectionLigth}>Langue</Text>
        <Text style={style.sectionLight}>Thème</Text>
      </View>
    );
  }
};

export default SettingsScreen;

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
    padding: 30,
  },

  sectionDark: {
    color: 'white',
    fontSize: 16,
    fontFamily: 'FuturaNewBold',
    padding: 15,
    marginLeft: 20,
    textTransform: 'uppercase',
  },

  switchDark: {
    alignSelf: 'center',
    color: '#00babc',

  },

  optionsDark: {
    color: 'white',
  },


  changeLanguageDark: {
    backgroundColor: '#00babc',
    padding: 15,
    borderRadius: 4,
    marginRight: 30,
  }
});
