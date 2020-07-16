import React from "react"
import ExpoPixi from 'expo-pixi'
import { FontAwesome } from '@expo/vector-icons'
import * as MediaLibrary from 'expo-media-library'

import {
  AppState,
  Image,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'

import moment from "moment"
import 'moment/locale/pt-br'
moment.locale('pt-BR')

const isAndroid = Platform.OS === 'android'
function uuidv4() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    var r = (Math.random() * 16) | 0,
      v = c == 'x' ? r : (r & 0x3) | 0x8
    return v.toString(16)
  })
}

export default class AddSign extends React.Component {
  constructor(props) {
    super(props)
  }

  state = {
    image: null,
    appState: AppState.currentState,
  }
  
  handleAppStateChangeAsync = nextAppState => {
    if (this.state.appState.match(/inactive|background/) && nextAppState === 'active') {
      if (isAndroid && this.sketch) {
        this.setState({ appState: nextAppState, id: uuidv4(), lines: this.sketch.lines })
        return
      }
    }
    this.setState({ appState: nextAppState })
  }

  UNSAFE_componentDidMount() {
    AppState.addEventListener('change', this.handleAppStateChangeAsync)
  }

  UNSAFE_componentWillUnmount() {
    AppState.removeEventListener('change', this.handleAppStateChangeAsync)
  }

  onChangeAsync = async () => {
    const { uri } = await this.sketch.takeSnapshotAsync({
      format: 'png',
      quality: 1,
      result: 'file'
    })

    this.setState({
      image: { uri },
    })
  }

  onReady = () => {
    // console.log('ready!')
  }

  saveCanvas = async () => {
    const file = await
      this.sketch.takeSnapshotAsync({
        format: 'png',
        quality: 1,
        result: 'file'
      })
      
    const asset = await MediaLibrary.createAssetAsync(file.uri)
    const dataAtual = moment().format('YYYYMMDD')
    const album = await MediaLibrary.getAlbumAsync(`FDC${dataAtual}`)

    // console.log('album', album)

    if (album === null) {
      MediaLibrary.createAlbumAsync(`FDC${dataAtual}`, asset, false)
      .then((res) => {
        // console.log('Album criado!')
        // console.log('Album:', res)
        this.props.close()
      })
      .catch(error => {
        // console.log('Erro ao Criar o Album', error)
      })
    } else {
      MediaLibrary.addAssetsToAlbumAsync(asset, album, false)
      .then((res) => {
        // console.log(`Foto Adicionada no Album FDC${dataAtual}!`)
        // console.log('Foto:', res)
        this.props.close()
      })
      .catch(error => {
        // console.log('Erro ao Adicionar a foto no Album', error)
      })
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.sketchview}>
          <View style={styles.sketchContainer}>
            <ExpoPixi.Sketch
              ref={ref => {
                this.sketch = ref
              }}
              style={{ flex: 1 }}
              strokeColor={0x000000}
              strokeWidth={20}
              strokeAlpha={1}
              onChange={this.onChangeAsync}
              onReady={this.onReady}
              initialLines={this.state.lines}
            />
            <View style={styles.label}>
              <Text>Assine aqui</Text>
            </View>
          </View>
          <View style={styles.imageContainer}>
            <View style={styles.label}>
              <Text>Pré-visualização</Text>
            </View>
            <Image style={{ flex: 1 }} source={this.state.image} />
          </View>
        </View>

        <View style={styles.buttonsView}>
          <View style={styles.captureButtonView}>
            <TouchableOpacity
              style={styles.sketchButtons}
              onPress={() => {
                this.sketch.undo()
              }}
            >
              <FontAwesome name="undo" size={23} color='#fff' />
            </TouchableOpacity>
          </View>
          <View style={styles.captureButtonView}>
            <TouchableOpacity
              style={styles.sketchButtons}
              onPress={this.saveCanvas}
            >
              <FontAwesome name="save" size={23} color='#fff' />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#225378",
    alignItems: "center",
    justifyContent: "flex-start",
    width: "100%",
    height: "100%",
  },
  sketchview: {
    width: "100%",
    height: "90%",
    backgroundColor: "white",
    borderRadius: 5,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 0,
  },
  sketchContainer: {
    width: '100%',
    height: '50%',
  },
  label: {
    width: '100%',
    padding: 5,
    alignItems: 'center',
  },
  imageContainer: {
    width: '100%',
    height: '50%',
    borderTopWidth: 4,
  },
  sketchButtons: {
    borderColor: "#fff",
    borderWidth: 2,
    padding: 10,
    borderRadius: 5,
    margin: 5,
  },
  captureButtonView: {
    height: 200,
    marginTop: 5,
  },
  buttonsView: {
    height: 200,
    width: "100%",
    flexDirection: "row",
    justifyContent: "center",
  },
  uploadedImage: {
    height: "50%",
    width: "100%",
    padding: 10,
    zIndex: 1,
  },
})
