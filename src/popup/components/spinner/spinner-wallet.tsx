import classNames from 'classnames'
import React from 'react'
import { Spinner, SpinnerSize, IStackProps, Stack } from '@fluentui/react'

export const SpinnerWallet = () => {
  const token = {
    sectionStack: {
      childrenGap: 10,
    },
    spinnerStack: {
      childrenGap: 20,
    },
  }
  const rowProps: IStackProps = { horizontal: true, verticalAlign: 'center' }
  return (
    <div className={classNames('w-full h-full flex flex-col items-center justify-center')}>
      <Stack {...rowProps} tokens={token.spinnerStack}>
        <Spinner size={SpinnerSize.large} />
      </Stack>
    </div>
  )
}
