import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Check } from 'lucide-react';
import Link from 'next/link';

const plans = [
    {
        name: 'Free',
        price: '$0',
        description: 'Great for personal notes and getting started',
        features: [
            'Up to 100 notes',
            'Basic markdown editor',
            'Local storage only',
            'Limited graph view',
        ],
        cta: 'Start Free',
        popular: false,
    },
    {
        name: 'Pro',
        price: '$8',
        period: '/month',
        description: 'Perfect for researchers and heavy note-takers',
        features: [
            'Unlimited notes',
            'Advanced markdown & LaTeX',
            'Cloud sync across devices',
            'Enhanced graph visualization',
            'Full-text search',
            'Custom themes',
        ],
        cta: 'Go Pro',
        popular: true,
    },
    {
        name: 'Team',
        price: '$18',
        period: '/user/month',
        description: 'Ideal for teams collaborating on projects',
        features: [
            'Everything in Pro',
            'Real-time collaboration',
            'Shared workspaces',
            'Version history',
            'Admin controls',
            'Priority support',
        ],
        cta: 'Start Trial',
        popular: false,
    },
];

const Pricing = () => {
    return (
        <section id='pricing' className='bg-obsidian-dark py-20'>
            <div className='container mx-auto px-4 md:px-6'>
                <div className='mb-16 text-center'>
                    <h2 className='text-obsidian-text mb-4 text-3xl font-bold md:text-4xl'>
                        Simple, Transparent Pricing
                    </h2>
                    <p className='text-obsidian-muted mx-auto max-w-2xl'>
                        Choose the plan that fits your needs. All plans include
                        access to our core features.
                    </p>
                </div>

                <div className='mx-auto grid max-w-5xl grid-cols-1 gap-8 md:grid-cols-3'>
                    {plans.map((plan, index) => (
                        <Card
                            key={index}
                            className={`border-obsidian-dark note-card relative bg-stone-300 dark:bg-zinc-900 ${
                                plan.popular
                                    ? 'border-obsidian-accent ring-obsidian-accent/20 ring-2'
                                    : ''
                            }`}
                        >
                            {plan.popular && (
                                <div className='absolute -top-4 right-0 left-0 flex justify-center'>
                                    <span className='rounded-full bg-orange-600 px-3 py-1 text-xs font-bold text-white'>
                                        MOST POPULAR
                                    </span>
                                </div>
                            )}
                            <CardHeader>
                                <CardTitle className='text-obsidian-text text-xl'>
                                    {plan.name}
                                </CardTitle>
                                <div className='mt-2 flex items-baseline'>
                                    <span className='text-obsidian-text text-3xl font-bold'>
                                        {plan.price}
                                    </span>
                                    {plan.period && (
                                        <span className='text-obsidian-muted ml-1'>
                                            {plan.period}
                                        </span>
                                    )}
                                </div>
                                <CardDescription className='text-obsidian-muted mt-2'>
                                    {plan.description}
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <ul className='space-y-3'>
                                    {plan.features.map((feature, i) => (
                                        <li
                                            key={i}
                                            className='flex items-center'
                                        >
                                            <Check className='text-obsidian-accent mr-2 h-4 w-4' />
                                            <span className='text-obsidian-text text-sm'>
                                                {feature}
                                            </span>
                                        </li>
                                    ))}
                                </ul>
                            </CardContent>
                            <CardFooter>
                                <Link href='/register' className='w-full'>
                                    <Button
                                        className={`w-full ${
                                            plan.popular
                                                ? 'text-obsidian-darkest hover:bg-obsidian-accent2 bg-white dark:bg-zinc-700'
                                                : 'border-obsidian-accent text-obsidian-accent hover:bg-obsidian-accent/10'
                                        }`}
                                        variant={
                                            plan.popular ? 'default' : 'outline'
                                        }
                                    >
                                        {plan.cta}
                                    </Button>
                                </Link>
                            </CardFooter>
                        </Card>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Pricing;
