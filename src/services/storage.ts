// eslint-disable-next-line max-classes-per-file
import { storageSecret } from 'constants/crypto'
import crypto from 'crypto-js'

import { IS_RUNNING_AS_EXTENSION } from '../constants/app'

export class Storage {
  encryptedKeyValue(key: string, value: any) {
    const keyEncrypted = crypto.AES.encrypt(key, storageSecret).toString()
    const valueEncrypted = crypto.AES.encrypt(JSON.stringify(value), storageSecret).toString()
    return [keyEncrypted, valueEncrypted]
  }

  public set(key: string, value: any) {
    return window.localStorage.setItem.call(window.localStorage, this.encryptedKeyValue(key, value))
  }

  public async get(key: string) {
    const keyEncrypted = crypto.AES.encrypt(key, storageSecret).toString()
    const encryptedValue = window.localStorage.getItem(keyEncrypted)
    if (!encryptedValue) {
      return null
    }
    const value = crypto.AES.decrypt(encryptedValue, storageSecret).toString()
    return JSON.parse(value)
  }

  public del(key: string) {
    const keyEncrypted = crypto.AES.encrypt(key, storageSecret).toString()
    window.localStorage.removeItem(keyEncrypted)
  }
}

export const storageService = IS_RUNNING_AS_EXTENSION ? new Storage() : new Storage()
