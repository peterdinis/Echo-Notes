import type { Meta, StoryObj } from '@storybook/react';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
    CardContent,
    CardFooter,
    CardAction,
} from '@/components/ui/card';

const meta: Meta<typeof Card> = {
    title: 'Components/Card',
    component: Card,
    tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Card>;

export const Default: Story = {
    render: () => (
        <Card>
            <CardHeader>
                <CardTitle>Card Title</CardTitle>
                <CardDescription>This is the card description.</CardDescription>
            </CardHeader>
            <CardContent>
                <p>
                    This is some card content. You can put anything here,
                    including lists, forms, or images.
                </p>
            </CardContent>
            <CardFooter>
                <Button variant='secondary'>Action</Button>
            </CardFooter>
        </Card>
    ),
};

export const WithAction: Story = {
    render: () => (
        <Card>
            <CardHeader>
                <CardTitle>Card with Action</CardTitle>
                <CardDescription>
                    Includes a top-right action button.
                </CardDescription>
                <CardAction>
                    <Button size='sm'>Edit</Button>
                </CardAction>
            </CardHeader>
            <CardContent>
                <p>
                    You can place buttons or menus in the top-right corner using
                    the CardAction slot.
                </p>
            </CardContent>
            <CardFooter>
                <Button>Save</Button>
            </CardFooter>
        </Card>
    ),
};

export const Borderless: Story = {
    render: () => (
        <Card className='border-0 shadow-none'>
            <CardHeader>
                <CardTitle>Borderless Card</CardTitle>
            </CardHeader>
            <CardContent>
                <p>
                    This card has no border and no shadow, useful for embedded
                    content.
                </p>
            </CardContent>
        </Card>
    ),
};
