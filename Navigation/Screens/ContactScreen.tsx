import React, {useEffect, useState} from 'react';
import {
  Button,
  FlatList,
  Text,
  View,
  Pressable,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import SQLite from 'react-native-sqlite-storage';
import {useIsFocused} from '@react-navigation/native';
import {useFocusEffect} from '@react-navigation/native';

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
  const [table, setTable] = useState(false);
  const isFocused = useIsFocused();

  let init: any = [];

  /*  useFocusEffect(() => {
      console.log('AG');
      getData();
    return () => {
    };
  });*/

  useEffect(() => {
    return () => {
      if (table == false) {
        createTable();
      }
      getData();
    };
  }, [isFocused]);

  function test() {
    setContacts(init);
  }

  async function getData() {
    await db.transaction(async tx => {
      tx.executeSql('SELECT * FROM Contact', [], (tx, result) => {
        for (let i = 0; i < result.rows.length; i++) {
          init = [...init, result.rows.item(i)];
        }
        test();
      });
    });
  }

  async function dropTable() {
    await db.transaction(async tx => {
      await tx.executeSql('DROP TABLE Contact');
    });
  }

  async function createTable() {
    await db.transaction(async tx => {
      await tx.executeSql(
        'CREATE TABLE IF NOT EXISTS Contact (id INTEGER PRIMARY KEY AUTOINCREMENT, name VARCHAR(30), surname VARCHAR(30), phone_number VARCHAR(30), email VARCHAR(30));',
        [],
        (tx, result) => {
          console.log('table ' + result);
          setTable(true);
        },
      );
    });
  }

  async function testContact() {
    await db.transaction(async tx => {
      console.log('testContact — begining');
      tx.executeSql(
        'INSERT INTO Contact (name, surname, phone_number, email ) VALUES ("damir", "haliti", "0649815966", "damirhaliti@yahoo.fr")',
        [],
        (tx, result) => {
          console.log('Inserted' + result);
        },
      );
    });
    navigation.navigate('Home');
  }

  async function testContact2() {
    await db.transaction(async tx => {
      console.log('testContact2 — begining');
      tx.executeSql(
        'INSERT INTO Contact (name, surname, phone_number, email ) VALUES ("maria", "shvetsova", "0123456789", "mariechvetsov@yahoo.fr")',
        [],
        (tx, result) => {
          console.log('Inserted2' + result);
        },
      );
    });
    navigation.navigate('Home');
  }

  const goToSettings = () => navigation.navigate('Settings');

  const addContact = () => navigation.navigate('AddContactScreen');

  return (
    <View style={style.general}>
      <View
        style={{
          display: 'flex',
          flexDirection: 'row',
        }}>
        <Text style={style.title}>Contacts</Text>
      </View>
      <FlatList
        data={contacts}
        renderItem={({item}) => (

            <TouchableOpacity
              style={style.listElement}
              onPress={() => navigation.navigate('ContactDetails', item)}>
              <View style={{
                display: 'flex',
                flexDirection: 'row'
              }}>
              <Text style={style.initials}>
                {item.name.charAt(0).toUpperCase()}{' '}
                {item.surname.charAt(0).toUpperCase()}
              </Text>
              <Text style={style.listText}>
                {item.name.charAt(0).toUpperCase()}
                {item.name.slice(1)} {item.surname.charAt(0).toUpperCase()}
                {item.surname.slice(1)}
              </Text>
              </View>
            </TouchableOpacity>
        )}
      />
      {/*<View*/}
      {/*  style={{*/}
      {/*    justifyContent: 'flex-end',*/}
      {/*    alignItems: 'flex-end',*/}
      {/*  }}>*/}
      {/*</View>*/}

      {/*<View style={{bottom: 50, right: 10, zIndex: 500}}>*/}
      <Pressable style={style.addButton} onPress={addContact}>
        <Text style={style.plusSign}>+</Text>
      </Pressable>
      {/*</View>*/}
      {/*   <Button title="Go to Settings" onPress={goToSettings} />
      <Button title={'Test Contact'} onPress={testContact} />
      <Button title={'Test Contact 2'} onPress={testContact2} />
*/}
      {/*<Button title={'Drop Table'} onPress={dropTable} />*/}
    </View>
  );
};

const style = StyleSheet.create({
  general: {
    backgroundColor: '#1A1919',
    flex: 1,
  },
  title: {
    fontSize: 40,
    color: 'white',
    fontFamily: 'FuturaNewBold',
    padding: 30,
  },
  listElement: {
    borderBottomWidth: 0.5,
    borderBottomColor: 'white',
    marginBottom: 5,
    marginLeft: 20,
    marginRight: 20,
    fontWeight: 'bold',
    //height: 50,
    alignSelf: 'auto',
    padding: 12,
  },
  listText: {
    color: 'white',
    textAlignVertical: 'auto',
    fontSize: 16,
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
  initials: {
    width: 40,
    height: 40,
    textAlign: 'center',
    textAlignVertical: 'center',
    fontSize: 14,
    fontFamily: 'FuturaNewBold',
    borderRadius: 100,
    color: 'white',
    borderColor: 'white',
    borderWidth: 1,
    // marginTop: 100,
    // marginBottom: 20,
    bottom: 5,
    marginRight: 15,
 //   left: 10,
  },
});

export default ContactScreen;
function then(
  arg0: (r: any) => void,
): SQLite.TransactionErrorCallback | undefined {
  throw new Error('Function not implemented.');
}
