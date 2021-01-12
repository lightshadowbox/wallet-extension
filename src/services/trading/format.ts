/* eslint-disable no-restricted-globals */
/* eslint-disable no-restricted-properties */
import { BigNumber } from 'bignumber.js'
import _ from 'lodash'
import { toHumanAmount } from './convert'

export const fixedNumber = (number, digits = 3) => {
  if (isNaN(number) || isNaN(digits)) return NaN
  return Math.trunc(number * Math.pow(10, digits)) / Math.pow(10, digits)
}
const removeTrailingZeroes = (amountString) => {
  let formattedString = amountString
  while (
    formattedString.length > 0 &&
    ((formattedString.includes('.') && formattedString[formattedString.length - 1] === '0') || formattedString[formattedString.length - 1] === '.')
  ) {
    formattedString = formattedString.slice(0, formattedString.length - 1)
  }

  return formattedString
}
export const amountCreator = (maxDigits) => (amount, decimals, clipAmount = false, decimalDigits = false) => {
  try {
    const fmt = {
      decimalSeparator: '.',
      groupSeparator: ',',
      groupSize: 3,
    }

    let _maxDigits = maxDigits

    let _amount = toHumanAmount(amount, decimals)

    if (clipAmount) {
      let maxDigits = decimals
      if (_amount > 0 && _amount < 1 && !!decimalDigits) {
        maxDigits = 5
      }
      if (_amount > 1) {
        maxDigits = 4
      }
      if (_amount > 1e3) {
        maxDigits = 2
      }
      if (_amount > 1e5) {
        maxDigits = 0
      }
      if (decimals) {
        _amount = _.floor(_amount, Math.min(decimals, maxDigits))
      } else {
        _amount = _.floor(_amount, maxDigits)
      }
    }

    if (!Number.isFinite(_amount)) throw new Error('Can not format invalid amount')

    // if amount is too small, do not round it
    if (_amount > 0 && _amount < 1) {
      _maxDigits = undefined
    }

    return _amount ? removeTrailingZeroes(new BigNumber(_amount).toFormat(_maxDigits, BigNumber.ROUND_DOWN, fmt)) : 0
  } catch {
    return amount
  }
}
const AMOUNT_MAX_FRACTION_DIGITS = 4
export const amountFull = amountCreator(AMOUNT_MAX_FRACTION_DIGITS)
export const amount = amountCreator(AMOUNT_MAX_FRACTION_DIGITS)
