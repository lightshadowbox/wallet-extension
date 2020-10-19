import * as i from 'incognito-sdk'
/**
 *
 * @param {nanoAmountPRV : number} nanoAmountPRV
 */
export const toPRV = (nanoAmountPRV: i.BN) => nanoAmountPRV.div(new i.BN(i.CONSTANT.WALLET_CONSTANT.NanoUnit)).toNumber()

/**
 *
 * @param {amountPRV : number} amountPRV
 */
export const toNanoPRV = (amountPRV: number) => Number(amountPRV * i.CONSTANT.WALLET_CONSTANT.NanoUnit)
