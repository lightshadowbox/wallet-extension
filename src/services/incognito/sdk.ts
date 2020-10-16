import * as i from 'incognito-sdk'

let sdkLoaded = false
let walletInstance: i.WalletInstance

export const initSDK = async () => {
  if (sdkLoaded) {
    return
  }
  i.setConfig({ wasmPath: '/privacy.wasm', chainURL: 'https://fullnode.incognito.best', mainnet: true })

  i.storageService.implement({
    setMethod: (key: string, data: any) => {
      return window.sessionStorage.setItem(key, data)
    },
    getMethod: (key: string) => {
      return window.sessionStorage.getItem(key)
    },
    removeMethod: (key: string) => window.sessionStorage.removeItem(key),
    namespace: 'WALLET',
  } as any)

  await i.goServices.implementGoMethodUseWasm()
  walletInstance = new i.WalletInstance()
  sdkLoaded = true
}

export const getWalletInstance = () => walletInstance
