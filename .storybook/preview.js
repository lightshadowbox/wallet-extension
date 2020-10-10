import React from 'react'
import { addDecorator } from '@storybook/react'
import { withInfo } from '@storybook/addon-info'
import Layout from './layout'
import { MINIMAL_VIEWPORTS } from '@storybook/addon-viewport'

const customViewports = {
  extensionView: {
    name: 'ExtensionView',
    styles: {
      width: '380px',
      height: '600px',
    },
  },
}

addDecorator((storyFn) => <Layout>{storyFn()}</Layout>)

export const parameters = {
  actions: { argTypesRegex: '^on[A-Z].*' },
  viewport: {
    viewports: { ...MINIMAL_VIEWPORTS, ...customViewports },
    defaultViewport: 'ExtensionView',
  },
}
