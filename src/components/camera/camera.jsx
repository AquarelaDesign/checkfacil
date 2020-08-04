import React from "react"
import { Camera } from "expo-camera"
import { FontAwesome, FontAwesome5 } from '@expo/vector-icons'
import * as MediaLibrary from 'expo-media-library'

import {
  Image, 
  View,
  StyleSheet,
  Text,
  ToastAndroid,
  TouchableOpacity,
} from "react-native"

import moment from "moment"
import 'moment/locale/pt-br'
moment.locale('pt-BR')

export default class Foto extends React.Component {
  constructor(props) {
    super(props)
  }

  state = {
    hasCameraPermission: null,
    type: Camera.Constants.Type.back,
    imageuri: "",
    url: "",
    asset: null
  }

  async UNSAFE_componentWillMount() {
    const { status } = await Camera.requestPermissionsAsync()
    this.setState({ hasCameraPermission: status === "granted" })
  }

  UNSAFE_componentWillUnmount() {
    this.props.close()
  }

  cameraChange = () => {
    this.setState({
      imageuri: "",
      url: "",
      type:
        this.state.type === Camera.Constants.Type.back
          ? Camera.Constants.Type.front
          : Camera.Constants.Type.back
    })
  }

  snap = async () => {
    if (this.camera) {
      let photo = await this.camera.takePictureAsync()
      if (photo) {
        this.setState({ imageuri: photo.uri })
      }
    }
  }

  salvar = async () => {
    const file = {
      uri: this.state.imageuri,
      filename: `${new Date().getTime()}.jpg`,
      mediaType: MediaLibrary.MediaType.photo
    }

    const asset = await MediaLibrary.createAssetAsync(file.uri)
    const dataAtual = moment().format('YYYYMMDD')
    const album = await MediaLibrary.getAlbumAsync(`FDC${dataAtual}`)

    console.log('album', album)

    if (album === null) {
      MediaLibrary.createAlbumAsync(`FDC${dataAtual}`, asset, false)
      .then((res) => {
        console.log('Album criado!')
        console.log('Album:', res)
        this.props.close()
      })
      .catch(error => {
        console.log('Erro ao Criar o Album', error)
      })
    } else {
      MediaLibrary.addAssetsToAlbumAsync(asset, album, false)
      .then((res) => {

        ToastAndroid.showWithGravityAndOffset(
          "Imagem Adicionada no Album! Atualize a lista para visualizar.",
          ToastAndroid.LONG,
          ToastAndroid.TOP,
          25,
          50
        )
        
        // console.log(`Foto Adicionada no Album FDC${dataAtual}!`)
        // console.log('Foto:', res)
      })
      .catch(error => {
        ToastAndroid.showWithGravityAndOffset(
          "Erro ao adicionar a Imagem no Album!",
          ToastAndroid.LONG,
          ToastAndroid.TOP,
          25,
          50
        )
        // console.log('Erro ao Adicionar a foto no Album', error)
      })
    }
    return null
  }

  render() {
    const { hasCameraPermission } = this.state

    if (hasCameraPermission === null) {
      return <View />
    } else if (hasCameraPermission === false) {
      return (
        <View>
          <Text>No access to camera</Text>
        </View>
      )
    } else {
      return (
        <View style={styles.container}>
          <View style={styles.cameraview}>
            {this.state.imageuri != "" ? (
              <Image
                source={{
                  uri: this.state.imageuri
                }}
                style={styles.uploadedImage}
                resizeMode="cover"
              />
            ) : (
                <Camera
                  style={styles.camera}
                  type={this.state.type}
                  ref={ref => {
                    this.camera = ref
                  }}
                >
                </Camera>
            )}
          </View>

          <View style={styles.buttonsView}>
            {this.state.imageuri == "" ? (
              <>
                <View style={styles.captureButtonView}>
                  <TouchableOpacity 
                    style={styles.cameraButtons}
                    onPress={this.cameraChange}
                  >
                    <FontAwesome5 name="sync" size={23} color='#fff' />
                  </TouchableOpacity>
                </View>
                <View style={styles.captureButtonView}>
                  <TouchableOpacity
                    style={styles.cameraButtons}
                    onPress={this.snap}
                  >
                    <FontAwesome name="camera" size={23} color='#fff' />
                  </TouchableOpacity>
                </View>
              </>
            ) : (
            <View style={styles.captureButtonView}>
              <TouchableOpacity
                style={styles.cameraButtons}
                onPress={this.salvar}
              >
                <FontAwesome name="save" size={23} color='#fff' />
              </TouchableOpacity>
            </View>
            )}
          </View>
        </View> 
      )
    }
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
  cameraview: {
    width: "100%",
    height: "90%",
    backgroundColor: "white",
    borderRadius: 5,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 0,
  },
  camera: {
    flex: 1,
    width: "100%",
    backgroundColor: "white",
    borderRadius: 5,
    justifyContent: "flex-start",
    alignItems: "center",
  },
  camerabuttonview: {
    height: "100%",
    backgroundColor: "transparent",
  },
  cameraButtons: {
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
    height: "100%",
    width: "100%",
    padding: 10,
  }
})