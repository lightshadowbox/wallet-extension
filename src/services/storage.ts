// eslint-disable-next-line max-classes-per-file
import { storageSecret } from 'constants/crypto'
import crypto from 'crypto-js'

import { IS_RUNNING_AS_EXTENSION } from '../constants/app'

export class Storage {
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

export const storageService = IS_RUNNING_AS_EXTENSION ? new Storage() : new Storage()
