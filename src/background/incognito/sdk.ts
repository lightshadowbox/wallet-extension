import * as incognitos from 'incognito-js'

export class SDK {
  isWASMRunned = false
  walletInstance = new incognitos.WalletInstance()

	async initSDK(wasmPath: string) {
		if (this.isWASMRunned) {
			return
		}
		incognitos.setConfig({ wasmPath, chainURL: '', mainnet: true })
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

  public get instance() {
    return this.walletInstance
  }
}

export const sdk = new SDK()
