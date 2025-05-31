import Loader from '@/components/ui/loader';
import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta<typeof Loader> = {
    title: 'Components/Loader',
    component: Loader,
    tags: ['autodocs'],
    argTypes: {
        width: { control: { type: 'number' } },
        height: { control: { type: 'number' } },
    },
};

type Story = StoryObj<typeof Loader>;

export const Small: Story = {
    args: {
        width: 4,
        height: 4,
    },
};

export const Medium: Story = {
    args: {
        width: 6,
        height: 6,
    },
};

export const Large: Story = {
    args: {
        width: 10,
        height: 10,
    },
};

export default meta;
