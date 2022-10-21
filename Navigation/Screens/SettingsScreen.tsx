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

const SettingsScreen = ({navigation, route}) => {
  const [theme, setTheme] = useState(route.params.theme);
  const [language, setLanguage] = useState(route.params.language);
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
    //  getPref();
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
      <View style={theme == 'dark' ? style.headerDark : style.headerLight}>
      <Text style={theme == 'dark' ? style.titleDark : style.titleLight}>
        {title}
      </Text>
    </View>
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
              textAlign: 'center',
            }}>
            {switchStatementLanguage}
          </Text>
        </Pressable>


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
              textAlign: 'center',
            }}>
            {switchStatementTheme}
          </Text>
        </Pressable>
      <View style={{marginTop: 70,}}>
        <Text style={style.creditsTitle}>Crédits</Text>
        <Text style={style.credits}>
          Lorem ipsum dolor sit amet. Ea omnis nihil ut nihil corporis est minus delectus. Aut sapiente deleniti qui quas debitis est veniam consequatur vel impedit quos! Ad animi officia a asperiores ipsam quo quidem aperiam ut expedita odit et facere sunt aut culpa nihil. Rem minima eveniet aut eligendi voluptas eum porro rerum sit rerum fuga qui quidem rerum.

          Eum culpa cupiditate sed reprehenderit autem qui nesciunt dolorem qui placeat quia in ullam galisum. Aut architecto eveniet et quia saepe est deserunt totam id quibusdam iste est quod aliquid. Ut veritatis facilis aut sunt voluptatibus aut Quis quidem quo consequatur officiis et officia repudiandae.
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

  changeLanguageDark: {
    backgroundColor: '#00babc',
    padding: 15,
    borderRadius: 4,
    marginRight: 90,
    marginLeft: 90,
    marginBottom: 10,

  },

  changeLanguageLight: {
    backgroundColor: '#00babc',
    padding: 15,
    borderRadius: 4,
    marginRight: 90,
    marginLeft: 90,
    marginBottom: 10,
  },

  changeThemeDark: {
    backgroundColor: '#00babc',
    padding: 15,
    borderRadius: 4,
    marginRight: 90,
    marginLeft: 90,
    marginBottom: 10,
  },

  changeThemeLight: {
    backgroundColor: '#00babc',
    padding: 15,
    borderRadius: 4,
    marginRight: 90,
    marginLeft: 90,
    marginBottom: 10,
  },

  creditsTitle:{
    fontFamily: 'FuturaNewBold',
    textAlign: 'center',
    textTransform: 'uppercase',
    fontSize: 16,
    marginBottom: 10,
    color: 'grey',
  },
  credits: {
    marginLeft: 40,
    marginRight : 40,
    textAlign:'center',
    color: 'grey',

  },
});
