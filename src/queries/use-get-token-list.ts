import { useGetWallet } from './use-get-wallet'

export const useGetTokenList = (accountName: string) => {
  const wallet = useGetWallet()
  if (!wallet.data) {
    return []
  }
  const account = wallet.data.accounts[accountName]
  return account.followingTokens
}
