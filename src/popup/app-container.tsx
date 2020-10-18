import './styles/global.css'

import React from 'react'

import { ReactQueryCacheProvider } from 'react-query'
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'
import { queryCache } from 'services/query-cache'
import { persistor, store } from 'popup/stores/store'
import { ThemeProvider } from 'styled-components'

import { Spinner } from '@fluentui/react'

import * as styles from './app-container.module.css'
import { AppRouter } from './app-router'
import { BoxLayout } from './components/layout'
import { useTheme } from './services/use-theme'

export const AppContainer = () => {
  const theme = useTheme()
  return (
    <div className={`container max-w-xs mx-auto shadow-sm ${styles.appContainer}`}>
      <Provider store={store}>
        <PersistGate
          loading={
            <div>
              <Spinner label="I am definitely loading..." />
            </div>
          }
          persistor={persistor}
        >
          <ReactQueryCacheProvider queryCache={queryCache}>
            <ThemeProvider theme={theme}>
              <BoxLayout>
                <AppRouter />
              </BoxLayout>
            </ThemeProvider>
          </ReactQueryCacheProvider>
        </PersistGate>
      </Provider>
    </div>
  )
}
