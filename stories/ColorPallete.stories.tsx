import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { ColorPalette } from '@/components/ui/color-pallete';

const meta: Meta<typeof ColorPalette> = {
  title: 'Components/ColorPalette',
  component: ColorPalette,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof ColorPalette>;

export const Default: Story = {
  render: () => (
    <div className="p-6">
      <ColorPalette
        colors={['#FF0000', '#00FF00', '#0000FF', '#FF00FF', '#FFA500', '#000000']}
        onSelect={(color) => console.log('Selected color:', color)}
      />
    </div>
  ),
};
