/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import React from 'react'
import { Header, WarningMessage, SecondaryButton } from 'popup/components'
import { useGetBackupWallet } from 'queries/wallet.queries'
import { Icon } from '@fluentui/react'
import { downloadBackupWallet } from 'services/wallet'
import './seed-phrase.css'

export const SeedPhrase = ({ dismissPanel }) => {
  const onDismissPanel = () => {
    localStorage.setItem('isDownloadBackup', JSON.stringify(true))
    dismissPanel()
  }
  return (
    <div className="seed-phrase flex flex-col">
      <Header title="Backup Wallet" dismissPanel={dismissPanel} />
      <div className="content h-full flex flex-col justify-between">
        <div>
          <div className="phrase mt-0">
            <p>This backup wallet contains the password in case you lose your password or forget the password. Save them safe and secret.</p>
          </div>
          <div className="mt-4">
            <WarningMessage title="Do not share this backup with anyone!" content="This words can be used to steal all of your accounts." />
          </div>
          <SeedPhraseText />
        </div>

        <div onClick={onDismissPanel} className="w-full flex flex-col">
          <SecondaryButton>Close</SecondaryButton>
        </div>
      </div>
    </div>
  )
}
export const SeedPhraseText = () => {
  const { data: backupWallet } = useGetBackupWallet()

  const onCopy = () => {
    const text = JSON.stringify(backupWallet)
    const elem = document.createElement('textarea')
    document.body.appendChild(elem)
    elem.value = text
    elem.select()
    document.execCommand('copy')
    document.body.removeChild(elem)
  }
  return (
    <div className="seed-phrase-text">
      <h2>Your private backup wallet</h2>
      {backupWallet ? (
        <div className="txt-frame">
          <span>
            <b>Name:</b> {backupWallet.name}
          </span>
          <span>
            <b>Password:</b> {backupWallet.password.substr(0, 25)}...
          </span>
          <span>
            <b>Mnemonic:</b> {backupWallet.mnemonic.substr(0, 25)}...
          </span>
          <span>
            <b>Seed:</b> {backupWallet.seed.substr(0, 25)}...
          </span>
          <span>
            <b>Wallet:</b> {backupWallet.wallet.join(',').substr(0, 25)}...
          </span>
        </div>
      ) : null}
      <div className="btn-container flex flex-row mt-2">
        <div onClick={downloadBackupWallet} className="btn-icon btn-download">
          <Icon iconName="Installation" />
        </div>
        <div onClick={onCopy} className="btn-icon btn-copy">
          <Icon iconName="Copy" />
        </div>
      </div>
    </div>
  )
}
