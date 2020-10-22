import React from 'react'
import { Image } from '@fluentui/react'
import LogoImage from 'popup/assets/lsb-logo.png'
import styles from './logo.module.css'

export const Logo = () => {
  return (
    <div className={`flex flex-col justify-center items-center ${styles.logoContainer}`}>
      <Image width={140} height={60} src={LogoImage} alt="Example with no image fit value and no height or width is specified." />
      <p className={`text-center w-full ${styles.textLogo}`}>Welcome to a crypto wallet that trusted by over 1 million users worldwide.</p>
    </div>
  )
}
