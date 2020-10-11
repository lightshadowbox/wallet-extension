import * as incognitos from 'incognito-js/build/web/module'

incognitos.setConfig({ wasmPath: '/privacy.wasm', chainURL: 'https://fullnode.incognito.best', mainnet: true })

export class SDK {
  isWASMRunned = false

  walletInstance = new incognitos.WalletInstance()

  async initSDK() {
    // if (this.isWASMRunned) {
    //   return
    // }

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
    this.isWASMRunned = true
  }
}
export { incognitos }
export const sdk = new SDK()
