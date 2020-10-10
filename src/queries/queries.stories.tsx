import React from 'react'

import {
  Meta,
  Story
} from '@storybook/react'

import { useGetTokenList } from './use-get-token-list'
import { useGetWallet } from './use-get-wallet'

const HookGetWalletExample = () => {
  const wallet = useGetWallet()

  if (wallet.isLoading) {
    return <div>Loading</div>
  }
  if (wallet.error) {
    return <div>{JSON.stringify(wallet.error)}</div>
  }

  return <div>{JSON.stringify(wallet.data, null, 2)}</div>
}

const Template = (args) => <HookGetWalletExample {...args} />
export const useGetWalletHook: Story = Template.bind({})

const HookGetTokenListExample = () => {
  const tokens = useGetTokenList('Account 0')
  return <div>{JSON.stringify(tokens, null, 2)}</div>
}

export const useGetTokenListExample: Story = (args) => <HookGetTokenListExample {...args} />

export default {
  title: 'Queries',
  component: HookGetWalletExample,
} as Meta
