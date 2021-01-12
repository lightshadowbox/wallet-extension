import _ from 'lodash'
import { BigNumber } from 'bignumber.js'
import { fixedNumber, amount } from './format'
import { toHumanAmount } from './convert'

const getImpact = (input, output) => {
  input = new BigNumber(input)
  output = new BigNumber(output)
  return output.minus(input).dividedBy(input).multipliedBy(100).toNumber()
}
// export const calculateSizeImpact = (inputValue, inputToken, outputValue, outputToken) => {
//   const { priceUsd: inputPriceUsd, pDecimals: inputPDecimals } = useSelector(selectedPrivacySeleclor.getPrivacyDataByTokenID)(inputToken?.id)
//   const { priceUsd: outputPriceUsd, pDecimals: outputPDecimals } = useSelector(selectedPrivacySeleclor.getPrivacyDataByTokenID)(outputToken?.id)
//   const totalInputUsd = toHumanAmount(inputValue * inputPriceUsd, inputPDecimals)
//   const totalOutputUsd = toHumanAmount(outputValue * outputPriceUsd, outputPDecimals)
//   if (totalInputUsd && totalOutputUsd) {
//     const impact = fixedNumber(getImpact(totalInputUsd, totalOutputUsd), 3)
//     if (!isNaN(impact)) {
//       const formatSeparator = amount(impact)
//       return {
//         impact: impact > 0 ? `+${formatSeparator}` : formatSeparator,
//         showWarning: impact < -5,
//       }
//     }
//   }
//   return {
//     impact: null,
//     showWarning: false,
//   }
// }
