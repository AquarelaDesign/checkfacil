import React, { useState, useEffect, useRef } from 'react'
import { 
  Image, 
  Text, 
  View, 
  Modal, 
  TouchableOpacity ,
  StyleSheet,
} from 'react-native'
import { Camera } from "expo-camera"
import { FontAwesome } from '@expo/vector-icons'

export default Foto = () => {
  const camRef = useRef(null);
  const [type, setType] = useState(Camera.Constants.Type.back);
  const [hasPermission, sethasPermission] = useState(null);
  const [fotoCapturada, setFotoCapturada] = useState(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestPermissionsAsync()
      sethasPermission(status === 'granted')
    })()
  }, [])

  if (hasPermission === null) {
    return <View />
  }

  if (hasPermission === false) {
    return <Text>Acesso a camera negado</Text>
  }

  async function takePicture() {
    if (camRef) {
      const data = await camRef.current.takePictureAsync();
      setFotoCapturada(data.uri);
      setOpen(true);
      console.log(data);
    }

  }

  return (
    <View style={styles.container}>
      <Camera style={{ flex: 1, width: '100%', height: 400 }}
        type={type}
        ref={camRef}
      >
        <View style={{ flex: 1, backgroundColor: 'transparent', flexdirection: 'row' }}>
          <TouchableOpacity
            style={{
              flex: 0.1,
              alignSelf: 'flex-end',
              alignItems: 'center',

            }}
            onPress={() => {
              setType(
                type === Camera.Constants.Type.back
                  ? Camera.Constants.Type.front
                  : Camera.Constants.Type.back
              );
            }}
          >
            <Text style={{ fontSize: 30, marginBottom: 13, color: "#fff" }}>Inverter</Text>

          </TouchableOpacity>
        </View>
      </Camera>

      <TouchableOpacity style={styles.button} onPress={takePicture}>
        <FontAwesome name="camera" size={23} color='#fff' />
      </TouchableOpacity>

      {fotoCapturada &&
        <Modal
          animationType="slide"
          transparent={false}
          visible={open}
        >
          <View style={{ felx: 1, justifyContent: 'center', alignItems: 'center', margin: 20 }}>

            <TouchableOpacity style={{ margin: 10 }} onPress={() => setOpen(false)}>
              <FontAwesome name="window-close" size={50} color="#FF0000" />
            </TouchableOpacity>

            <Image
              style={{ width: '100%', height: 300, borderRadius: 20 }}
              source={{ uri: fotoCapturada }}
            />
          </View>
        </Modal>
      }
    </View>

  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: '#fff',
    // alignItems: 'center',
    // justifyContent: 'center',
  },
  button:{
    justifyContent:'center',
    alignItems: 'center',
    backgroundColor: '#121212',
    margin: 20,
    borderRadius: 10,
    height: 50,
    width: 50,
  }
})
