import React from 'react'
import classNames from 'classnames'
import { WalletCover } from './components'

const HomeContainer: React.FC<{ cover: React.ReactNode; navigator?: React.FC }> = ({ children, cover, navigator }) => (
  <div className={classNames('flex flex-col relative w-full h-full')}>
    <div className={classNames('absolute self-center mt-20 shadow-md w-11/12 h-56 z-10 bg-gray-7')}>{cover}</div>
    <div className={classNames('flex flex-row align-top justify-between w-full h-48 bg-blue-1 p-4')}>{navigator}</div>
    <div className={classNames('w-full h-full mt-32')}>{children}</div>
  </div>
)

export const HomePage = () => {
  return (
    <HomeContainer cover={<WalletCover />}>
      <div>TokenList is comming soon</div>
    </HomeContainer>
  )
}
