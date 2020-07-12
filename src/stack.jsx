import React from 'react'
import { TouchableOpacity } from 'react-native'
import { createStackNavigator } from '@react-navigation/stack'
// import { DrawerNavigationProp } from '@react-navigation/drawer'
import { Appbar, Avatar, useTheme } from 'react-native-paper'
import { MaterialCommunityIcons } from '@expo/vector-icons'

import { BottomTabs } from './bottomTabs'

import logo from './assets/icon.png'

const Details = () => {
  return <Caption style={styles.centerText}>
    Detalhes...
  </Caption>
}

const Stack = createStackNavigator()

export const StackNavigator = () => {
  const theme = useTheme()

  return (
    <Stack.Navigator
      initialRouteName="FotoList"
      headerMode="screen"
      screenOptions={{
        header: ({ scene, previous, navigation }) => {
          const { options } = scene.descriptor;
          const title =
            options.headerTitle !== undefined
              ? options.headerTitle
              : options.title !== undefined
              ? options.title
              : scene.route.name

          return (
            <Appbar.Header
              theme={{ colors: { primary: theme.colors.surface } }}
            >
              {previous ? (
                <Appbar.BackAction
                  onPress={navigation.goBack}
                  color={theme.colors.primary}
                />
              ) : (
                <TouchableOpacity
                  style={{ marginLeft: 10 }}
                  onPress={() => {
                    (navigation).openDrawer();
                  }}
                >
                  <Avatar.Image
                    size={40}
                    source={logo}
                  />
                </TouchableOpacity>
              )}
              <Appbar.Content
                title={
                  title
                  // title === 'Foto' ? (
                  //   <MaterialCommunityIcons
                  //     style={{ marginRight: 10 }}
                  //     name="twitter"
                  //     size={40}
                  //     color={theme.colors.primary}
                  //   />
                  // ) : (
                  //   title
                  // )
                }
                titleStyle={{
                  fontSize: 18,
                  fontWeight: 'bold',
                  color: theme.colors.primary,
                }}
              />
            </Appbar.Header>
          )
        },
      }}
    >
      <Stack.Screen
        name="FotoList"
        component={BottomTabs}
        options={({ route }) => {
          const routeName = route.state
            ? route.state.routes[route.state.index].name
            : 'Check Fácil'
          return { headerTitle: routeName };
        }}
      />
      <Stack.Screen
        name="Details"
        component={Details}
        options={{ headerTitle: 'Detalhes' }}
      />
    </Stack.Navigator>
  )
}
