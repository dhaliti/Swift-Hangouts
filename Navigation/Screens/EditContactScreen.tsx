import React from "react";
import { StyleSheet, Text, View } from "react-native";

const EditContactScreen = ({navigation, route}) => {
  return (
    <View style={style.general}>
    <Text style={style.title}>Edit Contact</Text>
    </View>
  );
};

export default EditContactScreen;


const style = StyleSheet.create({
  general: {
    backgroundColor: '#1A1919',
    flex: 1,
  },
  title: {
    fontSize: 40,
    fontWeight: 'bold',
    color: 'white',
    fontFamily: 'GoogleSansMedium',
  },
});
