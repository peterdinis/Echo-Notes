'use client';

import { FC, useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ModeToggle } from '../shared/ModeToggle';
import { Menu, X } from 'lucide-react';

const Navigation: FC = () => {
    const [scrolled, setScrolled] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <nav
            className={`fixed top-0 left-0 z-50 w-full transition-all duration-300 ${
                scrolled
                    ? 'bg-stone-500 py-2 shadow-lg backdrop-blur-md dark:bg-zinc-900'
                    : 'bg-transparent py-4'
            }`}
        >
            <div className='container mx-auto flex items-center justify-between px-4 md:px-6'>
                {/* Logo */}
                <Link href='/' className='flex items-center space-x-2'>
                    <div className='flex h-8 w-8 items-center justify-center rounded-full bg-rose-700'>
                        <span className='font-bold text-black dark:text-sky-50'>
                            E
                        </span>
                    </div>
                    <span className='text-xl font-bold text-stone-900 dark:text-sky-50'>
                        EchoNotes
                    </span>
                </Link>

                {/* Desktop Links */}
                <div className='hidden items-center space-x-6 md:flex'>
                    <Link
                        href='/'
                        className='text-stone-900 transition-colors hover:text-stone-950 dark:text-sky-50'
                    >
                        Demo
                    </Link>
                    <a
                        href='#features'
                        className='text-stone-900 transition-colors hover:text-stone-950 dark:text-sky-50'
                    >
                        Features
                    </a>
                    <a
                        href='#testimonials'
                        className='text-stone-900 transition-colors hover:text-stone-950 dark:text-sky-50'
                    >
                        Testimonials
                    </a>
                    <a
                        href='#pricing'
                        className='text-stone-900 transition-colors hover:text-stone-950 dark:text-sky-50'
                    >
                        Pricing
                    </a>
                </div>

                {/* Mobile Menu Toggle */}
                <div className='flex items-center md:hidden'>
                    <button onClick={() => setMenuOpen((prev) => !prev)}>
                        {menuOpen ? (
                            <X className='h-6 w-6 text-stone-900 dark:text-white' />
                        ) : (
                            <Menu className='h-6 w-6 text-stone-900 dark:text-white' />
                        )}
                    </button>
                </div>

                {/* Right side buttons */}
                <div className='hidden items-center space-x-4 md:flex'>
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

            {/* Mobile Dropdown Menu */}
            {menuOpen && (
                <div className='space-y-4 bg-stone-200 px-4 py-4 shadow-md backdrop-blur-md md:hidden dark:bg-stone-900'>
                    <Link
                        href='/'
                        className='block text-stone-900 hover:text-stone-950 dark:text-sky-50'
                    >
                        Demo
                    </Link>
                    <a
                        href='#features'
                        className='block text-stone-900 hover:text-stone-950 dark:text-sky-50'
                    >
                        Features
                    </a>
                    <a
                        href='#testimonials'
                        className='block text-stone-900 hover:text-stone-950 dark:text-sky-50'
                    >
                        Testimonials
                    </a>
                    <a
                        href='#pricing'
                        className='block text-stone-900 hover:text-stone-950 dark:text-sky-50'
                    >
                        Pricing
                    </a>
                    <div className='mt-4 flex flex-col gap-2'>
                        <Link href='/'>
                            <Button className='w-full bg-orange-600 text-stone-900 hover:text-stone-950'>
                                Sign In
                            </Button>
                        </Link>
                        <Link href='/'>
                            <Button className='w-full bg-rose-600 text-white hover:bg-rose-800'>
                                Get Started
                            </Button>
                        </Link>
                        <div className='flex justify-end'>
                            <ModeToggle />
                        </div>
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navigation;
