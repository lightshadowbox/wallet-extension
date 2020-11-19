/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react'
import classNames from 'classnames'
import { useGetTokenBalance, getTokenFromTokenIds } from 'queries/token.queries'
import { FontIcon, Label, PrimaryButton } from '@fluentui/react'
import { useSettingStore } from 'popup/stores/features/settings'
import { Button, SecondaryButton } from 'popup/components/button'
import styles from './detail-cover.module.css'

export const DetailCover: React.FC<{ tokenId: string; showPanelReceive: () => void; showPanelSend: (e, tokenId, accountName) => void }> = ({
  tokenId,
  showPanelReceive,
  showPanelSend,
}) => {
  const { data: totalBalance, isSuccess } = useGetTokenBalance(tokenId)
  const selectedAccount = useSettingStore((s) => s.selectAccountName)
  const tokenDetail = getTokenFromTokenIds([tokenId])

  return (
    <div className={styles.detailCover__container}>
      <div className={styles.detailCover__balanceInfo}>
        <Label className={styles.detailCover__balance}>
          {/* coming soon */}
          {isSuccess ? totalBalance : 0}
        </Label>
        <Label className={styles.detailCover__balanceLabel}>Balance</Label>
      </div>
      <div className={classNames('flex flex-row w-full')}>
        <Button full className="w-1/3" onClick={showPanelReceive} iconProps={{ iconName: 'QRCode' }} disabled={!tokenDetail[tokenId].Verified}>
          Receive
        </Button>
        <SecondaryButton
          full
          spacious
          onClick={(e) => {
            showPanelSend(e, tokenId, selectedAccount)
          }}
          iconProps={{ iconName: 'Send' }}
          className="w-1/3"
        >
          Send
        </SecondaryButton>
        <SecondaryButton full className="w-1/3" iconProps={{ iconName: 'Switch' }} backgroundColor="#e1e1e1" textColor="#1d1d1d">
          {'Swap  '}
        </SecondaryButton>
      </div>
    </div>
  )
}
