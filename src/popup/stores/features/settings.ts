import { createSelectorForSlice } from 'popup/stores/utils'

import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface SettingStore {
  selectAccountName?: string
  walletName?: string
}

const walletInitialState: SettingStore = {}

export const settingSlices = createSlice({
  name: 'wallets',
  initialState: walletInitialState,
  reducers: {
    selectAccount: (state, action: PayloadAction<{ accountName: string }>) => {
      state.selectAccountName = action.payload.accountName
    },
    setWalletName: (state, action: PayloadAction<{ walletName: string }>) => {
      state.walletName = action.payload?.walletName
    },
  },
})

export const useSettingStore = createSelectorForSlice(settingSlices)
