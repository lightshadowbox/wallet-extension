import { eventEmitter } from './events'
import { sdk } from './incognito/sdk'
import { walletServices } from './services/wallet'

export const asyncFunc = async () => {
  console.log('hwllooooooo')
  await sdk.initSDK('/privacy.wasm')

  walletServices.listen(eventEmitter)
  console.dir(walletServices.rpc)
}

chrome.runtime.onInstalled.addListener(() => {
  console.log('onInstalled....')
})

chrome.runtime.onStartup.addListener(() => {
  console.log('onStartup....')
})
