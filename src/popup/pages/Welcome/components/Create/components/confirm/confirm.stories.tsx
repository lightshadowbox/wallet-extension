import { Story, Meta } from '@storybook/react/types-6-0'
import React from 'react'
import { ConfirmPassword } from './confirm'

export default {
  title: 'Example/ConfirmPassword',
  component: ConfirmPassword,
} as Meta

const Template: Story = () => <ConfirmPassword setConfirmPass={(a) => console.log(a)} />

export const Primary = Template.bind({})
Primary.args = {
  primary: true,
  label: 'Button',
}
