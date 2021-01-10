import axios from 'axios'
import _ from 'lodash'
import { API_BASE_URL } from 'constants/api'
import BigNumber from 'bignumber.js'

export async function getKyberTokens() {
  const url = `${API_BASE_URL}/uniswap/tokens`
  const data = await axios.get(url)
  return data
}
const CRYPTO_SYMBOL = {
  ETH: 'ETH',
}
export const MIN_PERCENT = 0.99
export async function getKyberQuote({ sellToken, sellAmount, buyToken }) {
  let sellAddress = sellToken
  let buyAddress = buyToken
  if (sellToken.symbol === CRYPTO_SYMBOL.ETH) {
    sellAddress = '0x0000000000000000000000000000000000000000'
  }

  if (buyToken.symbol === CRYPTO_SYMBOL.ETH) {
    buyAddress = '0x0000000000000000000000000000000000000000'
  }
  const url = `${API_BASE_URL}/uniswap/rate?SrcToken=${sellAddress}&DestToken=${buyAddress}&Amount=${sellAmount}`
  const rates: any = await axios.get(url)
  console.log(rates)
}
