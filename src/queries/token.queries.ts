import { useQuery } from 'react-query'
import { getFromCache } from 'services/query-cache'

import { concat, get, keyBy, pick } from 'lodash'
import { setup } from 'axios-cache-adapter'
import { AxiosError } from 'axios'

import { getAccountRuntime, getTokenBalanceForAccount } from 'services/wallet'
import { CONSTANT } from 'incognito-sdk/build/web/module'
import { useGetAccount } from 'queries/account.queries'
import { useSettingStore } from 'popup/stores/features/settings'

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

  const PRV = {
    tokenId: CONSTANT.WALLET_CONSTANT.PRVIDSTR,
    name: 'PRV',
    icon: 'https://s3.amazonaws.com/incognito-org/wallet/cryptocurrency-icons/32@2x/color/prv@2x.png',
    pSymbol: 'PRV',
    tokenType: 'TOKEN',
    type: 0,
    isFollowing: true,
  }

  return keyBy(concat([PRV], tokensMapped, customTokenMapped), 'tokenId')
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
          name: d?.name || 'UNKNOWN',
          icon: d?.icon || '/logo.png',
          type: d?.type,
          isFollowing: d?.isFollowing,
        }
      })
      return remoteData
    },
    { enabled: selectedAccount && tokenRemoteData },
  )
}

export const useGetTokenBalance = (token: string) => {
  const selectedAccount = useSettingStore((s) => s.selectAccountName)
  return useQuery([useGetTokenBalance.name, selectedAccount, token], () => getTokenBalanceForAccount(selectedAccount, token))
}
