import React from 'react'
import ReactDOM from 'react-dom'
import { initializeIcons, loadTheme } from '@fluentui/react'
import { AppContainer } from './app-container'
import { globalTheme } from './theme'

loadTheme(globalTheme)
initializeIcons()
ReactDOM.render(<AppContainer />, document.querySelector('#root'))
