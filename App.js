import React, { useEffect } from 'react'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { AppearanceProvider } from 'react-native-appearance'
import { YellowBox, ToastAndroid } from 'react-native'

import * as Updates from 'expo-updates'
import { Main } from './src/main'

YellowBox.ignoreWarnings([
  "Possible Unhandled Promise Rejection",
  "Warning: component",
  "An effect function must",
])

export default function App() {

  useEffect(() => {
    async function updateApp() {
      try {      
        const update = await Updates.checkForUpdateAsync()
        if (update.isAvailable) {
          await Updates.fetchUpdateAsync()
          // ... notify user of update ...
          ToastAndroid.showWithGravityAndOffset(
            "Aplicativo sendo atualizado!",
            ToastAndroid.LONG,
            ToastAndroid.TOP,
            25,
            50
          )
          await Updates.reloadAsync()
        }
        
        // const { isAvailable } = await Updates.checkForUpdateAsync()
        // if (isAvailable) {
        //   await Updates.fetchUpdateAsync()
        //   await Updates.reloadAsync()
        // }
      } catch (e) {
        // handle or log error
        // console.log(e)
        // ToastAndroid.showWithGravityAndOffset(
        //   "Ocorreu um erro na atualização do aplicativo!",
        //   ToastAndroid.LONG,
        //   ToastAndroid.TOP,
        //   25,
        //   50
        // )
      }        
    }

    updateApp()
  }, [])

  return (
    <SafeAreaProvider>
      <AppearanceProvider>
        <Main />
      </AppearanceProvider>
    </SafeAreaProvider>
  )
}
