import { Story, Meta } from '@storybook/react/types-6-0'
import React from 'react'
import { Header } from './header'

export default {
  title: 'Example/Header',
  component: Header,
  argTypes: {
    title: {
      control: 'text',
    },
    icon: {
      control: 'text',
    },
  },
} as Meta

const Template: Story = (args) => <Header title="Choose Network" dismissPanel={() => alert('Clicked')} icon="CircleFill" {...args} />

export const Primary = Template.bind({})
Primary.args = {
  title: 'Choose Network',
  icon: 'CircleFill',
}
