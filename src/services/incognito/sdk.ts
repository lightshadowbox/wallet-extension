import * as incognitos from 'incognito-sdk'

export class SDK {
  isWASMRunned = false

  async initSDK() {
    if (this.isWASMRunned) {
      return
    }

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

    const output = await incognitos.goServices.implementGoMethodUseWasm()
    this.isWASMRunned = true
    return output
  }
}

export const sdk = new SDK()
