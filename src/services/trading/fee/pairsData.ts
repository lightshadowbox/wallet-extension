import _ from 'lodash'
import { getAllTradingTokens } from '../kyber'
import { toRealTokenValue } from '../convert'

export const BIG_COINS = {
  PRV: '0000000000000000000000000000000000000000000000000000000000000004',
  USDT: '716fd1009e2a1669caacc36891e707bfdf02590f96ebd897548e8963c95ebac0',
  BTC: 'b832e5d3b1f01a4f0623f7fe91d6673461e1f5d37d91fe78c5c2e6183ff39696',
  ETH: 'ffd8d42dc40a8d166ea4848baf8b5f6e912ad79875f4373070b59392b1756c8f',
  BUSD: '9e1142557e63fd20dee7f3c9524ffe0aa41198c494aa8d36447d12e85f0ddce7',
  USDC: '1ff2da446abfebea3ba30385e2ca99b0f0bbeda5c6371f4c23c939672b429a42',
  BNB: 'b2655152784e8639fa19521a7035f331eea1f1e911b2f3200a507ebb4554387b',
  DAI: '3f89c75324b46f13c7b036871060e641d996a24c09b3065835cb1d38b799d6c1',
  SAI: 'd240c61c6066fed0535df9302f1be9f5c9728ef6d01ce88d525c4f6ff9d65a56',
  TUSD: '8c3a61e77061265aaefa1e7160abfe343c2189278dd224bb7da6e7edc6a1d4db',
  TOMO: 'a0a22d131bbfdc892938542f0dbe1a7f2f48e16bc46bf1c5404319335dc1f0df',
  LINK: 'e0926da2436adc42e65ca174e590c7b17040cd0b7bdf35982f0dd7fc067f6bcf',
  BAT: '1fe75e9afa01b85126370a1583c7af9f1a5731625ef076ece396fcc6584c2b44',
  BAND: '2dda855fb4660225882d11136a64ad80effbddfa18a168f78924629b8664a6b3',
  ZRX: 'de395b1914718702687b477703bdd36e52119033a9037bb28f6b33a3d0c2f867',
  FTM: 'd09ad0af0a34ea3e13b772ef9918b71793a18c79b2b75aec42c53b69537029fe',
  ZIL: '880ea0787f6c1555e59e3958a595086b7802fc7a38276bcd80d4525606557fbc',
  MCO: 'caaf286e889a8e0cee122f434d3770385a0fd92d27fcee737405b73c45b4f05f',
  GUSD: '465b0f709844be95d97e1f5c484e79c6c1ac51d28de2a68020e7313d34f644fe',
  PAX: '4a790f603aa2e7afe8b354e63758bb187a4724293d6057a46859c81b7bd0e9fb',
  KCS: '513467653e06af73cd2b2874dd4af948f11f1c6f2689e994c055fd6934349e05',
  OMG: '249ca174b4dce58ea6e1f8eda6e6f74ab6a3de4e4913c4f50c15101001bb467b',
  XMR: 'c01e7dc1d1aba995c19b257412340b057f8ad1482ccb6a9bb0adce61afbf05d4',
  ETH_TESTNET: 'ffd8d42dc40a8d166ea4848baf8b5f6e9fe0e9c30d60062eb7d44a8df9e00854',
}

export const PRIORITY_LIST = [
  BIG_COINS.PRV,
  BIG_COINS.USDC,
  BIG_COINS.USDT,
  BIG_COINS.DAI,
  BIG_COINS.BTC,
  BIG_COINS.ETH_TESTNET,
  BIG_COINS.ETH,
  BIG_COINS.XMR,
  BIG_COINS.BUSD,
  BIG_COINS.TUSD,
  BIG_COINS.GUSD,
  BIG_COINS.SAI,
  BIG_COINS.PAX,
  BIG_COINS.BNB,
  BIG_COINS.MCO,
  BIG_COINS.LINK,
  BIG_COINS.KCS,
  BIG_COINS.OMG,
  BIG_COINS.TOMO,
  BIG_COINS.BAND,
  BIG_COINS.ZRX,
  BIG_COINS.FTM,
  BIG_COINS.ZIL,
]
export const getPrivacyTokens = () => {
  return fetch('https://api-service.incognito.org/pcustomtoken/list?tokenId=undefined')
    .then((res) => res.json())
    .then((result) => {
      return result.Result
    })
    .catch((err) => console.log(err))
}
export const getTokenList = () => {
  return fetch('https://api-service.incognito.org/ptoken/list')
    .then((res) => res.json())
    .then((result) => {
      return result.Result
    })
    .catch((err) => console.log(err))
}
export const getPDEState = () => {
  return fetch('https://device-network.incognito.org/chain', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      jsonrpc: '1.0',
      method: 'getpdestate',
      params: [],
      id: 1,
    }),
  })
    .then((res) => res.json())
    .then((result) => result.Result)
    .catch((err) => console.log(err))
}
export const PRV = {
  id: '0000000000000000000000000000000000000000000000000000000000000004',
  name: 'Privacy',
  displayName: 'Privacy',
  symbol: 'PRV',
  pDecimals: 9,
  hasIcon: true,
  originalSymbol: 'PRV',
  isVerified: true,
}
export const mergeTokens = (chainTokens, pTokens) => {
  return [
    PRV,
    ..._([...chainTokens, ...pTokens])
      .uniqBy((item) => item.tokenId || item.id)
      .map((item) => {
        const pToken = pTokens.find((token) => token.tokenId === (item.tokenId || item.id))

        if (pToken && pToken.symbol === 'ETH' && pToken.currencyType === 1) {
          pToken.address = '0x0000000000000000000000000000000000000000'
        }

        return {
          ...item,
          address: pToken?.address || pToken?.contractId,
          id: item.tokenId || item.id,
          pDecimals: Math.min(pToken?.pDecimals || 0, 9),
          decimals: pToken?.decimals,
          hasIcon: !!pToken,
          symbol: pToken?.symbol || item.symbol,
          displayName: pToken ? `Privacy ${pToken.symbol}` : `Incognito ${item.name}`,
          name: pToken ? pToken.name : item.name,
          isVerified: item.verified || pToken?.verified,
        }
      })
      .orderBy(
        [
          'hasIcon',
          (item) => (PRIORITY_LIST.indexOf(item?.id) > -1 ? PRIORITY_LIST.indexOf(item?.id) : 100),
          (item) => _.isString(item.symbol) && item.symbol.toLowerCase(),
        ],
        ['desc', 'asc'],
      )
      .value(),
  ]
}
export const getPairsData = async () => {
  try {
    const now = Date.now()
    const [pTokens, chainTokens, chainPairs, erc20Tokens] = await Promise.all([getTokenList(), getPrivacyTokens(), getPDEState(), getAllTradingTokens()])
    const tokens = mergeTokens(chainTokens, pTokens)
    const end = Date.now()
    console.log(chainPairs)
    console.debug('LOAD PAIRS IN: ', end - now)
    const pairs = _(chainPairs.PDEPoolPairs)
      .map((pair) => ({
        [pair.Token1IDStr]: pair.Token1PoolValue,
        [pair.Token2IDStr]: pair.Token2PoolValue,
        total: toRealTokenValue(tokens, pair.Token1IDStr, pair.Token1PoolValue) + toRealTokenValue(tokens, pair.Token2IDStr, pair.Token2PoolValue),
        keys: [pair.Token1IDStr, pair.Token2IDStr],
      }))
      .filter((pair) => pair.keys.includes(BIG_COINS.PRV))
      .filter((pair) => pair.total)
      .orderBy('total', 'desc')
      .value()
    const shares = chainPairs.PDEShares
    Object.keys(shares).forEach((key) => {
      if (shares[key] === 0) {
        delete shares[key]
      }
    })
    let pairTokens = tokens.filter((token) => token && pairs.find((pair) => pair.keys.includes(token.id)))

    pairTokens = pairTokens.concat(erc20Tokens.filter((token) => !pairTokens.find((item) => item.id === token.id)))
    pairTokens = _(pairTokens)
      .map((token) => {
        const erc20Token = erc20Tokens.find((item) => item.id === token.id)
        let priority = PRIORITY_LIST.indexOf(token?.id)
        priority = priority > -1 ? priority : erc20Token ? PRIORITY_LIST.length : PRIORITY_LIST.length + 1

        return {
          ...token,
          address: erc20Token?.address,
          priority,
          verified: token.verified,
        }
      })
      .orderBy(['priority', 'hasIcon', 'verified'], ['asc', 'desc', 'desc'])
      .value()
    console.log('pairs', pairs)
    console.log('pairs Token', pairTokens)
    return {
      pairs,
      pairTokens,
      tokens,
      shares,
      erc20Tokens,
    }
  } catch (err) {
    console.log(err)
  }
}
