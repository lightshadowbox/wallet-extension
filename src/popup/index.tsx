import React from 'react'
import ReactDOM from 'react-dom'

import { sdk } from 'services/incognito/sdk'

import { initializeIcons, loadTheme } from '@fluentui/react'

import { AppContainer } from './app-container'
import { globalTheme } from './theme'

loadTheme(globalTheme)
initializeIcons()

sdk.initSDK().then(console.log)
ReactDOM.render(<AppContainer />, document.querySelector('#root'))
