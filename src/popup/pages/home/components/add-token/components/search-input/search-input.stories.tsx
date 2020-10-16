import { Story, Meta } from '@storybook/react/types-6-0'
import React from 'react'
import { SearchInput } from './search-input'

export default {
  title: 'Example/SearchInput',
  component: SearchInput,
  argTypes: {
    placeholder: {
      control: 'text',
    },
  },
} as Meta

const Template: Story = (args) => <SearchInput placeholder="Choose network name..." {...args} />

export const Primary = Template.bind({})
Primary.args = {
  placeholder: 'Choose network name...',
}
