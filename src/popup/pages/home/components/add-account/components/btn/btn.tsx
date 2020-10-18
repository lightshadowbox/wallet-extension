import React from 'react'
import { SecondaryButton } from 'popup/components/button/button'
import classNames from 'classnames'
import { walletRuntime } from 'services/wallet'

const AddAccount = async (wallet) => {
  const account1 = await wallet.masterAccount.addAccount(`Account ${Math.random()} `, 3)
  console.log('Account with shard ID 3', account1)
  console.log(wallet.masterAccount.getAccounts())
}

export const BtnAdd = () => {
  const addAccountHandle = () => {
    AddAccount(walletRuntime)
  }
  return (
    <div className={classNames('flex flex-row justify-around mt-4')}>
      <SecondaryButton onClick={addAccountHandle} iconProps={{ iconName: 'Add' }}>
        Add
      </SecondaryButton>
      <SecondaryButton iconProps={{ iconName: 'Up' }}>Import</SecondaryButton>
    </div>
  )
}
