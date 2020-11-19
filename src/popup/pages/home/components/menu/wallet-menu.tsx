/* eslint-disable import/no-cycle */
import classNames from 'classnames'
import { FaButton, SecondaryButton } from 'popup/components/button'
import { useTheme } from 'popup/services'
import { fade } from 'popup/services/utils'
import React from 'react'
import { DropdownMenu } from 'popup/pages/home/components/dropdown-menu/dropdown-menu'
import styles from './wallet-menu.module.css'

interface Props {
  showPanel: () => void
  showPanelBackup: () => void
  showPanelAcc: () => void
}
export const WalletMenu: React.FC<Props> = ({ showPanel, showPanelBackup, showPanelAcc }) => {
  const listItem = [
    {
      icon: 'Contact',
      name: 'Account',
      showPanel: showPanelAcc,
      clickHandleName: (name) => console.log('panel'),
    },
    {
      icon: 'Subscribe',
      name: 'Backup',
      showPanel: showPanelBackup,
      clickHandleName: (name) => console.log('panel'),
    },
    {
      icon: 'Lock',
      name: 'Lock',
      showPanel: null,
      clickHandleName: (name) => console.log('panel'),
    },
    {
      icon: 'ChromeFullScreen',
      name: 'Full Screen',
      showPanel: null,
      clickHandleName: (name) => console.log('panel'),
    },
    {
      icon: 'InfoSolid',
      name: 'About us',
      showPanel: () => null,
      clickHandleName: (name) => console.log('panel'),
    },
    {
      icon: 'Leave',
      name: 'Log out',
      showPanel: () => null,
      clickHandleName: (name) => console.log('panel'),
    },
  ]
  const [isOpen, setIsOpen] = React.useState(false)
  const onOpenMenuClick = React.useCallback(() => {
    if (isOpen) {
      const node = document.querySelector('.menu .dropdown') as HTMLElement
      node.style.animation = 'none'
      node.style.animation = 'dropdownOut 0.3s'
      return setTimeout(() => {
        node.style.animation = 'dropdownIn 0.3s'
        setIsOpen(!isOpen)
      }, 200)
    }
    return setIsOpen(!isOpen)
  }, [isOpen])
  const theme = useTheme()
  return (
    <>
      <SecondaryButton
        textColor={theme.palette.white}
        backgroundColor={fade(theme.palette.white, 0.2)}
        menuIconProps={{ iconName: 'ChevronDown' }}
        coverSize="small"
        rounded
        onClick={showPanel}
      >
        DAppChain
      </SecondaryButton>
      <SecondaryButton
        textColor={theme.palette.white}
        backgroundColor={fade(theme.palette.white, 0.2)}
        menuIconProps={{ iconName: 'ChevronDown' }}
        coverSize="small"
        spacious
        rounded
      >
        USD
      </SecondaryButton>
      <div className={classNames('flex-grow')} />
      <div className={classNames('relative menu')}>
        {isOpen ? (
          <div className={`absolute dropdown ${styles.dropdownContainer}`}>
            <DropdownMenu listItem={listItem} onOpenMenuClick={onOpenMenuClick} />
          </div>
        ) : null}
        <FaButton onClick={onOpenMenuClick} iconProps={{ iconName: 'MoreVertical' }} iconColor={theme.palette.white} />
      </div>
    </>
  )
}
