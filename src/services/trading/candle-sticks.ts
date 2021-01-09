import axios from 'axios'
import { useQuery } from 'react-query'

function getSecondTimestamp() {
  return Math.round(new Date().getTime() / 1000)
}
// function getDdMmYyyy(timestamp: number) {
//   const date = new Date(timestamp)
//   return { day: date.getDate(), month: date.getMonth() + 1, year: date.getFullYear() }
// }

function reversePair(pair: string) {
  const pairs = pair.split('-')
  return `${pairs[1]}-${pairs[0]}`
}
export interface PairCandleStickModel {
  time: any
  open: number
  close: number
  high: number
  low: number
}

export type PairCandleGranuality = '1HOUR' | '6HOURS' | '1DAY'
const G = { '1HOUR': 3600, '6HOURS': 21600, '1DAY': 86400 }

export const getCandleSticks = async (pair: string, granuality: PairCandleGranuality) => {
  try {
    const end = getSecondTimestamp()
    const baseUrl = 'https://api.incscan.io/pdex/candles'
    let url = `${baseUrl}/${pair}?granularity=${G[granuality]}&start=1568551184&end=${end}&reversed=false`
    let res = await axios.get<Array<PairCandleStickModel>>(url)

    if (res.data.length === 0) {
      url = `${baseUrl}/${reversePair(pair)}?granularity=${G[granuality]}&start=1568551184&end=${end}&reversed=true`
      res = await axios.get<Array<PairCandleStickModel>>(url)
    }

    return res.data
  } catch (error) {
    console.error(error)
  }
  return []
}

export const useCandleSticks = (pair: string, granuality: PairCandleGranuality) => {
  return useQuery(`${getCandleSticks.name}/${pair}/${granuality}`, () => getCandleSticks(pair, granuality))
}
