import React from 'react'
import ReactDOM from 'react-dom'
import { initializeIcons } from '@fluentui/react'

import { AppContainer } from './app-container'

initializeIcons()
ReactDOM.render(<AppContainer />, document.querySelector('#root'))
