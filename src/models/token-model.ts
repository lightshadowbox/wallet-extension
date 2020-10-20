export type TokenModelType = {
  tokenId: string
  name: string
  symbol: string
  isPrivacyToken: boolean
  totalSupply: string
  id: number
  originalSymbol: string
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
