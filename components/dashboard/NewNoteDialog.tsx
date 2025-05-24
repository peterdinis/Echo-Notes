'use client';

import { useState } from 'react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Bold,
    Italic,
    Heading,
    Image,
    Table,
    Video,
    Heading1,
    Heading2,
    Heading3,
    Heading4,
} from 'lucide-react';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';

type Note = {
    id: string;
    title: string;
    excerpt: string;
    updated: string;
    content: string;
    tags: string[];
};

interface NewNoteDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (note: Omit<Note, 'id' | 'updated'>) => void;
}

const NewNoteDialog = ({ isOpen, onClose, onSave }: NewNoteDialogProps) => {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [tags, setTags] = useState<string[]>([]);
    const [tagsInput, setTagsInput] = useState('');

    const resetForm = () => {
        setTitle('');
        setContent('');
        setTags([]);
        setTagsInput('');
    };

    const handleClose = () => {
        resetForm();
        onClose();
    };

    const handleSave = () => {
        if (!title.trim()) return;

        const excerpt =
            content.slice(0, 100) + (content.length > 100 ? '...' : '');

        onSave({
            title,
            content,
            excerpt,
            tags,
        });

        resetForm();
        onClose();
    };

    const handleTagsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setTagsInput(value);

        if (value.trim()) {
            const newTags = value
                .split(',')
                .map((tag) => tag.trim())
                .filter((tag) => tag);
            setTags(newTags);
        } else {
            setTags([]);
        }
    };

    // Rich text editor functions
    const insertTextAtCursor = (textBefore: string, textAfter: string = '') => {
        const textarea = document.getElementById(
            'editor',
        ) as HTMLTextAreaElement;
        if (!textarea) return;

        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const selectedText = textarea.value.substring(start, end);

        const textToInsert = textBefore + selectedText + textAfter;

        setContent(
            textarea.value.substring(0, start) +
                textToInsert +
                textarea.value.substring(end),
        );

        // Set cursor position after the operation
        setTimeout(() => {
            textarea.focus();
            textarea.selectionStart =
                start + textBefore.length + selectedText.length;
            textarea.selectionEnd =
                start + textBefore.length + selectedText.length;
        }, 0);
    };

    const insertHeading = (level: number) => {
        insertTextAtCursor('#'.repeat(level) + ' ', '\n');
    };

    const insertBold = () => insertTextAtCursor('**', '**');
    const insertItalic = () => insertTextAtCursor('*', '*');
    const insertImage = () => insertTextAtCursor('![Image description](', ')');
    const insertTable = () => {
        insertTextAtCursor(
            '| Header 1 | Header 2 | Header 3 |\n| --- | --- | --- |\n| Cell 1 | Cell 2 | Cell 3 |\n| Cell 4 | Cell 5 | Cell 6 |',
        );
    };
    const insertVideo = () => insertTextAtCursor('{{video: ', '}}');

    return (
        <Dialog open={isOpen} onOpenChange={handleClose}>
            <DialogContent className='border-obsidian-darkest text-obsidian-text flex h-[80vh] max-h-[800px] w-full max-w-3xl flex-col bg-stone-900'>
                <DialogHeader>
                    <DialogTitle className='text-obsidian-text text-2xl'>
                        New Note
                    </DialogTitle>
                </DialogHeader>

                <div className='flex flex-grow flex-col overflow-hidden'>
                    <Input
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder='Note title'
                        className='bg-obsidian-darkest text-obsidian-text placeholder:text-obsidian-muted mb-4 rounded border-0 px-4 py-2 text-xl font-semibold focus-visible:ring-0'
                    />

                    <Input
                        value={tagsInput}
                        onChange={handleTagsChange}
                        placeholder='Add tags separated by commas'
                        className='border-obsidian-dark bg-obsidian-darkest text-obsidian-text placeholder:text-obsidian-muted mb-4'
                    />

                    <div className='mb-4 flex flex-wrap gap-2'>
                        {tags.map((tag, index) => (
                            <span
                                key={index}
                                className='bg-obsidian-accent/20 text-obsidian-accent rounded-full px-2 py-1 text-xs'
                            >
                                #{tag}
                            </span>
                        ))}
                    </div>

                    <div className='bg-obsidian-darkest mb-2 flex flex-wrap gap-2 rounded p-2'>
                        <Button
                            variant='ghost'
                            size='icon'
                            onClick={insertBold}
                            className='text-obsidian-text hover:bg-obsidian-dark hover:text-obsidian-accent'
                        >
                            <Bold />
                        </Button>

                        <Button
                            variant='ghost'
                            size='icon'
                            onClick={insertItalic}
                            className='text-obsidian-text hover:bg-obsidian-dark hover:text-obsidian-accent'
                        >
                            <Italic />
                        </Button>

                        <Popover>
                            <PopoverTrigger asChild>
                                <Button
                                    variant='ghost'
                                    size='icon'
                                    className='text-obsidian-text hover:bg-obsidian-dark hover:text-obsidian-accent'
                                >
                                    <Heading />
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className='bg-obsidian-dark border-obsidian-darkest flex w-auto flex-col gap-1 p-2'>
                                <Button
                                    variant='ghost'
                                    size='sm'
                                    onClick={() => insertHeading(1)}
                                    className='text-obsidian-text hover:bg-obsidian-darkest flex justify-start'
                                >
                                    <Heading1 className='mr-2' size={16} />{' '}
                                    Heading 1
                                </Button>
                                <Button
                                    variant='ghost'
                                    size='sm'
                                    onClick={() => insertHeading(2)}
                                    className='text-obsidian-text hover:bg-obsidian-darkest flex justify-start'
                                >
                                    <Heading2 className='mr-2' size={16} />{' '}
                                    Heading 2
                                </Button>
                                <Button
                                    variant='ghost'
                                    size='sm'
                                    onClick={() => insertHeading(3)}
                                    className='text-obsidian-text hover:bg-obsidian-darkest flex justify-start'
                                >
                                    <Heading3 className='mr-2' size={16} />{' '}
                                    Heading 3
                                </Button>
                                <Button
                                    variant='ghost'
                                    size='sm'
                                    onClick={() => insertHeading(4)}
                                    className='text-obsidian-text hover:bg-obsidian-darkest flex justify-start'
                                >
                                    <Heading4 className='mr-2' size={16} />{' '}
                                    Heading 4
                                </Button>
                            </PopoverContent>
                        </Popover>

                        <Button
                            variant='ghost'
                            size='icon'
                            onClick={insertImage}
                            className='text-obsidian-text hover:bg-obsidian-dark hover:text-obsidian-accent'
                        >
                            <Image />
                        </Button>

                        <Button
                            variant='ghost'
                            size='icon'
                            onClick={insertTable}
                            className='text-obsidian-text hover:bg-obsidian-dark hover:text-obsidian-accent'
                        >
                            <Table />
                        </Button>

                        <Button
                            variant='ghost'
                            size='icon'
                            onClick={insertVideo}
                            className='text-obsidian-text hover:bg-obsidian-dark hover:text-obsidian-accent'
                        >
                            <Video />
                        </Button>
                    </div>

                    <textarea
                        id='editor'
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        className='bg-obsidian-darkest text-obsidian-text placeholder:text-obsidian-muted flex-grow resize-none rounded p-4 focus:outline-none'
                        placeholder='Write your note content here...'
                    />
                </div>

                <DialogFooter className='gap-2 sm:gap-0'>
                    <Button
                        variant='outline'
                        onClick={handleClose}
                        className='border-obsidian-dark text-obsidian-muted hover:bg-obsidian-darkest hover:text-obsidian-text'
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={handleSave}
                        className='bg-obsidian-accent text-obsidian-darkest hover:bg-obsidian-accent2'
                        disabled={!title.trim()}
                    >
                        Create Note
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default NewNoteDialog;
