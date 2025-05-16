'use client';

import { FC } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import Link from 'next/link';
import { useSignUpUser } from '@/hooks/auth/useRegister';
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
import { useRouter } from 'next/navigation';

type FormValues = {
    email: string;
    password: string;
    nick?: string;
    firstName: string;
    lastName?: string;
};

const RegisterForm: FC = () => {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<FormValues>();
    const router = useRouter();
    const signUpMutation = useSignUpUser();

    const onSubmit = (data: FormValues) => {
        signUpMutation.mutate(data, {
            onSuccess: () => {
                toast.success('Account created successfully!');
                router.push('/login');
            },
            onError: (err) => {
                toast.error((err as Error)?.message || 'Something went wrong');
            },
        });
    };

    return (
        <div className='bg-obsidian-darkest flex min-h-screen items-center justify-center px-4 py-12'>
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
                        <form
                            onSubmit={handleSubmit(onSubmit)}
                            className='space-y-4'
                        >
                            <div className='space-y-2'>
                                <Label
                                    htmlFor='firstName'
                                    className='text-obsidian-text'
                                >
                                    First Name
                                </Label>
                                <Input
                                    id='firstName'
                                    {...register('firstName', {
                                        required: 'First name is required',
                                    })}
                                    placeholder='Your first name'
                                    className='bg-obsidian-darkest border-obsidian-dark text-obsidian-text'
                                />
                                {errors.firstName && (
                                    <p className='text-sm text-red-500'>
                                        {errors.firstName.message}
                                    </p>
                                )}
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
                                    {...register('email', {
                                        required: 'Email is required',
                                        pattern: {
                                            value: /\S+@\S+\.\S+/,
                                            message: 'Invalid email address',
                                        },
                                    })}
                                    placeholder='name@example.com'
                                    className='bg-obsidian-darkest border-obsidian-dark text-obsidian-text'
                                />
                                {errors.email && (
                                    <p className='text-sm text-red-500'>
                                        {errors.email.message}
                                    </p>
                                )}
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
                                    {...register('password', {
                                        required: 'Password is required',
                                        minLength: {
                                            value: 6,
                                            message:
                                                'Password must be at least 6 characters',
                                        },
                                    })}
                                    placeholder='Create a strong password'
                                    className='bg-obsidian-darkest border-obsidian-dark text-obsidian-text'
                                />
                                {errors.password && (
                                    <p className='text-sm text-red-500'>
                                        {errors.password.message}
                                    </p>
                                )}
                            </div>

                            <div className='space-y-2'>
                                <Label
                                    htmlFor='nick'
                                    className='text-obsidian-text'
                                >
                                    Nickname (optional)
                                </Label>
                                <Input
                                    id='nick'
                                    {...register('nick')}
                                    placeholder='Optional nickname'
                                    className='bg-obsidian-darkest border-obsidian-dark text-obsidian-text'
                                />
                            </div>

                            <div className='space-y-2'>
                                <Label
                                    htmlFor='lastName'
                                    className='text-obsidian-text'
                                >
                                    Last Name (optional)
                                </Label>
                                <Input
                                    id='lastName'
                                    {...register('lastName')}
                                    placeholder='Optional last name'
                                    className='bg-obsidian-darkest border-obsidian-dark text-obsidian-text'
                                />
                            </div>

                            <CardFooter className='pt-4'>
                                <Button type='submit' className='w-full'>
                                    Register
                                </Button>
                            </CardFooter>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default RegisterForm;
