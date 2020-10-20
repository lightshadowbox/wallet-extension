import { useQuery } from 'react-query'
import { getFromCache } from 'services/query-cache'

import { concat, get, keyBy, pick } from 'lodash'
import { setup } from 'axios-cache-adapter'
import { AxiosError } from 'axios'
import { useSettingStore } from 'popup/stores/features/settings'
import { getAccountRuntime, getWalletInstance } from 'services/wallet'
import { CONSTANT } from 'incognito-sdk/build/web/module'
import { PrivacyToken } from 'incognito-sdk/build/web/module/src/walletInstance/token'

interface CustomTokenReceivedModel {
  id: number
  createdAt: Date
  updatedAt: Date
  deletedAt?: Date
  tokenId: string
  symbol: string
  name: string
  image: string
  amount: string
  verified: boolean
}

export interface TokenReceivedModel {
  id: number
  createdAt: Date
  updatedAt: Date
  deletedAt?: Date
  tokenId: string
  symbol: string
  originalSymbol: string
  name: string
  contractId: string
  decimals: number
  pDecimals: number
  status: number
  type: number
  currencyType: number
  pSymbol: string
  isDefault: boolean
  userId?: string
  verified: boolean
}

const api = setup({
  cache: {
    maxAge: 30 * 1000,
    readOnError: (error: AxiosError) => {
      return error.response.status >= 400 && error.response.status < 600
    },
    clearOnStale: true,
  },
})

export interface TokenItemInterface {
  id: number
  tokenId: string
  symbol: string
  originalSymbol: string
  name: string
  contractId?: string
  decimals: number
  pDecimals: number
  status: number
  type: number
  currencyType: number
  pSymbol: string
  isDefault: boolean
  verified: boolean
  icon: string
  isFollowing: boolean
  tokenType: 'TOKEN' | 'SHIELD' | 'CUSTOM'
}

export const getTokenList = async () => {
  const tokens = await api.get<Array<TokenReceivedModel>>('https://api.incscan.io/blockchain/tokens')
  const customTokens = await api.get<Array<CustomTokenReceivedModel>>('https://api.incscan.io/blockchain/custom-tokens')

  const tokensMapped = tokens.data.map<TokenItemInterface>((i) => ({
    tokenType: 'TOKEN',
    isFollowing: false,
    icon: `https://s3.amazonaws.com/incognito-org/wallet/cryptocurrency-icons/32@2x/color/${i.symbol.toLowerCase()}@2x.png`,
    ...i,
  }))

  const customTokenMapped = customTokens.data.map<TokenItemInterface>((i) => ({
    tokenType: 'CUSTOM',
    ...i,
    isFollowing: false,
    icon: i.image,
    originalSymbol: i.symbol,
    isDefault: false,
    decimals: 0,
    pDecimals: 0,
    status: 0,
    type: 0,
    currencyType: 0,
    pSymbol: i.symbol,
    tokenId: i.tokenId || `${i.id}`,
  }))

  return keyBy(concat(tokensMapped, customTokenMapped), 'tokenId')
}

export const useFetchToken = () => {
  return useQuery(useFetchToken.name, getTokenList, { refetchOnWindowFocus: false, refetchInterval: 60 * 60 * 60 })
}

export const getTokenFromTokenIds = (tokenIds: string[]) => {
  const tokens = getFromCache<{ [key: string]: TokenItemInterface }>(useFetchToken.name)
  if (tokens && Object.keys(tokens).length > 0) {
    const filteredTokens = pick(tokens, ...tokenIds)
    return filteredTokens
  }
  return {}
}

export const useGetTokenForAccount = (selectedAccount: string) => {
  const { data: tokenRemoteData } = useFetchToken()
  return useQuery(
    [useGetTokenForAccount.name, selectedAccount],
    async () => {
      const account = await getAccountRuntime(selectedAccount)
      const tokens = [CONSTANT.WALLET_CONSTANT.PRVIDSTR, ...account.privacyTokenIds]

      const remoteData = tokens.map((tokenId) => {
        const d = get(tokenRemoteData, tokenId)
        return {
          tokenId,
          name: d?.name || tokenId,
          icon: d?.icon || '',
          type: d?.type,
          isFollowing: d?.isFollowing,
        }
      })
      return remoteData
    },
    { enabled: selectedAccount && tokenRemoteData },
  )
}
