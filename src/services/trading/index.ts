import _ from 'lodash';
import React from 'react'
import { v4 } from 'uuid';
import { getKyberQuote} from './kyber'
import { amountFull } from './format'

export const caculateOutputWithAPI = (props) => {
    const [outputValue, setOutputValue] = React.useState(0);
    const [outputText, setOutputText] = React.useState('0');
    const [minimumAmount, setMinimumAmount] = React.useState(0);
    const [gettingQuote, setGettingQuote] = React.useState(false);
    const [quote, setQuote] = React.useState(null);
    const { inputToken, inputValue, outputToken } = props;
    let currentDebounceId;
    const getQuote = async (inputToken, outputToken, value, id) => {
        try {
            setGettingQuote(true);
            const quote = await getKyberQuote({
              sellAmount: value,
              sellToken: inputToken,
              buyToken: outputToken
            });
            if (id !== currentDebounceId) {
              return;
            }
            const { maxAmountOut: outputValue } = quote;
            const minimumAmount = outputValue;
            setOutputValue(outputValue);
            setMinimumAmount(minimumAmount);
            if (minimumAmount === 0 || isNaN(minimumAmount)) {
              setOutputText('0');
            } else {
              const outputText = amountFull(minimumAmount, outputToken.pDecimals);
              setOutputText(outputText);
            }
            setQuote(quote);
          } catch (error) {
            setMinimumAmount(0);
            setOutputValue(0);
            setOutputText('0');
            setQuote(null);
          } finally {
            setGettingQuote(false);
          }
    }
    const debouncedGetQuote = React.useCallback(_.debounce(getQuote, 1000), []);
   const setValue = () => {
        if (inputToken && outputToken  && inputValue) {
          if (inputToken.address && outputToken.address) {
            const debounceId = v4();
            setGettingQuote(true);
            debouncedGetQuote(inputToken, outputToken, inputValue, debounceId);
            currentDebounceId = debounceId;
          } 
        }
    
        if (inputToken && outputToken && !inputValue) {
          debouncedGetQuote.cancel();
          setGettingQuote(false);
          currentDebounceId = v4();
        }
    
        if (!inputValue) {
          setOutputValue(0);
          setOutputText('0');
          setMinimumAmount(0);
          setQuote(null);
        }
      }
      setValue()
      console.log(outputValue)
}
