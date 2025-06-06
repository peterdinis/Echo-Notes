import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Slider } from '@/components/ui/slider';

const meta: Meta = {
  title: 'Components/Slider',
  component: Slider,
  tags: ['autodocs'],
};

export default meta;

type Story = StoryObj<typeof Slider>;

export const Default: Story = {
  render: () => {
    const [value, setValue] = React.useState([25]);

    return (
      <div className="w-64 space-y-4">
        <Slider
          value={value}
          onValueChange={setValue}
          min={0}
          max={100}
          step={1}
        />
        <div>Value: {value[0]}</div>
      </div>
    );
  },
};

export const Range: Story = {
  render: () => {
    const [range, setRange] = React.useState([20, 80]);

    return (
      <div className="w-64 space-y-4">
        <Slider
          value={range}
          onValueChange={setRange}
          min={0}
          max={100}
          step={1}
        />
        <div>
          Range: {range[0]} – {range[1]}
        </div>
      </div>
    );
  },
};

export const Disabled: Story = {
  render: () => (
    <div className="w-64">
      <Slider defaultValue={[50]} min={0} max={100} disabled />
    </div>
  ),
};