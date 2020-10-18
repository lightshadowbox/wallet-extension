import React from 'react'

import { Button } from '@fluentui/react'
import { Meta, Story } from '@storybook/react'

import { useCreateWallet } from './create-account.mutation'
import { useGetWallet } from './use-get-wallet'
import { useIsAlreadyHaveWallet } from './use-is-already-have-wallet'

const HookCreateWallet = () => {
  const [createWallet, status] = useCreateWallet()
  if (status.isError) {
    return <div>{JSON.stringify(status.error)}</div>
  }
  return (
    <div>
      <Button onClick={() => createWallet({ name: 'FAKEKEKE', password: 'PASSSWW' })}>CREATE RANDOM</Button>
    </div>
  )
}

const WalletProfile = () => {
  const wallet = useGetWallet()
  if (wallet.isLoading) {
    return <div>Loading</div>
  }

  if (wallet.error) {
    return <div>ERROR</div>
  }

  return <div>{JSON.stringify(wallet.data, null, 2)}</div>
}

const HookGetWalletExample = () => {
  const isCreated = useIsAlreadyHaveWallet()
  if (isCreated) {
    return <WalletProfile />
  }
  return <HookCreateWallet />
}

const Template = (args) => <HookGetWalletExample {...args} />
export const useGetWalletHook: Story = Template.bind({})

export default {
  title: 'Queries',
  component: HookGetWalletExample,
} as Meta
