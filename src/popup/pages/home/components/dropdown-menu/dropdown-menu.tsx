/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
import React from 'react'
import { FontIcon } from '@fluentui/react'
import classNames from 'classnames'
import styles from './dropdown-menu.module.css'
import './dropdown-menu.css'

interface Item {
  name: string
  icon: string
  showPanel: () => void
  clickHandleName: (value) => void
}
export const DropdownMenu: React.FC<{ onOpenMenuClick: () => void; listItem: Item[] }> = ({ onOpenMenuClick, listItem }) => {
  const ref = React.useRef<HTMLDivElement>(null)
  const handleClickOutside = (event: Event) => {
    if (ref.current && !ref.current.contains(event.target as Node)) {
      onOpenMenuClick()
    }
  }
  React.useEffect(() => {
    document.addEventListener('click', handleClickOutside, true)
    return () => {
      document.removeEventListener('click', handleClickOutside, true)
    }
  })
  return (
    <div ref={ref} className={classNames(`absolute inset-0 ${styles.dropdownContainer}`)}>
      <ul>
        {listItem.map((a) => (
          <li
            onClick={() => {
              a.showPanel()
              a.clickHandleName(a.name)
              onOpenMenuClick()
            }}
            className={`${styles.dropdownItem} dropdownItem`}
          >
            <FontIcon iconName={a.icon} />
            <p>{a.name}</p>
          </li>
        ))}
      </ul>
    </div>
  )
}
