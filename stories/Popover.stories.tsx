import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';

import { Button } from '@/components/ui/button';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';

const meta: Meta = {
    title: 'Components/Popover',
    component: Popover,
    tags: ['autodocs'],
};

export default meta;
type Story = StoryObj;

export const Default: Story = {
    render: () => (
        <div className='flex h-[300px] items-center justify-center'>
            <Popover>
                <PopoverTrigger asChild>
                    <Button variant='outline'>Open Popover</Button>
                </PopoverTrigger>
                <PopoverContent>
                    <p className='text-muted-foreground text-sm'>
                        This is the content inside the popover.
                    </p>
                </PopoverContent>
            </Popover>
        </div>
    ),
};
