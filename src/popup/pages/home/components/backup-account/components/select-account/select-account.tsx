import React from 'react'
import { getBackupAccount } from 'services/wallet'
import { AccountModelType } from 'models/account-model'
import { SpinnerWallet } from 'popup/components'
import { useSettingStore } from 'popup/stores/features/settings'
import { DropdownMenu } from 'popup/pages/home/components/dropdown-menu/dropdown-menu'
import styles from './select-account.module.css'
import './select-account.css'

export const SelectAccount: React.FC<{ changeAccount: (accountName: AccountModelType) => void; data: any; status: string }> = ({
  changeAccount,
  data,
  status,
}) => {
  const [isOpen, setIsOpen] = React.useState(false)
  const selectedAccount = useSettingStore((s) => s.selectAccountName)
  const [preAccount, setPreAccount] = React.useState(null)
  const onChangeOption = React.useCallback(
    async (accountName) => {
      const account = await getBackupAccount(accountName)
      setPreAccount(accountName)
      changeAccount(account)
    },
    [setPreAccount, changeAccount],
  )
  const onOpenMenuClick = () => {
    if (isOpen) {
      const node = document.querySelector('.backupAccount .dropdown') as HTMLElement
      node.style.animation = 'none'
      node.style.animation = 'dropdownOut 0.3s'
      return setTimeout(() => {
        node.style.animation = 'dropdownIn 0.3s'
        setIsOpen(!isOpen)
      }, 200)
    }
    return setIsOpen(!isOpen)
  }

  if (status !== 'loading') {
    return (
      <div className={`${styles.container} select-account`} onChange={onChangeOption}>
        <img className="send-icon mr-2" alt="hinh anh" src="https://picsum.photos/200" />
        <p>{preAccount || selectedAccount}</p>
        {isOpen ? (
          <div className={`absolute dropdown ${styles.dropdownContainer}`}>
            <DropdownMenu listItem={[]} onOpenMenuClick={onOpenMenuClick} />
          </div>
        ) : null}
      </div>
    )
  }
  return (
    <div className="h-full w-full">
      <SpinnerWallet />
    </div>
  )
}
