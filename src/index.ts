import { initializeIcons } from '@fluentui/react'

export const autoLoad = async () => {
  initializeIcons()
  await import('./popup/index')
}

autoLoad()
