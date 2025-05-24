'use client';

import { FC, useState } from 'react';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import dynamic from 'next/dynamic';
import { EmojiClickData } from 'emoji-picker-react';
import { useRouter } from 'next/navigation';
import { useCreateWorkspace } from '@/hooks/workspace/useCreateNewWorkspace';

const EmojiPicker = dynamic(() => import('emoji-picker-react'), { ssr: false });

const StartSettingsWrapper: FC = () => {
    const [name, setName] = useState('');
    const [emoji, setEmoji] = useState('🚀');
    const [description, setDescription] = useState('');
    const [isVisible, setIsVisible] = useState(true);
    const router = useRouter();

    const { mutate: createWorkspace, isPending } = useCreateWorkspace();

    const handleEmojiClick = (emojiData: EmojiClickData) => {
        setEmoji(emojiData.emoji);
    };

    const handleCreate = () => {
        createWorkspace(
            {
                name,
                description,
                emojiLogo: emoji,
                banner: 'https://images.unsplash.com/photo-1596495577886-d920f1fb7238',
            },
            {
                onSuccess: () => {
                    router.push('/dashboard');
                },
            },
        );
    };

    if (!isVisible) return null;

    return (
        <div className='flex h-screen items-center justify-center px-4'>
            <Alert className='!flex w-full max-w-lg !flex-col items-center gap-4 p-6 text-center'>
                <AlertTitle className='text-xl'>
                    Vytvorte si svoj prvý workspace {emoji}
                </AlertTitle>

                <AlertDescription className='w-full space-y-4'>
                    <Input
                        placeholder='Názov workspace'
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />

                    <div className='flex items-center justify-center'>
                        <EmojiPicker onEmojiClick={handleEmojiClick} />
                    </div>

                    <Textarea
                        placeholder='Popis workspace'
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        rows={4}
                    />

                    <div className='flex flex-col gap-2 pt-2 sm:flex-row'>
                        <Button
                            className='bg-primary w-full text-white'
                            onClick={handleCreate}
                            disabled={isPending}
                        >
                            {isPending ? 'Vytváram...' : 'Vytvoriť'}
                        </Button>

                        <Button
                            variant='outline'
                            className='w-full'
                            onClick={() => {
                                setIsVisible(false);
                                router.push('/dashboard');
                            }}
                        >
                            Preskočiť
                        </Button>
                    </div>
                </AlertDescription>
            </Alert>
        </div>
    );
};

export default StartSettingsWrapper;
