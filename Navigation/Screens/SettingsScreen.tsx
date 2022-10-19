import React, {useEffect, useState} from 'react';
import {StyleSheet, Text, View, Switch, Pressable, Alert} from 'react-native';
import SQLite from 'react-native-sqlite-storage';
import {Translate} from '../../translation/translate';
import { useFocusEffect, useIsFocused } from "@react-navigation/native";

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

const SettingsScreen = () => {
  const [theme, setTheme] = useState('dark');
  const [language, setLanguage] = useState('');
  const [lightThemeOn, setLightThemeOn] = useState(false);
  const [switchStatementLanguage, setSwitchStatementLanguage] = useState('');
  const [switchStatementTheme, setSwitchStatementTheme] = useState('');
  useState('');
  const [title, setTitle] = useState('');
  const [languageTitle, setLanguageTitle] = useState('');
  const [themeTitle, setThemeTitle] = useState('');
  const isFocused = useIsFocused();

  useEffect(() => {
    return () => {
      getPref();
      setItems();
      setThemeLang();
      console.log('Settings');
    };
  }, );

  useFocusEffect(
    React.useCallback(() => {
      getPref();
      setItems();
      setThemeLang();
      return () => console.log('Settings');
    }, [getPref, setItems, setThemeLang]),
  );


  const setItems = () => {
    if (language == 'en') {
      setSwitchStatementLanguage(Translate.en.Settings.switchStatementLanguage);
      setLanguageTitle(Translate.en.Settings.languageTitle);
      setThemeTitle(Translate.en.Settings.themeTitle);
      setTitle(Translate.en.Settings.title);
    } else if (language == 'fr') {
      setSwitchStatementLanguage(Translate.fr.Settings.switchStatementLanguage);
      setLanguageTitle(Translate.fr.Settings.languageTitle);
      setThemeTitle(Translate.fr.Settings.themeTitle);
      setTitle(Translate.fr.Settings.title);
    }
  };

  const setThemeLang = () => {
    if (language == 'fr') {
      theme == 'dark'
        ? setSwitchStatementTheme(
            Translate.fr.Settings.switchStatementThemeDark,
          )
        : setSwitchStatementTheme(
            Translate.fr.Settings.switchStatementThemeLight,
          );
    } else {
      theme == 'dark'
        ? setSwitchStatementTheme(
            Translate.en.Settings.switchStatementThemeDark,
          )
        : setSwitchStatementTheme(
            Translate.en.Settings.switchStatementThemeLight,
          );
    }
  };

  async function getPref() {
    await db.transaction(async tx => {
      tx.executeSql('SELECT * from Preferences', [], (tx, result) => {
        console.log(result.rows.item(0).theme);
        console.log(result.rows.item(0).language);
        setLanguage(result.rows.item(0).language);
        setTheme(result.rows.item(0).theme);
      });
    });
  }

  async function changeTheme() {
    setTheme('light');
   // setItems();
    setThemeLang();
    if (theme == 'dark') {
      await db.transaction(async tx => {
        tx.executeSql(
          'UPDATE Preferences SET theme="light";',
          [],
          (tx, result) => {
          },
        );
      });
    } else {
      await db.transaction(async tx => {
        setTheme('dark');
     //   setItems();
        setThemeLang();
        tx.executeSql(
          'UPDATE Preferences SET theme="dark";',
          [],
          (tx, result) => {
          },
        );
      });
    }
  }

  async function changeLanguage() {
    setLanguage('fr');
    setItems();
    setThemeLang();
    if (language == 'en') {
      await db.transaction(async tx => {
        tx.executeSql(
          'UPDATE Preferences SET language="fr";',
          [],
          (tx, result) => {
          },
        );
      });
    } else {
      await db.transaction(async tx => {
        setLanguage('en');
        setItems();
        setThemeLang();
        tx.executeSql(
          'UPDATE Preferences SET language="en";',
          [],
          (tx, result) => {
          },
        );
      });
    }
  }

  return (
    <View style={theme == 'dark' ? style.generalDark : style.generalLight}>
      <Text style={theme == 'dark' ? style.titleDark : style.titleLight}>
        {title}
      </Text>
      <View
        style={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
        <Text style={theme == 'dark' ? style.sectionDark : style.sectionLight}>
          {languageTitle}
        </Text>
        <Pressable
          style={
            theme == 'dark'
              ? style.changeLanguageDark
              : style.changeLanguageLight
          }
          onPress={changeLanguage}>
          <Text
            style={{
              color: 'white',
              fontFamily: 'FuturaNewMedium',
              fontSize: 16,
            }}>
            {switchStatementLanguage}
          </Text>
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
        <Text style={theme == 'dark' ? style.sectionDark : style.sectionLight}>
          {themeTitle}
        </Text>
        <Pressable
          style={
            theme == 'dark' ? style.changeThemeDark : style.changeThemeLight
          }
          onPress={changeTheme}>
          <Text
            style={{
              color: 'white',
              fontFamily: 'FuturaNewMedium',
              fontSize: 16,
            }}>
            {switchStatementTheme}
          </Text>
        </Pressable>
        <View />
      </View>
    </View>
  );
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

  titleLight: {
    fontSize: 40,
    color: 'black',
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

  sectionLight: {
    color: 'black',
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

  switchLight: {
    alignSelf: 'center',
    color: '#00babc',
  },

  optionsDark: {
    color: 'white',
  },

  optionsLight: {
    color: 'black',
  },

  changeLanguageDark: {
    backgroundColor: '#00babc',
    padding: 15,
    borderRadius: 4,
    marginRight: 30,
  },

  changeLanguageLight: {
    backgroundColor: '#00babc',
    padding: 15,
    borderRadius: 4,
    marginRight: 30,
  },

  changeThemeDark: {
    backgroundColor: '#00babc',
    padding: 15,
    borderRadius: 4,
  },

  changeThemeLight: {
    backgroundColor: '#00babc',
    padding: 15,
    borderRadius: 4,
  },
});
