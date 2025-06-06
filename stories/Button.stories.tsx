import { Button } from '@/components/ui/button';
import type { Meta, StoryObj } from '@storybook/react';
import { Plus } from 'lucide-react';

const meta: Meta<typeof Button> = {
    title: 'Components/Button',
    component: Button,
    tags: ['autodocs'],
    argTypes: {
        variant: {
            control: 'select',
            options: [
                'default',
                'destructive',
                'outline',
                'secondary',
                'ghost',
                'link',
                'success',
                'warning',
            ],
        },
        size: {
            control: 'select',
            options: ['default', 'sm', 'lg', 'icon'],
        },
        children: {
            control: 'text',
        },
    },
    args: {
        variant: 'default',
        size: 'default',
        children: 'Button',
    },
};

export default meta;

type Story = StoryObj<typeof Button>;

export const Default: Story = {};

export const Destructive: Story = {
    args: {
        variant: 'destructive',
        children: 'Delete',
    },
};

export const Outline: Story = {
    args: {
        variant: 'outline',
        children: 'Outline',
    },
};

export const Secondary: Story = {
    args: {
        variant: 'secondary',
        children: 'Secondary',
    },
};

export const Ghost: Story = {
    args: {
        variant: 'ghost',
        children: 'Ghost',
    },
};

export const Link: Story = {
    args: {
        variant: 'link',
        children: 'Link Button',
    },
};

export const Small: Story = {
    args: {
        size: 'sm',
        children: 'Small',
    },
};

export const Large: Story = {
    args: {
        size: 'lg',
        children: 'Large',
    },
};

export const IconButton: Story = {
    args: {
        size: 'icon',
        children: <Plus className='size-4' />,
    },
};

export const SuccessButton: Story = {
    args: {
        variant: 'success',
    },
};

export const WarningButton: Story = {
    args: {
        variant: 'warning',
    },
};
