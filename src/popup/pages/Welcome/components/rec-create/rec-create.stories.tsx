import { Story, Meta } from '@storybook/react/types-6-0'
import React from 'react'
import { RecCreate } from './rec-create'

export default {
  title: 'Example/RecCreate',
  component: RecCreate,
} as Meta

const Template: Story = () => <RecCreate />

export const Primary = Template.bind({})
Primary.args = {
  primary: true,
  label: 'Button',
}

export const Secondary = Template.bind({})
Secondary.args = {
  label: 'Button',
}

export const Large = Template.bind({})
Large.args = {
  size: 'large',
  label: 'Button',
}

export const Small = Template.bind({})
Small.args = {
  size: 'small',
  label: 'Button',
}
