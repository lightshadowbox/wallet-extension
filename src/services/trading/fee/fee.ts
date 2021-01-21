import { MAX_DEX_FEE, MAX_PDEX_TRADE_STEPS } from 'constants/fee.constant'
import { PRV_ID } from 'constants/constants'
import { PRV } from './pairsData'
import { calculateOutputValue } from '../utils'

export const estimateFeeTrade = ({ inputToken, outputToken, pairs }) => {
  let fee = MAX_DEX_FEE
  let feeToken = PRV
  if (inputToken.id === PRV_ID || outputToken.id !== PRV_ID) {
    fee = MAX_DEX_FEE * 4
    feeToken = PRV
    return {
      fee,
      feeToken,
    }
  }

  const prvPair = (pairs || []).find((item) => item.keys.includes(inputToken.id) && item.keys.includes(PRV_ID) && item[PRV_ID] > 10000 * 1e9)
  const prvFee = MAX_DEX_FEE

  if (inputToken.id !== PRV_ID && prvPair) {
    const outputValue = Math.max(calculateOutputValue(prvPair, PRV, prvFee, inputToken), MAX_PDEX_TRADE_STEPS * 20)
    console.log(outputValue)
    feeToken = inputToken
    fee = outputValue * 4
  } else {
    fee = prvFee
    feeToken = PRV
  }

  return {
    fee,
    feeToken,
  }
}
