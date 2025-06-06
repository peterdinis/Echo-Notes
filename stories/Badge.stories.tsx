import { Badge } from '@/components/ui/badge';
import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta<typeof Badge> = {
    title: 'Components/Badge',
    component: Badge,
    tags: ['autodocs'],
    argTypes: {
        variant: {
            control: 'select',
            options: [
                'default',
                'secondary',
                'destructive',
                'outline',
                'success',
                'orange',
            ],
        },
        children: {
            control: 'text',
        },
    },
    args: {
        children: 'Badge Label',
        variant: 'default',
    },
};

export default meta;
type Story = StoryObj<typeof Badge>;

export const Default: Story = {
    args: {
        variant: 'default',
    },
};

export const Secondary: Story = {
    args: {
        variant: 'secondary',
    },
};

export const Destructive: Story = {
    args: {
        variant: 'destructive',
    },
};

export const Outline: Story = {
    args: {
        variant: 'outline',
    },
};

export const Success: Story = {
    args: {
        variant: 'success',
    },
};

export const Warning: Story = {
    args: {
        variant: 'warning',
    },
};
