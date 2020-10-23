import * as i from 'incognito-sdk'
import BN from 'bn.js'

/**
 *
 * @param {nanoAmountPRV : number} nanoAmountPRV
 */
export const toPRV = (nanoAmountPRV: BN) => nanoAmountPRV.div(new BN(i.CONSTANT.WALLET_CONSTANT.NanoUnit)).toNumber()

/**
 *
 * @param {amountPRV : number} amountPRV
 */
export const toNanoPRV = (amountPRV: number) => Number(amountPRV * i.CONSTANT.WALLET_CONSTANT.NanoUnit)
