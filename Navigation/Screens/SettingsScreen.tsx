import React, {useEffect, useState} from 'react';
import {StyleSheet, Text, View, Switch, Pressable, Alert} from 'react-native';
import SQLite from 'react-native-sqlite-storage';
import {Translate} from '../../translation/translate';
import {useIsFocused} from '@react-navigation/native';

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
  const [switchStatementLanguage, setSwitchStatementLanguage] = useState('');
  const [switchStatementTheme, setSwitchStatementTheme] = useState('');
  useState('');
  const [languageTitle, setLanguageTitle] = useState('');
  const [themeTitle, setThemeTitle] = useState('');
  const isFocused = useIsFocused();

  useEffect(() => {
    return () => {
      getPref();
      if (language == 'en') {
        setItemsEn();
        setSwitchStatementLanguage(
          Translate.en.Settings.switchStatementLanguage,
        );
        setLanguageTitle(Translate.en.Settings.languageTitle);
        setThemeTitle(Translate.en.Settings.themeTitle);
        if (theme == 'dark') {
          setSwitchStatementTheme(
            Translate.en.Settings.switchStatementThemeLight,
          );
        } else {
          setSwitchStatementTheme(
            Translate.en.Settings.switchStatementThemeDark,
          );
        }
      } else {
        setItemsFr();
        setSwitchStatementLanguage(
          Translate.fr.Settings.switchStatementLanguage,
        );
        setLanguageTitle(Translate.fr.Settings.languageTitle);
        setThemeTitle(Translate.fr.Settings.themeTitle);
        if (theme == 'dark') {
          setSwitchStatementTheme(
            Translate.fr.Settings.switchStatementThemeDark,
          );
        } else {
          setSwitchStatementTheme(
            Translate.fr.Settings.switchStatementThemeLight,
          );
        }
      }
    };
  }, [isFocused]);

  const setItemsEn = () => {

  }

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

  const changeTheme = () => {
    setLightThemeOn(!lightThemeOn);
  };

  async function changeLanguage ()  {
    if (language == 'en') {
      Alert.alert('français');
      await db.transaction(async tx => {
        tx.executeSql(
          'UPDATE Preferences SET language="fr";',
          [],
          (tx, result) => {
            setLanguage('fr');
          },
        );
      });
    } else {
      Alert.alert('english');
      await db.transaction(async tx => {
        tx.executeSql(
          'UPDATE Preferences SET language="en";',
          [],
          (tx, result) => {
            setLanguage('en');
          },
        );
      });
    }
  };


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
        <Text style={theme == 'dark' ? style.sectionDark : style.sectionLight}>
          {languageTitle}
        </Text>
        <Pressable style={style.changeLanguageDark} onPress={changeLanguage}>
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
        <Pressable style={style.changeThemeDark} onPress={changeTheme}>
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
  },

  changeThemeDark: {
    backgroundColor: '#00babc',
    padding: 15,
    borderRadius: 4,
  },
});
