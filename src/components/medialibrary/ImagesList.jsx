import React, { useState, useEffect, useContext } from 'react'
import * as MediaLibrary from 'expo-media-library'
import { FontAwesome, MaterialIcons } from '@expo/vector-icons'

import { 
  View, 
  StyleSheet, 
  Text, 
  FlatList, 
  Image, 
  TouchableOpacity,
  TouchableHighlight,
  Dimensions,
  Modal,
  // CheckBox,
} from 'react-native'

import CheckBox from '../CheckBox'
import { Context } from '../Store'

import folder from '../../assets/folder-pictures.png'

import moment from "moment"
import 'moment/locale/pt-br'
moment.locale('pt-BR')

const { width, height } = Dimensions.get('window')

const Colunas = 3
const _width = ((width - 20)  / Colunas)
const _height = _width * 1.2

function ImagesList({ route }) {
  const [ hasPermission, setHasPermission ] = useState(null)
  const [ isAlbum, setIsAlbum ] = useState(true)
  const [ album, setAlbum ] = useState(null)
  const [ albuns, setAlbuns ] = useState([])
  const [ medias, setMedias ] = useState([])
  const [ isFetching, setIsFetching ] = useState(false)
  const [ atualiza, setAtualiza ] = useState(route?.params?.atualiza ?  route.params.atualiza : false)
  
  const [ imageVisible, setImageVisible ] = useState(false)
  const [ contentImage, setContentImage ] = useState(null)

  const [ modalVisible, setModalVisible ] = useState(false)
  const [ tipo, setTipo ] = useState('')
  const [ contentItem, setContentItem ] = useState(null)
  
  const [state, dispatch] = useContext(Context)

  const sleep = ms => new Promise(resolve => setTimeout(resolve, ms))

  // console.log('*** Atualiza', atualiza,  route?.params?.atualiza ?  route.params.atualiza : false)

  useEffect(() => {
    try {
      // await sleep(5000)
      if (atualiza) {
        onRefresh()
      }
    }
    catch (e) {
      console.log('*** Deu Erro!!')
    }
  
    if (isAlbum) {
      setTipo('do Album')
      buscaAlbuns()
    } else {
      setTipo('da Imagem')
      buscaMedias(album)
    }
  }, [atualiza])

  const buscaAlbuns = () => {
    (async () => {
      try {
        const { status } = await MediaLibrary.requestPermissionsAsync()
        setHasPermission(status === "granted")
        setIsFetching(false)

        const _albuns = await MediaLibrary.getAlbumsAsync()

        let arrAlbuns = []
        _albuns.map(album => {
          if (album.title !== null) {
            if (album.title.startsWith('FDC')) {
              arrAlbuns.push(album)
            }
          }
        })
        setAlbuns(arrAlbuns)
      }
      catch (error) {
        console.log('error:', error)
      }
    })()
  }

  const buscaMedias = (Album) => {
    (async () => {
      try {
        const { status } = await MediaLibrary.requestPermissionsAsync()
        setHasPermission(status === "granted")
        setIsFetching(false)

        const _album = await MediaLibrary.getAlbumAsync(Album)

        if (_album === null) {
          return null
        } else {
          const _medias = await MediaLibrary.getAssetsAsync({
            album: _album,
            sortBy: MediaLibrary.SortBy.creationTime,
          })
          
          let tmpMedia = []
          _medias.assets.map(item => {
            let _item = {...item, checked: false}
            if (state.anexos) {
              state.anexos.map(anexo => {
                if (anexo.id === item.id) {
                  _item = {...item, checked: anexo.checked}
                  return
                }
              })
            }
            tmpMedia.push(_item)
          })
          setMedias(tmpMedia)
        }
      }
      catch (error) {
        console.log('error:', error)
      }
    })()
  }

  const openFolder = (Album) => {
    setAlbum(Album)
    buscaMedias(Album)
    setIsAlbum(false)
  }

  const onRefresh = () => {
    setIsFetching(true)
    if (isAlbum) {
      buscaAlbuns()
    } else {
      buscaMedias(album)
    }
  }

  const onDelete = async () => {
    if (isAlbum) {
      let _albuns = []
      _albuns.push(contentItem)
      const _medias = await MediaLibrary.deleteAlbumsAsync(_albuns, true)
    } else {
      let _assets = []
      const image = await MediaLibrary.getAssetInfoAsync(contentItem)
      _assets.push(image)
      const _medias = await MediaLibrary.removeAssetsFromAlbumAsync(_assets, contentItem.albumId)
      dispatch({type: 'REMOVE_ANEXO', payload: _item})
    }

    setContentItem(null)
    setIsFetching(true)
    onRefresh()
  }

  const retData = (texto) => {
    if (texto.length >= 11) {
      return `${texto.substr(9,2)}/${texto.substr(7,2)}/${texto.substr(3,4)}`
    } 
    return texto
  }

  const handleChange = async (e, itemID) => {
    let tmpMedia = []
    let _item = {}
    await medias.map(item => {
      if (item.id === itemID) {
        _item = {...item, checked: !item.checked}
        if (_item.checked){
          dispatch({type: 'ADD_ANEXO', payload: _item})
        } else {
          dispatch({type: 'REMOVE_ANEXO', payload: _item})
        }
      } else {
        _item = item
      }
      tmpMedia.push(_item)
    })
    setMedias(tmpMedia)
  }

  const viewImage = (item) => {
    setContentImage(item)
    setImageVisible(true)
  }

  const confModal = async (item) => {
    setContentItem(item)
    setModalVisible(true)
  }

  const ImagemModal = () => (
    <Modal
      animationType="slide"
      transparent={true}
      visible={imageVisible}
      onRequestClose={() => {
        // Alert.alert("Modal has been closed.");
      }}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalImageView}>
          {contentImage && <Image style={styles.imageView} source={{ uri: contentImage.uri }} />}

          <View style={styles.modalButtons} >
            <TouchableHighlight
              style={{ ...styles.naoButton, backgroundColor: "#2196F3" }}
              onPress={() => {
                setImageVisible(!imageVisible)
              }}
            >
              <Text style={styles.textStyle}>Fechar</Text>
            </TouchableHighlight>
          </View>
        </View>
      </View>
    </Modal>
  )
 
  const ViewModal = () => (
    <Modal
      animationType="slide"
      transparent={true}
      visible={modalVisible}
      onRequestClose={() => {
        // Alert.alert("Modal has been closed.");
      }}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <Text style={styles.modalText}>Confirma a Exclusão {tipo}?</Text>

          <View style={styles.modalButtons} >
            <TouchableHighlight
              style={{ ...styles.simButton, backgroundColor: "#2196F3" }}
              onPress={() => {
                // setConfirm(true)
                onDelete()
                setModalVisible(!modalVisible)
              }}
            >
              <Text style={styles.textStyle}>Sim</Text>
            </TouchableHighlight>

            <TouchableHighlight
              style={{ ...styles.naoButton, backgroundColor: "#2196F3" }}
              onPress={() => {
                // setConfirm(false)
                setModalVisible(!modalVisible)
              }}
            >
              <Text style={styles.textStyle}>Não</Text>
            </TouchableHighlight>
          </View>
        </View>
      </View>
    </Modal>
  )

  if (hasPermission === null) {
    return <View />
  } else if (hasPermission === false) {
    return (
      <View>
        <Text>Sem acesso a miblioteca de midias</Text>
      </View>
    )
  } else {
    if (isAlbum) {
      return (
        <View style={styles.container}>
          <ViewModal />
          {albuns &&
            <FlatList
              key={1}
              style={styles.list}
              data={albuns}
              keyExtractor={(item, index) => index.toString()}
              onRefresh={onRefresh}
              refreshing={isFetching}
              numColumns={Colunas}
              showsHorizontalScrollIndicator={false}
              renderItem={({ item }) => (
                <View style={styles.listItem} key={item.id}>
                  <TouchableOpacity onPress={() => openFolder(item.title)} style={styles.button}>
                    <Image style={styles.thumbnail} source={folder} />
                    <Text style={styles.data}>{retData(item.title)}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => confModal(item)} style={styles.delete}>
                    <MaterialIcons name="delete-forever" size={30} color="#f05a5b" />
                  </TouchableOpacity>
                  {/* Incluir Botao Excluir Folder float */}
                </View>
              )}
            />
          }
        </View>
      )
    } else {
      return (
        <View style={styles.container}>
          <ViewModal />
          <ImagemModal />
          <Text style={styles.titulo}>{retData(album)}</Text>
          <TouchableOpacity style={{ position: 'absolute', right: 10, marginTop: -30 }} onPress={() => {
            setIsAlbum(true)
            setAlbum(null)
          }}>
            <FontAwesome name="window-close" size={30} color="#000" />
          </TouchableOpacity>
          {albuns &&
            <FlatList
              key={2}
              style={styles.list}
              data={medias}
              keyExtractor={(item, index) => index.toString()}
              onRefresh={onRefresh}
              refreshing={isFetching}
              // horizontal
              numColumns={Colunas}
              showsHorizontalScrollIndicator={false}
              renderItem={({ item }) => (
                <View style={styles.listItem} key={item.id}>
                  {/* Incluir Botao Selecionar Arquivo float */}
                  <View style={styles.checkImage}>
                    <CheckBox
                      iconColor="#225378"
                      checkColor="#225378"
                      isChecked={item.checked}
                      onChange={(e) => handleChange(e, item.id)}
                    />
                  </View>
                  <TouchableOpacity onPress={() => viewImage(item)} style={styles.button}>
                    <Image style={styles.thumbnail} source={{ uri: item.uri }} />
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => confModal(item)} style={styles.deleteImage}>
                    <MaterialIcons name="delete-forever" size={30} color="#f05a5b" />
                  </TouchableOpacity>
                </View>
              )}
            />
          }
        </View>
      )
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 30,
    width: width,
    height: height,
    paddingBottom: 5,
  },
  list: {
    width: width,
    paddingHorizontal: 10,
  },
  listItem: {
    marginBottom: 15,
    alignItems: 'center',
  },
  thumbnail: {
    width: _width,
    height: _height,
    resizeMode: 'contain',
    borderRadius: 2,
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
  bold: {
    fontWeight: 'bold',
  },
  data: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 10,
  },
  price: {
    fontSize: 15,
    color: '#999',
    marginTop: 5,
  },

  button: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 15,
  },
  delete: {
    flex: 1,
    position: 'absolute',
    right: 5,
    bottom: 30,
  },
  deleteImage: {
    flex: 1,
    position: 'absolute',
    right: 2,
    bottom: 2,
  },
  checkImage: {
    flex: 1,
    position: 'absolute',
    top: 5,
    left: 8,
    zIndex: 10,
  },
  select: {
    position: 'absolute',
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
  },

  modalImageView: {
    margin: 10,
    backgroundColor: "white",
    borderRadius: 5,
    padding: 5,
    paddingBottom: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    height: height - 80,
  },
  
  imageView: {
    // width: _width,
    // height: _height,
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
    borderRadius: 2,
  },

  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 5,
    padding: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    height: 130,
  },
  modalButtons: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
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

export default ImagesList