import React from 'react'
import QRCode from 'qrcode.react'
import styles from './qr-code.module.css'

export const QRCodeWallet = ({ keyAddress }) => {
  return (
    <div className={styles.qrCodeContainer}>
      <QRCode id="qrcode" value={keyAddress} size={200} level="H" includeMargin />
    </div>
  )
}
