import { FC } from 'react';
import Navigation from './Navigation';
import Link from 'next/link';
import { Button } from '../ui/button';
import Features from './Features';
import Pricing from './Pricing';
import Footer from '../shared/Footer';

const Hero: FC = () => {
    return (
        <div className='dark:bg-background min-h-screen bg-stone-200'>
            <Navigation />
            <section className='relative flex min-h-screen items-center justify-center overflow-hidden py-20'>
                <div className='bg-obsidian-darkest absolute inset-0 z-0'>
                    <div className='bg-obsidian-accent/10 animate-float absolute top-20 left-10 h-72 w-72 rounded-full blur-3xl filter' />
                    <div
                        className='bg-obsidian-accent2/10 animate-float absolute right-10 bottom-20 h-96 w-96 rounded-full blur-3xl filter'
                        style={{ animationDelay: '1s' }}
                    />
                </div>

                <div className='relative z-10 container mx-auto px-4 md:px-6'>
                    <div className='mx-auto max-w-3xl text-center'>
                        <h1 className='animate-fade-in text-obsidian-text mb-6 text-4xl font-bold md:text-5xl lg:text-6xl'>
                            Your Second Brain,
                            <span className='text-obsidian-accent'>
                                {' '}
                                Amplified
                            </span>
                        </h1>

                        <p
                            className='text-obsidian-muted animate-fade-in mx-auto mb-8 max-w-2xl text-lg md:text-xl'
                            style={{ animationDelay: '0.2s' }}
                        >
                            Connect your thoughts, organize your research, and
                            discover new insights with our powerful note-taking
                            experience inspired by how you think.
                        </p>

                        <div
                            className='animate-fade-in flex flex-col justify-center gap-4 sm:flex-row'
                            style={{ animationDelay: '0.4s' }}
                        >
                            <Link href='/register'>
                                <Button
                                    size='lg'
                                    className='bg-rose-700 px-8 text-white hover:bg-rose-900'
                                >
                                    Start For Free
                                </Button>
                            </Link>
                            <Button
                                variant='outline'
                                size='lg'
                                className='bg-orange-500 text-white hover:bg-orange-800'
                            >
                                Watch Demo
                            </Button>
                        </div>
                    </div>
                    
                    <div
                        className='animate-fade-in shadow-obsidian-accent/20 mx-auto mt-16 max-w-5xl overflow-hidden rounded-lg shadow-2xl dark:bg-stone-900'
                        style={{ animationDelay: '0.6s' }}
                    >
                        <div className='bg-obsidian-dark flex items-center space-x-2 rounded-t-lg p-2'>
                            <div className='h-3 w-3 rounded-full bg-red-400' />
                            <div className='h-3 w-3 rounded-full bg-yellow-400' />
                            <div className='h-3 w-3 rounded-full bg-green-400' />
                        </div>
                        <div className='bg-obsidian-dark rounded-b-lg p-4'>
                            <div className='bg-obsidian-darkest flex aspect-video items-center justify-center rounded-md'>
                                <p className='text-obsidian-muted'>
                                    Application Dashboard Preview
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <Features />
            <Pricing />
            <Footer />
        </div>
    );
};

export default Hero;
