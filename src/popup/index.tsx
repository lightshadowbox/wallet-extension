import React from 'react'
import ReactDOM from 'react-dom'

import { sdk } from 'services/incognito/sdk'

import { initializeIcons, loadTheme } from '@fluentui/react'
import { getWalletInstance } from 'services/wallet'
import { AppContainer } from './app-container'
import { globalTheme } from './theme'

navigator.getUserMedia(
  { video: true },
  () => console.log('ok'),
  (err) => console.error(err),
)
loadTheme(globalTheme)
initializeIcons()

export const bootstrap = async () => {
  await sdk.initSDK()
  await getWalletInstance()
  ReactDOM.render(<AppContainer />, document.querySelector('#root'))
}

bootstrap()
