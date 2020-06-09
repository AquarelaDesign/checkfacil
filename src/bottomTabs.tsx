import React from 'react'
import color from 'color'
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs'
import { useTheme, Portal, FAB } from 'react-native-paper'
import { useSafeArea } from 'react-native-safe-area-context'
import { useIsFocused, RouteProp } from '@react-navigation/native'

import overlay from './overlay'
// import { Foto } from './foto'
import Foto from './camera/camera.page'
import { Message } from './message'
import { Albuns } from './albuns'
import { StackNavigatorParamlist } from './types'

const Tab = createMaterialBottomTabNavigator()

type Props = {
  route: RouteProp<StackNavigatorParamlist, 'FotoList'>
}

export const BottomTabs = (props: Props) => {
  const routeName = props.route.state
    ? props.route.state.routes[props.route.state.index].name
    : 'Foto'

  const theme = useTheme()
  const safeArea = useSafeArea()
  const isFocused = useIsFocused()

  let icon = 'file-send'

  switch (routeName) {
    case 'Foto':
      icon = 'image-filter-center-focus'
      break
    case 'Albuns':
      icon = 'file-send'
      break
    case 'Messages':
      icon = 'file-send'
      break
    default:
      icon = 'file-send'
      break
  }

  const btnAction = () => {
    alert(routeName)
  }

  const tabBarColor = theme.dark
    ? (overlay(6, theme.colors.surface) as string)
    : theme.colors.surface

  return (
    <React.Fragment>
      <Tab.Navigator
        initialRouteName="Foto"
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
          name="Foto"
          component={Foto}
          options={{
            tabBarIcon: 'camera',
            tabBarColor,
          }}
        />
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
      {/* <Portal>
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
      </Portal> */}
    </React.Fragment>
  )
}
