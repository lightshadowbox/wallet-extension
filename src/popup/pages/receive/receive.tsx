import React from 'react'
import { Icon } from '@fluentui/react'

import QrCodeImg from '../../assets/qr-code.png'

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
}

/**
 * Primary UI component for user interaction
 */
export const Receive: React.FC<ReceiveProps> = ({
  primary = false,
  size = 'medium',
  backgroundColor,
  label,
  ...props
}) => {
  const mode = primary ? 'storybook-receive--primary' : 'storybook-receive--secondary'
  return (
    <div
      className={['storybook-receive', `storybook-receive--${size}`, mode].join(' ')}
      style={{ backgroundColor }}
      {...props}>
      <header className="bg-blue-5 text-white">
        <div className="flex">
          <div>
            <Icon className="text-white" iconName="ChromeBack" />
          </div>
          <div className="flex-1 text-center font-medium">Receive</div>
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
                <img className="m-auto" src={QrCodeImg} alt="qr-code" width="208" height="208" />
              </div>
              <div className="code text-xl break-all">
                ANB279HZ88QQOIQWUEZ9201AN728MNZ &nbsp;
                <Icon className="text-blue-5 inline" iconName="Copy" />
              </div>
              <button
                type="button"
                className="mt-5 bg-blue-6 text-blue-5 py-4 px-4 rounded flex items-center w-full justify-center">
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
