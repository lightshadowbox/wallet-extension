import * as i from 'incognito-js/build/web/module'
import { keyBy } from 'lodash'

export type AccountModelType = {
  name?: string

  publicKey?: string
  privateKey?: string
  paymentAddress?: string
  viewingKey?: string

  balances?: { [key: string]: { availableBallance: any; totalBalance: any } }

  followingTokens?: string[]
}

const getTokenBalances = async (
  account: i.AccountInstance,
  tokenId: string
): Promise<{ tokenId: string; availableBallance: any; totalBalance: any }> => {
  if (tokenId === account.nativeToken.tokenId) {
    return {
      tokenId,
      availableBallance: await account.nativeToken.getAvaiableBalance(),
      totalBalance: await account.nativeToken.getTotalBalance(),
    }
  }
  const pToken = (await account.getFollowingPrivacyToken(tokenId)) as i.PrivacyTokenInstance
  return {
    tokenId,
    availableBallance: await pToken.getAvaiableBalance(),
    totalBalance: await pToken.getTotalBalance(),
  }
}

export const serializeAccount = async (account: i.AccountInstance): Promise<AccountModelType> => {
  const accountModel: AccountModelType = {}
  accountModel.name = account.name
  accountModel.paymentAddress = account.key.keySet.paymentAddressKeySerialized
  accountModel.privateKey = account.key.keySet.privateKeySerialized
  accountModel.publicKey = account.key.keySet.publicKeySerialized
  accountModel.viewingKey = account.key.keySet.viewingKeySerialized
  accountModel.publicKey = await account.getBLSPublicKeyB58CheckEncode()
  accountModel.followingTokens = [...account.privacyTokenIds, account.nativeToken.tokenId]
  const balances = await Promise.all(accountModel.followingTokens.map((tokenId) => getTokenBalances(account, tokenId)))
  accountModel.balances = keyBy(balances, 'tokenId')
  return accountModel
}
