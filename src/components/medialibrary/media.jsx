import React from 'react'
import * as MediaLibrary from 'expo-media-library'
import { Button, View, } from 'react-native'

import ImagesList from './ImagesList'

export default class Media extends React.Component {
  state = {
    hasPermission: null,
    medias: null,
  }
  
  async UNSAFE_componentWillMount() {
    const { status } = await MediaLibrary.requestPermissionsAsync()
    this.setState({ hasPermission: status === "granted" })
    this.mediaLibraryAsync()
  }

  mediaLibraryAsync = async () => {
    try {
      const album = await MediaLibrary.getAlbumAsync('FDC')
      if (album === null) {
        return null
      } else {
        const medias = await MediaLibrary.getAssetsAsync({
          album: album,
          sortBy: MediaLibrary.SortBy.creationTime,
        })
        this.setState({ medias: medias.assets })
      }
    }
    catch (error) {
      console.log('error:', error)
    }
  }

  render() {
    const { hasPermission, medias } = this.state

    if (hasPermission === null) {
      return <View />
    } else if (hasPermission === false) {
      return (
        <View>
          <Text>Sem acesso a miblioteca de midias</Text>
        </View>
      )
    } else {
      return (
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <ImagesList medias={medias}/>
          {/* <Button
            onPress={this.mediaLibraryAsync}
            title="Do MediaLibrary Stuff"
          /> */}
        </View>
      )
    }
  }
}