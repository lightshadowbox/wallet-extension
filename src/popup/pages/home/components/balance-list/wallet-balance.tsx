/* eslint-disable no-plusplus */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import { Icon, Label, List, Persona, PersonaPresence, PersonaSize } from '@fluentui/react'
import classNames from 'classnames'
import React from 'react'
import PrvIcon from 'popup/assets/prv@2x.png'
import './wallet-balance.css'
import { useQuery } from 'react-query'
import { SecondaryButton } from 'popup/components/button'
import { useGetTokenList } from 'queries/use-get-token-list'
import GetTokens from '../add-token/components/token-list/token'

interface IExample {
  name: string
  icon: string
}
interface Props {
  showPanel: () => void
}
const BalanceItem = (item: IExample): JSX.Element => {
  return (
    <div className={classNames('flex p-4 hover:bg-gray-6')}>
      <div className={classNames('flex items-center w-12')}>
        <Persona imageUrl={item.icon} size={PersonaSize.size32} hidePersonaDetails />
      </div>
      <div className={classNames('flex items-center flex-grow')}>
        <Label>{item.name}</Label>
      </div>
      <div className={classNames('flex items-center justify-end')}>
        <Label className={classNames('text-gray-2 text-xs font-normal')}>1.25 USD</Label>
      </div>
    </div>
  )
}

export const WalletBalance: React.FC<Props> = ({ showPanel }) => {
  const tokens = useGetTokenList('Account 0')
  const [tokenList, setTokenList] = React.useState([])
  const { data, status } = useQuery('tokens', GetTokens)
  React.useEffect(() => {
    if (status === 'success') {
      const temp = data.filter((a) => {
        return tokens.includes(a.tokenId)
      })
      setTokenList(temp)
    }
    console.log('hi')
  }, [tokens])
  return (
    <div className="lsb-WalletBalance--container">
      <SecondaryButton full backgroundColor="transparent">
        <div onClick={showPanel} className={classNames('w-full flex items-center')}>
          <div className={classNames('flex items-center w-12 pl-2')}>
            <Icon iconName="Add" />
          </div>
          <div className={classNames('flex flex-grow text-sm')}>Add token</div>
        </div>
      </SecondaryButton>
      <div className="lsb-WalletBalance--list">
        <List items={tokenList} onRenderCell={BalanceItem} />
      </div>
    </div>
  )
}
