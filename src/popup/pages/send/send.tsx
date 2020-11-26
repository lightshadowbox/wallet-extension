/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable no-nested-ternary */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import React, { useState, useRef, useEffect } from 'react'
import { Icon, Customizer, IFocusTrapZoneProps, ILayerProps, LayerHost, mergeStyles, Panel, Persona, PersonaSize } from '@fluentui/react'
import logo from 'popup/assets/lsb.png'
import { useId } from '@uifabric/react-hooks'

import { useSettingStore } from 'popup/stores/features/settings'
import classNames from 'classnames'
import { useSendToken, useBurningToken } from 'queries/create-account.mutation'
import { useGetTokenForAccount, useGetTokenBalance, getTokenFromTokenIds } from 'queries/token.queries'
import { FaButton } from 'popup/components/button'
import { Header } from 'popup/components/header/header'
import { estimateFee } from 'services/wallet'
import { useTheme } from 'popup/services'
import { Message } from './message/message'
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
  tokenId: string | null
  accountName: string | null
}
interface Props {
  isPanelOpen: boolean
  showPanel: () => void
  dismissPanel: () => void
  tokenId: string | null
  accountName: string | null
}
const PRV_TOKEN_ID = '0000000000000000000000000000000000000000000000000000000000000004'

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

const DropdownCoins: React.FC<{
  accountName: string
  active: any
  setActive: (value) => void
  tokenId: string | null
  activeMode: string
}> = React.memo(({ accountName, active, setActive, tokenId, activeMode }) => {
  const { ref, isComponentVisible, setIsComponentVisible } = useComponentVisible(false)
  const { data: tokenAccounts, status } = useGetTokenForAccount(accountName)

  const onChangeCoin = (id) => {
    setActive(id)
    setIsComponentVisible(!isComponentVisible)
  }

  const onLoadImageFail = React.useCallback((e) => {
    e.target.src = 'https://picsum.photos/200'
  }, [])

  if (status === 'success') {
    return (
      <>
        <div ref={ref} className="dropdown inline-block relative">
          <input type="hidden" name="coin" value={active} />
          <button
            onClick={() => setIsComponentVisible(!isComponentVisible)}
            type="button"
            className="button-select border focus:outline-none border-gray-9 bg-white py-2 px-2 inline-flex items-center"
          >
            {activeMode !== 'out-network' ? (
              <Persona
                size={PersonaSize.size48}
                imageUrl={
                  !tokenId
                    ? active
                      ? tokenAccounts.find((item) => item.TokenId === active).Icon
                      : tokenAccounts[0].Icon
                    : active
                      ? tokenAccounts.find((item) => item.TokenId === tokenId).Icon
                      : tokenAccounts[0].Icon
                }
                imageInitials={
                  !tokenId
                    ? active
                      ? tokenAccounts.find((item) => item.TokenId === active).Name
                      : tokenAccounts[0].Name
                    : tokenAccounts?.find((item) => item.TokenId === tokenId).Name
                }
                text={
                  !tokenId
                    ? active
                      ? tokenAccounts.find((item) => item.TokenId === active).Name
                      : tokenAccounts[0].Name
                    : tokenAccounts?.find((item) => item.TokenId === tokenId).Name
                }
              />
            ) : (
                <Persona
                  size={PersonaSize.size48}
                  imageUrl={
                    !tokenId
                      ? tokenAccounts.length !== 1
                        ? tokenAccounts.find((item) => item.TokenId === active && item.Verified)?.Name || tokenAccounts.find((item) => item.Verified)?.Icon
                        : logo
                      : active
                        ? tokenAccounts.find((item) => item.TokenId === tokenId).Icon
                        : tokenAccounts[0].Icon
                  }
                  imageInitials={
                    !tokenId
                      ? tokenAccounts.length !== 1
                        ? tokenAccounts.find((item) => item.TokenId === active && item.Verified)?.Name || tokenAccounts.find((item) => item.Verified)?.Name
                        : 'No token'
                      : tokenAccounts?.find((item) => item.TokenId === tokenId).Name
                  }
                  text={
                    !tokenId
                      ? tokenAccounts.length !== 1
                        ? tokenAccounts.find((item) => item.TokenId === active && item.Verified)?.Name || tokenAccounts.find((item) => item.Verified)?.Name
                        : 'No token'
                      : tokenAccounts?.find((item) => item.TokenId === tokenId).Name
                  }
                />
              )}
            {!tokenId ? <Icon className="text-gray-7" iconName="ChevronDown" /> : null}
          </button>
        </div>
        {!tokenId && isComponentVisible ? (
          <ul className="dropdown-menu absolute border-gray-9 border token-dropdown w-48">
            {tokenAccounts.map((item) =>
              activeMode === 'out-network' ? (
                item.Verified ? (
                  <li key={item.TokenId} className="border-b border-gray-9 bg-white">
                    <button
                      className="rounded-t focus:outline-none w-full flex bg-white hover:bg-gray-9 py-2 px-4 block whitespace-no-wrap"
                      type="button"
                      onMouseDown={() => onChangeCoin(item.TokenId)}
                    >
                      <img onError={onLoadImageFail} className="send-icon" src={item.Icon} alt="icon" />
                      <span className="self-center ml-2">{item.Name}</span>
                    </button>
                  </li>
                ) : null
              ) : (
                  <li key={item.TokenId} className="border-b border-gray-9 bg-white">
                    <button
                      className="rounded-t focus:outline-none w-full flex bg-white hover:bg-gray-9 py-2 px-4 block whitespace-no-wrap"
                      type="button"
                      onMouseDown={() => onChangeCoin(item.TokenId)}
                    >
                      <img onError={onLoadImageFail} className="send-icon" src={item.Icon} alt="icon" />
                      <span className="self-center ml-2">{item.Name}</span>
                    </button>
                  </li>
                ),
            )}
          </ul>
        ) : null}
      </>
    )
  }
  return <h1>Loading...</h1>
})

/**
 * Primary UI component for user interaction
 */
export const SendContainer: React.FC<SendProps> = ({ primary = false, backgroundColor, label, dismissPanel, tokenId, accountName, ...props }) => {
  const [estimatedFee, setFee] = React.useState(0)
  const [feeToken, setFeeToken] = React.useState(PRV_TOKEN_ID)
  const [message, setMessage] = React.useState({
    message: '',
    name: '',
  })
  const [sendToken] = useSendToken(dismissPanel, setMessage)
  const [sendEth] = useBurningToken(setMessage)
  const [paymentInfo, setPaymentInfo] = React.useState({
    paymentAddressStr: '',
    amount: '',
    message: '',
  })
  const [ethInfo, setEthInfo] = React.useState({
    outchainAddress: '',
    burningAmount: '',
    message: '',
  })
  const tokenDetail = getTokenFromTokenIds([tokenId])
  const selectedAccount = useSettingStore((s) => s.selectAccountName)
  const { data: tokenAccounts, status } = useGetTokenForAccount(selectedAccount)
  const mode = primary ? 'storybook-send--primary' : 'storybook-send--secondary'
  const [activeMode, setActiveMode] = React.useState('in-network')
  const [active, setActive] = useState(PRV_TOKEN_ID)
  const tempDisableOutnetwork = true

  const onHandleActiveMode = (mode) => {
    if (activeMode !== mode) {
      const element = document.querySelector(`.content-send .${mode}`) as HTMLElement
      const preElement = document.querySelector(`.content-send .${activeMode}`) as HTMLElement
      element.classList.add('active')
      preElement.classList.remove('active')
      setActiveMode(mode)
    }
  }

  const handleAmountInputChanged = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (activeMode === 'in-network') {
      setPaymentInfo({ ...paymentInfo, amount: e.target.value })
      setFee(await estimateFee(Number(e.target.value) || 0))
    } else if (activeMode === 'out-network') {
      setEthInfo({ ...ethInfo, burningAmount: e.target.value })
    } else {
      setMessage({
        name: 'error',
        message: 'Something went wrong!',
      })
    }
  }

  const handleNoteChanged = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (activeMode === 'in-network') {
      setPaymentInfo({ ...paymentInfo, message: e.target.value })
    } else if (activeMode === 'out-network') {
      setEthInfo({ ...ethInfo, message: e.target.value })
    } else {
      setMessage({
        name: 'error',
        message: 'Something went wrong!',
      })
    }
  }

  const handleReceivingAddressChanged = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (activeMode === 'in-network') {
      setPaymentInfo({ ...paymentInfo, paymentAddressStr: e.target.value })
    } else if (activeMode === 'out-network') {
      setEthInfo({ ...ethInfo, outchainAddress: e.target.value })
    } else {
      setMessage({
        name: 'error',
        message: 'Something went wrong!',
      })
    }
  }

  const { data: balance, isSuccess: balanceStatus } = useGetTokenBalance(!tokenId ? active : tokenId, selectedAccount)
  React.useEffect(() => {
    setTimeout(() => {
      setMessage({
        message: '',
        name: '',
      })
    }, 2000)
  }, [message.message])

  return (
    <div className={['storybook-send', mode, 'relative'].join(' ')} style={{ backgroundColor }} {...props}>
      {message.message !== '' ? <Message message={message.message} name={message.name} /> : null}
      <Header title="Send" icon="ChromeBack" dismissPanel={dismissPanel} />
      <div className="content content-send mt-2">
        <div className="card__container">
          <ul className="tabs flex font-normal">
            <li onClick={() => onHandleActiveMode('in-network')} className="in-network tab flex-1 text-center active">
              <button type="button" className="bg-white inline-block py-2 px-4">
                In Network
              </button>
            </li>
            <li
              onClick={() => !tempDisableOutnetwork && onHandleActiveMode('out-network')}
              className={
                tokenDetail[tokenId]?.Verified || tokenId === null
                  ? 'out-network tab flex-1 text-center'
                  : ` ${styles.outPrint} out-network tab flex-1 text-center`
              }
            >
              <button
                type="button"
                className={classNames(
                  'bg-white inline-block py-2 px-4',
                  tempDisableOutnetwork ? 'disabled:opacity-50 cursor-not-allowed' : 'hover:text-black hover:font-medium',
                )}
              >
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
                <div className="field__wrapper relative" style={{ padding: 12 }}>
                  <Persona
                    imageAlt={selectedAccount}
                    text={selectedAccount}
                    size={PersonaSize.size48}
                    secondaryText={`Balance: ${balanceStatus ? balance : 0}`}
                  />
                </div>
                <div className="text-with-mini-cube">
                  <span className="mini-cube bg-orange-2" />
                  {activeMode === 'in-network' ? 'Receiving account' : activeMode === 'out-network' ? 'Ethereum Address' : null}
                </div>
                <div className="field__wrapper relative">
                  <input
                    type="text"
                    className="bg-white outline-none w-full border-b border-gray-9 pt-3 pb-3 pl-1 pr-8"
                    id="receiving-account"
                    value={activeMode === 'in-network' ? paymentInfo.paymentAddressStr : ethInfo.outchainAddress}
                    onChange={handleReceivingAddressChanged}
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
                <div className="text-with-mini-cube mt-6">
                  <span className="mini-cube bg-orange-2" />
                  Amount
                </div>
                <div className="field__wrapper relative">
                  <input
                    type="text"
                    className=" bg-white outline-none w-full border-b border-gray-9 pt-3 pb-3 pl-1 pr-8"
                    id="receiving-account"
                    value={activeMode === 'in-network' ? paymentInfo.amount : ethInfo.burningAmount}
                    onChange={handleAmountInputChanged}
                    placeholder="0.0"
                    name="amount"
                  />
                </div>

                <div className="mt-6 mb-6 text-center flex flex-col justify-center items-center">
                  <DropdownCoins
                    activeMode={activeMode}
                    tokenId={tokenId}
                    active={active}
                    setActive={setActive}
                    accountName={!accountName ? selectedAccount : accountName}
                  />
                  <input
                    className="mt-2 bg-white text-center outline-none w-full placeholder-gray-8:placeholder"
                    placeholder="Write note here..."
                    value={activeMode === 'in-network' ? paymentInfo.message : ethInfo.message}
                    onChange={handleNoteChanged}
                  />
                </div>
                <div className="flex">
                  <div className="font-medium self-center">Fee:</div>
                  <div className="coin__fee flex-1 text-right">
                    <span className="mr-1 font-medium">{(estimatedFee * 1e-9).toFixed(8)}</span>
                    <div className="field__wrapper relative inline-block">
                      {/* <select id="coin__fee-type" className="appearance-none bg-white outline-none pr-8">
                        <option>PRV</option>
                      </select> */}
                      PRV
                      {/* <Icon className="icon text-gray-7 absolute right-0 top-0 transform -translate-x-2" iconName="ChevronDown" /> */}
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => {
                    const paymentInfoList = []
                    paymentInfoList.push({ ...paymentInfo, amount: `${(Number(paymentInfo.amount) || 0) * 1e9}` })
                    if (activeMode === 'in-network') {
                      return sendToken({
                        accountName: !accountName ? selectedAccount : accountName,
                        paymentInfoList,
                        tokenId: !tokenId ? active : tokenId,
                        nativeFee: estimatedFee,
                      })
                    }

                    return sendEth({
                      tokenId: !tokenId
                        ? tokenAccounts?.find((item) => item.TokenId === active && item.Verified)?.TokenId ||
                        tokenAccounts?.find((item) => item.Verified)?.TokenId
                        : tokenId,
                      address: ethInfo.outchainAddress,
                      accountName: selectedAccount,
                      burningAmount: ethInfo.burningAmount,
                    })
                  }}
                  type="button"
                  className="text-white bg-blue-5 mt-5 py-4 px-4 rounded flex items-center w-full justify-center"
                >
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

export const SendPanel: React.FC<Props> = ({ isPanelOpen, showPanel, dismissPanel, tokenId, accountName }) => {
  const layerHostId = useId('layerHost')
  const scopedSettings = useLayerSettings(true, layerHostId)
  return (
    isPanelOpen && (
      <div className={`absolute inset-0 send ${styles.container}`}>
        <Customizer scopedSettings={scopedSettings}>
          <Panel isOpen focusTrapZoneProps={focusTrapZoneProps}>
            <SendContainer label="Send" dismissPanel={dismissPanel} tokenId={tokenId} accountName={accountName} />
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
