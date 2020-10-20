import { Story, Meta } from '@storybook/react/types-6-0'
import React from 'react'
import { Header } from './header'

export default {
  title: 'Example/Header',
  component: Header,
} as Meta

const Template: Story = () => <Header dismissPanel={() => console.log('clicked')} />

export const Primary = Template.bind({})
Primary.args = {
  primary: true,
  label: 'Button',
}
