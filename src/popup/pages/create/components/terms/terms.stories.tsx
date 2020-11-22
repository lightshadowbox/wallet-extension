import { Story, Meta } from '@storybook/react/types-6-0'
import React from 'react'
import { Terms } from './terms'

export default {
  title: 'Example/Terms',
  component: Terms,
} as Meta

const Template: Story = () => <Terms href="/" text="Privacy terms and conditions" />

export const Primary = Template.bind({})
Primary.args = {
  primary: true,
  label: 'Link',
}
