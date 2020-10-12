import '../src/popup/styles/global.css'

import React from 'react'

import { ThemeProvider } from 'styled-components'

import { initializeIcons, loadTheme } from '@fluentui/react'

import { useTheme } from '../src/popup/services'
import { globalTheme } from '../src/popup/theme'
import { sdk } from '../src/services/incognito/sdk'

sdk.initSDK().then(console.log)
loadTheme(globalTheme)
initializeIcons()

const Layout = ({ children }) => {
  const theme = useTheme()
  return (
    <ThemeProvider theme={theme}>
      <div>{children}</div>
    </ThemeProvider>
  )
}

export default Layout
