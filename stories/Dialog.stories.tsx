import type { Meta, StoryObj } from '@storybook/react';
import * as React from 'react';
import { Button } from '@/components/ui/button';
import { DialogClose, Dialog, DialogTrigger, DialogContent, DialogTitle, DialogDescription, DialogHeader, DialogFooter } from '@/components/ui/dialog';


const meta: Meta<typeof Dialog> = {
    title: 'Components/Dialog',
    component: Dialog,
    tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Dialog>;

export const BasicDialog: Story = {
    render: () => (
        <Dialog>
            <DialogTrigger asChild>
                <Button>Open Dialog</Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Dialog Title</DialogTitle>
                    <DialogDescription>
                        This is a description of the dialog. Use it to convey important context.
                    </DialogDescription>
                </DialogHeader>
                <div className="text-sm text-foreground">
                    Here is the body of the dialog. You can place any React component or content here.
                </div>
                <DialogFooter>
                    <DialogClose asChild>
                        <Button variant="outline">Cancel</Button>
                    </DialogClose>
                    <Button>Confirm</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    ),
};
