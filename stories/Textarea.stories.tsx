import { Textarea } from '@/components/ui/textarea';
import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta<typeof Textarea> = {
    title: 'Components/Textarea',
    component: Textarea,
    tags: ['autodocs'],
    argTypes: {
        placeholder: {
            control: 'text',
            defaultValue: 'Type your message here...',
        },
        rows: {
            control: 'number',
            defaultValue: 4,
        },
        disabled: {
            control: 'boolean',
            defaultValue: false,
        },
        'aria-invalid': {
            control: 'boolean',
            name: 'aria-invalid',
            defaultValue: false,
        },
    },
    args: {
        placeholder: 'Type your message here...',
        rows: 4,
    },
};

export default meta;
type Story = StoryObj<typeof Textarea>;

export const Default: Story = {
    args: {},
};

export const WithError: Story = {
    name: 'Aria Invalid',
    args: {
        'aria-invalid': true,
        placeholder: 'Invalid input',
    },
};

export const Disabled: Story = {
    args: {
        disabled: true,
        placeholder: 'Disabled textarea',
    },
};

export const CustomHeight: Story = {
    args: {
        rows: 8,
        placeholder: 'Taller textarea with 8 rows',
    },
};
