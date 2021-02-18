// eslint-disable-next-line max-classes-per-file
import { storageSecret } from 'constants/crypto'
import crypto from 'crypto-js'

import { IS_RUNNING_AS_EXTENSION } from '../constants/app'

interface StorageAPI {
  set(key: string, value: any): void
  get(key: string): Promise<any>
  del(key: string): void
}

export class LocalStorage implements StorageAPI {
  constructor() {
    console.info('[INFO] using localStorage for sync wallet data')
  }

  encryptedKeyValue(key: string, value: any) {
    const keyEncrypted = crypto.HmacSHA1(key, storageSecret).toString()
    const valueEncrypted = crypto.AES.encrypt(JSON.stringify(value), storageSecret).toString()
    return [keyEncrypted, valueEncrypted]
  }

  public set(key: string, value: any) {
    // const [encryptedKey, encryptedValue] = this.encryptedKeyValue(key, value)
    return window.localStorage.setItem(key, JSON.stringify({ value }))
  }

  public async get(key: string) {
    // const keyEncrypted = crypto.HmacSHA1(key, storageSecret).toString()
    const encryptedValue = window.localStorage.getItem(key)
    if (!encryptedValue) {
      return null
    }
    // const value = crypto.AES.decrypt(encryptedValue, storageSecret).toString()
    try {
      const { value } = JSON.parse(encryptedValue)
      return value
    } catch {
      return encryptedValue
    }
  }

  public del(key: string) {
    const keyEncrypted = crypto.AES.encrypt(key, storageSecret).toString()
    window.localStorage.removeItem(keyEncrypted)
  }
}

export class ChromeStorage implements StorageAPI {
  constructor() {
    console.info('[INFO] using chromeStorage to sync wallet data')
  }

  encryptedKeyValue(key: string, value: any) {
    const keyEncrypted = crypto.HmacSHA1(key, storageSecret).toString()
    const valueEncrypted = crypto.AES.encrypt(JSON.stringify(value), storageSecret).toString()
    return [keyEncrypted, valueEncrypted]
  }

  private debug(key: string) {
    console.info(`Sync data key ${key} to chromeStorage`)
  }

  public set(key: string, value: any) {
    // const [encryptedKey, encryptedValue] = this.encryptedKeyValue(key, value)
    return chrome.storage.sync.set({ [key]: JSON.stringify({ value }) }, this.debug.bind(undefined, key))
  }

  public async get(key: string) {
    // const keyEncrypted = crypto.HmacSHA1(key, storageSecret).toString()
    return new Promise((resolve, reject) => {
      chrome.storage.sync.get([key], function (response) {
        let encryptedValue
        try {
          encryptedValue = response[key]
        } catch (e) {
          console.warn(`Can not find value of key ${key} in chrome storage`)
          resolve(null)
        }

        // const value = crypto.AES.decrypt(encryptedValue, storageSecret).toString()
        try {
          const { value } = JSON.parse(encryptedValue)
          resolve(value)
        } catch {
          resolve(encryptedValue)
        }
      })
    })
  }

  public del(key: string) {
    const keyEncrypted = crypto.AES.encrypt(key, storageSecret).toString()
    chrome.storage.sync.remove(keyEncrypted)
  }
}

export const storageService = IS_RUNNING_AS_EXTENSION ? new ChromeStorage() : new LocalStorage()
