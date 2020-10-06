declare module 'redux-persist-webextension-storage'
declare module 'incognito-chain-web-js/build/wallet'
declare module 'craco-antd'
declare module 'react-awesome-button'
declare module '*.webp'
declare module '*.png'
declare module '*.gif'
declare module '*.jpg'
declare module '*.css'
declare module '@nivo/core'
declare module '@nivo/line'
declare module 'react-virtualized-auto-sizer'

declare global {
  type KeyWalletChainCode = Uint8Array
  type KeyWalletChildNumber = Uint8Array
  type KeyWalletDepth = number
  type KeyBytes = Uint8Array
  type TokenIdType = string
  type TokenSymbolType = string
  type TokenNameType = string
  type TokenTxType = number
}

declare class Go {
  run: any

  importObject: any
}
