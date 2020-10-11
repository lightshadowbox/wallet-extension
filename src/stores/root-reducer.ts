import { combineReducers } from '@reduxjs/toolkit'

import { walletSlices } from './implements/wallet'

export const rootReducer = combineReducers({
	[walletSlices.name]: walletSlices.reducer
})

export type RootState = ReturnType<typeof rootReducer>
