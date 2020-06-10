import React, { useState } from 'react'
import color from 'color'

import {
  StyleSheet,
  Modal,
  View, 
  TouchableOpacity ,
} from 'react-native'

import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs'
import { useTheme, Portal, FAB, Caption } from 'react-native-paper'
import { useSafeArea } from 'react-native-safe-area-context'
import { useIsFocused, RouteProp } from '@react-navigation/native'
import { FontAwesome } from '@expo/vector-icons'

import overlay from './overlay'
import Foto from './camera'
// import { Message } from './message'
// import { Albuns } from './albuns'

// const Foto = () => {
//   return <Caption style={styles.centerText}>
//     Foto...
//   </Caption>
// }

const Message = () => {
  return <Caption style={styles.centerText}>
    Mensagem...
  </Caption>
}

const Albuns = () => {
  return <Caption style={styles.centerText}>
    Albuns...
  </Caption>
}

const Tab = createMaterialBottomTabNavigator()

export const BottomTabs = (props) => {
  const [camera, setCamera] = useState(null)
  const [open, setOpen] = useState(false)

  const routeName = props.route.state
    ? props.route.state.routes[props.route.state.index].name
    : 'Albuns'

  const theme = useTheme()
  const safeArea = useSafeArea()
  const isFocused = useIsFocused()

  let icon = 'file-send'

  switch (routeName) {
    // case 'Foto':
    //   icon = 'image-filter-center-focus'
    //   break
    case 'Albuns':
      icon = 'image-filter-center-focus'
      break
    case 'Messages':
      icon = 'file-send'
      break
    default:
      icon = 'file-send'
      break
  }

  const btnAction = () => {

    if (routeName === 'Albuns') {
      setOpen(true)
      return      
    }

    alert(routeName)
  }

  const tabBarColor = theme.dark
    ? overlay(6, theme.colors.surface)
    : theme.colors.surface

  return (
    <React.Fragment>
      <Tab.Navigator
        initialRouteName="Albuns"
        backBehavior="initialRoute"
        shifting={true}
        activeColor={theme.colors.primary}
        inactiveColor={color(theme.colors.text)
          .alpha(0.6)
          .rgb()
          .string()}
        sceneAnimationEnabled={false}
      >
        {/* <Tab.Screen
          name="Foto"
          component={Foto}
          options={{
            tabBarIcon: 'camera',
            tabBarColor,
          }}
        /> */}
        <Tab.Screen
          name="Albuns"
          component={Albuns}
          options={{
            tabBarIcon: 'folder-multiple-image',
            tabBarColor,
          }}
        />
        <Tab.Screen
          name="Messages"
          component={Message}
          options={{
            tabBarIcon: 'message-text-outline',
            tabBarColor,
          }}
        />
      </Tab.Navigator>
      <Portal>
        <FAB
          visible={isFocused}
          icon={icon}
          style={{
            position: 'absolute',
            bottom: safeArea.bottom + 65,
            right: 16,
          }}
          color="white"
          theme={{
            colors: {
              accent: theme.colors.primary,
            },
          }}
          onPress={btnAction}
        />
        
        <Modal
          animationType="slide"
          transparent={false}
          visible={open}
        >
          <View style={{ felx: 1, justifyContent: 'center', alignItems: 'center', margin: 20 }}>

            <TouchableOpacity style={{ margin: 10 }} onPress={() => setOpen(false)}>
              <FontAwesome name="window-close" size={30} color="#FF0000" />
            </TouchableOpacity>

            <Foto />
          </View>
        </Modal>

      </Portal>
    </React.Fragment>
  )
}

const styles = StyleSheet.create({
  scrollViewContent: {
    flex: 1,
    paddingHorizontal: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  centerText: {
    textAlign: 'center',
  },
  button: {
    marginTop: 20,
  },
})
