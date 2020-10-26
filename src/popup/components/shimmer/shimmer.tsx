import classNames from 'classnames'
import React from 'react'
import './shimmer.css'

export const Shimmer = () => {
  return (
    <div className={classNames('w-full h-full')}>
      <div className={classNames('flex flex-row')}>
        <div className={classNames('shine box')} />

        <div className={classNames('flex flex-col ml-4')}>
          <div className={classNames('shine shine-name')} />
          <div className={classNames('shine shine-prv')} />
        </div>
      </div>
      <br />

      <div className={classNames('flex flex-row')}>
        <div className={classNames('shine box')} />

        <div className={classNames('flex flex-col ml-4')}>
          <div className={classNames('shine shine-name')} />
          <div className={classNames('shine shine-prv')} />
        </div>
      </div>
    </div>
  )
}
