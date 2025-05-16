import { FC } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import Link from 'next/link';

const RegisterForm: FC = () => {
    return (
        <div className='bg-obsidian-darkest flex min-h-screen items-center justify-center px-4 py-12'>
            {/* Background Effects */}
            <div className='absolute inset-0 z-0'>
                <div className='bg-obsidian-accent/5 absolute top-20 left-10 h-72 w-72 rounded-full blur-3xl filter' />
                <div className='bg-obsidian-accent2/5 absolute right-10 bottom-20 h-96 w-96 rounded-full blur-3xl filter' />
            </div>

            <div className='z-10 container mx-auto max-w-md'>
                <Link
                    href='/'
                    className='mb-8 flex items-center justify-center space-x-2'
                >
                    <div className='bg-obsidian-accent flex h-8 w-8 items-center justify-center rounded-full'>
                        <span className='text-obsidian-darkest font-bold'>
                            E
                        </span>
                    </div>
                    <span className='text-obsidian-text text-xl font-bold'>
                        EchoNotes
                    </span>
                </Link>

                <Card className='bg-obsidian-dark border-obsidian-dark animate-scale-in'>
                    <CardHeader>
                        <CardTitle className='text-obsidian-text text-center text-2xl'>
                            Create an account
                        </CardTitle>
                        <CardDescription className='text-obsidian-muted text-center'>
                            Enter your details to get started
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form className='space-y-4'>
                            <div className='space-y-2'>
                                <Label
                                    htmlFor='name'
                                    className='text-obsidian-text'
                                >
                                    Name
                                </Label>
                                <Input
                                    id='name'
                                    placeholder='Your name'
                                    className='bg-obsidian-darkest border-obsidian-dark text-obsidian-text'
                                />
                            </div>
                            <div className='space-y-2'>
                                <Label
                                    htmlFor='email'
                                    className='text-obsidian-text'
                                >
                                    Email
                                </Label>
                                <Input
                                    id='email'
                                    type='email'
                                    placeholder='name@example.com'
                                    className='bg-obsidian-darkest border-obsidian-dark text-obsidian-text'
                                />
                            </div>
                            <div className='space-y-2'>
                                <Label
                                    htmlFor='password'
                                    className='text-obsidian-text'
                                >
                                    Password
                                </Label>
                                <Input
                                    id='password'
                                    type='password'
                                    placeholder='Create a strong password'
                                    className='bg-obsidian-darkest border-obsidian-dark text-obsidian-text'
                                />
                            </div>
                            <Button
                                type='submit'
                                className='bg-obsidian-accent text-obsidian-darkest hover:bg-obsidian-accent2 w-full'
                            >
                                Create Account
                            </Button>

                            <div className='relative my-6'>
                                <div className='absolute inset-0 flex items-center'>
                                    <div className='border-obsidian-dark w-full border-t'></div>
                                </div>
                                <div className='relative flex justify-center text-xs'>
                                    <span className='bg-obsidian-dark text-obsidian-muted px-2'>
                                        Or continue with
                                    </span>
                                </div>
                            </div>
                        </form>
                    </CardContent>
                    <CardFooter className='flex justify-center'>
                        <p className='text-obsidian-muted text-sm'>
                            Already have an account?{' '}
                            <Link
                                href='/login'
                                className='text-obsidian-accent hover:underline'
                            >
                                Sign in
                            </Link>
                        </p>
                    </CardFooter>
                </Card>
            </div>
        </div>
    );
};

export default RegisterForm;
