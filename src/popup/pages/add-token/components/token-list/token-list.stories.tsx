import { Story, Meta } from '@storybook/react/types-6-0'
import React from 'react'
import { TokenList } from './token-list'

export default {
  title: 'Example/TokenList',
  component: TokenList,
} as Meta

const Template: Story = () => <TokenList />

export const Primary = Template.bind({})
Primary.args = {
  primary: true,
  label: 'TokenList',
}
