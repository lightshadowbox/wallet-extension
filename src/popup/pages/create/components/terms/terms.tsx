import React from 'react'
import { Link } from '@fluentui/react'
import styles from './terms.module.css'

interface Props {
  text: string
  href: string
}

export const Terms: React.FC<Partial<Props>> = ({ text, href }) => {
  return (
    <div className={styles.terms}>
      <Link className={styles.link} href={href || '/'}>{text || 'Privacy terms and conditions'}</Link>
    </div>
  )
}
