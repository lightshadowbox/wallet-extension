import _ from 'lodash'
import React from 'react'
import { useGetPairsData } from 'services/trading/fee/pairsData'
import { calculateOutputValueCrossPool } from './utils'
import { getKyberQuote } from './kyber'
import { amountFull } from './format'

export const withCalculateOutput = (WrappedComp) => (props) => {
  const [outputValue, setOutputValue] = React.useState(0)
  const [outputText, setOutputText] = React.useState('0')
  const [minimumAmount, setMinimumAmount] = React.useState(0)
  const [gettingQuote, setGettingQuote] = React.useState(false)
  const [quote, setQuote] = React.useState(null)
  const { inputToken, inputValue, outputToken } = props
  const { data, isSuccess } = useGetPairsData()
  const [pair, setPairs] = React.useState([])
  React.useEffect(() => {
    if (isSuccess) {
      setPairs(data.pairs)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSuccess])
  const calculateOutputValue = (pair) => {
    const outputValue = calculateOutputValueCrossPool(pair, inputToken, inputValue, outputToken)
    setOutputValue(outputValue)

    const minimumAmount = _.floor(outputValue * 0.99)
    setMinimumAmount(minimumAmount)

    let outputText = amountFull(minimumAmount, outputToken.pDecimals)

    if (outputValue === 0 || minimumAmount === 0 || _.isNaN(minimumAmount)) {
      outputText = 0
    }

    setQuote(null)
    setOutputText(outputText.toString())
  }
  const getQuote = async (inputToken, outputToken, value, id) => {
    try {
      setGettingQuote(true)
      const quote = await getKyberQuote({
        sellAmount: value,
        sellToken: inputToken,
        buyToken: outputToken,
      })
      const { maxAmountOut: outputValue } = quote
      const minimumAmount = outputValue
      setOutputValue(outputValue)
      setMinimumAmount(minimumAmount)
      if (minimumAmount === 0 || isNaN(minimumAmount)) {
        setOutputText('0')
      } else {
        const outputText = amountFull(minimumAmount, outputToken.PDecimals)
        setOutputText(outputText)
      }
      setQuote(quote)
    } catch (error) {
      setMinimumAmount(0)
      setOutputValue(0)
      setOutputText('0')
      setQuote(null)
    } finally {
      setGettingQuote(false)
    }
  }
  const debouncedGetQuote = React.useCallback(_.debounce(getQuote, 1000), [])
  React.useEffect(() => {
    if (pair.length !== 0) {
      if (inputToken && outputToken && inputValue) {
        calculateOutputValue(pair)
      }

      if (inputToken && outputToken && !inputValue) {
        debouncedGetQuote.cancel()
        setGettingQuote(false)
      }

      if (!inputValue) {
        setOutputValue(0)
        setOutputText('0')
        setMinimumAmount(0)
        setQuote(null)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inputToken, inputValue, outputToken, pair])
  return (
    <WrappedComp
      {...{
        ...props,
        outputValue,
        outputText,
        minimumAmount,
        quote,
        gettingQuote,
      }}
    />
  )
}
