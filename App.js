import React from 'react'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { AppearanceProvider } from 'react-native-appearance'
import { YellowBox } from 'react-native'

import { Main } from './src/main'

YellowBox.ignoreWarnings([
  "Possible Unhandled Promise Rejection",
  "Warning: component",
  "An effect function must",
])

export default function App() {
  return (
    <SafeAreaProvider>
      <AppearanceProvider>
        <Main />
      </AppearanceProvider>
    </SafeAreaProvider>
  )
}
