import React from 'react'
import { getBackupAccount } from 'services/wallet'
import { useGetWallet } from 'queries/wallet.queries'
import { AccountModelType } from 'models/account-model'
import { SpinnerWallet } from 'popup/components/spinner/spinner-wallet'
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
  const accounts = useGetWallet()
  const selectedAccount = useSettingStore((s) => s.selectAccountName)
  const [preAccount, setPreAccount] = React.useState(null)
  const [listItem, setListItem] = React.useState([])
  const onChangeOption = async (accountName) => {
    const account = await getBackupAccount(accountName)
    setPreAccount(accountName)
    changeAccount(account)
  }
  React.useEffect(() => {
    if (accounts) {
      const temp = accounts.data.masterAccount.child.map((account) => {
        return {
          name: account.name,
          icon: 'Contact',
          showPanel: () => {},
          clickHandleName: onChangeOption,
        }
      })
      setListItem(temp)
    }
  }, [accounts.isSuccess])
  const onOpenMenuClick = React.useCallback(() => {
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
  }, [isOpen])
  if (status !== 'loading') {
    return (
      <div onClick={onOpenMenuClick} className={`${styles.container} select-account`} onChange={onChangeOption}>
        <img className="send-icon mr-2" alt="hinh anh" src="https://picsum.photos/200" />
        <p>{preAccount || selectedAccount}</p>
        {isOpen ? (
          <div className={`absolute dropdown ${styles.dropdownContainer}`}>
            <DropdownMenu listItem={listItem} onOpenMenuClick={onOpenMenuClick} />
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
