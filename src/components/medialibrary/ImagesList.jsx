import React, { useState, useEffect } from 'react'
import * as MediaLibrary from 'expo-media-library'
import { FontAwesome } from '@expo/vector-icons'

import { 
  View, 
  StyleSheet, 
  Text, 
  FlatList, 
  Image, 
  TouchableOpacity,
  Dimensions,
} from 'react-native'

import folder from '../../assets/folder-pictures.png'

import moment from "moment"
import 'moment/locale/pt-br'
moment.locale('pt-BR')

const { width, height } = Dimensions.get('window')

const Colunas = 3
const _width = ((width - 20)  / Colunas)
const _height = _width * 1.2

function ImagesList() {
  const [ hasPermission, setHasPermission ] = useState(null)
  const [ isAlbum, setIsAlbum ] = useState(true)
  const [ album, setAlbum ] = useState(null)
  const [ albuns, setAlbuns ] = useState(null)
  const [ medias, setMedias ] = useState(null)
  const [ isFetching, setIsFetching ] = useState(false)

  useEffect(() => {
    console.log('isAlbum', isAlbum)
    if (isAlbum) {
      buscaAlbuns()
    } else {
      buscaMedias(album)
    }
  }, [])

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

        console.log('_album', _album)
        if (_album === null) {
          return null
        } else {
          const _medias = await MediaLibrary.getAssetsAsync({
            album: _album,
            sortBy: MediaLibrary.SortBy.creationTime,
          })

          console.log('medias', _medias)
          setMedias(_medias.assets)
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

  const retData = (texto) => {
    if (texto.length >= 11) {
      return `${texto.substr(9,2)}/${texto.substr(7,2)}/${texto.substr(3,4)}`
    } 
    return texto
  }

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
                </View>
              )}
            />
          }
        </View>
      )
    } else {
      return (
        <View style={styles.container}>
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
                  <Image style={styles.thumbnail} source={{ uri: item.uri }} />
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
})

export default ImagesList