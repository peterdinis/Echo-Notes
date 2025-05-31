import { Input } from '@/components/ui/input';
import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta<typeof Input> = {
    title: 'Components/Input',
    component: Input,
    tags: ['autodocs'],
    argTypes: {
        type: {
            control: 'select',
            options: ['text', 'email', 'password', 'number', 'file'],
        },
        placeholder: {
            control: 'text',
        },
        disabled: {
            control: 'boolean',
        },
    },
    args: {
        type: 'text',
        placeholder: 'Enter text...',
        disabled: false,
    },
};

export default meta;

type Story = StoryObj<typeof Input>;

export const Default: Story = {};

export const Email: Story = {
    args: {
        type: 'email',
        placeholder: 'Enter your email',
    },
};

export const Password: Story = {
    args: {
        type: 'password',
        placeholder: 'Enter your password',
    },
};

export const Number: Story = {
    args: {
        type: 'number',
        placeholder: 'Enter a number',
    },
};

export const File: Story = {
    args: {
        type: 'file',
    },
};

export const Disabled: Story = {
    args: {
        disabled: true,
        placeholder: 'Disabled input',
    },
};
