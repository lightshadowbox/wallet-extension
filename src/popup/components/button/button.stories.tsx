import React from 'react'
// also exported from '@storybook/react' if you can deal with breaking changes in 6.1
import { Story, Meta } from '@storybook/react/types-6-0'
import { Button, SecondaryButton, FaButton, ButtonProps, FabProps } from './button'

export default {
  title: 'Example/Button',
  component: Button,
  argTypes: {
    children: { control: 'text' },
    textColor: { control: 'color' },
    backgroundColor: { control: 'color' },
  },
} as Meta

const PrimaryTemplate: Story<ButtonProps> = (args) => <Button {...args} iconProps={{ iconName: 'Send' }} />
const SecondaryTemplate: Story<ButtonProps> = (args) => <SecondaryButton {...args} iconProps={{ iconName: 'Send' }} />
const FabTemplate: Story<FabProps> = (args) => <FaButton {...args} iconProps={{ iconName: 'ChevronLeft' }} />

export const Primary = PrimaryTemplate.bind({})
Primary.args = {
  children: 'Send',
}

export const Secondary = SecondaryTemplate.bind({})
Secondary.args = {
  children: 'Send',
}

export const Fab = FabTemplate.bind({})
Fab.args = {
  iconColor: '#d50000',
  iconSize: 'medium',
}
