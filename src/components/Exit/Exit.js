import React from 'react'

import {
  AsyncStorage, 
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native'

import {
  Avatar,
  Text,
  Title,
} from 'react-native-paper'

import logo from '../../assets/icon.png'
// import Entypo from 'react-native-vector-icons/Entypo'
import AwesomeIcon from 'react-native-vector-icons/FontAwesome'
import FeatherIcon from 'react-native-vector-icons/Feather'
import SimpleIcon from 'react-native-vector-icons/SimpleLineIcons'
import MaterialIcon from 'react-native-vector-icons/MaterialCommunityIcons'

export default function Exit({ navigation }) {

  const Sair = () => {
    AsyncStorage.setItem('Autorizado', '')
    navigation.navigate('Login')
  }

  return (
    <View style={styles.content}>
      <Avatar.Image source={logo} size={80} />
      <Title style={styles.title}>Check Fácil</Title>
      <Text style={styles.row}>atendimento@procyon.com.br</Text>

      <Text style={styles.row}>
        <AwesomeIcon size={24} name="globe" /> fichadocarro.com.br
        </Text>

      <Text style={styles.row}>
        <FeatherIcon size={24} name="phone-call" /> +55 (41) 3311-6747
        </Text>

      <Text style={styles.row}>
        <SimpleIcon size={24} name="support" /> +55 (41) 3311-6756
        </Text>

      <Text style={styles.row}>
        <FeatherIcon size={24} name="headphones" /> +55 (41) 3311-6754
        </Text>

      <TouchableOpacity 
        style={[styles.row, styles.buttom]} 
        onPress={Sair}
      >
        <MaterialIcon name="exit-to-app" size={30} color="#000" />
        <Text> Sair </Text>
      </TouchableOpacity>

    </View>
  )
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    margin: 20,
    marginTop: 60,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontWeight: 'bold',
    fontSize: 22,
    marginTop: 10,
  },
  row: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 5,
    fontSize: 18,
  },
  buttom: {
    marginTop: 10, 
    marginBottom: 40, 
    backgroundColor: '#87CEEB',
    color: '#F8FCF8',
    borderRadius: 5,
    width: 150,
  },

})
