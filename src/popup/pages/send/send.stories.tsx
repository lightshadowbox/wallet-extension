import React from 'react'
// also exported from '@storybook/react' if you can deal with breaking changes in 6.1
import { Story, Meta } from '@storybook/react/types-6-0'

import { SendContainer, SendProps } from './send'

export default {
  title: 'Example/Send',
  component: SendContainer,
  argTypes: {
    backgroundColor: { control: 'color' },
  },
} as Meta

const Template: Story<SendProps> = (args) => <SendContainer {...args} />

export const Primary = Template.bind({})
Primary.args = {
  primary: true,
  label: 'Send',
}
