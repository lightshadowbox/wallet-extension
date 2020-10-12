import React from 'react'
// also exported from '@storybook/react' if you can deal with breaking changes in 6.1
import { Story, Meta } from '@storybook/react/types-6-0'

import { Send, SendProps } from './send'

export default {
  title: 'Example/Send',
  component: Send,
  argTypes: {
    backgroundColor: { control: 'color' },
  },
} as Meta

const Template: Story<SendProps> = (args) => <Send {...args} />

export const Primary = Template.bind({})
Primary.args = {
  primary: true,
  label: 'Send',
}
