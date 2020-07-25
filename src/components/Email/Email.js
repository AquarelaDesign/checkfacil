import React, { useState, useEffect, useContext } from 'react'

import {
  Button,
  Dimensions,
  FlatList,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native'

import * as MailComposer from 'expo-mail-composer'
import UUIDGenerator from 'react-native-uuid-generator'
import { Context } from '../Store'

const { width, height } = Dimensions.get('window')

const Colunas = 3
const _width = ((width - 20) / Colunas)
const _height = _width * 1.2

function Email() {
  const [state, dispatch] = useContext(Context)

  const [email, setEmail] = useState('')
  const [cc, setCc] = useState('')
  const [cco, setCco] = useState('')
  const [assunto, setAssunto] = useState('')
  const [conteudo, setConteudo] = useState('')
  const [eanexos, setEanexos] = useState([])
  const [aanexos, setAanexos] = useState([])

  useEffect(() => {
    if (state.anexos) {
      let aAnexos = []
      state.anexos.map(anexo => {
        aAnexos.push(anexo.uri)
      })
      setEanexos(aAnexos)
      setAanexos(state.anexos)
      // console.log('*** Anexos', aanexos)
    }
  }, [state])

  async function sendEmailAsync() {
    
    const _recipients = email.split(';')
    const _ccRecipients = cc.split(';')
    const _bccRecipients = cco.split(';')

    let result = await MailComposer.composeAsync({
      recipients: _recipients,
      ccRecipients: _ccRecipients,
      bccRecipients: _bccRecipients,
      subject: `[Check Fácil] ${assunto}`,
      body: `${conteudo} <br/><br/>Email enviado pelo Check Fácil - <a href="https://fichadocarro.com.br/">https://fichadocarro.com.br</a>`,
      attachments: eanexos,
      isHtml: true,
    })

    if (result.status === 'sent') {
      dispatch({type: 'SET_ANEXO', payload: []})
      setEmail('')
      setCc('')
      setCco('')
      setAssunto('')
      setConteudo('')
      setEanexos([])
      setAanexos([])
      alert('Email enviado com sucesso!')
    } else {
      if (result.status === 'cancelled') {
        alert('Email Cancelado!')
      } else {
        alert('Maiores informações no Aplicativo de envio!')
      }
    }
  }

  const uuid = (item) => {
    let _uuid = ''
    UUIDGenerator.getRandomUUID().then((uuid) => {
      _uuid = uuid
    })
    if (_uuid) {
      console.log('*** _uuid', _uuid)
    } else {
      console.log('*** item.id', item.id)
    }
    return item.id
  }


  return (
    <View style={styles.container}>
      <ScrollView style={styles.fragment}>
        <TextInput
          style={styles.input}
          placeholder="Para:"
          placeholderTextColor="#444"
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
          value={email}
          onChangeText={setEmail}
        />

        <TextInput
          style={styles.input}
          placeholder="Cc:"
          placeholderTextColor="#444"
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
          value={cc}
          onChangeText={setCc}
        />

        <TextInput
          style={styles.input}
          placeholder="Cco:"
          placeholderTextColor="#444"
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
          value={cco}
          onChangeText={setCco}
        />

        <TextInput
          style={styles.input}
          placeholder="Assunto:"
          placeholderTextColor="#444"
          keyboardType="default"
          autoCapitalize="none"
          autoCorrect={false}
          value={assunto}
          onChangeText={setAssunto}
        />

        <TextInput
          style={styles.multiinput}
          multiline
          scrollEnabled
          numberOfLines={20}
          // placeholder="Assunto:"
          placeholderTextColor="#444"
          keyboardType="default"
          autoCapitalize="none"
          autoCorrect={false}
          value={conteudo}
          onChangeText={setConteudo}
        />

        <FlatList
          style={styles.list}
          data={aanexos}
          keyExtractor={anexo => anexo.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          renderItem={({ item }) => (
            <View style={styles.listItem}>
              <Image style={styles.thumbnail} source={{ uri: item.uri }} />
            </View>
          )}
        />
        {/* 
        <View style={styles.list}>
          {state.anexos &&
            state.anexos.map(anexo => {
              return (
                <View key={anexo.id} style={styles.listItem}>
                  <Text style={styles.listItem}>{anexo.id}</Text>
                </View>
              )
            })}
        </View>
         */}
        <View style={styles.modalButtons}>
          <Button title="Enviar" onPress={sendEmailAsync} />
        </View>
      </ScrollView>
    </View>
  )

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    margin: 10,
    width: width - 20,
    height: height - 20,
    // paddingBottom: 5,
  },
  fragment: {
    marginTop: 10,
    marginRight: 10,
    borderTopWidth: 0,
  },

  list: {
    // paddingHorizontal: 10,
  },
  listItem: {
    marginBottom: 15,
    alignItems: 'center',
  },
  thumbnail: {
    width: 90,
    height: 120,
    resizeMode: 'contain',
    borderRadius: 2,
    marginRight: 5,
  },
  titulo: {
    position: 'absolute',
    left: 10,
    marginTop: -30,
    fontSize: 18,
    fontStyle: 'italic',
    color: '#225378',
    paddingHorizontal: 20,
    marginBottom: 15,
  },

  label: {
    color: '#363636',
    fontWeight: 'bold',
    justifyContent: 'center',
    marginBottom: 4,
  },
  input: {
    borderWidth: 1,
    borderColor: '#CCC',
    // borderBottomColor: '#444',
    borderTopWidth: 0,
    borderBottomWidth: 1,
    borderLeftWidth: 0,
    borderRightWidth: 0,
    borderRadius: 5,
    paddingHorizontal: 10,
    fontSize: 16,
    color: '#444',
    backgroundColor: '#FdFdFd',
    height: 35,
    marginBottom: 5,
  },
  multiinput: {
    textAlignVertical: 'top',
    borderWidth: 1,
    borderColor: '#CCC',
    borderRadius: 5,
    padding: 10,
    fontSize: 16,
    color: '#444',
    backgroundColor: '#FdFdFd',
    height: 200,
    marginBottom: 5,
  },

  modalButtons: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 10,
  },
  simButton: {
    // backgroundColor: "#F194FF",
    borderRadius: 5,
    padding: 5,
    elevation: 2,
    width: 100,
    marginRight: 30,
  },
  naoButton: {
    // backgroundColor: "#F194FF",
    borderRadius: 5,
    padding: 5,
    elevation: 2,
    width: 100,
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center"
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center"
  }

})

export default Email