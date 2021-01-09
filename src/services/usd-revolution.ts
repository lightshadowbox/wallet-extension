import axios from 'axios'

const getSecondTimestamp = () => {
  return Math.round(new Date().getTime() / 1000)
}
export interface TimeValue {
  time: number
  value: number
}

export type AggregationType = '1MONTH' | '6MONTHS' | '1YEAR'
const DAYS = { '1MONTH': 30, '6MONTHS': 182, '1YEAR': 365 }
export interface UsdEvolutionReceived {
  currentAmount: TimeValue[]
  perDayAmount: TimeValue[]
  totalAmount: TimeValue[]
}

export const getUsdEvolution = async (token: string, aggregation: AggregationType) => {
  try {
    const end = getSecondTimestamp()
    const start = end - 86400 * DAYS[aggregation]
    let url = `https://api.incscan.io/shielded-coins/usd-evolution/${token}?start=${start}&end=${end}`

    if (token === 'PRV') {
      url = `https://api.incscan.io/privacy-coin/usd-evolution?start=${start}&end=${end}`
      const res = await axios.get<TimeValue[]>(url)
      return {
        currentAmount: res.data,
        perDayAmount: res.data,
        totalAmount: res.data,
      }
    }

    const res = await axios.get<UsdEvolutionReceived>(url)

    return res.data
  } catch (error) {
    console.error(error)
  }
  return {
    currentAmount: [],
    perDayAmount: [],
    totalAmount: [],
  }
}
