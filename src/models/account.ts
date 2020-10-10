import * as i from 'incognito-js'

export class AccountModel {
  private incognitoAccount: i.AccountInstance

  constructor(ac: i.AccountInstance) {
    this.incognitoAccount = ac
  }

  get accountName() {
    return this.incognitoAccount.name
  }

  get keys() {
    return this.incognitoAccount.key.keySet
  }

  get followingTokens() {
    return this.incognitoAccount.privacyTokenIds
  }
}
