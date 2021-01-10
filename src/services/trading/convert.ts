import _ from 'lodash';
import BigNumber from 'bignumber.js';
const checkAmount = amount => {
    if (!Number.isFinite(amount))
      throw new Error('Can not format invalid amount');
}
const replaceDecimals = (text, autoCorrect = false) => {
    if (typeof text !== 'string') {
      return text;
    }
  
    if (
      '.' === ',' &&
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
}
export const  toHumanAmount = (originAmount, decimals)  => {
    try {
        const amount = toNumber(originAmount);
        checkAmount(amount);
  
        const decision_rate = Number(decimals) ? 10 ** Number(decimals) : 1;
        return amount / decision_rate;
      } catch {
        return originAmount;
      } 
}