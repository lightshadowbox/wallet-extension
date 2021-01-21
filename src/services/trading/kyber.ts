import axios from 'axios'
import { sortBy } from 'lodash'
import { API_BASE_URL } from 'constants/api'
import BigNumber from 'bignumber.js'

const CRYPTO_SYMBOL = {
  ETH: 'ETH',
}
const ERC20_NETWORK = {
  Kyber: 'Kyber',
  Uniswap: 'Uniswap',
  PDex: 'Incognito',
}
export const MIN_PERCENT = 0.99
export async function getKyberQuote({ sellToken, sellAmount, buyToken }) {
  let sellAddress = sellToken.address
  let buyAddress = buyToken.address
  if (sellToken.symbol === CRYPTO_SYMBOL.ETH) {
    sellAddress = '0x0000000000000000000000000000000000000000'
  }

  if (buyToken.symbol === CRYPTO_SYMBOL.ETH) {
    buyAddress = '0x0000000000000000000000000000000000000000'
  }
  const url = `${API_BASE_URL}/uniswap/rate?SrcToken=${sellAddress}&DestToken=${buyAddress}&AmountIn=${sellAmount}`
  const rates: any = await axios.get(url)
  console.log(rates)
  const bestRate = rates?.data.Result.ListRate?.find((rate) => rate?.DappName === rates?.data.Result.DappName)
  let expectAmount
  let protocol
  let dAppAddress
  let maxAmountIn
  let maxAmountOut
  const priorityList = {}
  if (bestRate) {
    try {
      maxAmountIn = new BigNumber(bestRate?.AmountInput || rates?.AmountInput || 0).dividedToIntegerBy(1).toNumber()
      maxAmountOut = new BigNumber(bestRate?.AmountOutput || rates?.AmountOutput || 0).dividedToIntegerBy(1).toNumber()
      expectAmount = bestRate?.ExpectedRate || rates?.ExpectedRate
      protocol = bestRate?.DappName || rates?.DappName
      dAppAddress = bestRate?.DappAddress || rates?.DappAddress
      const priorityArray = sortBy(bestRate?.Fee || [], ['PRVAmount'])
      priorityArray.forEach((priority, index) => {
        const key = priority?.Name.toUpperCase()
        const tradingFee = new BigNumber(priority?.PRVAmount || 0).dividedToIntegerBy(1).toNumber() || 0
        const gasPrice = priority?.GasPrice
        const number = ++index
        priorityList[key] = { key, tradingFee, number, gasPrice }
      })
    } catch (e) {
      console.debug('ERROR', e)
    }
  }
  const data = {
    maxAmountOut,
    maxAmountIn,
    expectAmount,
    protocol,
    dAppAddress,
    priorityList,
    network: ERC20_NETWORK.Kyber || ERC20_NETWORK.PDex,
    crossTrade: ERC20_NETWORK.Kyber === ERC20_NETWORK.PDex,
  }
  console.debug('RESPONSE GETTING QUOTE ERC20 BEST RATE: ', bestRate)
  console.debug('RESPONSE GETTING QUOTE ERC20 DATA: ', data)
  return data
}
