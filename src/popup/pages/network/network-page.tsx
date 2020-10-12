import classNames from 'classnames'
import React from 'react'
import { Header, SearchInput, ListNetwork } from './components/index'

const NetworkContainer: React.FC<{
  header: React.ReactNode
  searchInput: React.ReactNode
  list: React.ReactNode
}> = ({ header, searchInput, list }) => (
  <div className={classNames('flex flex-col relative justify-center items-center p-md bg-white')}>
    <div className={classNames('w-full h-full')}>{header}</div>
    <div className={classNames('w-full h-full')}>{searchInput}</div>
    <div className={classNames('w-full h-full')}>{list}</div>
  </div>
)
export const NetworkPage = () => {
  return (
    <NetworkContainer header={<Header />} searchInput={<SearchInput />} list={<ListNetwork />}>
      <div>Body will coming soon </div>
    </NetworkContainer>
  )
}
