import { concat } from 'lodash'
import { setup } from 'axios-cache-adapter'
import { AxiosError } from 'axios'

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

export default async function () {
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
  }))

  return concat(tokensMapped, customTokenMapped)
}
