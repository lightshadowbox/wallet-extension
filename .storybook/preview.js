import React from 'react'
import { addDecorator } from '@storybook/react'
import { withInfo } from '@storybook/addon-info'
import Layout from './layout'

addDecorator((storyFn) => <Layout>{storyFn()}</Layout>)
addDecorator(
  withInfo({
    inline: true,
    styles: (base) => ({
      ...base,
      infoBody: {
        ...base.infoBody,
        padding: 16,
      },
      source: {
        h1: {
          margin: '20px 0',
          padding: '0 0 5px 0',
          fontSize: '25px',
          borderBottom: '1px solid #EEE',
        },
      },
    }),
    propTablesExclude: [Layout],
  }),
)

export const parameters = {
  actions: { argTypesRegex: '^on[A-Z].*' },
}
