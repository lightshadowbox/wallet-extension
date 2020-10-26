/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import React, { useState, useRef, useEffect } from 'react'
import { Icon, Customizer, IFocusTrapZoneProps, ILayerProps, LayerHost, mergeStyles, Panel } from '@fluentui/react'
import { useId } from '@uifabric/react-hooks'
import classNames from 'classnames'
import { useGetListAccount } from 'queries/account.queries'
import styles from './send.module.css'

import './send.css'

export interface SendProps {
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
interface Props {
  isPanelOpen: boolean
  showPanel: () => void
  dismissPanel: () => void
}

const useComponentVisible = (initialIsVisible) => {
  const [isComponentVisible, setIsComponentVisible] = useState(initialIsVisible)
  const ref = useRef<HTMLDivElement>(null)

  const handleHideDropdown = (event: KeyboardEvent) => {
    if (event.key === 'Escape') {
      setIsComponentVisible(false)
    }
  }

  const handleClickOutside = (event: Event) => {
    if (ref.current && !ref.current.contains(event.target as Node)) {
      setIsComponentVisible(false)
    }
  }

  useEffect(() => {
    document.addEventListener('keydown', handleHideDropdown, true)
    document.addEventListener('click', handleClickOutside, true)
    return () => {
      document.removeEventListener('keydown', handleHideDropdown, true)
      document.removeEventListener('click', handleClickOutside, true)
    }
  })

  return { ref, isComponentVisible, setIsComponentVisible }
}

const DropdownCoins = React.memo(() => {
  const { ref, isComponentVisible, setIsComponentVisible } = useComponentVisible(false)
  const coins = [
    {
      id: 'neo',
      name: 'NEO',
    },
    {
      id: 'bitcoin',
      name: 'BITCOIN',
    },
  ]
  const [active, setActive] = useState('neo')
  const onChangeCoin = (id) => {
    setActive(id)
    setIsComponentVisible(!isComponentVisible)
  }

  return (
    <div ref={ref} className="dropdown inline-block relative">
      <input type="hidden" name="coin" value={active} />
      <button
        onClick={() => setIsComponentVisible(!isComponentVisible)}
        type="button"
        className="button-select border focus:outline-none border-gray-9 bg-white py-2 px-2 inline-flex items-center"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            opacity="0.2"
            fillRule="evenodd"
            clipRule="evenodd"
            d="M23.9349 12.0002C23.9349 18.5927 18.5908 23.937 11.9983 23.937C5.40576 23.937 0.0615234 18.5927 0.0615234 12.0002C0.0615234 5.40772 5.40576 0.0634766 11.9983 0.0634766C18.5907 0.0634766 23.9349 5.40772 23.9349 12.0002Z"
            fill="#52BA00"
          />
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M13.0957 5.53845L6.67186 7.63209L11.016 9.54453L17.4199 7.43889L13.0957 5.53845ZM6.46143 7.81899L10.8448 9.71943V17.5385L6.46143 15.638V7.81899ZM12.9773 13.9005V9.11619L17.5383 7.61379V15.5294L12.9773 13.9005Z"
            fill="#83BD67"
          />
        </svg>
        <span className="mr-2 ml-2">{coins.find((item) => item.id === active).name}</span>
        <Icon className="text-gray-7" iconName="ChevronDown" />
      </button>
      <ul
        className={`${isComponentVisible ? 'block' : 'hidden'}
        dropdown-menu absolute border-gray-9 border-t border-r border-l mt-1`}
      >
        {coins.map((item) => (
          <li key={item.id} className="border-b border-gray-9 bg-white">
            <button
              className="rounded-t focus:outline-none w-full flex bg-white hover:bg-gray-9 py-2 px-4 block whitespace-no-wrap"
              type="button"
              onClick={() => onChangeCoin(item.id)}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  opacity="0.2"
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M23.9349 12.0002C23.9349 18.5927 18.5908 23.937 11.9983 23.937C5.40576 23.937 0.0615234 18.5927 0.0615234 12.0002C0.0615234 5.40772 5.40576 0.0634766 11.9983 0.0634766C18.5907 0.0634766 23.9349 5.40772 23.9349 12.0002Z"
                  fill="#52BA00"
                />
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M13.0957 5.53845L6.67186 7.63209L11.016 9.54453L17.4199 7.43889L13.0957 5.53845ZM6.46143 7.81899L10.8448 9.71943V17.5385L6.46143 15.638V7.81899ZM12.9773 13.9005V9.11619L17.5383 7.61379V15.5294L12.9773 13.9005Z"
                  fill="#83BD67"
                />
              </svg>
              <span className="self-center ml-2">{item.name}</span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
})

/**
 * Primary UI component for user interaction
 */
export const SendContainer: React.FC<SendProps> = ({ primary = false, backgroundColor, label, dismissPanel, ...props }) => {
  const { data: accounts, isSuccess } = useGetListAccount()
  const mode = primary ? 'storybook-send--primary' : 'storybook-send--secondary'
  return (
    <div className={['storybook-send', mode].join(' ')} style={{ backgroundColor }} {...props}>
      <header>
        <div className="flex p-4">
          <div className={classNames('flex flex-row relative w-full')}>
            <div onClick={dismissPanel} className={styles.headerIcon}>
              <Icon iconName="ChromeBack" />
            </div>
            <div className="flex-1 text-center font-medium text-base">Receive</div>
          </div>
        </div>
      </header>
      <div className="content mt-2">
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
          <div className="p-5 w-full">
            <div className="tab-1">
              <form>
                <div className="text-with-mini-cube">
                  <span className="mini-cube bg-green-4" />
                  Transfer account
                </div>
                <div className="field__wrapper relative">
                  <select id="transfer-account" className="appearance-none mt-2 bg-white outline-none w-full border-b border-gray-9 pt-3 pb-3 pl-1 pr-5">
                    {isSuccess ? accounts.map((account) => <option key={account.accountName}>{account.accountName}</option>) : <option>...</option>}
                  </select>
                  <Icon className="icon text-gray-7 absolute right-0 top-0 transform translate-y-6 -translate-x-2" iconName="ChevronDown" />
                </div>
                <div className="mb-6 mt-2 text-gray-7">Balance: 12.50 NEO</div>

                <div className="text-with-mini-cube">
                  <span className="mini-cube bg-orange-2" />
                  Receiving account
                </div>
                <div className="field__wrapper relative">
                  <input
                    type="text"
                    className="mt-2 bg-white outline-none w-full border-b border-gray-9 pt-3 pb-3 pl-1 pr-8"
                    id="receiving-account"
                    value="TQOA279HZ88VWOUEZ9209IKQ"
                    name="receiving-account"
                  />
                  <span className="icon absolute right-0 top-0 transform translate-y-6 -translate-x-2">
                    <svg width="20" height="12" viewBox="0 0 20 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path
                        d="M13.7499 6.83329C12.7499 6.83329 11.1916 7.11663 9.99992 7.66663C8.80825 7.10829 7.24992 6.83329 6.24992 6.83329C4.44158 6.83329 0.833252 7.73329 0.833252 9.54163V11.8333H19.1666V9.54163C19.1666 7.73329 15.5583 6.83329 13.7499 6.83329ZM10.4166 10.5833H2.08325V9.54163C2.08325 9.09163 4.21658 8.08329 6.24992 8.08329C8.28325 8.08329 10.4166 9.09163 10.4166 9.54163V10.5833ZM17.9166 10.5833H11.6666V9.54163C11.6666 9.15829 11.4999 8.82496 11.2333 8.52496C11.9666 8.27496 12.8666 8.08329 13.7499 8.08329C15.7833 8.08329 17.9166 9.09163 17.9166 9.54163V10.5833ZM6.24992 5.99996C7.85825 5.99996 9.16658 4.69163 9.16658 3.08329C9.16658 1.47496 7.85825 0.166626 6.24992 0.166626C4.64158 0.166626 3.33325 1.47496 3.33325 3.08329C3.33325 4.69163 4.64158 5.99996 6.24992 5.99996ZM6.24992 1.41663C7.16658 1.41663 7.91658 2.16663 7.91658 3.08329C7.91658 3.99996 7.16658 4.74996 6.24992 4.74996C5.33325 4.74996 4.58325 3.99996 4.58325 3.08329C4.58325 2.16663 5.33325 1.41663 6.24992 1.41663ZM13.7499 5.99996C15.3583 5.99996 16.6666 4.69163 16.6666 3.08329C16.6666 1.47496 15.3583 0.166626 13.7499 0.166626C12.1416 0.166626 10.8333 1.47496 10.8333 3.08329C10.8333 4.69163 12.1416 5.99996 13.7499 5.99996ZM13.7499 1.41663C14.6666 1.41663 15.4166 2.16663 15.4166 3.08329C15.4166 3.99996 14.6666 4.74996 13.7499 4.74996C12.8333 4.74996 12.0833 3.99996 12.0833 3.08329C12.0833 2.16663 12.8333 1.41663 13.7499 1.41663Z"
                        fill="#757575"
                      />
                    </svg>
                  </span>
                </div>

                <div className="mt-6 mb-6 text-center">
                  <DropdownCoins />
                  <h2 className="price text-6xl font-medium mb-4 mt-2">12.5</h2>
                  <input className="bg-white text-center outline-none w-full placeholder-gray-8:placeholder" placeholder="Write note here..." />
                </div>
                <div className="flex">
                  <div className="font-medium self-center">Fee:</div>
                  <div className="coin__fee flex-1 text-right">
                    <span className="mr-1 font-medium">0.025</span>
                    <div className="field__wrapper relative inline-block">
                      <select id="coin__fee-type" className="appearance-none bg-white outline-none pr-8">
                        <option>TRX</option>
                        <option>ABC</option>
                        <option>XYZ</option>
                      </select>
                      <Icon className="icon text-gray-7 absolute right-0 top-0 transform -translate-x-2" iconName="ChevronDown" />
                    </div>
                  </div>
                </div>
                <button type="button" className="text-white bg-blue-5 mt-5 py-4 px-4 rounded flex items-center w-full justify-center">
                  <Icon className="mr-2 text-white" iconName="Send" />
                  <span className="text-white">Send</span>
                </button>
              </form>
            </div>
            <div className="tab-2 hidden">Content 2</div>
          </div>
        </div>
      </div>
    </div>
  )
}

export const SendPanel: React.FC<Props> = ({ isPanelOpen, showPanel, dismissPanel }) => {
  const layerHostId = useId('layerHost')
  const scopedSettings = useLayerSettings(true, layerHostId)
  return (
    isPanelOpen && (
      <div className={`absolute inset-0 send ${styles.container}`}>
        <Customizer scopedSettings={scopedSettings}>
          <Panel isOpen focusTrapZoneProps={focusTrapZoneProps}>
            <SendContainer label="Send" dismissPanel={dismissPanel} />
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
