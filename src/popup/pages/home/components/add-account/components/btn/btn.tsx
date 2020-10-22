import React from 'react'
import { SecondaryButton } from 'popup/components/button/button'
import classNames from 'classnames'
import { useBoolean } from '@uifabric/react-hooks'
import { ModalAddAccount } from './modal/modal'

export const BtnAdd: React.FC<{ onImportClick: () => void }> = ({ onImportClick }) => {
  const [isModalOpen, { setTrue: showModal, setFalse: hideModal }] = useBoolean(false)
  const addAccountHandle = () => {
    showModal()
    // AddAccount(walletRuntime)
  }
  return (
    <div className={classNames('flex flex-row justify-around mt-4 relative')}>
      <ModalAddAccount isModalOpen={isModalOpen} showModal={showModal} hideModal={hideModal} />
      <SecondaryButton onClick={addAccountHandle} iconProps={{ iconName: 'Add' }}>
        Add
      </SecondaryButton>
      <SecondaryButton onClick={onImportClick} iconProps={{ iconName: 'Up' }}>
        Import
      </SecondaryButton>
    </div>
  )
}
