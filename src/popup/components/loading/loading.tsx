import React from 'react'
import { SpinnerWallet } from 'popup/components'
import './loading.css'

export const Loading = () => {
  return (
    <div className="loading-container">
      <SpinnerWallet />
    </div>
  )
}
