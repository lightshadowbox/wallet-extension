import React from 'react'
import { Customizations, CustomizerContext, ICustomizerContext, initializeIcons, loadTheme } from '@fluentui/react'
import { ThemeProvider } from 'styled-components'
import { globalTheme } from '../src/popup/theme'
import { useTheme } from '../src/popup/services'
import '../src/popup/styles/global.css'

loadTheme(globalTheme)
initializeIcons()

const Layout = ({ children }) => {
  const theme = useTheme()
  return (
    <ThemeProvider theme={theme}>
      <div className="px-20 py-10">{children}</div>
    </ThemeProvider>
  )
}

export default Layout
