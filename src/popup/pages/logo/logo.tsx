import React from 'react'
import { Image } from '@fluentui/react'
import LogoImage from 'popup/assets/lsb-logo.png'
import styles from './logo.module.css'

export const Logo = ({ welcomeBack }) => {
  return (
    <div className={`flex flex-col justify-center items-center ${styles.logoContainer}`}>
      <Image width={140} height={60} src={LogoImage} alt="Example with no image fit value and no height or width is specified." />
      {welcomeBack ? <h3 className="mt-6 font-bold">Welcome Back!</h3> : null}
      <p className={`text-center w-full ${styles.textLogo}`}>Your journey to privacy starts here</p>
    </div>
  )
}
