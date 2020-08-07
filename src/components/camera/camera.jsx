import React from "react"
import { Camera } from "expo-camera"
import { FontAwesome, FontAwesome5 } from '@expo/vector-icons'

import * as MediaLibrary from 'expo-media-library'
import * as ImageManipulator from "expo-image-manipulator"
// import * as FileSystem from 'expo-file-system'

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

  abortController = new AbortController()

  async UNSAFE_componentWillMount() {
    const { status } = await Camera.requestPermissionsAsync()
    this.setState({ hasCameraPermission: status === "granted" })
  }

  UNSAFE_componentWillUnmount() {
    this.abortController.abort()
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
      // console.log('**** Ratio', this.camera.getSupportedRatiosAsync())
      // console.log('**** Size', this.camera.getAvailablePictureSizesAsync())
      let photo = await this.camera.takePictureAsync({ quality: 0.2, skipProcessing: true })
      if (photo) {
        this.setState({ imageuri: photo.uri })
      }
    }
  }

  salvar = async () => {
    const file = {
      uri: this.state.imageuri,
      filename: `${new Date().getTime()}.png`,
      mediaType: MediaLibrary.MediaType.photo
    }

    const asset = await MediaLibrary.createAssetAsync(file.uri)
    const dataAtual = moment().format('YYYYMMDD')
    const album = await MediaLibrary.getAlbumAsync(`FDC${dataAtual}`)

    // console.log('album', album)

    if (album === null) {
      // console.log('**** asset-1', asset)

      MediaLibrary.createAlbumAsync(`FDC${dataAtual}`, asset, false)
      .then((res) => {
        // console.log('Album criado!')
        // console.log('Album:', res)
        this.props.close()
      })
      .catch(error => {
        console.log('Erro ao Criar o Album', error)
      })
    } else {

      /*
      console.log('**** asset-2', asset)

      const newImageUri = await this.ajustaImage(asset.uri)
      const imageUri = `${FileSystem.documentDirectory}${album.title}/${file.filename}`

      console.log('**** asset.uri', asset.uri)

      FileSystem.copyAsync({
        from: newImageUri,
        to: imageUri,
      })

      asset['uri'] = imageUri
      asset['filename'] = file.filename

      console.log('**** newImage', asset)
      console.log('**** album', album)
      // console.log('**** documentDirectory', FileSystem.documentDirectory)
      // console.log('**** cacheDirectory', FileSystem.cacheDirectory)
      */

      MediaLibrary.addAssetsToAlbumAsync(asset, album, false)
      .then((res) => {

        ToastAndroid.showWithGravityAndOffset(
          "Imagem Salva!",
          ToastAndroid.LONG,
          ToastAndroid.TOP,
          25,
          50
        )
        this.props.close()
        
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

  ajustaImage = async (imageUri) => {
    try {
      const manipResult = await ImageManipulator.manipulateAsync(
        imageUri,
        [{resize: {width: 800}}],
        { compress: 0.2, format: ImageManipulator.SaveFormat.PNG }
      )
      return manipResult.uri
    }
    catch (e) {
      console.log('**** ajustaImage e', e)
      return imageUri
    }
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