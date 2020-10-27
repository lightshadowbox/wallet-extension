import { Story, Meta } from '@storybook/react/types-6-0'
import React from 'react'
import { ListGhostingExample } from './token-list'

export default {
  title: 'Example/TokenList',
  component: ListGhostingExample,
} as Meta

const Template: Story = () => (
  <ListGhostingExample dismissPanel={() => console.log('alert')} valueInput="Tran Hoang" showPanelTokenDetail={(value) => console.log('hello')} />
)

export const Primary = Template.bind({})
Primary.args = {
  primary: true,
  label: 'TokenList',
}
