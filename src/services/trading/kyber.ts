import axios from 'axios'
import _ from 'lodash';
import { API_BASE_URL } from 'constants/api'
import BigNumber from 'bignumber.js';


export async function getKyberTokens() {
    const url = `${API_BASE_URL}/uniswap/tokens`;
    const data = await axios.get(url)
    return data
}
const CRYPTO_SYMBOL = {
    ETH: 'ETH'
}
export const MIN_PERCENT = 0.99;
export async function getKyberQuote({sellToken , sellAmount, buyToken}) {
    let sellAddress = sellToken;
    let buyAddress = buyToken;
    if (sellToken.symbol === CRYPTO_SYMBOL.ETH) {
        sellAddress = '0x0000000000000000000000000000000000000000';
    }
    
    if (buyToken.symbol === CRYPTO_SYMBOL.ETH) {
        buyAddress = '0x0000000000000000000000000000000000000000';
    }
    const url = `${API_BASE_URL}/uniswap/rate?SrcToken=${sellAddress}&DestToken=${buyAddress}&Amount=${sellAmount}`;
    const rates:any = await axios.get(url);
    const bestRate = _.maxBy(rates.ListRate, (rate: any) => new BigNumber(rate.ExpectedRate).toNumber());
    console.log(bestRate)
    const {ExpectedRate, SlippageRate, MaxAmountOut} = bestRate;
    const originalSellAmount = new BigNumber(sellAmount)
    .dividedBy(new BigNumber(10).pow(sellToken.decimals));
  const originalPrice = new BigNumber(ExpectedRate)
    .dividedBy( new BigNumber(10).pow(18));
  const amount = new BigNumber(originalPrice)
    .multipliedBy(originalSellAmount)
    .multipliedBy(new BigNumber(10).pow(buyToken.decimals));
  const maxAmountOut = new BigNumber(MaxAmountOut)
    .multipliedBy(MIN_PERCENT)
    .toFixed(0);

  const maxPrice = new BigNumber(SlippageRate)
    .dividedBy(new BigNumber(10).pow(18));
  const minimumAmount = new BigNumber(maxPrice)
    .multipliedBy(originalSellAmount)
    .multipliedBy(new BigNumber(10).pow(buyToken.decimals));
}