import { Story, Meta } from '@storybook/react/types-6-0'
import React from 'react'
import { ListNetwork } from './list-network'

export default {
  title: 'Example/ListNetwork',
  component: ListNetwork,
} as Meta

const Template: Story = () => <ListNetwork />

export const Primary = Template.bind({})
Primary.args = {
  primary: true,
  label: 'ListNetwork',
}
