import { combineReducers } from '@reduxjs/toolkit'
import { settingSlices } from './features/settings'

export const rootReducer = combineReducers({
  [settingSlices.name]: settingSlices.reducer,
})

export type RootState = ReturnType<typeof rootReducer>
