import React from 'react'
import Countdown from 'react-countdown-now'
import styles from './CountDown.module.css'

interface Props {
  address: string
}
const renderer = ({ hours, minutes, seconds, completed }) => {
  if (completed) {
    return <span>Please try shield again</span>
  }
  return (
    <span className={styles.time}>
      {hours} : {minutes} : {seconds}
    </span>
  )
}
export const CountDown = () => {
  return <Countdown date={Date.now() + 3600000} renderer={renderer} />
}
