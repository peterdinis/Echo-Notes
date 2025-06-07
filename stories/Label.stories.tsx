import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Label } from '@/components/ui/label';


const meta: Meta<typeof Label> = {
  title: 'Components/Label',
  component: Label,
  tags: ['autodocs'],
  argTypes: {
    htmlFor: {
      control: 'text',
      description: 'ID of the associated input',
    },
    children: {
      control: 'text',
      description: 'Text content of the label',
    },
    className: {
      control: 'text',
      description: 'Tailwind utility classes',
    },
  },
  args: {
    htmlFor: 'email',
    children: 'Email address',
  },
};

export default meta;

type Story = StoryObj<typeof Label>;

export const Default: Story = {
  render: (args) => (
    <div className="flex flex-col gap-2 max-w-sm">
      <Label {...args} />
      <input
        type="email"
        id={args.htmlFor}
        className="px-3 py-2 border rounded-md border-input"
        placeholder="you@example.com"
      />
    </div>
  ),
};