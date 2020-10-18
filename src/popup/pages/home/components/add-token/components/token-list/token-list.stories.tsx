import { Story, Meta } from '@storybook/react/types-6-0'
import React from 'react'
import { ListGhostingExample } from './token-list'

export default {
  title: 'Example/TokenList',
  component: ListGhostingExample,
} as Meta

const Template: Story = () => <ListGhostingExample accountName="Tran Hoang" />

export const Primary = Template.bind({})
Primary.args = {
  primary: true,
  label: 'TokenList',
}
