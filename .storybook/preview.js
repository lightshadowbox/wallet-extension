import React from 'react'

import { addDecorator } from '@storybook/react'

import Layout from './layout'

addDecorator((storyFn) => <Layout>{storyFn()}</Layout>)


export const parameters = {
  actions: { argTypesRegex: '^on[A-Z].*' },
  viewport: {
    viewports: {
      extensionView: {
        name: 'ExtensionView',
        styles: {
          width: '380px',
          height: '600px',
        },
      },
    },
    defaultViewport: 'extensionView',
  },
}
