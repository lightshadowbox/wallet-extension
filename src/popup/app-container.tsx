import './styles/global.css'

import React from 'react'

import classNames from 'classnames'
import { ReactQueryCacheProvider } from 'react-query'
import { RecoilRoot } from 'recoil'

import * as styles from './app-container.module.css'
import { AppRouter } from './app-router'
import { BoxLayout } from './components/layout'
import { queryCache } from './services/query-cache'

export const AppContainer = () => {
  return (
    <div className={classNames('container max-w-xs mx-auto shadow-sm', styles.appContainer)}>
      <RecoilRoot>
        <ReactQueryCacheProvider queryCache={queryCache}>
          <BoxLayout>
            <AppRouter />
          </BoxLayout>
        </ReactQueryCacheProvider>
      </RecoilRoot>
    </div>
  )
}
