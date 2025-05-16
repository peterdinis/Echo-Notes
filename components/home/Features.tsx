import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';

const features = [
    {
        title: 'Connected Notes',
        description:
            'Create bidirectional links between your notes, building a knowledge graph that mirrors your thinking.',
        icon: '🔗',
    },
    {
        title: 'Markdown Editor',
        description:
            'Write in powerful markdown with live preview, code blocks, and custom styling options.',
        icon: '📝',
    },
    {
        title: 'Graph Visualization',
        description:
            'See how your ideas connect with an interactive visual graph of your knowledge network.',
        icon: '🌐',
    },
    {
        title: 'Full-Text Search',
        description:
            'Find anything instantly with our powerful search that indexes all your content.',
        icon: '🔍',
    },
    {
        title: 'Custom Themes',
        description:
            'Personalize your workspace with beautiful themes that match your style.',
        icon: '🎨',
    },
    {
        title: 'Sync Everywhere',
        description:
            'Access your notes from any device with seamless cloud synchronization.',
        icon: '☁️',
    },
];

const Features = () => {
    return (
        <section id='features' className='py-20'>
            <div className='container mx-auto px-4 md:px-6'>
                <div className='mb-16 text-center'>
                    <h2 className='text-obsidian-text mb-4 text-3xl font-bold md:text-4xl'>
                        Powerful Features
                    </h2>
                    <p className='text-obsidian-muted mx-auto max-w-2xl'>
                        Everything you need to capture, connect, and cultivate
                        your ideas in one beautiful workspace.
                    </p>
                </div>

                <div className='grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3'>
                    {features.map((feature, index) => (
                        <Card
                            key={index}
                            className='border-obsidian-dark hover:border-obsidian-accent/50 note-card bg-zinc-300 transition-all duration-300 dark:bg-zinc-900'
                        >
                            <CardHeader>
                                <div className='mb-4 text-3xl'>
                                    {feature.icon}
                                </div>
                                <CardTitle className='text-obsidian-text text-xl'>
                                    {feature.title}
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <CardDescription className='text-obsidian-muted'>
                                    {feature.description}
                                </CardDescription>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Features;
