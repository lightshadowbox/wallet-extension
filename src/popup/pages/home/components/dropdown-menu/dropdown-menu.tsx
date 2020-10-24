/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
import React from 'react'
import { FontIcon } from '@fluentui/react'
import classNames from 'classnames'
import styles from './dropdown-menu.module.css'
import './dropdown-menu.css'

export const DropdownMenu: React.FC<{ showPanelBackup: () => void; onOpenMenuClick: () => void; showPanelAcc: () => void }> = ({
  showPanelBackup,
  onOpenMenuClick,
  showPanelAcc,
}) => {
  return (
    <div className={classNames(`absolute inset-0 dropdown ${styles.dropdownContainer}`)}>
      <ul>
        <li
          onClick={() => {
            showPanelAcc()
            onOpenMenuClick()
          }}
          className={styles.dropdownItem}
        >
          <FontIcon iconName="Contact" />
          <p>Account</p>
        </li>
        <li
          onClick={() => {
            showPanelBackup()
            onOpenMenuClick()
          }}
          className={styles.dropdownItem}
        >
          <FontIcon iconName="Subscribe" />
          <p>Backup</p>
        </li>
        <li className={styles.dropdownItem}>
          <FontIcon iconName="Lock" />
          <p>Lock</p>
        </li>
        <li className={styles.dropdownItem}>
          <FontIcon iconName="ChromeFullScreen" />
          <p>Full Screen</p>
        </li>
        <li className={styles.dropdownItem}>
          <FontIcon iconName="InfoSolid" />
          <p>About us</p>
        </li>
        <li className={styles.dropdownItem}>
          <FontIcon iconName="Leave" />
          <p>Log out</p>
        </li>
      </ul>
    </div>
  )
}
