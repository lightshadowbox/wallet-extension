import _ from 'lodash';
import BigNumber from 'bignumber.js';

const checkAmount = amount => {
  if (!Number.isFinite(amount))
    throw new Error('Can not format invalid amount');
};

export function getDecimalSeparator() {
  return ".";
}

const replaceDecimals = (text, autoCorrect = false) => {
  if (typeof text !== 'string') {
    return text;
  }

  if (
    getDecimalSeparator() === ',' &&
    !text?.includes?.('e+') &&
    !text?.includes?.('e-')
  ) {
    text = text.replace(/\./g, '_');
    text = text.replace(/,/g, '.');
    text = text.replace(/_/g, ',');
  }

  if (autoCorrect) {
    text = text.replace(/,/g, '');
  }

  return text;
};

const toNumber = (text, autoCorrect = false) => {
  const number = replaceDecimals(text, autoCorrect);

  return _.toNumber(number);
};

export default {
  /**
   *
   * @param {number} originAmount
   * @param {number} decimals
   * Convert original amount (usualy get from backend) to human readable amount or display on frontend
   */
  toHumanAmount(originAmount, decimals) {
    try {
      const amount = toNumber(originAmount);
      checkAmount(amount);

      const decision_rate = Number(decimals) ? 10 ** Number(decimals) : 1;
      return amount / decision_rate;
    } catch {
      return originAmount;
    }
    /**
     *
     * @param {number} humanAmount
     * @param {number} decimals
     * @param {boolean} round
     * Convert human readable amount (display on frontend) to original amount
     */
  },
  toOriginalAmount(humanAmount, decimals, round = true) {
    const amount = toNumber(humanAmount);
    checkAmount(amount);

    // Use big number to solve float calculation problem
    // For example: 0.5000001 * 1e9 = 500000099.99999994
    // The result should be 500000100
    const decision_rate = Number(decimals) ? 10 ** Number(decimals) : 1;
    if (round) {
      return Math.floor(new BigNumber(amount).multipliedBy(new BigNumber(decision_rate)).toNumber());
    }

    return new BigNumber(amount).multipliedBy(new BigNumber(decision_rate)).toNumber();
  },
};
