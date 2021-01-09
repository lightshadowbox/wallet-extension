import { useQuery } from 'react-query'
import { getFromCache } from 'services/query-cache'
import { historyServices, CONSTANT } from 'incognito-sdk/build/web/browser'
import { concat, get, keyBy, pick } from 'lodash'
import { setup } from 'axios-cache-adapter'
import { AxiosError } from 'axios'
import { getUsdEvolution } from 'services/usd-revolution'

import { getAccountRuntime, getTokenBalanceForAccount } from 'services/wallet'

import { useSettingStore } from 'popup/stores/features/settings'
import { createTokenSearchIndex } from 'services/fulltext'
import { useGetWallet } from './wallet.queries'

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
  ID: number
  CreatedAt: string
  UpdatedAt: string
  DeletedAt?: any
  TokenID: string
  Symbol: string
  OriginalSymbol: string
  Name: string
  ContractID: string
  Decimals: number
  PDecimals: number
  Status: number
  Type: number
  CurrencyType: number
  PSymbol: string
  Default: boolean
  UserID: number
  PriceUsd: number
  Verified: boolean
  LiquidityReward: number
  PercentChange1h: string
  PercentChangePrv1h: string
  CurrentPrvPool: number
  PricePrv: number
  volume24: number
  IsCustom: boolean
  Icon: string
  TokenType: string
}

export type TokenAPIResultItem = {
  ID: number
  CreatedAt: string
  UpdatedAt: string
  DeletedAt?: any
  TokenID: string
  Symbol: string
  OriginalSymbol: string
  Name: string
  ContractID: string
  Decimals: number
  PDecimals: number
  Status: number
  Type: number
  CurrencyType: number
  PSymbol: string
  Default: boolean
  UserID: number
  PriceUsd: number
  Verified: boolean
  LiquidityReward: number
  PercentChange1h: string
  PercentChangePrv1h: string
  CurrentPrvPool: number
  PricePrv: number
  volume24: number
}

const PRV_TOKEN_ID = '0000000000000000000000000000000000000000000000000000000000000004'
export const getTokenList = async () => {
  const tokens = await api.get<{ Result: TokenAPIResultItem[] }>('https://api-service.incognito.org/ptoken/list')

  const tokensMapped = tokens.data.Result.map<TokenItemInterface>((i) => ({
    IsCustom: false,
    Icon: `https://s3.amazonaws.com/incognito-org/wallet/cryptocurrency-icons/32@2x/color/${(i.Symbol || i.PSymbol).toLowerCase()}@2x.png`,
    ...i,
    TokenType: 'pToken',
  }))

  const PRV: Partial<TokenItemInterface> = {
    TokenID: CONSTANT.WALLET_CONSTANT.PRVIDSTR,
    Name: 'PRV',
    PSymbol: 'pPRV',
    Symbol: 'pPRV',
    IsCustom: false,
    TokenType: 'pToken',
    Icon: 'https://s3.amazonaws.com/incognito-org/wallet/cryptocurrency-icons/32@2x/color/prv@2x.png',
  }

  return keyBy(concat([PRV], tokensMapped), 'TokenID')
}

export const useGetUSDEvolution = (tokenID: string, agg: any) => {
  return useQuery(['useGetUSDEvolution.name', tokenID, agg], () => getUsdEvolution(tokenID, agg))
}
export const useGetHistory = (tokenId: string) => {
  const selectedAccount = useSettingStore((s) => s.selectAccountName)
  return useQuery(['useGetHistory.name', selectedAccount, tokenId], () => getHistory(selectedAccount, tokenId), {
    enabled: tokenId,
  })
}
const getHistory = async (AccountName: string, tokenId: string) => {
  const account = await getAccountRuntime(AccountName)
  await historyServices.checkCachedHistories()
  const histories = await historyServices.getTxHistoryByPublicKey(
    account.key.keySet.publicKeySerialized, // publicKeySerialized of the account
    tokenId === PRV_TOKEN_ID ? null : tokenId,
  )
  console.log(histories)
  return histories
}

export const useFetchToken = () => {
  return useQuery('useFetchToken.name', getTokenList, { refetchOnWindowFocus: false, refetchInterval: 60 * 60 * 60 })
}

export const useSearchableTokenList = (...searchFields: string[]) => {
  const { data: tokenList } = useFetchToken()
  return useQuery('useSearchableTokenList.name', () => createTokenSearchIndex(Object.values(tokenList), ...searchFields), { enabled: tokenList })
}

export const useSearchableOnlyVerifiedToken = (...searchFields: string[]) => {
  const { data: tokenList } = useFetchToken()
  return useQuery(
    'useSearchableOnlyVerifiedToken.name',
    () =>
      createTokenSearchIndex<TokenItemInterface[]>(
        Object.values(tokenList).filter((i) => i.Verified),
        ...searchFields,
      ),
    { enabled: tokenList },
  )
}

export const getTokenFromTokenIds = (tokenIds: string[]) => {
  const tokens = getFromCache<{ [key: string]: TokenItemInterface }>('useFetchToken.name')
  if (tokens && Object.keys(tokens).length > 0) {
    const filteredTokens = pick(tokens, ...tokenIds)
    return filteredTokens
  }
  return {}
}

export const useGetTokenForAccount = (selectedAccount: string) => {
  const { data: tokenRemoteData } = useFetchToken()
  const { data: wallet } = useGetWallet()
  return useQuery(
    ['useGetTokenForAccount.name', selectedAccount],
    async () => {
      const account = await getAccountRuntime(selectedAccount)
      const tokens = [CONSTANT.WALLET_CONSTANT.PRVIDSTR, ...account.privacyTokenIds]

      const remoteData = tokens.map((TokenId) => {
        const d = get(tokenRemoteData, TokenId)
        return {
          TokenId,
          Name: d?.Name || 'UNKNOWN',
          Icon: d?.Icon || '/logo.png',
          Verified: d?.Verified || false,
        }
      })
      return remoteData
    },
    { enabled: wallet && selectedAccount && tokenRemoteData },
  )
}
export const useGenerateDepositAddress = (tokenId: string) => {
  const selectedAccount = useSettingStore((s) => s.selectAccountName)
  return useQuery(
    [useGenerateDepositAddress.name, tokenId, selectedAccount],
    async () => {
      if (!tokenId || CONSTANT.WALLET_CONSTANT.PRVIDSTR === tokenId) {
        return null
      }
      const account = await getAccountRuntime(selectedAccount)
      const token = (await account.getFollowingPrivacyToken(tokenId)) as any
      const ethDepositAddress = await token.bridgeGenerateDepositAddress()
      return ethDepositAddress
    },
    {
      enabled: [tokenId, selectedAccount],
    },
  )
}

export const useGetTokenBalance = (token: string = CONSTANT.WALLET_CONSTANT.PRVIDSTR, accountName: string | null = null) => {
  const selectedAccount = useSettingStore((s) => s.selectAccountName)
  return useQuery(
    ['useGetTokenBalance.name', accountName, selectedAccount, token],
    () => {
      if (!accountName) {
        return getTokenBalanceForAccount(selectedAccount, token)
      }
      return getTokenBalanceForAccount(accountName, token)
    },
    {
      enabled: selectedAccount,
    },
  )
}

