import * as incognitos from 'incognito-sdk'

let sdkLoaded = false
let walletInstance: any

export const initSDK = async () => {
  if (sdkLoaded) {
    return
  }
  incognitos.setConfig({ wasmPath: '/privacy.wasm', chainURL: 'https://fullnode.incognito.best', mainnet: true })

  incognitos.storageService.implement({
    setMethod: (key: string, data: any) => {
      return window.sessionStorage.setItem(key, data)
    },
    getMethod: (key: string) => {
      return window.sessionStorage.getItem(key)
    },
    removeMethod: (key: string) => window.sessionStorage.removeItem(key),
    namespace: 'WALLET',
  } as any)

  await incognitos.goServices.implementGoMethodUseWasm()
  walletInstance = new incognitos.WalletInstance()
  sdkLoaded = true
}

export const getWalletInstance = () => walletInstance as incognitos.WalletInstance
