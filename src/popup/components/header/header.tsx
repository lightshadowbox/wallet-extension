import React from 'react'
import { Label } from '@fluentui/react'
import { FaButton } from 'popup/components'
import styled from './header.module.css'

type Props = {
  title: string
  icon?: string
  iconColor?: string
  dismissPanel: () => void
}
export const Header: React.FC<Props> = ({ title, icon, dismissPanel, iconColor }) => (
  <header>
    <div className={`${styled.headerLayout__main}`}>
      <FaButton className={styled.headerLayout__icon} onClick={dismissPanel} iconProps={{ iconName: icon }} iconColor={iconColor || '#1d1d1d'} />
      <Label className={styled.headerLayout__title}>{title}</Label>
      <div className={styled.headerLayout__divider} />
    </div>
  </header>
)
