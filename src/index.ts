export const autoLoad = async () => {
  await import('./popup/index')
}

autoLoad()
