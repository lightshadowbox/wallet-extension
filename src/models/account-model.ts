import { AccountInstance, PrivacyTokenInstance } from 'incognito-sdk'

export type AccountModelType = {
  name?: string

  publicKey?: string
  privateKey?: string
  paymentAddress?: string
  viewingKey?: string

  followingTokens?: string[]
}

export const getTokenBalances = async (account: AccountInstance, tokenId: string): Promise<{ tokenId: string; availableBallance: any; totalBalance: any }> => {
  if (tokenId === account.nativeToken.tokenId) {
    return {
      tokenId,
      availableBallance: await account.nativeToken.getAvaiableBalance(),
      totalBalance: await account.nativeToken.getTotalBalance(),
    }
  }
  const pToken = (await account.getFollowingPrivacyToken(tokenId)) as PrivacyTokenInstance
  return {
    tokenId,
    availableBallance: await pToken.getAvaiableBalance(),
    totalBalance: await pToken.getTotalBalance(),
  }
}

export const serializeAccount = async (account: AccountInstance): Promise<AccountModelType> => {
  const accountModel: AccountModelType = {}
  accountModel.name = account.name
  accountModel.paymentAddress = account.key.keySet.paymentAddressKeySerialized
  accountModel.privateKey = account.key.keySet.privateKeySerialized
  accountModel.publicKey = account.key.keySet.publicKeySerialized
  accountModel.viewingKey = account.key.keySet.viewingKeySerialized
  accountModel.publicKey = await account.getBLSPublicKeyB58CheckEncode()
  accountModel.followingTokens = [...account.privacyTokenIds, account.nativeToken.tokenId]
  return accountModel
}
