import React from 'react'
import classNames from 'classnames'
import { ReactQueryCacheProvider } from 'react-query'
import { ThemeProvider } from 'styled-components'
import { queryCache } from './services/query-cache'
import { AppRouter } from './app-router'
import './styles/global.css'

import * as styles from './app-container.module.css'
import { BoxLayout } from './components/layout'
import { useTheme } from './services/use-theme'

export const AppContainer = () => {
  const theme = useTheme()
  return (
    <div className={classNames('container max-w-xs mx-auto shadow-sm', styles.appContainer)}>
      <ReactQueryCacheProvider queryCache={queryCache}>
        <ThemeProvider theme={theme}>
          <BoxLayout>
            <AppRouter />
          </BoxLayout>
        </ThemeProvider>
      </ReactQueryCacheProvider>
    </div>
  )
}
