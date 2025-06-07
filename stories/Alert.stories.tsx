import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const meta: Meta<typeof Alert> = {
  title: 'Components/Alert',
  component: Alert,
  tags: ['autodocs'],
  args: {
    variant: 'default',
  },
  argTypes: {
    variant: {
      control: 'radio',
      options: ['default', 'destructive'],
    },
  },
};

export default meta;

type Story = StoryObj<typeof Alert>;

export const Default: Story = {
  render: (args) => (
    <Alert {...args}>
      <AlertTitle>Heads up!</AlertTitle>
      <AlertDescription>This is a default alert message.</AlertDescription>
    </Alert>
  ),
};

export const WithIcon: Story = {
  render: (args) => (
    <Alert {...args}>
      <AlertCircle className="mt-1" />
      <div>
        <AlertTitle>Heads up!</AlertTitle>
        <AlertDescription>This alert includes an icon.</AlertDescription>
      </div>
    </Alert>
  ),
};

export const Destructive: Story = {
  render: (args) => (
    <Alert variant="destructive" {...args}>
      <AlertCircle className="mt-1" />
      <div>
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>
          Something went wrong. Please try again later.
        </AlertDescription>
      </div>
    </Alert>
  ),
};