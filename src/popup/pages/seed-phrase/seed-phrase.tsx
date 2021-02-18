import React from 'react'
import { Header, WarningMessage, Button } from 'popup/components'
import { downloadBackupWallet } from 'services/wallet'
import './seed-phrase.css'

export const SeedPhrase = ({ dismissPanel }) => {
  const onHandleDownloadSeed = () => {
    downloadBackupWallet()
    localStorage.setItem('isDownloadBackup', JSON.stringify(true))
    dismissPanel()
  }
  return (
    <div className="seed-phrase flex flex-col">
      <Header title="Seed Phrase" dismissPanel={dismissPanel} />
      <div className="content h-full flex flex-col justify-between">
        <div>
          <div className="phrase mt-2">
            <p>If you ever change browser or move computers, you will need this seed phrase to access your accounts. Save them safe and secret.</p>
          </div>
          <div className="mt-4">
            <WarningMessage title="Do not share this phrase with anyone!" content="This words can be used to steal all of your accounts." />
          </div>
        </div>
        <div onClick={onHandleDownloadSeed} className="w-full flex flex-col">
          <Button>Download Seed Phrase</Button>
        </div>
      </div>
    </div>
  )
}
