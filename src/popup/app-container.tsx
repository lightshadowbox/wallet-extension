import React from 'react'
import classNames from 'classnames'
import { ReactQueryCacheProvider } from 'react-query'
import { queryCache } from './services/query-cache'
import { AppRouter } from './app-router'
import './styles/global.css'

import * as styles from './app-container.module.css'
import { BoxLayout } from './components/layout'

export const AppContainer = () => {
  return (
    <div className={classNames('container max-w-xs mx-auto shadow-sm', styles.appContainer)}>
      <ReactQueryCacheProvider queryCache={queryCache}>
        <BoxLayout>
          <AppRouter />
        </BoxLayout>
      </ReactQueryCacheProvider>
    </div>
  )
}
