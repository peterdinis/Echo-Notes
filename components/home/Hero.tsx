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
            <section className="relative min-h-screen flex items-center justify-center overflow-hidden py-20">
                {/* Background Effects */}
                <div className="absolute inset-0 bg-obsidian-darkest z-0">
                    <div className="absolute top-20 left-10 w-72 h-72 bg-obsidian-accent/10 rounded-full filter blur-3xl animate-float" />
                    <div className="absolute bottom-20 right-10 w-96 h-96 bg-obsidian-accent2/10 rounded-full filter blur-3xl animate-float" style={{ animationDelay: '1s' }} />
                </div>

                <div className="container mx-auto px-4 md:px-6 relative z-10">
                    <div className="max-w-3xl mx-auto text-center">
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 animate-fade-in text-obsidian-text">
                            Your Second Brain,
                            <span className="text-obsidian-accent"> Amplified</span>
                        </h1>

                        <p className="text-lg md:text-xl mb-8 text-obsidian-muted max-w-2xl mx-auto animate-fade-in" style={{ animationDelay: '0.2s' }}>
                            Connect your thoughts, organize your research, and discover new insights with our powerful note-taking experience inspired by how you think.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in" style={{ animationDelay: '0.4s' }}>
                            <Link href="/register">
                                <Button size="lg" className="bg-rose-700 text-white hover:bg-rose-900 px-8">
                                    Start For Free
                                </Button>
                            </Link>
                            <Button variant="outline" size="lg" className="bg-orange-500 text-white hover:bg-orange-800">
                                Watch Demo
                            </Button>
                        </div>
                    </div>

                    {/* Preview Image */}
                    <div className="mt-16 max-w-5xl mx-auto animate-fade-in shadow-2xl shadow-obsidian-accent/20 rounded-lg overflow-hidden" style={{ animationDelay: '0.6s' }}>
                        <div className="p-2 bg-obsidian-dark rounded-t-lg flex items-center space-x-2">
                            <div className="w-3 h-3 rounded-full bg-red-400" />
                            <div className="w-3 h-3 rounded-full bg-yellow-400" />
                            <div className="w-3 h-3 rounded-full bg-green-400" />
                        </div>
                        <div className="bg-obsidian-dark p-4 rounded-b-lg">
                            <div className="aspect-video bg-obsidian-darkest rounded-md flex items-center justify-center">
                                <p className="text-obsidian-muted">Application Dashboard Preview</p>
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
