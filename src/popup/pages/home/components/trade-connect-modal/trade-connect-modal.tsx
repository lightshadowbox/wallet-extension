/* eslint-disable no-nested-ternary */
/* eslint-disable jsx-a11y/label-has-associated-control */
import React from 'react'
import LogoTrading from 'popup/assets/logo-trading.png'
import { useGetListAccountName, useGetListAccountBasicInfo } from 'queries/account.queries'
import { Button, SecondaryButton, SpinnerWallet } from 'popup/components'

import './trade-connect-modal.css'

interface Props {
  isModalOpen: boolean
  showModal: () => void
  hideModal: () => void
  onConnect: () => void
  onDismissConnect: () => void
  setAccountTrade: (value) => void
}
export const ModalConnectTrade: React.FunctionComponent<Props> = ({ onConnect, onDismissConnect, setAccountTrade }) => {
  const { data: accountListName, isSuccess } = useGetListAccountName()
  const [accountName, setAccountName] = React.useState([])
  const { data: accountsBasicInfo } = useGetListAccountBasicInfo(accountName)
  React.useEffect(() => {
    if (isSuccess) {
      setAccountName(accountListName)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSuccess])
  return (
    <div className="trading-connect-modal">
      <div className="trading-heading">
        <div className="img-container">
          <img src={LogoTrading} alt="logo-trading" />
          <img src={LogoTrading} alt="logo-trading-bold" className="logo-trading-bold" />
          <img src={LogoTrading} alt="logo-trading-bold" className="logo-trading-bold" />
        </div>
        <div className="txt-frame">
          <p className="main-p">
            Swap with{' '}
            <span>
              <b>Light Shadow Box</b>
            </span>
          </p>
          <p className="part-p">Select accounts</p>
        </div>
      </div>
      <div className="list-account">
        <ul>
          {accountsBasicInfo ? (
            accountsBasicInfo.length !== 0 ? (
              accountsBasicInfo.map((item) => (
                <li key={item.paymentAddress}>
                  <input onChange={() => setAccountTrade(item.accountName)} type="radio" id={item.accountName} name="accountName" value={item.accountName} />
                  <label htmlFor={item.accountName}>
                    <span className="name">
                      {item.accountName}
                      <span className="payment-address">
                        (...{item.paymentAddress.toString().substr(item.paymentAddress.toString().length - 10, item.paymentAddress.toString().length)})
                      </span>
                    </span>
                    <span className="total-balance">{item.PRV} PRV</span>
                  </label>
                </li>
              ))
            ) : (
              <SpinnerWallet />
            )
          ) : (
            <SpinnerWallet />
          )}
        </ul>
      </div>
      <div className="btn-container">
        <Button onClick={onConnect}>Yes</Button>
        <SecondaryButton onClick={onDismissConnect}>No</SecondaryButton>
      </div>
    </div>
  )
}
