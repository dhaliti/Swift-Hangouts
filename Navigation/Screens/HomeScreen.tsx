import React, { useEffect, useState } from "react";
import {Text} from 'react-native';
import SQLite from "react-native-sqlite-storage";

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

const HomeScreen = ({route, navigation}) => {

  let init: any = [];
  const [contacts, setContacts] = useState([]);

  function test() {
    console.log(init);
    navigation.navigate('Contacts', {init});
  }

  async function getData() {
    await db.transaction(async tx => {
      tx.executeSql('SELECT * FROM Contact', [], (tx, result) => {
        for (let i = 0; i < result.rows.length; i++) {
          init = [...init, result.rows.item(i)];
        }
        console.log('beforeTest');
        test();
      });
    });
  }



  useEffect(() => {
    return () => {
      createTable();
      getData();
    };
  }, );


/*  useEffect(() => {
    return () => {
      createTable();
    };
  }, []);*/

  async function createTable() {
    await db.transaction(async tx => {
      await tx.executeSql(
        'CREATE TABLE IF NOT EXISTS Contact (id INTEGER PRIMARY KEY AUTOINCREMENT, name VARCHAR(30), surname VARCHAR(30), phone_number VARCHAR(30), email VARCHAR(30));',
        [],
        (tx, result) => {
          console.log('table ' + result);
        },
      );
    });
  }



  return <Text style={{color: 'white'}}>Home Screen</Text>;
};

export default HomeScreen;
