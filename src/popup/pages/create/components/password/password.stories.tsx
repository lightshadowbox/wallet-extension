import { Story, Meta } from '@storybook/react/types-6-0'
import React from 'react'
import { Password } from './password'

export default {
  title: 'Example/Password',
  component: Password,
} as Meta

const Template: Story = () => <Password setPasswordWallet={(a) => console.log(a)} />

export const Primary = Template.bind({})
Primary.args = {
  primary: true,
  label: 'Button',
}
