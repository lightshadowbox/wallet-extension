import { classToPlain } from 'class-transformer'
import * as i from 'incognito-js'
import { AccountModel } from './account'

export class WalletModel {
  private walletInstance: i.WalletInstance

  public get walletName() {
    return this.walletInstance.name
  }

  public get accounts(): AccountModel[] {
    return this.walletInstance.masterAccount.getAccounts().map((a) => new AccountModel(a))
  }

  toJSON() {
    return classToPlain(this)
  }
}
