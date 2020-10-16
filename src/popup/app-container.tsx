import './styles/global.css'

import React from 'react'

import { ReactQueryCacheProvider } from 'react-query'
import { Provider } from 'react-redux'
import { queryCache } from 'services/query-cache'
import { store } from 'stores/store'
import { ThemeProvider } from 'styled-components'

import * as styles from './app-container.module.css'
import { AppRouter } from './app-router'
import { BoxLayout } from './components/layout'
import { useTheme } from './services/use-theme'

export const AppContainer = () => {
  const theme = useTheme()
  return (
    <div className={`container max-w-xs mx-auto shadow-sm ${styles.appContainer}`}>
      <Provider store={store}>
        <ReactQueryCacheProvider queryCache={queryCache}>
          <ThemeProvider theme={theme}>
            <BoxLayout>
              <AppRouter />
            </BoxLayout>
          </ThemeProvider>
        </ReactQueryCacheProvider>
      </Provider>
    </div>
  )
}
