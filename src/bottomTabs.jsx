import React, { useState } from 'react'
import color from 'color'

import {
  StyleSheet,
  Modal,
  View,
  TouchableOpacity,
} from 'react-native'

import {
  useTheme,
  Portal,
  FAB,
} from 'react-native-paper'

import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs'
import { useSafeArea } from 'react-native-safe-area-context'
import { useIsFocused, RouteProp } from '@react-navigation/native'
import { FontAwesome, MaterialCommunityIcons } from '@expo/vector-icons'

import overlay from './overlay'
import Foto from './components/camera/camera'
import AddSign from './components/AddSign'
import Albuns from './components/medialibrary/ImagesList'
import Email from './components/Email/Email'
import Exit from './components/Exit/Exit'

const Tab = createMaterialBottomTabNavigator()

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms))

export const BottomTabs = (props) => {
  // const [camera, setCamera] = useState(null)
  const [open, setOpen] = useState(false)
  const [openSign, setOpenSign] = useState(false)

  const routeName = props.route.state
    ? props.route.state.routes[props.route.state.index].name
    : 'Albuns'

  const theme = useTheme()
  const safeArea = useSafeArea()
  const isFocused = useIsFocused()

  let icon = 'file-send'

  switch (routeName) {
    case 'Albuns':
      icon = 'image-filter-center-focus'
      break
    case 'Email':
      icon = 'gesture'
      break
    case 'Sair':
      icon = 'close'
      break
    default:
      icon = 'file-send'
      break
  }

  const btnAction = () => {
    // console.log('routeName', routeName)
    if (routeName === 'Albuns') {
      setOpen(true)
      return
    } else if (routeName === 'Email') {
      setOpenSign(true)
      return
    }

    alert(routeName)
  }

  const closeSign = async () => {
    setOpenSign(false)
    setOpen(false)
    await sleep(300)
    props.navigation.jumpTo('Albuns', { atualiza: true })
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
        <Tab.Screen
          name="Albuns"
          component={Albuns}
          options={{
            tabBarIcon: 'folder-multiple-image',
            tabBarColor,
          }}
        />
        <Tab.Screen
          name="Email"
          component={Email}
          options={{
            tabBarIcon: ({ color }) => (
              <MaterialCommunityIcons color={color} name="email" size={26} />
            ),
            tabBarColor,
          }}
        />
        <Tab.Screen
          name="Sair"
          component={Exit}
          options={{
            tabBarIcon: ({ color }) => (
              <MaterialCommunityIcons color={color} name="exit-run" size={26} />
            ),
            tabBarColor,
          }}
        />
      </Tab.Navigator>
      <Portal>
        <FAB
          visible={routeName === 'Sair' ? false : isFocused}
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
          <View style={{
            flex: 1,
            justifyContent: 'flex-end',
            alignItems: 'flex-end',
            margin: 0,
            paddingHorizontal: 5,
            paddingBottom: 5,
            backgroundColor: '#2699F8'
          }}>

            <TouchableOpacity style={{ margin: 10 }} onPress={() => {closeSign()}}>
              <FontAwesome name="window-close" size={30} color="#000" />
            </TouchableOpacity>

            <Foto close={closeSign} />
          </View>
        </Modal>

        <Modal
          animationType="slide"
          transparent={false}
          visible={openSign}
        >
          <View style={{
            flex: 1,
            justifyContent: 'flex-end',
            alignItems: 'flex-end',
            margin: 0,
            paddingHorizontal: 5,
            paddingBottom: 5,
            backgroundColor: '#FFFFFF'
          }}>

            <TouchableOpacity style={{ margin: 10 }} onPress={() => setOpenSign(false)}>
              <FontAwesome name="window-close" size={30} color="#000" />
            </TouchableOpacity>

            <AddSign close={closeSign} />
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
