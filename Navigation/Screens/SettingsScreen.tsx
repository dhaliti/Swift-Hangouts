import React, {useEffect, useState} from 'react';
import {StyleSheet, Text, View, Switch, Pressable, Alert} from 'react-native';
import SQLite from 'react-native-sqlite-storage';
import {Translate} from '../../translation/translate';
import {useFocusEffect, useIsFocused} from '@react-navigation/native';

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
  const [theme, setTheme] = useState(route.params.theme);
  const [language, setLanguage] = useState(route.params.language);
  const [switchStatementLanguage, setSwitchStatementLanguage] = useState('');
  const [switchStatementTheme, setSwitchStatementTheme] = useState('');
  useState('');
  const [title, setTitle] = useState('');
  const [languageTitle, setLanguageTitle] = useState('');
  const [themeTitle, setThemeTitle] = useState('');
  const isFocused = useIsFocused();

  useEffect(() => {
    return () => {
      //  getPref();
      setItems();
      setThemeLang();
      console.log('Settings');
    };
  });

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
    if (theme == 'dark') {
      setTheme('light');
      setThemeLang();
      await db.transaction(async tx => {
        tx.executeSql('UPDATE Preferences SET theme="light";', [], () => {});
      });
    } else {
      await db.transaction(async tx => {
        setTheme('dark');
        setThemeLang();
        tx.executeSql('UPDATE Preferences SET theme="dark";', [], () => {});
      });
    }
  }

  async function changeLanguage() {
    setLanguage('fr');
    setItems();
    setThemeLang();
    if (language == 'en') {
      setLanguage('fr');
      setItems();
      setThemeLang();
      await db.transaction(async tx => {
        tx.executeSql('UPDATE Preferences SET language="fr";', [], () => {});
      });
    } else {
      setLanguage('en');
      setItems();
      setThemeLang();
      await db.transaction(async tx => {
        tx.executeSql(
          'UPDATE Preferences SET language="en";',
          [],
          (tx, result) => {},
        );
      });
    }
  }

  return (
    <View style={theme == 'dark' ? style.generalDark : style.generalLight}>
      <View style={theme == 'dark' ? style.headerDark : style.headerLight}>
        <Text style={theme == 'dark' ? style.titleDark : style.titleLight}>
          {title}
        </Text>
      </View>
      <Pressable
        style={
          language == 'en' ? style.changeLanguageFr : style.changeLanguageEn
        }
        onPress={changeLanguage}>
        <Text
          style={{
            color: 'white',
            fontFamily: 'FuturaNewBold',
            fontSize: 16,
            textAlign: 'center',
          }}>
          {switchStatementLanguage}
        </Text>
      </Pressable>

      <Pressable
        style={theme == 'dark' ? style.changeThemeDark : style.changeThemeLight}
        onPress={changeTheme}>
        <Text
          style={
            theme == 'dark'
              ? {
                  color: 'black',
                  fontFamily: 'FuturaNewBold',
                  fontSize: 16,
                  textAlign: 'center',
                }
              : {
                  color: 'white',
                  fontFamily: 'FuturaNewBold',
                  fontSize: 16,
                  textAlign: 'center',
                }
          }>
          {switchStatementTheme}
        </Text>
      </Pressable>
      <View style={{marginTop: 70}}>
        <Text style={style.creditsTitle}>
          {language == 'en' ? 'Credits' : 'Crédits'}
        </Text>
        <Text style={style.credits}>
          {language == 'en' ? Translate.en.Credits : Translate.fr.Credits}
        </Text>
      </View>
    </View>
  );
};

export default SettingsScreen;

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
    marginBottom: 60,
    justifyContent: 'space-between',
    elevation: 10,
  },

  headerLight: {
    display: 'flex',
    flexDirection: 'row',
    height: 90,
    backgroundColor: '#00babc',
    marginBottom: 60,
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

  changeLanguageEn: {
    backgroundColor: '#04809F',
    padding: 15,
    borderRadius: 4,
    marginRight: 90,
    marginLeft: 90,
    marginBottom: 10,
  },

  changeLanguageFr: {
    backgroundColor: '#D67772',
    padding: 15,
    borderRadius: 4,
    marginRight: 90,
    marginLeft: 90,
    marginBottom: 10,
  },

  changeThemeDark: {
    backgroundColor: 'whitesmoke',
    borderWidth: 1,
    borderColor: 'lightgrey',
    padding: 15,
    borderRadius: 4,
    marginRight: 90,
    marginLeft: 90,
    marginBottom: 10,
  },

  changeThemeLight: {
    backgroundColor: '#323232',
    padding: 15,
    borderRadius: 4,
    marginRight: 90,
    marginLeft: 90,
    marginBottom: 10,
  },

  creditsTitle: {
    fontFamily: 'FuturaNewBold',
    textAlign: 'center',
    textTransform: 'uppercase',
    fontSize: 16,
    marginBottom: 10,
    color: 'grey',
  },
  credits: {
    marginLeft: 40,
    marginRight: 40,
    textAlign: 'center',
    color: 'grey',
  },
});
