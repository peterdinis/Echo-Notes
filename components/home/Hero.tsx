import { FC } from 'react';
import Navigation from './Navigation';

const Hero: FC = () => {
    return (
        <div className='darK:bg-background min-h-screen bg-stone-200'>
            <Navigation />
        </div>
    );
};

export default Hero;
