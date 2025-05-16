'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowUp } from 'lucide-react';

export const ScrollToTopButton = () => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const toggleVisibility = () => {
            setIsVisible(window.scrollY > 300);
        };

        window.addEventListener('scroll', toggleVisibility);
        return () => window.removeEventListener('scroll', toggleVisibility);
    }, []);

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth',
        });
    };

    return isVisible ? (
        <Button
            onClick={scrollToTop}
            className='fixed right-6 bottom-6 z-50 rounded-full bg-stone-800 p-3 text-white shadow-lg hover:bg-stone-700'
            size='icon'
        >
            <ArrowUp className='h-5 w-5' />
        </Button>
    ) : null;
};
