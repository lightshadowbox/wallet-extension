/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import React from 'react'
import classNames from 'classnames'
import { Icon, Customizer, IFocusTrapZoneProps, ILayerProps, LayerHost, mergeStyles, Panel, TooltipHost, ITooltipHostStyles } from '@fluentui/react'
import { QRCodeWallet, SpinnerWallet, FaButton } from 'popup/components'
import { useGetAccount } from 'queries/account.queries'
import { useId } from '@uifabric/react-hooks'
import { useGenerateDepositAddress } from 'queries/token.queries'

import { useTheme } from 'popup/services'
import styles from './receive.module.css'
import './receive.css'

export interface ReceiveProps {
  /**
   * Is this the principal call to action on the page?
   */
  primary?: boolean
  /**
   * What background color to use
   */
  backgroundColor?: string
  /**
   * How large should the button be?
   */
  size?: 'small' | 'medium' | 'large'
  /**
   * Button contents
   */
  label: string
  /**
   * Optional click handler
   */
  onClick?: () => void
  dismissPanel: () => void
  tokenId: string | null
  showPanelShieldToken: () => void
  defaultActive: string
}

/**
 * Primary UI component for user interaction
 */
interface Props {
  isPanelOpen: boolean
  showPanel: () => void
  dismissPanel: () => void
  tokenId: string | null
  showPanelShieldToken: () => void
  defaultActive: string
}
const calloutProps = { gapSpace: 0 }
const hostStyles: Partial<ITooltipHostStyles> = { root: { display: 'inline-block' } }

export const ReceiveContainer: React.FC<ReceiveProps> = ({
  primary = false,
  size = 'medium',
  backgroundColor,
  label,
  dismissPanel,
  tokenId,
  showPanelShieldToken,
  defaultActive,
  ...props
}) => {
  const theme = useTheme()
  const mode = primary ? 'storybook-receive--primary' : 'storybook-receive--secondary'
  const { data: account } = useGetAccount()
  const { data: depositAddress, isSuccess } = useGenerateDepositAddress(tokenId)
  const [active, setActive] = React.useState(defaultActive)
  const tooltipId = useId('tooltip')
  const [contentTooltip, setContentTooltip] = React.useState('Copy')

  // Event handlers
  const onActiveHandle = (value) => {
    if (active !== value) {
      const element = document.querySelector(`.content .${value}`) as HTMLElement
      const preElement = document.querySelector(`.content .${active}`) as HTMLElement
      element.classList.add('active')
      preElement.classList.remove('active')
      setActive(value)
    }
  }

  const onClickCopy = (value: string) => {
    const text = value
    setContentTooltip('Copied')
    setTimeout(() => {
      setContentTooltip('Copy')
      const elem = document.createElement('textarea')
      document.body.appendChild(elem)
      elem.value = text
      elem.select()
      document.execCommand('copy')
      document.body.removeChild(elem)
    }, 1500)
  }

  return (
    <div className={['storybook-receive', 'relative', `storybook-receive--${size}`, mode].join(' ')} style={{ backgroundColor }} {...props}>
      <header className="bg-blue-5 text-white">
        <div className={classNames('flex flex-row relative')}>
          <FaButton className={styles.headerIcon} onClick={dismissPanel} iconProps={{ iconName: 'ChromeBack' }} iconColor={theme.palette.white} />
          <div className="flex-1 text-center font-medium text-lg">Receive</div>
        </div>
        <div className="desc text-center text-xs">
          {active === 'in-network' ? 'Recieve from accounts within Incognito Network' : 'Receive from accounts outside of Incognito Network'}
        </div>
      </header>
      <div className="content">
        <div className="card__container">
          <ul className="tabs flex font-normal">
            <li
              onClick={() => onActiveHandle('in-network')}
              className={defaultActive === 'in-network' ? 'tab flex-1 text-center in-network active' : 'tab flex-1 text-center in-network'}
            >
              <button type="button" className="bg-white inline-block py-2 px-4">
                In Network
              </button>
            </li>
            <li
              onClick={() => {
                onActiveHandle('out-network')
                if (!tokenId) {
                  showPanelShieldToken()
                  setTimeout(() => {
                    dismissPanel()
                  }, 500)
                }
              }}
              className={
                defaultActive === 'out-network'
                  ? 'tab out-network flex-1 text-center cursor-not-allowed active pointer-events-none'
                  : 'tab out-network flex-1 text-center cursor-not-allowed pointer-events-none'
              }
            >
              <button type="button" className={classNames('bg-white inline-block py-2 px-4', ' hover:font-medium')}>
                Out Network
              </button>
            </li>
          </ul>
          <div className="card-desc w-full">
            {isSuccess ? (
              <div className="text-center">
                {/* Count down will coming soon */}
                {/* {depositAddress && active === 'out-network' ? <CountDown /> : null} */}
                <div className="qr mt-2 mb-12">
                  {!depositAddress || active === 'in-network' ? (
                    <QRCodeWallet keyAddress={account.paymentAddress} />
                  ) : (
                    <QRCodeWallet keyAddress={depositAddress?.address} />
                  )}
                </div>
                <TooltipHost content={contentTooltip} id={tooltipId} calloutProps={calloutProps} styles={hostStyles}>
                  <div
                    onClick={() => onClickCopy(!depositAddress || active === 'in-network' ? account.paymentAddress : depositAddress?.address)}
                    className="flex flex-row items-center justify-center code text-xl break-all cursor-pointer"
                  >
                    <p className={styles.keyText}>{!depositAddress || active === 'in-network' ? account.paymentAddress : depositAddress?.address}</p>
                    <Icon className="text-blue-5 inline" iconName="Copy" />
                  </div>
                </TooltipHost>
                {/* <button type="button" className="mt-5 bg-blue-6 text-blue-5 py-4 px-4 rounded flex flex-row items-center w-full justify-center">
                  <Icon className="text-blue-5 mr-2" iconName="ShareiOS" />
                  <span>Share</span>
                </button> */}
              </div>
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <SpinnerWallet />
              </div>
            )}
            <div className="hidden">Tab #2</div>
          </div>
        </div>
      </div>
    </div>
  )
}
export const ReceivePanel: React.FC<Props> = ({ isPanelOpen, dismissPanel, tokenId = null, showPanelShieldToken, defaultActive }) => {
  const layerHostId = useId('layerHost')
  const scopedSettings = useLayerSettings(true, layerHostId)
  return (
    isPanelOpen && (
      <div className={`absolute inset-0 receive ${styles.container}`}>
        <Customizer scopedSettings={scopedSettings}>
          <Panel isOpen focusTrapZoneProps={focusTrapZoneProps}>
            <ReceiveContainer
              defaultActive="in-network"
              showPanelShieldToken={showPanelShieldToken}
              tokenId={null}
              label="Receive"
              dismissPanel={dismissPanel}
            />
          </Panel>
        </Customizer>
        <LayerHost id={layerHostId} className={layerHostClass} />
      </div>
    )
  )
}
const layerHostClass = mergeStyles({
  position: 'relative',
  height: 600,
  width: 360,
  overflow: 'scroll',
})

const focusTrapZoneProps: IFocusTrapZoneProps = {
  isClickableOutsideFocusTrap: true,
  forceFocusInsideTrap: false,
}

function useLayerSettings(trapPanel: boolean, layerHostId: string): { Layer?: ILayerProps } {
  return React.useMemo(() => {
    if (trapPanel) {
      const layerProps: ILayerProps = { hostId: layerHostId }
      return { Layer: layerProps }
    }
    return {}
  }, [trapPanel, layerHostId])
}
