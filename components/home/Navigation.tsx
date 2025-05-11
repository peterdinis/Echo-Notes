"use client"

import { FC, useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

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

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <nav
            className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${scrolled
                    ? "bg-stone-300 backdrop-blur-md shadow-lg py-2"
                    : "bg-transparent py-4"
                }`}
        >
            <div className="container mx-auto px-4 md:px-6 flex justify-between items-center">
                <Link href="/" className="flex items-center space-x-2">
                    <div className="h-8 w-8 rounded-full bg-rose-700 flex items-center justify-center">
                        <span className="font-bold text-black">E</span>
                    </div>
                    <span className="font-bold text-xl text-stone-900">EchoNotes</span>
                </Link>

                <div className="hidden md:flex items-center space-x-6">
                    <Link href="/" className="text-stone-900 hover:text-stone-950 transition-colors">Demo</Link>
                    <a href="#features" className="text-stone-900 hover:text-stone-950 transition-colors">Features</a>
                    <a href="#testimonials" className="text-stone-900 hover:text-stone-950 transition-colors">Testimonials</a>
                    <a href="#pricing" className="text-stone-900 hover:text-stone-950 transition-colors">Pricing</a>
                </div>

                <div className="flex items-center space-x-4">
                    <Link href="/">
                        <Button className="bg-orange-600 text-stone-900 hover:text-stone-950">
                            Sign In
                        </Button>
                    </Link>
                    <Link href="/">
                        <Button className="bg-rose-600 text-white hover:bg-rose-800">
                            Get Started
                        </Button>
                    </Link>
                </div>
            </div>
        </nav>
    );
};

export default Navigation;
