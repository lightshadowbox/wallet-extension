import React from 'react'
import ReactDOM from 'react-dom'

import { initSDK } from 'services/incognito/sdk'

import {
  initializeIcons,
  loadTheme,
} from '@fluentui/react'

import { AppContainer } from './app-container'
import { globalTheme } from './theme'

loadTheme(globalTheme)
initializeIcons()
setTimeout(()=> initSDK(), 10)
ReactDOM.render(<AppContainer />, document.querySelector('#root'))
