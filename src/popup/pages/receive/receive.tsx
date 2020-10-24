/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import React from 'react'
import classNames from 'classnames'
import { Icon, Customizer, IFocusTrapZoneProps, ILayerProps, LayerHost, mergeStyles, Panel, TooltipHost, ITooltipHostStyles, FontIcon } from '@fluentui/react'
import { QRCodeWallet } from 'popup/components/qr-code/qr-code'
import { useGetAccount } from 'queries/account.queries'
import { useId } from '@uifabric/react-hooks'
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
}

/**
 * Primary UI component for user interaction
 */
interface Props {
  isPanelOpen: boolean
  showPanel: () => void
  dismissPanel: () => void
}
const calloutProps = { gapSpace: 0 }
const hostStyles: Partial<ITooltipHostStyles> = { root: { display: 'inline-block' } }

export const ReceiveContainer: React.FC<ReceiveProps> = ({ primary = false, size = 'medium', backgroundColor, label, dismissPanel, ...props }) => {
  const mode = primary ? 'storybook-receive--primary' : 'storybook-receive--secondary'
  const { data: account, status } = useGetAccount()
  const tooltipId = useId('tooltip')
  const [contentTooltip, setContentTooltip] = React.useState('Copy')
  const onClickCopy = React.useCallback((value: string) => {
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
  }, [])

  return (
    <div className={['storybook-receive', `storybook-receive--${size}`, mode].join(' ')} style={{ backgroundColor }} {...props}>
      <header className="bg-blue-5 text-white">
        <div className={classNames('flex flex-row relative')}>
          <div onClick={dismissPanel} className={styles.headerIcon}>
            <Icon iconName="ChromeBack" />
          </div>
          <div className="flex-1 text-center font-medium text-base">Receive</div>
        </div>
        <div className="desc text-center text-xs">This account support TRX, TRC10, TRC20 tokens</div>
      </header>
      <div className="content">
        <div className="card__container">
          <ul className="tabs flex font-normal">
            <li className="tab flex-1 text-center active">
              <button type="button" className="bg-white inline-block py-2 px-4">
                In Network
              </button>
            </li>
            <li className="tab flex-1 text-center">
              <button type="button" className="bg-white inline-block py-2 px-4 hover:text-black hover:font-medium">
                Out Network
              </button>
            </li>
          </ul>
          <div className="card-desc w-full">
            <div className="text-center">
              <div className="qr mt-5 mb-12">
                <QRCodeWallet keyAddress="hehlll" />
              </div>
              <TooltipHost content={contentTooltip} id={tooltipId} calloutProps={calloutProps} styles={hostStyles}>
                <div
                  onClick={() => onClickCopy(account.paymentAddress)}
                  className="flex flex-row items-center justify-center code text-xl break-all cursor-pointer"
                >
                  <p className={styles.keyText}>{account.paymentAddress}</p>
                  <Icon className="text-blue-5 inline" iconName="Copy" />
                </div>
              </TooltipHost>

              <button type="button" className="mt-5 bg-blue-6 text-blue-5 py-4 px-4 rounded flex flex-row items-center w-full justify-center">
                <Icon className="text-blue-5 mr-2" iconName="ShareiOS" />
                <span>Share</span>
              </button>
            </div>
            <div className="hidden">Tab #2</div>
          </div>
        </div>
      </div>
    </div>
  )
}
export const ReceivePanel: React.FC<Props> = ({ isPanelOpen, showPanel, dismissPanel }) => {
  const layerHostId = useId('layerHost')
  const scopedSettings = useLayerSettings(true, layerHostId)
  return (
    isPanelOpen && (
      <div className={`absolute inset-0 receive ${styles.container}`}>
        <Customizer scopedSettings={scopedSettings}>
          <Panel isOpen focusTrapZoneProps={focusTrapZoneProps}>
            <ReceiveContainer label="Receive" dismissPanel={dismissPanel} />
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
