'use client';

import { FC, useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ModeToggle } from '../shared/ModeToggle';

const Navigation: FC = () => {
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 50) {
                setScrolled(true);
            } else {
                setScrolled(false);
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <nav
            className={`fixed top-0 left-0 z-50 w-full transition-all duration-300 ${
                scrolled
                    ? 'bg-stone-300 py-2 shadow-lg backdrop-blur-md'
                    : 'bg-transparent py-4'
            }`}
        >
            <div className='container mx-auto flex items-center justify-between px-4 md:px-6'>
                <Link href='/' className='flex items-center space-x-2'>
                    <div className='flex h-8 w-8 items-center justify-center rounded-full bg-rose-700'>
                        <span className='font-bold text-black'>E</span>
                    </div>
                    <span className='text-xl font-bold text-stone-900'>
                        EchoNotes
                    </span>
                </Link>

                <div className='hidden items-center space-x-6 md:flex'>
                    <Link
                        href='/'
                        className='text-stone-900 transition-colors hover:text-stone-950'
                    >
                        Demo
                    </Link>
                    <a
                        href='#features'
                        className='text-stone-900 transition-colors hover:text-stone-950'
                    >
                        Features
                    </a>
                    <a
                        href='#testimonials'
                        className='text-stone-900 transition-colors hover:text-stone-950'
                    >
                        Testimonials
                    </a>
                    <a
                        href='#pricing'
                        className='text-stone-900 transition-colors hover:text-stone-950'
                    >
                        Pricing
                    </a>
                </div>

                <div className='flex items-center space-x-4'>
                    <Link href='/'>
                        <Button className='bg-orange-600 text-stone-900 hover:text-stone-950'>
                            Sign In
                        </Button>
                    </Link>
                    <Link href='/'>
                        <Button className='bg-rose-600 text-white hover:bg-rose-800'>
                            Get Started
                        </Button>
                    </Link>
                    <ModeToggle />
                </div>
            </div>
        </nav>
    );
};

export default Navigation;
