import React from 'react'
// also exported from '@storybook/react' if you can deal with breaking changes in 6.1
import { Story, Meta } from '@storybook/react/types-6-0'
import { BaseButton, SecondaryButton, ButtonProps } from './button'

export default {
  title: 'Example/Button',
  component: BaseButton,
  argTypes: {
    children: { control: 'text' },
    textColor: { control: 'color' },
  },
} as Meta

const PrimaryTemplate: Story<ButtonProps> = (args) => <BaseButton {...args} iconProps={{ iconName: 'Send' }} />
const SecondaryTemplate: Story<ButtonProps> = (args) => <SecondaryButton {...args} iconProps={{ iconName: 'Send' }} />

export const Primary = PrimaryTemplate.bind({})
Primary.args = {
  children: 'Send',
}

export const Secondary = SecondaryTemplate.bind({})
Secondary.args = {
  children: 'Send',
}
