import { createSelectorForSlice } from 'stores/utils'

import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface WalletState {
  selectAccountName?: string
}

const walletInitialState: WalletState = {}

export const walletSlices = createSlice({
  name: 'wallets',
  initialState: walletInitialState,
  reducers: {
    selectAccount: (state, action: PayloadAction<{ accountName: string }>) => {
      state.selectAccountName = action.payload.accountName
    },
  },
})

export const useWalletState = createSelectorForSlice(walletSlices)
