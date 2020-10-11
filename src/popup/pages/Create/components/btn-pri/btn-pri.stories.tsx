import { Story, Meta } from '@storybook/react/types-6-0'
import React from 'react'
import { BtnPri } from './btn-pri'

export default {
  title: 'Example/BtnPri',
  component: BtnPri,
} as Meta

const Template: Story = (args) => <BtnPri {...args} />

export const Primary = Template.bind({})
Primary.args = {
  primary: true,
  label: 'Button',
  onClick: () => console.log('clicked'),
}
