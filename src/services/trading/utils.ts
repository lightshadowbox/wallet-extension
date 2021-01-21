import _ from 'lodash'
import { BigNumber } from 'bignumber.js'
import { PRV } from './fee/pairsData'

export const calculateOutputValue = (pair, inputToken, inputValue, outputToken) => {
  try {
    if (!pair) {
      return 0
    }
    const inputPool = pair[inputToken.id]

    const outputPool = pair[outputToken.id]
    const initialPool = inputPool * outputPool

    const newInputPool = inputPool + inputValue
    const newOutputPoolWithFee = _.ceil(initialPool / newInputPool)
    console.log('input', outputPool - initialPool)
    return outputPool - newOutputPoolWithFee
  } catch (error) {
    console.debug('CALCULATE OUTPUT', error)
  }
}
export const calculateInputValue = (pair, inputToken, outputValue, outputToken) => {
  try {
    const inputPool = pair[inputToken.id]
    const outputPool = pair[outputToken.id]
    const initialPool = inputPool * outputPool
    return _.ceil(initialPool / (outputPool - outputValue)) - inputPool
  } catch (error) {
    console.debug('CALCULATE OUTPUT', error)
  }
}
export const calculateInputValueCrossPool = (pairs, inputToken, outputValue, outputToken) => {
  const firstPair = _.get(pairs, 0)
  const secondPair = _.get(pairs, 1)

  let currentOutputToken = inputToken
  let inputValue = outputValue

  if (secondPair) {
    inputValue = calculateInputValue(secondPair, PRV, inputValue, outputToken)
    currentOutputToken = PRV
    inputValue = calculateInputValue(firstPair, inputToken, inputValue, currentOutputToken)
  } else {
    inputValue = calculateInputValue(firstPair, currentOutputToken, inputValue, outputToken)
  }

  if (inputValue < 0) {
    inputValue = 0
  }

  return inputValue
}
export const calculateOutputValueCrossPool = (pairs, inputToken, inputValue, outputToken) => {
  const firstPair = _.get(pairs, 0)
  const secondPair = _.get(pairs, 1)

  let currentInputToken = inputToken
  let outputValue = inputValue

  if (secondPair) {
    outputValue = calculateOutputValue(firstPair, currentInputToken, outputValue, PRV)
    currentInputToken = PRV
  }

  outputValue = calculateOutputValue(secondPair || firstPair, currentInputToken, outputValue, outputToken)

  if (outputValue < 0) {
    outputValue = 0
  }

  return outputValue
}
const getImpact = (input, output) => {
  input = new BigNumber(input)
  output = new BigNumber(output)
  return output.minus(input).dividedBy(input).multipliedBy(100).toNumber()
}
