import { Story, Meta } from '@storybook/react/types-6-0'
import React from 'react'
import { RecCreate } from './rec-create'

export default {
  title: 'Example/RecCreate',
  component: RecCreate,
} as Meta

const Template: Story = (args) => <RecCreate showPanel={() => console.log('clicked')} {...args} />

export const Primary = Template.bind({})
Primary.args = {
  primary: true,
  label: 'Button',
  showPanel: () => alert('clicked'),
}
