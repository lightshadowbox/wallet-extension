export const autoLoad = async () => {
  console.log('start connect to background services...')
  await import('./popup/index')
}

autoLoad()
