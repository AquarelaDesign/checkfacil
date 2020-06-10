import React from 'react'
import { MaterialCommunityIcons, Feather, SimpleLineIcons } from '@expo/vector-icons'
import {
  DrawerContentComponentProps,
  DrawerContentOptions,
  DrawerContentScrollView,
  DrawerItem,
} from '@react-navigation/drawer'
import { StyleSheet, TouchableOpacity, View } from 'react-native'
import {
  Avatar,
  Caption,
  Drawer,
  // Paragraph,
  Switch,
  Text,
  Title,
  TouchableRipple,
  useTheme,
} from 'react-native-paper'
import Animated from 'react-native-reanimated'

import { PreferencesContext } from './context/preferencesContext'

import logo from './assets/icon.png'

export function DrawerContent({props}) {
  const paperTheme = useTheme();
  const { theme, toggleTheme } = React.useContext(
    PreferencesContext
  )

  // const translateX = Animated.interpolate(props.progress, {
  //   inputRange: [0, 0.5, 0.7, 0.8, 1],
  //   outputRange: [-100, -85, -70, -45, 0],
  // })

  return (
    <DrawerContentScrollView {...props}>
      <Animated.View
        style={[
          styles.drawerContent,
          {
            backgroundColor: paperTheme.colors.surface,
            // transform: [{ translateX }],
          },
        ]}
      >
        <View style={styles.userInfoSection}>
          <TouchableOpacity
            style={{ marginLeft: 10 }}
            onPress={() => {
              props.navigation.toggleDrawer();
            }}
          >
            <Avatar.Image
              source={logo}
              size={50}
            />
          </TouchableOpacity>
          <Title style={styles.title}>Check Fácil</Title>
          <Caption style={styles.caption}>atendimento@procyon.com.br</Caption>
        </View>
        <Drawer.Section style={styles.drawerSection}>
          <DrawerItem
            icon={({ color, size }) => (
              <Feather
                name="globe"
                color={color}
                size={size}
              />
            )}
            label="fichadocarro.com.br"
            onPress={() => {}}
          />
          <DrawerItem
            icon={({ color, size }) => (
              <Feather name="phone-call" color={color} size={size} />
            )}
            label="+55 (41) 3311-6747"
            onPress={() => {}}
          />
          <DrawerItem
            icon={({ color, size }) => (
              <SimpleLineIcons name="support" color={color} size={size} />
            )}
            label="+55 (41) 3311-6756"
            onPress={() => {}}
          />
          <DrawerItem
            icon={({ color, size }) => (
              <Feather name="headphones" color={color} size={size} />
            )}
            label="+55 (41) 3311-6756"
            onPress={() => {}}
          />
        </Drawer.Section>
        <Drawer.Section title="Preferências">
          <TouchableRipple onPress={toggleTheme}>
            <View style={styles.preference}>
              <Text>Dark Theme</Text>
              <View pointerEvents="none">
                <Switch value={theme === 'dark'} />
              </View>
            </View>
          </TouchableRipple>
        </Drawer.Section>
      </Animated.View>
    </DrawerContentScrollView>
  );
}

const styles = StyleSheet.create({
  drawerContent: {
    flex: 1,
  },
  userInfoSection: {
    paddingLeft: 20,
  },
  title: {
    marginTop: 20,
    fontWeight: 'bold',
  },
  caption: {
    fontSize: 14,
    lineHeight: 14,
  },
  row: {
    marginTop: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  section: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 15,
  },
  paragraph: {
    fontWeight: 'bold',
    marginRight: 3,
  },
  drawerSection: {
    marginTop: 15,
  },
  preference: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
});
