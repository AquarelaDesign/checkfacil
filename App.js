import React, { useEffect } from 'react'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { AppearanceProvider } from 'react-native-appearance'
import { YellowBox } from 'react-native'

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
      const { isAvailable } = await Updates.checkForUpdateAsync()

      if (isAvailable) {
        await Updates.fetchUpdateAsync()
        await Updates.reloadAsync()
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
