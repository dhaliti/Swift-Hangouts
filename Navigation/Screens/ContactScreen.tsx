import React, {useEffect, useRef, useState} from 'react';
import {
  Button,
  FlatList,
  Text,
  View,
  Pressable,
  TouchableOpacity,
  StyleSheet,
  Image,
  AppState,
  Alert,
} from 'react-native';
import SQLite from 'react-native-sqlite-storage';
import {useFocusEffect, useIsFocused} from '@react-navigation/native';
import {PermissionsAndroid} from 'react-native';
import BackgroundTimer from 'react-native-background-timer';

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

const ContactScreen = ({navigation, route}) => {
  const [contacts, setContacts] = useState([]);
  const [language, setLanguage] = useState(
    route.params ? route.params.language : 'en',
  );
  const [theme, setTheme] = useState(
    route.params ? route.params.theme : 'dark',
  );
  const isFocused = useIsFocused();
  const [seconds, setSeconds] = useState(0);
  const appState = useRef(AppState.currentState);
  const [appStateVisible, setAppStateVisible] = useState(appState.current);

  let init: any = [];
  let startTimer: any;
  let newSeconds = 0;

  useFocusEffect(
    React.useCallback(() => {
      console.log('callback');
      requestContactsPermissionWrite().then(() => {
        requestContactsPermissionRead().then(() => {
          getData();
          createTable();
          createPref();
          getPref();
        });
      });
      return () => console.log('Contacts');
    }, [isFocused]),
  );

  useEffect(() => {
    getPref();
    const subscription = AppState.addEventListener('change', nextAppState => {
      if (appState.current.match('active') && nextAppState === 'background') {
        console.log('start');
        newSeconds = 0;
        startCount();
      } else if (
        appState.current.match('background') &&
        nextAppState === 'active'
      ) {
        getPref();
        endTimer();
      }
      appState.current = nextAppState;
      setAppStateVisible(appState.current);
    });
    return () => {
      console.log('Timer');
      subscription.remove();
    };
  }, [isFocused]);

  async function stopTimer() {
    BackgroundTimer.stopBackgroundTimer();
    BackgroundTimer.clearInterval(startTimer);
    await getPref();
  }

  async function endTimer() {
    await resetTimer();
  }

  async function resetTimer() {
    console.log('stop');
    await stopTimer();
    Alert.alert('Toast', newSeconds + ' seconds');
    newSeconds = 0;
  }

  function startCount() {
    startTimer = BackgroundTimer.runBackgroundTimer(() => {
      console.log(newSeconds);
      newSeconds++;
    }, 1000);
  }

  async function requestContactsPermissionWrite() {
    const granted = await PermissionsAndroid.requestMultiple([
      PermissionsAndroid.PERMISSIONS.WRITE_CONTACTS,
      PermissionsAndroid.PERMISSIONS.READ_CONTACTS,
    ]);
  }

  async function requestContactsPermissionRead() {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.WRITE_CONTACTS,
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
  async function getData() {
    await db.transaction(async tx => {
      tx.executeSql('SELECT * FROM Contact', [], (tx, result) => {
        for (let i = 0; i < result.rows.length; i++) {
          init = [...init, result.rows.item(i)];
        }
        setContacts(init);
        console.log(result.rows.item(0));
      });
    });
  }

  async function dropTable() {
    await db.transaction(async tx => {
      await tx.executeSql('DROP TABLE Contact');
    });
  }

  async function createPref() {
    await db.transaction(async tx => {
      await tx.executeSql(
        'CREATE TABLE IF NOT EXISTS Preferences (id INTEGER PRIMARY KEY AUTOINCREMENT, language VARCHAR(10), theme VARCHAR(10));',
        [],
        (tx, result) => {
          console.log('Create Preferences');
        },
      );
    });
    await db.transaction(async tx => {
      await tx.executeSql(
        'INSERT INTO Preferences (language, theme) VALUES ("en", "dark");',
        [],
        (tx, result) => {
          console.log('Inserted Preferences');
        },
      );
    });
  }

  async function createTable() {
    await db.transaction(async tx => {
      await tx.executeSql(
        'CREATE TABLE IF NOT EXISTS Contact (id INTEGER PRIMARY KEY AUTOINCREMENT, name VARCHAR(30), surname VARCHAR(30), phone_number VARCHAR(30),  email VARCHAR(30), student INTEGER);',
        [],
        (tx, result) => {
          console.log('Create Contact ' + result);
        },
      );
    });
  }

  const goToSettings = () =>
    navigation.navigate('Settings', {theme: theme, language: language});

  const addContact = () =>
    navigation.navigate('AddContactScreen', {theme: theme, language: language});

  return (
    <View style={theme == 'light' ? style.generalLight : style.generalDark}>
      <View style={theme == 'dark' ? style.headerDark : style.headerLight}>
        <Text style={theme == 'light' ? style.titleLight : style.titleDark}>
          Contacts
        </Text>
        <TouchableOpacity
          style={{
            justifyContent: 'center',
          }}
          onPress={goToSettings}>
          <Image
            style={{
              width: 27,
              height: 27,
              marginRight: 30,
            }}
            source={require('../../images/settings.png')}
          />
        </TouchableOpacity>
      </View>
      <FlatList
        data={contacts}
        renderItem={({item}) => (
          <TouchableOpacity
            style={
              theme == 'light' ? style.listElementLight : style.listElementDark
            }
            onPress={() =>
              navigation.navigate(
                'ContactDetails',
                Object.assign(item, {theme: theme, language: language}),
              )
            }>
            <View
              style={{
                display: 'flex',
                flexDirection: 'row',
              }}>
              <Image
                style={
                  theme == 'light' ? style.initialsLight : style.initialsDark
                }
                source={
                  item.student == 0
                    ? require('../../images/42profile.png')
                    : require('../../images/default_profile.png')
                }
              />
              <Text
                style={
                  theme == 'light' ? style.listTextLight : style.listTextDark
                }>
                {item.name.charAt(0).toUpperCase()}
                {item.name.slice(1)} {item.surname.charAt(0).toUpperCase()}
                {item.surname.slice(1)}
              </Text>
            </View>
          </TouchableOpacity>
        )}
      />
      <Pressable style={style.addButton} onPress={addContact}>
        <Text style={style.plusSign}>+</Text>
      </Pressable>
      <Button title={'Drop Table'} onPress={dropTable} />
    </View>
  );
};

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
    marginBottom: 20,
    justifyContent: 'space-between',
    elevation: 10,
  },

  headerLight: {
    display: 'flex',
    flexDirection: 'row',
    height: 90,
    backgroundColor: '#00babc',
    marginBottom: 20,
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

  listElementDark: {
    borderBottomWidth: 1,
    borderBottomColor: 'black',
    marginBottom: 5,
    marginLeft: 20,
    marginRight: 20,
    alignSelf: 'auto',
    padding: 12,
  },

  listElementLight: {
    borderBottomWidth: 1,
    borderBottomColor: 'black',
    marginBottom: 5,
    marginLeft: 20,
    marginRight: 20,
    alignSelf: 'auto',
    padding: 12,
  },

  listTextDark: {
    color: 'black',
    textAlignVertical: 'auto',
    padding: 5,
    fontFamily: 'FuturaNewBook',
    fontSize: 18,
  },

  listTextLight: {
    color: 'black',
    textAlignVertical: 'auto',
    padding: 5,
    fontFamily: 'FuturaNewMedium',
    fontSize: 18,
  },

  addButton: {
    width: 75,
    height: 75,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
    borderRadius: 100,
    backgroundColor: '#00babc',
    marginRight: 20,
    shadowOffset: {width: 5, height: 5},
    shadowColor: '#000000',
    shadowOpacity: 0.1,
    shadowRadius: 1,
    elevation: 20,
    alignSelf: 'flex-end',
    bottom: 25,
    right: 15,
    position: 'absolute',
  },
  plusSign: {
    color: 'white',
    fontSize: 40,
    alignSelf: 'center',
    fontWeight: '300',
    shadowRadius: 20,
  },

  initialsDark: {
    width: 40,
    height: 40,
    textAlign: 'center',
    textAlignVertical: 'center',
    fontSize: 14,
    fontFamily: 'FuturaNewBold',
    borderRadius: 100,
    color: 'white',
    borderColor: 'black',
    borderWidth: 1,
    bottom: 5,
    marginRight: 15,
  },

  initialsLight: {
    width: 40,
    height: 40,
    textAlign: 'center',
    textAlignVertical: 'center',
    fontSize: 14,
    fontFamily: 'FuturaNewBold',
    borderRadius: 100,
    color: 'black',
    borderColor: 'black',
    borderWidth: 2,
    bottom: 5,
    marginRight: 15,
  },
});

export default ContactScreen;
function then(
  arg0: (r: any) => void,
): SQLite.TransactionErrorCallback | undefined {
  throw new Error('Function not implemented.');
}
