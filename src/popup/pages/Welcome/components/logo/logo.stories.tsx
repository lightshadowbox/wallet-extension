import { Story, Meta } from '@storybook/react/types-6-0'
import React from 'react'
import { Logo } from './logo'

export default {
  title: 'Example/Logo',
  component: Logo,
} as Meta

const Template: Story = () => <Logo />

export const Primary = Template.bind({})
Primary.args = {
  primary: true,
  label: 'Button',
}
