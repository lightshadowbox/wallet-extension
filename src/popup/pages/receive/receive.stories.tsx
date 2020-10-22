import React from 'react'
// also exported from '@storybook/react' if you can deal with breaking changes in 6.1
import { Story, Meta } from '@storybook/react/types-6-0'

import { Receive, ReceiveProps } from './receive'

export default {
  title: 'Example/Receive',
  component: Receive,
  argTypes: {
    backgroundColor: { control: 'color' },
  },
} as Meta

const Template: Story<ReceiveProps> = (args) => <Receive {...args} />

export const Primary = Template.bind({})
Primary.args = {
  primary: true,
  label: 'Receive',
}

export const Secondary = Template.bind({})
Secondary.args = {
  label: 'Receive',
}

export const Large = Template.bind({})
Large.args = {
  size: 'large',
  label: 'Receive',
}

export const Small = Template.bind({})
Small.args = {
  size: 'small',
  label: 'Receive',
}
