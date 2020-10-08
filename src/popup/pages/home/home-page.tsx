import classNames from 'classnames'
import React from 'react'
import { WalletCover } from './components'

const HomeContainer: React.FC<{ cover: React.ReactNode }> = ({ children, cover }) => (
  <div className={classNames('flex flex-col relative w-full h-full')}>
    <div className={classNames('absolute self-center mt-20 shadow-lg w-11/12 h-56 z-10 bg-gray-7')}>{cover}</div>
    <div className={classNames('w-full h-48 bg-blue-1')} />
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
