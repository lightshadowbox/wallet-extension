import logger from 'redux-logger'

import { configureStore } from '@reduxjs/toolkit'

import { rootReducer } from './root-reducer'

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(logger),
})

export type AppDispatch = typeof store.dispatch
