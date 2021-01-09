import axios from 'axios'
import { API_BASE_URL } from 'constants/api'

export async function get0xTokens() {
    const url = `${API_BASE_URL}/uniswap/list0xtokens`;
    const data = await axios.get(url)
    return data
}