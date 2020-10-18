import { WalletInstance } from 'incognito-sdk'
import { Dictionary, keyBy } from 'lodash'

import { AccountModelType, serializeAccount } from './account-model'

export type WalletModelType = {
  name?: string
  accounts?: Dictionary<AccountModelType>
}

export const serializeWallet = async (wallet: WalletInstance): Promise<WalletModelType> => {
  const accounts = await Promise.all(wallet.masterAccount.getAccounts().map(serializeAccount))
  return {
    name: wallet.name,
    accounts: keyBy(accounts, 'name'),
  }
}
