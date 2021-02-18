import React from 'react'
import QrReader from 'react-qr-scanner'
import styles from './qr-cam.module.css'

export const QRCam: React.FC<{ onHaveValue: (qrcode: string) => void }> = ({ onHaveValue }) => {
  return (
    <div className={styles.QRCamContainer}>
      <p className={styles.text}>Place QR code into device camera</p>
      <QrReader
        style={{
          transform: 'scaleX(-1)',
          maxWidth: 280,
        }}
        delay={800}
        onError={console.error}
        onScan={(value: string) => value && onHaveValue(value)}
      />
    </div>
  )
}
