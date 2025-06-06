import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Switch } from '@/components/ui/switch';

const meta: Meta = {
  title: 'Components/Switch',
  component: Switch,
  tags: ['autodocs'],
};

export default meta;

type Story = StoryObj<typeof Switch>;

export const Default: Story = {
  render: () => {
    const [checked, setChecked] = React.useState(false);

    return (
      <div className="flex items-center gap-4">
        <Switch checked={checked} onCheckedChange={setChecked} />
        <span>{checked ? 'On' : 'Off'}</span>
      </div>
    );
  },
};
